/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router(); //define routes w/o initializing express app like in server.js

module.exports = (db) => { //exporting a FUNCTION that RETURNS a router

  // Render poll creation page
  router.get("/create", (req, res) => {
    // const user = req.session.user_id;
    const user = true;
    if (user) {
      res.render('poll_create');
    } else {
      res.redirect("/");
    }
  });

  // Add a new poll to database + redirect to voting page
  router.post("/", (req, res) => {
    req.session.cookie = 'Ak94Vj'; // for testing, REMOVE when done
    const cookie = req.session.cookie;
    const formData = req.body.text;
    const title = formData[0];
    const description = formData[1];
    const choiceNames = formData.slice(2); // array of choice names
    const pollId = generateRandomString();

    db.query(`SELECT creators.id FROM creators WHERE cookie = $1;`, [cookie])
    .then(data => {
      // Get specific creator_id from cookie
      return data.rows[0]; // {id: 1}
    })
    .then(creator => {
      const creator_id = creator.id; // 1
      const pollParams = [
        creator_id,
        title,
        description,
        `http://localhost:8080/${pollId}/r`,
        `http://localhost:8080/${pollId}`
      ];

      const queryString = `
      INSERT INTO polls (creator_id, title, description, admin_link, submission_link)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `;

      // Add poll to polls table and return that poll
      const poll = db.query(queryString, pollParams).then(data => data.rows[0]);
      return poll;
    })
    .then(poll => {
      const poll_id = poll.id;
      const choiceParams = [pollId];
      for (const name of choiceNames) {
        choiceParams.push(name);
      }

      const queryString = `
      INSERT INTO choices (poll_id, name)
      VALUES ($1, $2);
      `;

      // Add each choice to choices table
      for (const name of choiceNames) {
        db.query(queryString, [poll_id, name]);
      }
    })
    res.redirect(`/polls/${pollId}`);
  });

  // Render voting + links page
  router.get("/:id", (req, res) => {
    const queryString = `
    SELECT polls.*, choices.*, voters.*
    FROM polls
    JOIN choices ON poll_id = polls.id
    JOIN voters ON choice_id = choices.id
    `;
    db.query(queryString)
      .then(data => {
        const poll = data.rows;
        console.log(poll);
        const templateVars = { poll };
        res.render('poll_voting');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Add new choice_rankings for a choices
  router.post("/:id", (req, res) => {
    const queryString = `
    SELECT polls.*, choices.*, voters.*
    FROM polls
    JOIN choices ON poll_id = polls.id
    JOIN voters ON choice_id = choices.id
    `;
    db.query(queryString)
      .then(data => {
        const poll = data.rows;
        console.log(poll);
        res.json({ poll });
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

      const percentages = [];
      for (const choice of choices) {
        const percent = Math.round(((choice.rankSum / (sumTotalChoices(totalChoices) * totalVotes))*100) * 10) / 10;
        percentages.push(percent);
      }

      console.log('percentages', percentages);
      console.log('sum', sumTotalChoices(5));
      console.log(choices);
      console.log('votes:', totalVotes, 'totalchoices', totalChoices);

      const templateVars = { title, description, choices, percentages };
      res.render('poll_results', templateVars);
    })
    .catch(err => {
      res
          .status(500)
          .json({ error: err.message });
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
