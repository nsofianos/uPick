-- Drop and recreate Creators table

DROP TABLE IF EXISTS creators CASCADE;

CREATE TABLE creators (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255) NOT NULL
);
