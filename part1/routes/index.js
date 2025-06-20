var express = require('express');
var router = express.Router();

router.get('/api/dogs', async (req, res) => {
    const [rows] = await db.query();
});

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
