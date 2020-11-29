/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
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
        res.render({ poll });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.get("/:id/r", (req, res) => {
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
