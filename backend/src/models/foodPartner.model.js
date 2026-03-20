const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    contactName : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        requried : true
    },
    email : {
        type : String,
        unqiue : true,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const foodPartner = mongoose.model("foodPartner" , foodPartnerSchema);
module.exports = foodPartner