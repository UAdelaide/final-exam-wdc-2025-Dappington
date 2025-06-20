var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
    try{
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });
        await connection.query('DROP DATABASE IF EXISTS DogWalkService;');
        await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
        await connection.end();

        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService',
            multipleStatements: true
        });

        await db.query(`CREATE TABLE Users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('owner', 'walker') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE Dogs (
                dog_id INT AUTO_INCREMENT PRIMARY KEY,
                owner_id INT NOT NULL,
                name VARCHAR(50) NOT NULL,
                size ENUM('small', 'medium', 'large') NOT NULL,
                FOREIGN KEY (owner_id) REFERENCES Users(user_id)
            );

            CREATE TABLE WalkRequests (
                request_id INT AUTO_INCREMENT PRIMARY KEY,
                dog_id INT NOT NULL,
                requested_time DATETIME NOT NULL,
                duration_minutes INT NOT NULL,
                location VARCHAR(255) NOT NULL,
                status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
            );

            CREATE TABLE WalkApplications (
                application_id INT AUTO_INCREMENT PRIMARY KEY,
                request_id INT NOT NULL,
                walker_id INT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
                FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
                FOREIGN KEY (walker_id) REFERENCES Users(user_id),
                CONSTRAINT unique_application UNIQUE (request_id, walker_id)
            );

            CREATE TABLE WalkRatings (
                rating_id INT AUTO_INCREMENT PRIMARY KEY,
                request_id INT NOT NULL,
                walker_id INT NOT NULL,
                owner_id INT NOT NULL,
                rating INT CHECK (rating BETWEEN 1 AND 5),
                comments TEXT,
                rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
                FOREIGN KEY (walker_id) REFERENCES Users(user_id),
                FOREIGN KEY (owner_id) REFERENCES Users(user_id),
                CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
            );`);

        await db.query(`INSERT INTO Users (username, email, password_hash, role)
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
            VALUES (2, NOW(), 5, 'the park', 'cancelled');`);

    } catch (err) {
        console.error('database exploded on startup', err);
    }
})();

// app.use(function(req,res,next){
//   req.pool = dbConnectionPool;
//   next();
// });

app.get('/api/dogs', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id;`);
        res.json(rows);
    } catch (err) {
        res.sendStatus(404);
    }
});

app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username FROM WalkRequests INNER JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id INNER JOIN Users ON Dogs.owner_id = Users.user_id WHERE WalkRequests.status = 'open';`);
        res.json(rows);
    } catch (err) {
        res.sendStatus(404);
    }
});

app.get('/api/walkers/summary', async (req, res) => {
    try {
        let [walkers] = await db.query(`SELECT user_id, username AS walker_username FROM Users WHERE role = 'walker';`);
        var finished_walkers_list = await Promise.all(walkers.map(async (walker) => {
            var finishedWalker = {
                walker_username: walker.walker_username
            };
            let [ratings] = await db.query(`SELECT COUNT(WalkRatings.rating_id) AS total_ratings, AVG(WalkRatings.rating) AS average_rating FROM WalkRatings WHERE WalkRatings.walker_id = ?;`, [walker.user_id]);
            finishedWalker.total_ratings = ratings[0].total_ratings;
            finishedWalker.average_rating = ratings[0].average_rating;
            let [completedCount] = await db.query(`SELECT COUNT(WalkRequests.request_id) AS completed_walks FROM WalkRequests INNER JOIN WalkApplications ON  WalkRequests.request_id = WalkApplications.request_id WHERE WalkApplications.walker_id = ? AND WalkApplications.status = 'accepted' AND WalkRequests.status = 'completed';`, [walker.user_id]);
            finishedWalker.completed_walks = completedCount[0].completed_walks;
            return finishedWalker;
        }));
        res.json(finished_walkers_list);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.use('/', indexRouter);

module.exports = app;
