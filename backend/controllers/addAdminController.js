
const addAdmin = require("../models/addAdmin");

// Get all admins
const getaddAdmin = async (req, res) => {
  try {
    const admins = await addAdmin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new admin
const createaddAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const admin = new addAdmin({ name, email, password });
  try {
    const newAdmin = await admin.save();
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete an admin
const deleteaddAdmin = async (req, res) => {
    try {
      // Find and delete the admin by ID
      const admin = await addAdmin.findByIdAndDelete(req.params.id); // Use the correct model name `Admin`
      
      if (!admin) {
        // If the admin doesn't exist, return a 404 response
        return res.status(404).json({ message: "Admin not found" });
      }
  
      // Respond with a success message
      res.json({ message: "Admin deleted successfully" });
    } catch (err) {
      // Handle server errors
      res.status(500).json({ message: err.message });
    }
  };
  
  

module.exports = { getaddAdmin, createaddAdmin, deleteaddAdmin };
