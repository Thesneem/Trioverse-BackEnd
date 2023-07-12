const express = require('express');
const cors = require("cors");
const adminRouter = require('./routes/adminRoute')
const userRouter = require('./routes/userRoute')
const logger = require('morgan');
//const multerMiddleware = require('./middleWares/multer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const { Server } = require("socket.io")
const { createServer } = require('http')
const dotenv = require('dotenv').config();
const mongoose = require('./configuration/dbConnection');

const REACT = process.env.REACT
const app = express();

//app.use(multerMiddleware);

app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(function (err, req, res, next) {
    res.status(err.status || 500).json(response.error(err.status || 500));
});


app.use(cors({
    origin: [REACT],
    method: ["GET", "POST"],
    credentials: true,
})
);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(logger('dev'));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//app.use(express.json());

app.use('/', userRouter)
app.use('/admin', adminRouter)

const port = process.env.PORT || 7000;

const server = createServer(app);
server.listen(port, () => {
    console.log(`Server is running at port ${port}`)
});

const io = new Server(server, {
    pingTimeout: 6000,//no request or response it  will close the connection
    cors: {
        origin: REACT
    },
})

let activeUsers = [];

io.on("connection", (socket) => {
    // add new User
    socket.on("new-user-add", (newUserId) => {
        console.log('newuserrr', newUserId)
        // if user is not added previously
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });
            console.log("New User Connected", activeUsers);
        }
        // send all active users to new user
        io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {

        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers);
        // send all active users to all users
        io.emit("get-users", activeUsers);
    });

    // send message to a specific user
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        console.log('yy', activeUsers)
        const user = activeUsers.find((user) => user.userId === receiverId);
        console.log('UHU', user)
        console.log("Sending from socket to :", receiverId)
        console.log("Data: ", data)
        if (user) {
            console.log(data)
            io.to(user?.socketId).emit("recieve-message", data);
        }
    });
});