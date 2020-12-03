/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const mailgun = require("mailgun-js");
const apiKey = '227f444044a3246e9eae23357e372a9a-95f6ca46-8b6ac466';
const domain = 'sandbox5e38857c2490413c8b6807ea374ecf61.mailgun.org';
const mg = mailgun({apiKey, domain});

module.exports = (db) => {

  // Render poll creation page
  router.get("/create", (req, res) => {
      res.render('poll_create');
  });

  // Add a new poll to database + redirect to voting page
  router.post("/", (req, res) => {
    const formData = req.body.text;
    const title = formData[0];
    const email = formData[1];
    const description = formData[2];
    const choiceNames = formData.slice(3).filter(name => name !== ""); // array of choice names
    const pollKey = generateRandomString();

    const pollParams = [
      email,
      title,
      description,
      `http://localhost:8080/polls/${pollKey}/result`,
      `http://localhost:8080/polls/${pollKey}`
    ];

    const queryString = `
    INSERT INTO polls (email, title, description, admin_link, submission_link)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;

    // Add poll to polls table
    db.query(queryString, pollParams)
      .then(data => {
        return data.rows[0]; // return that poll
      })
      .then(poll => {
        const poll_id = poll.id;
        let queryString = `
        INSERT INTO choices (poll_id, name)
        VALUES `;
        const queryVals = [];
        const queryParams = [];
        let i = 1;

        for (const name of choiceNames) {
          // Build queryParams
          queryParams.push(poll_id, name);

          // Build queryString
          queryVals.push(`($${i}, $${i + 1})`)
          i += 2;
        }
        queryString += queryVals.join(',') + ';';

        console.log("queryString", queryString);
        console.log("queryParams", queryParams);

        db.query(queryString, queryParams);
        console.log("SECOND DOT THEN!!")
      })
      .then(() => {
        console.log("DO WE MAKE IT HERE");
        // Send links to poll creator
        const emailLinks = {
          from: 'uPick <nexustk_fan@hotmail.com>',
          to: email,
          subject: 'You just made a poll!',
          text: `Thanks for using uPick! You just made a poll called: ${title}.
          Vote now! (${pollParams[4]}) or take a peek at the results (${pollParams[3]})`
        };
        mg.messages().send(emailLinks, function (error, body) {
          if (error) {
            console.log("Mailgun error:", error);
          }
          console.log(body);
        });

        res.redirect(`/polls/${pollKey}`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Render voting + links page
  router.get("/:id", (req, res) => {
    const pollKey = req.params.id;
    const queryString = `
    SELECT polls.*, choices.name
    FROM polls
    JOIN choices ON poll_id = polls.id
    WHERE submission_link LIKE $1;
    `;
    const queryParams = [`%${pollKey}`];
    db.query(queryString, queryParams)
      .then(data => {
        const queryRows = data.rows; // array of row objects
        let choices = [];
        for (const row of queryRows) {
          choices.push(row.name);
        }
        const templateVars = {
          title: queryRows[0].title,
          description: queryRows[0].description,
          admin_link: queryRows[0].admin_link,
          submission_link: queryRows[0].submission_link,
          choices,
          inDatabase: true
        }
        res.render('poll_voting', templateVars);
      })
      .catch(err => {
        res.status(404);
        res.render('poll_voting', {inDatabase: false});
      });
  });

  // Add new choice_rankings for a choices
  router.post("/:id", (req, res) => {
    const choiceRankingsObj = req.body;
    const pollKey = req.params.id;
    const promises = [];

    // For each choice, grab its id
    for (const key in choiceRankingsObj) {
      const queryString = `
      SELECT choices.id FROM choices
      JOIN polls ON polls.id = poll_id
      WHERE name = $1
      AND submission_link LIKE $2;
      `;
      const promise = db.query(queryString, [key, `%${pollKey}`])
      .then(data => {
        const choiceId = data.rows[0].id;
        const queryString = `
        INSERT INTO choice_rankings (choice_id, ranking)
        VALUES ($1, $2);
        `;
        // Insert each new choice_rankings row
        db.query(queryString, [choiceId, choiceRankingsObj[key]]);
      })
      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        res.send("Redirect"); // Send to AJAX to redirect
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Render poll results page
  router.get("/:id/result", (req, res) => {
    const pollkey = req.params.id;
    const queryString = `
    SELECT polls.title, polls.description, choices.name, sum(choice_rankings.ranking) as sum_rankings, count(choice_rankings.ranking) as total_rankings
    FROM polls
    JOIN choices ON polls.id = poll_id
    JOIN choice_rankings ON choices.id = choice_id
    WHERE polls.admin_link LIKE '%${pollkey}%'
    GROUP BY polls.title, polls.description, choices.name;
    `;
    db.query(queryString)
    .then(data => {
      console.log(data.rows)

      //results from the query
      const queryRows = data.rows;

      //store results into corresponding variables
      const title = queryRows[0].title;
      const description = queryRows[0].description;
      const totalVotes = queryRows[0].total_rankings;
      const totalChoices = queryRows.length;

      //array of choice objects containing choice name, sum of rankings
      const choices = [];
      for (const row of queryRows) {
        choices.push({ name: row.name, rankSum: row.sum_rankings });
      }

      //recursive function to get the sum of total choices
      const sumTotalChoices = (n) => {
        if (n < 1) {
          return 0;
        }
        return n + sumTotalChoices(n - 1);
      }

      //calculate percentage of votes for each choice using borda count method
      for (const choice of choices) {
        choice.percentage = Math.round(((choice.rankSum / (sumTotalChoices(totalChoices) * totalVotes))*100) * 10) / 10;
      }


      console.log('sum', sumTotalChoices(5));
      console.log(choices);
      console.log('votes:', totalVotes, 'totalchoices', totalChoices);

      const templateVars = { title, description, choices, pollkey, inDatabase: true };
      res.render('poll_results', templateVars);
    })
    .catch(err => {
      res.status(404);
      res.render('poll_voting', {inDatabase: false});
    });

  });

  // HELPER FUNCTIONS

  // Generate random string for unique poll id
  const generateRandomString = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      randomString += chars[Math.floor(Math.random() * chars.length)];
    }
    return randomString;
  };

  return router;
};
