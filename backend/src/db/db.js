const mongoose = require("mongoose");
const db_Name = require("../constants");

async function connectDb() {
  try {
    const instance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: db_Name,
    });

    console.log(`✅ MongoDB Connected | Host: ${instance.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.log("🔴 Mongoose error:", err.message);
    });

  } catch (error) {
    console.log("❌ DB Error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDb;