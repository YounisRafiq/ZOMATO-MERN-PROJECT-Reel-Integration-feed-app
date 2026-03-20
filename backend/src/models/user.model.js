const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        requried : true
    },
    password : {
        type : String,
    }
} , {timestamps : true});

const User = mongoose.model("User" , userSchema);
module.exports = User;

