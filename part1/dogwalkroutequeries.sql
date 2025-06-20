SELECT Dogs.name, Dogs.size, Users.username AS owner_username
FROM Dogs
INNER JOIN Users ON Dogs.owner_id = Users.user_id;

SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username
FROM WalkRequests
INNER JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
INNER JOIN Users ON Dogs.owner_id = Users.user_id
WHERE WalkRequests.status = 'open';

SELECT Users.username AS walker_username, COUNT(WalkRatings.rating_id) AS total_ratings, AVG(WalkRatings.rating) AS average_rating, COUNT(SELECT WalkRequests.status FROM )

SELECT user_id, username AS walker_username
FROM Users
WHERE role = 'walker';

SELECT COUNT(WalkRatings.rating_id) AS total_ratings, AVG(WalkRatings.rating) AS average_rating
FROM WalkRatings
WHERE WalkRatings.walker_id = ?;
[walker_id]

SELECT COUNT(WalkRequests.request_id) AS completed_walks
FROM WalkRequests
INNER JOIN WalkApplications ON  WalkRequests.request_id = WalkApplications.request_id
WHERE WalkApplications.walker_id = ? AND WalkApplications.status = 'accepted' AND WalkRequests.status = 'completed';
[walker_id]