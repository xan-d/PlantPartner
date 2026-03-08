const express = require('express');
const router = express.Router();
const pushController = require('../controllers/pushController');
const requireAuth = require('../middleware/requireAuth');

router.get('/vapid-public-key', pushController.getVapidPublicKey);
router.post('/subscribe', pushController.subscribe);
router.post('/unsubscribe', requireAuth, pushController.unsubscribe);

module.exports = router;