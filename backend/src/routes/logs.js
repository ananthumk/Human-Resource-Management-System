const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All log routes require authentication
router.use(authMiddleware);

router.get('/', getLogs);

module.exports = router;