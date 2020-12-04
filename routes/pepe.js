/*
 * All routes for Index are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const queryString = `
    SELECT polls.id, polls.title AS polls, choices.name AS choices, SUM(choice_rankings.ranking) AS rank
    FROM polls
    LEFT JOIN choices ON poll_id = polls.id
    LEFT JOIN choice_rankings ON choice_id = choices.id
    GROUP BY polls.id, polls.title, choices.name
    HAVING COUNT(choice_rankings.id) > 0
    ORDER BY polls.id, COUNT(choice_rankings.ranking) DESC;
    `;

    db.query(queryString)
      .then(data => {
        res.render('pepe');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};