require('dotenv').config();
const connection =  require('./config/connection_mysql');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const setupWebSocket = require('./socket/websocket');
// Thiết lập WebSocket với server
const io = setupWebSocket(server);

const PORT = process.env.PORT || 5000;

app.set('io', io);

//import routes
const AttendanceRoute = require('./Routes/attendance.route');
const AdminRoute = require('./Routes/admin.route');
const BusRoute = require('./Routes/bus.route');
const DriverRoute = require('./Routes/driver.route');
// const NotificationRoute = require('./Routes/notification.route');
const RouteRoute = require('./Routes/route.route');
const ScheduleRoute = require('./Routes/schedule.route');
const StudentRoute = require('./Routes/student.route');
const TrackingRoute = require('./Routes/tracking.route');
const UserRoute = require('./Routes/User.route');


var cors = require('cors');
app.use(cors());

//config request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use routes
app.use('/api/v1/attendance', AttendanceRoute);
app.use('/api/v1/admin', AdminRoute);
app.use('/api/v1/bus', BusRoute);
app.use('/api/v1/driver', DriverRoute);
// app.use('/api/v1/notification', NotificationRoute);
app.use('/api/v1/route', RouteRoute);
app.use('/api/v1/schedule', ScheduleRoute);
app.use('/api/v1/student', StudentRoute);
app.use('/api/v1/tracking', TrackingRoute);
app.use('/api/v1/user', UserRoute);

app.get('/', (req, res, next) => {
    res.send('Hello World!');
});



server.listen(PORT,  async () => {
    await connection.testConnection();
    console.log(`Server is running on port ${PORT}`);
});
