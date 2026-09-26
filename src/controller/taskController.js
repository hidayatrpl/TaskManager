const db = require('../config/db');
const response = require('../response');

const getAllTask = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { limit = 10, offset = 0 } = req.query;
        const sql = `SELECT t.*, c.name AS category_name FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1 ORDER BY t.id DESC LIMIT $2 OFFSET $3`;
        const result = await db.query(sql, [user_id, limit, offset]);
        return response(200, result.rows, "Data Success", res);
    }
    catch (err) {
        next(err);
    }
}

const getTaskById = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const sql = `SELECT t.*, c.name AS category_name FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1 AND t.id = $2`;
        const result = await db.query(sql, [user_id, id]);
        if (result.rowCount === 0) return response(404, null, "Data Not Found", res);
        return response(200, result.rows, "Data Success", res);
    }
    catch (err) {
        next(err);
    }
}

const createTask = async (req, res, next) => {
    const { user_id } = req.user;
    const { title, description, status, category_id } = req.body;
    try {
        if (category_id) {
            const checkCategorySql = `SELECT * FROM categories WHERE id = $1 AND user_id = $2`;
            const checkCategoryResult = await db.query(checkCategorySql, [category_id, user_id]);
            if (checkCategoryResult.rowCount === 0) return response(404, null, "Category Not Found", res);
        }
        const sql = `INSERT INTO tasks(title, description, status, category_id, user_id) VALUES ($1, $2, COALESCE($3, 'pending'), $4, $5) RETURNING id`;
        const result = await db.query(sql, [title, description, status, category_id, user_id]);
        if (result?.rowCount) {
            const data = {
                isSuccess: true,
                id: result.rows[0].id
            }
            return response(201, data, "Data added Successfully", res);
        }
    }
    catch (err) {
        next(err);
    }
}

const updateTask = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const { title, description, status, category_id } = req.body;
        const sql = `UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), category_id = COALESCE($4, 1) WHERE user_id = $5 AND id = $6 RETURNING id`;
        const result = await db.query(sql, [title, description, status, category_id, user_id, id]);
        if (result.rowCount === 0) return response(404, null, "Data Not Found", res);
        const data = {
            isSuccess: true,
            id: result.rows[0].id
        }
        return response(200, data, `Data with ID ${id} has been updated successfully`, res);
    }
    catch (err) {
        next(err);
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const sql = `DELETE FROM tasks WHERE user_id = $1 AND id = $2`;
        const result = await db.query(sql, [user_id, id]);
        if (result.rowCount === 0) return response(404, null, "Data Not Found", res);
        const data = {
            isSuccess: true,
            id: id
        }
        return response(200, data, `Data with ID ${id} has been deleted successfully`, res);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    getAllTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
}