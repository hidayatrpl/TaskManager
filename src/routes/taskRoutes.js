const express = require('express');
const taskController = require('../controller/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/taskValidator');
const router = express.Router();

router.get('/', authMiddleware.authenticateToken, taskController.getAllTask);
router.get('/:id', authMiddleware.authenticateToken, taskController.getTaskById);
router.post('/', authMiddleware.authenticateToken, validateTask, taskController.createTask);
router.put('/:id', authMiddleware.authenticateToken, validateTask, taskController.updateTask);
router.delete('/:id', authMiddleware.authenticateToken, taskController.deleteTask);

module.exports = router;
