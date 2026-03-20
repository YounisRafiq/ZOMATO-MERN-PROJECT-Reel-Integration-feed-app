const mongoose = require('mongoose');
const db_Name = require('../constants.js');
function connectDb() {
   try {
    
   mongoose.connect(`${process.env.MONGODB_URI}/${db_Name}`);

   console.log(`MongoDb Connected SuccessFully`)
   } catch (error) {
    console.log("Error Happen While coneecting the database" , error)
   }
};

module.exports =  connectDb;