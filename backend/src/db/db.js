const mongoose = require('mongoose');
const db_Name = require("../constants");
async function connectDb() {
  try {
    const instance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_Name}`)
    console.log("MongoDb URI : ", process.env.MONGODB_URI);
      console.log(`MongoDB Atlas Connected Successfully | Db Host : ${instance.connection.host}`);
   } catch (error) {
      console.log("Error while connecting database", error.message);
      process.exit(1);
   }
};

module.exports =  connectDb;