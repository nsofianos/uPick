/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {

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
    SELECT creators.id FROM creators WHERE email = theiremail
    // Extract data from request to get queryParams
    // Write query

    db.query(queryString)
    res.redirect(`/polls/${pollID}`);
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




  return router;
};
