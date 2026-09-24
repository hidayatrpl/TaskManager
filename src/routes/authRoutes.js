const express = require('express');
const authController = require('../controller/authController');
const { validateAuth } = require('../middleware/taskValidator');
const router = express.Router();

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);

module.exports = router;