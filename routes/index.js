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
    SELECT polls.id, polls.title AS polls, choices.name AS choices, choice_rankings.ranking AS rank
    FROM polls
    JOIN choices ON poll_id = polls.id
    JOIN choice_rankings ON choice_id = choices.id
    ORDER BY polls.id
    `;
    db.query(queryString)
      .then(data => {
        const index = data.rows;
        console.log(index);
        var currentPollId = -1; // or whatever you know will never exist
        var currentPollObj = null;
        var polls = [];
        for (const row of index) {
          if (currentPollId != row.id) {
            // insert the previously constructed poll object into the array
            if (currentPollObj !== null) {
              polls.push(currentPollObj);
            }

            // we've found a new unique poll id, create a new object to represent this new poll
            currentPollId = row.id;

            currentPollObj = {};
            currentPollObj.question = row.polls;
            currentPollObj.choicesNRanks = {};
          }
          currentPollObj.choicesNRanks[row.choices] = row.rank;
        }
        // insert the last poll object, since that won't be done in the loop
        // note: what if you have no polls in the database?
        polls.push(currentPollObj);
        console.log(polls);
        const templateVars = { polls };
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