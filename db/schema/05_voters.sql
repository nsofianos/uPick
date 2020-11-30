-- Drop and recreate Voters table

DROP TABLE IF EXISTS voters CASCADE;

CREATE TABLE voters (
  id SERIAL PRIMARY KEY NOT NULL,
  choice_id INTEGER REFERENCES choices(id) ON DELETE CASCADE
);
