require('dotenv').config();
const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USERS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if(err){
        return console.error('Gagal terhubung dengan database:', err.stack);
    }
    console.log("Koneksi berhasil");
    release();
});

module.exports = pool;