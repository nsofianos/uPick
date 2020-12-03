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
    ORDER BY polls.id, COUNT(choice_rankings.ranking) DESC;
    `;

    db.query(`SELECT  polls.id AS id,
    polls.title AS title,
    choices.name AS choice,
    COALESCE(SELECT  SUM(cr.ranking)
             FROM    choice_rankings AS cr
             WHERE   cr.choice_id = choices.id
             GROUP BY cr.choice_id), 0) AS summed_votes,
    COALESCE(SELECT  COUNT(cr2.ranking)
             FROM    choice_rankings AS cr2
             WHERE   cr2.choice_id = choices.id
             GROUP BY cr2.choice_id), 0) AS num_of_votes
FROM    polls
    JOIN choices ON polls.id = choices.poll_id
WHERE   polls.id IN (SELECT id
                FROM polls
                ORDER BY random()
                LIMIT 3)`)
    .then(data => {
      console.log(data);
    });

    db.query(queryString)
      .then(data => {
        const index = data.rows;
        // console.log(index);
        let currentPollId = -1; // or whatever you know will never exist
        let currentPollObj = null;
        let polls = [];
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
          currentPollObj.choicesNRanks[row.choices] = row.rank === null ? 1 : row.rank;
        }
        // insert the last poll object, since that won't be done in the loop
        // note: what if you have no polls in the database?
        polls.push(currentPollObj);
        const templateVars = { polls };
        console.log(polls);
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