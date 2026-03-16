const express = require('express');
const router = express.Router();
const { reportBug } = require('../controllers/bugReportController');

router.post('/report-bug', reportBug);

module.exports = router;