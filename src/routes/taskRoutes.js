const express = require('express');
const db = require('../config/db');
const response = require('../response');
const router = express.Router();


router.get('/task', (req, res) => {
    const sql = "SELECT * FROM tasks";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return response(500, null, err.message, res);
        }
        return response(200, result.rows, "Data Success", res);
    });
});
router.get('/task/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM tasks WHERE id = $1";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return response(500, null, err.message, res);
        }
        return response(200, result.rows, "Data Success", res);
    });
});

router.post('/task', (req, res) => {
    const { title, description, status } = req.body;
    const sql = `INSERT INTO tasks(title, description, status) VALUES ($1, $2, $3) RETURNING id`;
    db.query(sql, [title, description, status], (err, result) => {
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
});

router.put('/task/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
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
});


router.delete('/task/:id', (req, res) => {
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
});
module.exports = router;
