const express = require('express');
const authController = require('../controller/authController');
const { validateRegister, validateLogin } = require('../middleware/taskValidator');
const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;