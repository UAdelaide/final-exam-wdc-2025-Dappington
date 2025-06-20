INSERT INTO Users (username, email, password_hash, role)
VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Max', 'medium'), (LAST_INSERT_ID(), 'Rex', 'medium');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('ethanhunt', 'ethan@example.com', '177013', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Killer', 'small'), (LAST_INSERT_ID(), 'Princess', 'large');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('carol123', 'carol@example.com', 'hashed789', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Bella', 'small') (LAST_INSERT_ID(), 'Paris', 'small');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('bobwalker', 'bob@example.com', 'hashed456', 'walker');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('navydavie', 'dave@example.com', 'passwrd222', 'walker');