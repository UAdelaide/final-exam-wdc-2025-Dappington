INSERT INTO Users (username, email, password_hash, role)
VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Max', 'medium');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('bobwalker', 'bob@example.com', 'hashed456', 'walker');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Killer', 'small'), (LAST_INSERT_ID(), 'Princess', 'large');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('carol123', 'carol@example.com', 'hashed789', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Max', 'medium');


('carol123', 'carol@example.com', 'hashed789', 'owner'),
('navydavie', 'dave@example.com', 'passwrd222', 'walker'),
('ethanhunt', 'ethan@example.com', '177013', 'owner');



Five dogs:
A dog named Bella, who is small and owned by carol123.
1 more dogs with details of your choosing.