const express = require('express')
const app = express();

const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());
app.use('/', taskRoutes);
app.use(errorHandler);

module.exports = app;