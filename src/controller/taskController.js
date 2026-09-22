const db = require('../config/db');
const response = require('../response');

const getAllTask = (req, res) => {
    const sql = "SELECT * FROM tasks";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return response(500, null, err.message, res);
        }
        return response(200, result.rows, "Data Success", res);
    });
}

const getTaskById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM tasks WHERE id = $1";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return response(500, null, err.message, res);
        }
        return response(200, result.rows, "Data Success", res);
    });
}

const createTask = (req, res) => {
    const { title, description } = req.body;
    const sql = `INSERT INTO tasks(title, description) VALUES ($1, $2) RETURNING id`;
    db.query(sql, [title, description], (err, result) => {
        if (err) {
            console.error("Error inserting task:", err);
            return response(500, null, err.message, res);
        }
        if (result?.rowCount) {
            const data = {
                isSuccess: true,
                id: result.rows[0].id
            }
            return response(201, data, "Data added Successfully", res);
        }
    });
}

const updateTask = (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const status = req.body.status || "pending";
    const sql = `UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING id`;
    db.query(sql, [title, description, status, id], (err, result) => {
        if (err) {
            console.error("Error updating task:", err);
            return response(500, null, err.message, res);
        }
        if (result?.rowCount) {
            const data = {
                isSuccess: true,
                id: result.rows[0].id
            }
            return response(201, data, "Data updated Successfully", res);
        }
    });
}

const deleteTask = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = $1`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return response(500, null, err.message, res);
        }
        if (result?.rowCount) {
            return response(200, null, "Data deleted Successfully", res);
        }
    });
}

module.exports = {
    getAllTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
}