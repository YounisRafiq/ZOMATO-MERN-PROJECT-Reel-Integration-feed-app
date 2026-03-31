const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
    foodPartner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "foodPartner",
        required : true
    },

    food : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Food",
        required : true
    }
} , { timestamps : true });

const Save = mongoose.model("Save", saveSchema);
module.exports = Save;