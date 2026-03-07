const express = require('express');
const router = express.Router();
const { getStats, updateStats } = require('../controllers/userStatsController');
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, getStats);
router.patch('/', requireAuth, updateStats);

module.exports = router;