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
    SELECT polls.title AS polls, choices.name AS choices
    FROM polls
    JOIN choices ON poll_id = polls.id
    GROUP BY polls, choices
    `;
    db.query(queryString)
      .then(data => {
        const index = data.rows;
        console.log(index);
        // console.log(data);
        const templateVars = { index };
        // res.json({ index });
        res.render('index', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
