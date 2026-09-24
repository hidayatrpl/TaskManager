const db = require('../config/db');
const response = require('../response');

const getAllTask = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const sql = "SELECT * FROM tasks WHERE user_id = $1";
        const result = await db.query(sql, [user_id]);
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
        const sql = "SELECT * FROM tasks WHERE user_id = $1 AND id = $2";
        const result = await db.query(sql, [user_id, id]);
        if (result.rowCount === 0) return response(404, null, "Data Not Found", res);
        return response(200, result.rows, "Data Success", res);
    }
    catch (err) {
        next(err);
    }
}

const createTask = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { title, description, status } = req.body;
        const sql = `INSERT INTO tasks(title, description, status, user_id) VALUES ($1, $2, COALESCE($3, 'pending'), $4) RETURNING id`;
        const result = await db.query(sql, [title, description, status, user_id]);
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
        const { title, description, status } = req.body;
        const sql = `UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status) WHERE user_id = $4 AND id = $5 RETURNING id`;
        const result = await db.query(sql, [title, description, status, user_id, id]);
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