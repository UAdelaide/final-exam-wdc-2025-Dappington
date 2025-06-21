const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});



// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?;
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userInfo = rows[0];
    // store key information in session
    req.session.loggedIn = true;
    req.session.user_id = userInfo.user_id;
    req.session.username = userInfo.username;
    req.session.user_role = userInfo.role;
    // redirect to appropriate dashboard
    if (req.session.user_role === 'owner') {
      res.redirect('/owner-dashboard.html');
    }
    if (req.session.user_role === 'walker') {
      res.redirect('/walker-dashboard.html');
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/mydogs', async(req, res) => {
    console.log('request recieved');
    if (!req.session.loggedIn) {
        res.sendStatus(401);
        return;
    }
    try {
        const dogs = await db.query(`SELECT dog_id AS id, name FROM Dogs WHERE owner_id = ?;`, [req.session.user_id]);
        console.log('Sending response!');
        console.log(dogs);
        res.send(dogs);
    } catch (err) {
        res.sendStatus(500);
    }
});

router.get('/logout', function(req,res){
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
