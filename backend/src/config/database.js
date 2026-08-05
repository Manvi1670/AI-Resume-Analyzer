const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

module.exports = connectToDB;