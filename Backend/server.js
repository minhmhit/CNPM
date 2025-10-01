require('dotenv').config();
const connection =  require('./config/connection_mysql');

const express = require('express');
const app = express();
const createError = require('http-errors');

var cors = require('cors');
app.use(cors());



//config request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoute = require('./Routes/User.route');
const BusRoute = require('./Routes/bus.route');
const RouteRoute = require('./Routes/route.route');

app.use('/api/v1/bus', BusRoute);

app.use('/api/v1/user', UserRoute);

app.use('/api/v1/route', RouteRoute);

app.get('/', (req, res, next) => {
    res.send('Hello World!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT,  async () => {
    await connection.testConnection();
    console.log(`Server is running on port ${PORT}`);
});
