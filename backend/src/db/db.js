const mongoose = require("mongoose");
const db_Name = require("../constants");

async function connectDb() {
  try {
    const instance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${db_Name}`,
    );

    console.log(`✅ MongoDB Connected | Host: ${instance.connection.host}`);
  } catch (error) {
    console.log("❌ DB Error:", error.message);
  }
}

module.exports = connectDb;
