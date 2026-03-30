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
    },
     roles: {
      type: [String],
      default: ["user"],
    },
    
} , {timestamps : true});

const User = mongoose.model("User" , userSchema);
module.exports = User;

