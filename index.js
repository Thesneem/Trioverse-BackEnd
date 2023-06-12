const express = require('express');
const cors = require("cors");
const adminRouter = require('./routes/adminRoute')
const userRouter = require('./routes/userRoute')
const logger = require('morgan');
//const multerMiddleware = require('./middleWares/multer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

// const dotenv = require('dotenv').config();
const mongoose = require('./configuration/dbConnection');


const app = express();

//app.use(multerMiddleware);

app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(function (err, req, res, next) {
    res.status(err.status || 500).json(response.error(err.status || 500));
});


app.use(cors({
    origin: ["http://localhost:3000"],
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

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
});