const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    foodPartner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "foodPartner"
    },
    food : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Food"
    }
} , { timestamps : true });

likeSchema.index({ user: 1, food: 1 }, { unique: true });

const Like = mongoose.model("Like" , likeSchema);
module.exports = Like;