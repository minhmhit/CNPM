require('dotenv').config();
require('./config/connection_mysql');

const express = require('express');
const app = express();
const createError = require('http-errors');

var cors = require('cors');
app.use(cors());




app.use(express.json());
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.get('/', (req, res, next) => {
    res.send('Hello World!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
