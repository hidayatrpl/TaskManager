const db = require('../config/db');
const response = require('../response');

const getAllUser = async (req, res, next) => {
    try {
        const sql = "SELECT id, username, email FROM users";
        const result = await db.query(sql);
        if (result?.rowCount) {
            const data = {
                isSuccess: true,
                data: result.rows
            }
            return response(200, data, "Data Success", res);
        }
        return response(404, null, "Data Not Found", res);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    getAllUser
};