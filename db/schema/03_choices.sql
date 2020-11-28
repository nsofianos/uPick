-- Drop and recreate Choices table

DROP TABLE IF EXISTS choices CASCADE;

CREATE TABLE choices (
  id SERIAL PRIMARY KEY NOT NULL,
  poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  choice_rank INTEGER NOT NULL
);
