const mongoose = require('mongoose');
const db_Name = require('../constants.js');
async function connectDb() {
  try {
    const instance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_Name}`)

      console.log(`MongoDB Connected Successfully | Db Host : ${instance.connection.host}`);
   } catch (error) {
      console.log("Error while connecting database", error);
   }
};

module.exports =  connectDb;