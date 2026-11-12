const mongoose = require("mongoose");

let connectionPromise;

async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }

    if (mongoose.connection.readyState === 2 && connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to DB");
            return mongoose.connection;
        })
        .catch((err) => {
            connectionPromise = undefined;
            console.error("MongoDB Connection Error:", err.message);
            throw err;
        });

    return connectionPromise;
}

module.exports = connectDB;