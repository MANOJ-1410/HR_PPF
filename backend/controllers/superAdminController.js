// // const superAdmin = require('../models/superAdmin');
// // const bcrypt = require('bcrypt');
// // const jwt = require('jsonwebtoken');

// // const login = async (req, res) => {
// //     const { email, password } = req.body;
// //     console.log('Email:', email);
// //     console.log('Password:', password);
  
// //     if (!email || !password) {
// //       return res.status(400).json({ error: 'Email and password are required' });
// //     }
  
// //     try {
// //       const admin = await superAdmin.findOne({ email: email.trim() });
// //       if (!admin) {
// //         console.log('No admin found with that email');
// //         return res.status(401).json({ message: 'Invalid email or password' });
// //       }
  
// //       console.log('Hashed password in DB:', admin.password);
// //       const isValidPassword = await bcrypt.compare(password.trim(), admin.password.trim());
// //       console.log('Password valid:', isValidPassword);
// //       if (!isValidPassword) {
// //         console.log('Password validation failed');
// //         return res.status(401).json({ message: 'Invalid email or password' });
// //       }
  
// //       console.log('User authenticated');
// //       const token = jwt.sign({ id: admin._id }, 'your_jwt_secret_key');
// //       res.status(200).json({ message: 'Login successful', token });
// //     } catch (error) {
// //       console.log('Server error:', error);
// //       res.status(500).json({ message: 'Server error' });
// //     }
// //   };
  
// // module.exports = { login };

// const superAdmin = require('../models/superAdmin');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { updatePassword } = require('./authController');

// // Hardcoded SuperAdmin credentials
// const HARDCODED_SUPERADMIN = {
//   email: "superadmin@mv.com",
//   password: "super123"
// };

// // Initialize hardcoded SuperAdmin in database
// const initializeSuperAdmin = async () => {
//   try {
//     const existingAdmin = await superAdmin.findOne({ email: HARDCODED_SUPERADMIN.email });
    
//     if (!existingAdmin) {
//       // const hashedPassword = await bcrypt.hash(HARDCODED_SUPERADMIN.password, 10);
//       const newSuperAdmin = new superAdmin({
//         email: HARDCODED_SUPERADMIN.email,
//         password: HARDCODED_SUPERADMIN.password
//       });
//       await newSuperAdmin.save();
//       console.log('Hardcoded SuperAdmin created in database');
//     } else {
//       console.log('SuperAdmin already exists in database');
//     }
//   } catch (error) {
//     console.error('Error initializing SuperAdmin:', error);
//   }
// };

// // Call initialization when module loads
// initializeSuperAdmin();

// const login = async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Login attempt - Email:', email);

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     try {
//       const admin = await superAdmin.findOne({ email: email.trim() });
//       if (!admin) {
//         console.log('No admin found with that email');
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const isValidPassword = await bcrypt.compare(password.trim(), admin.password);
//       console.log('Password validation result:', isValidPassword);
      
//       if (!isValidPassword) {
//         console.log('Password validation failed');
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       console.log('SuperAdmin authenticated successfully');
      
//       // Use consistent JWT secret
//       const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
//       const token = jwt.sign(
//         { 
//           id: admin._id, 
//           email: admin.email,
//           role: 'superadmin' 
//         }, 
//         JWT_SECRET,
//         { expiresIn: '24h' }
//       );

//       res.status(200).json({ 
//         message: 'Login successful', 
//         token,
//         user: {
//           id: admin._id,
//           email: admin.email,
//           role: 'superadmin'
//         }
//       });
//     } catch (error) {
//       console.log('Server error:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
// };

// module.exports = { login , updatePassword };