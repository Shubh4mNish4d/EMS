const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);

        isConnected = db.connections[0].readyState === 1;

        console.log("MongoDB Connected Successfully");

    } catch (err) {
        isConnected = false;

        console.error("MongoDB Connection Error:", err.message);

        throw err;
    }
}

module.exports = connectDB;