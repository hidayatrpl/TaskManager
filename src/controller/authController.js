const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const response = require('../response');

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const checkEmail = await db.query(`SELECT email FROM users WHERE email = $1`, [email]);
        if (checkEmail.rowCount > 0) return response(409, null, "Email already exists", res);
        const checkUsername = await db.query(`SELECT username FROM users WHERE username = $1`, [username]);
        if (checkUsername.rowCount > 0) return response(409, null, "Username already exists", res);

        const hashPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id`;
        const result = await db.query(sql, [username, email, hashPassword]);
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

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];
        if (!user) return response(401, null, "Invalid username or password", res);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return response(401, null, "Invalid username or password", res);

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const data = {
            isSuccess: true,
            token,
            user_id: user.id
        }
        return response(200, data, "Login Success", res);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login
};
