const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const loginRouter = require('./routes/login.router');
const signupRouter = require('./routes/signup.router');
const driversignupRouter = require('./routes/driversignup.router');
const driverinfoRouter = require('./routes/driverinfo.router')
const routeRouter = require('./routes/route.router');
const updatecapacityRouter = require('./routes/updatecapacity.router')




const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const socketController = require('./controller/socket.controller');
socketController(io);


app.use('/api/v1/login', loginRouter);
app.use('/api/v1/signup', signupRouter);
app.use('/api/v1/driversignup', driversignupRouter);
app.use('/api/v1/driverinfo', driverinfoRouter);
app.use('/api/v1/routes', routeRouter);
app.use('/api/v1/update', updatecapacityRouter);

// const PORT = process.env.PORT || 21108;
// app.listen(PORT, () => {
//   console.log("Server is running on port:", PORT);
// });

const PORT = process.env.PORT || 21108;
server.listen(PORT, () => {
  console.log("🚀 Server is running on port:", PORT);
});
