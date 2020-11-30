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
    // Get creatorId using SQL and cookie
<<<<<<< Updated upstream
    //SELECT creators.id FROM creators WHERE email = theiremail
=======
    // SELECT creators.id FROM creators WHERE email = theiremail
>>>>>>> Stashed changes
    // Extract data from request to get queryParams
    // Write query
    // const pollId = req.pollId;
    // db.query(queryString) // query for getting specific creator from table
    //   .then(data => {
    //     return data.rows[0].id; // creator id
    //   })
    //   .then(creatorId => {
    //     const queryParams = [
    //       creatorId,
    //       req.title,
    //       req.description,
    //       req.pollId,
    //       req.adminLink,
    //       req.submissionLink
    //     ];
    //     const queryString = `
    //     INSERT INTO polls (creator_id, title, description, poll_id, admin_link, submission_link)
    //     VALUES ($1, $2, $3, $4, $5, $6);
    //     `;
    //     db.query(queryString, queryParams).then(res => res.rows[0]);
    //   })
    const formData = req.body.text;
    const title = formData[0];
    const description = formData[1];
    const choiceNames = formData.slice(2); // array of choice names
    const pollId = generateRandomString();
    const pollParams = [
      //creatorId
      title,
      description,
      `http://localhost:8080/${pollId}`,
      `http://localhost:8080/${pollId}/results`

<<<<<<< Updated upstream
    //db.query(queryString)
    res.redirect(`/polls/${pollID}`);
  });

=======
    ];
    const choiceParams = [
>>>>>>> Stashed changes

    ];
    console.log("req.body", req.body);
    console.log("req.body.text", req.body.text);
    console.log("req.body.text[0]", req.body.text[0]);
    // res.redirect(`/polls/${pollId}`);
    res.redirect(`/`);
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

  // Add new choice_rankings for this user
  router.post("/:id/", (req, res) => {
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
  router.get("/:id/results", (req, res) => {
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
