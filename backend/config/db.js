const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;  // MongoDB URI from your .env file
    await mongoose.connect(uri); // No need for deprecated options like useNewUrlParser
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);  // Terminate the process if connection fails
  }
};

module.exports = connectDB;

