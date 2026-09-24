const express = require('express');
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware.authenticateToken, userController.getAllUser);

module.exports = router;