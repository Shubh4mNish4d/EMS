const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB")
    }
    catch (err) {
        console.error("MongoDB Connection Error:", err.message);

        throw err;
    }
}

module.exports = connectDB;