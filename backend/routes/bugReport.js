const express = require('express');
const router = express.Router();
const { reportBug, roomRequest } = require('../controllers/bugReportController');

router.post('/report-bug', reportBug);
router.post('/room-request', roomRequest);

module.exports = router;