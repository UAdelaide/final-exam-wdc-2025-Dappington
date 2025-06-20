INSERT INTO Users (username, email, password_hash, role)
VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Max', 'medium');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('ethanhunt', 'ethan@example.com', '177013', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Killer', 'small'), (LAST_INSERT_ID(), 'Princess', 'large');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('carol123', 'carol@example.com', 'hashed789', 'owner');
INSERT INTO Dogs (owner_id, name, size)
VALUES (LAST_INSERT_ID(), 'Bella', 'small'), (LAST_INSERT_ID(), 'Paris', 'small');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('bobwalker', 'bob@example.com', 'hashed456', 'walker');

INSERT INTO Users (username, email, password_hash, role)
VALUES ('navydavie', 'dave@example.com', 'passwrd222', 'walker');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location)
VALUES (1, NOW(), 5, 'the park');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES (2, NOW(), 5, 'the park', 'cancelled');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES (2, NOW(), 10, 'the park', 'completed');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES (2, NOW(), 10, 'the park', 'completed');

INSERT INTO WalkApplications (request_id, walker_id, status)
VALUES (3, 4, 'accepted');

INSERT INTO WalkApplications (request_id, walker_id, status)
VALUES (4, 4, 'accepted');

INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating)
VALUES (3, 4, 1, 5);

INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating)
VALUES (4, 4, 1, 1);