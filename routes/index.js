/*
 * All routes for Index are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const queryString = `
    SELECT polls.*, choices.*, voters.*
    FROM polls
    JOIN choices ON poll_id = polls.id
    JOIN voters ON choice_id = choices.id
    `;
    db.query(queryString)
      .then(data => {
        const index = data.rows;
        console.log(index);
        res.json({ index });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
