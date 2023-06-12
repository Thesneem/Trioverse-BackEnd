const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Trioverse', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connection success");
})
    .catch((err) => {
        console.log(err.message)
    });