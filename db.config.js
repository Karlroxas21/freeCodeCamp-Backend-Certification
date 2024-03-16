const Mongoose = require('mongoose');

exports.connectDB = () =>{
    Mongoose.connect(process.env.DB_URI).then(() =>{
        console.log("Connected to DB");
    }).catch((err) =>{
        console.log("Connection to DB failed");
        console.error(err);
        process.exit(1);
    })
}