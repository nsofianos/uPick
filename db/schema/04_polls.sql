-- Drop and recreate Polls table

DROP TABLE IF EXISTS polls CASCADE;

CREATE TABLE polls(
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES creators(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  admin_link VARCHAR(255) NOT NULL,
  submission_link VARCHAR(255) NOT NULL
);
