const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controller/categoryController');
const { validateCategory } = require('../middleware/taskValidator');

router.get('/', authMiddleware.authenticateToken, categoryController.getAllCategory);

router.get('/:id', authMiddleware.authenticateToken, categoryController.getCategoryById);

router.post('/', authMiddleware.authenticateToken, validateCategory, categoryController.createCategory);

router.put('/:id', authMiddleware.authenticateToken, validateCategory, categoryController.updateCategory);

router.delete('/:id', authMiddleware.authenticateToken, categoryController.deleteCategory);

module.exports = router;