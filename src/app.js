const express = require('express')
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');
const app = express();
app.use(express.json());

app.use('/', taskRoutes);

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`)
})