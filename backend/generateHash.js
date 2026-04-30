const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const superAdmin = require("./models/superAdmin");

mongoose.connect("mongodb://localhost:5173/HrmDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));


async function createSuperAdmin() {
  const hashedPassword = await bcrypt.hash("password123", 10); // Hash the password
  const admin = new superAdmin({
    name: "Super Admin",
    email: "admin@example.com",
    password: hashedPassword,
  });

  await admin.save();
  console.log("Admin created successfully!");
  mongoose.disconnect();
}

createSuperAdmin();
