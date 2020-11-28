INSERT INTO creators (email)
VALUES ('a@hotmail.com'),
('b@outlook.com'),
('c@gmail.com');

INSERT INTO voters (choice_id)
VALUES (2),
(2),
(1),
(6),
(4),
(6),
(8),
(7),
(7);

INSERT INTO choices (poll_id, name, choice_rank)
VALUES (1, 'Honeydew', 2),
(1, 'Mango', 1),
(1, 'Pineapple', 3),
(2, 'Corona', 2),
(2, 'Stella Artois', 3),
(2, 'Bacardi 151', 1),
(3, 'McDonalds', 1),
(3, 'Burger King', 2),
(3, 'Pizza Hut', 3);

INSERT INTO polls (creator_id, title, description, admin_link, submission_link)
VALUES (1, 'Best fruit', 'Which fruit is the tastiest?', http://localhost.8080/ae3klo/r, http://localhost.8080/ae3klo),
(2, 'Best booze', 'Which drinks are the tasiest?', http://localhost.8080/skjl54/r, http://localhost.8080/skjl54),
(3, 'Best restaurant', 'Which restaurant is the yummiest?', http://localhost.8080/0aw459/r, http://localhost.8080/0aw459);