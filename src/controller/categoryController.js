const db = require('../config/db');
const response = require('../response');

const getAllCategory = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const sql = "SELECT * FROM categories WHERE user_id = $1";
        const result = await db.query(sql, [user_id]);
        return response(200, result.rows, "Data Success", res);
    }
    catch (err) {
        next(err);
    }
}

const getCategoryById = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const sql = "SELECT * FROM categories WHERE user_id = $1 AND id = $2";
        const result = await db.query(sql, [user_id, id]);
        if (result.rowCount === 0) return response(404, null, "Data Not Found", res);
        return response(200, result.rows, "Data Success", res);
    }
    catch (err) {
        next(err);
    }
}

const createCategory = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { name } = req.body;
        const sql = `INSERT INTO categories(name, user_id) VALUES ($1, $2) RETURNING id`;
        const result = await db.query(sql, [name, user_id]);
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

const updateCategory = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const { name } = req.body;
        const sql = `UPDATE categories SET name = COALESCE($1, name) WHERE user_id = $2 AND id = $3 RETURNING id`;
        const result = await db.query(sql, [name, user_id, id]);
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

const deleteCategory = async (req, res, next) => {
    try {
        const { user_id } = req.user;
        const { id } = req.params;
        const sql = `DELETE FROM categories WHERE user_id = $1 AND id = $2`;
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
    getAllCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}
