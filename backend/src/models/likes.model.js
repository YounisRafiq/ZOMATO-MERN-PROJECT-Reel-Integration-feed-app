const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    food : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Food"
    }
} , { timestamps : true });

const Like = mongoose.model("Like" , likeSchema);
module.exports = Like;