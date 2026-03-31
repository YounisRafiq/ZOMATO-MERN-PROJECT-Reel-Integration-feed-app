const mongoose = require('mongoose');
const db_Name = require("../constants");

async function connectDb() {
  try {

    const uri = `${process.env.MONGODB_URI}/${db_Name}`;

    console.log("MongoDB URI:", uri); // debug

    const instance = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected | Host: ${instance.connection.host}`);

    // 🔥 EVENTS (VERY IMPORTANT FOR DEBUG)
    mongoose.connection.on("connected", () => {
      console.log("🟢 Mongoose connected event fired");
    });

    mongoose.connection.on("error", (err) => {
      console.log("🔴 Mongoose error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("🟡 Mongoose disconnected");
    });

  } catch (error) {
    console.log("❌ Error while connecting database:", error.message);
    process.exit(1);
  }
}

module.exports = connectDb;