const express = require('express');
const taskController = require('../controller/taskController');
const validateTask = require('../middleware/taskValidator');
const router = express.Router();

router.get('/task', taskController.getAllTask)
router.get('/task/:id', taskController.getTaskById)
router.post('/task', validateTask, taskController.createTask)
router.put('/task/:id', validateTask, taskController.updateTask)
router.delete('/task/:id', taskController.deleteTask)

module.exports = router;
