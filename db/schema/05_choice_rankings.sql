-- Drop and recreate Choice Rankings table

DROP TABLE IF EXISTS choice_rankings CASCADE;

CREATE TABLE choice_rankings (
  id SERIAL PRIMARY KEY NOT NULL,
  voter_id INTEGER REFERENCES voters(id) ON DELETE CASCADE,
  ranking INTEGER NOT NULL
);
