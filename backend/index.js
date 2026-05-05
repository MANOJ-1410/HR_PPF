// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const connectDB = require("./config/db");
// const candidateRoute = require("./routes/candidateForm.route");
// // const AuthRouter = require('./routes/AuthRouter');
// require("dotenv").config();

// const app = express();
// // const superAdminRoute = require("./routes/superAdminRoute");
// const addAdminRoute = require("./routes/addAdminRoute");
// // const authRoutes = require("./routes/authRoutes");
// const authRoutes = require('./routes/auth')

// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 },
//     fileFilter: function (req, file, cb) {
//         const filetypes = /jpeg|jpg|png|pdf/;
//         const mimetype = filetypes.test(file.mimetype);
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         if (mimetype && extname) {
//             return cb(null, true);
//         }
//         cb(new Error("Invalid file type"));
//     }
// });

// // CORS Configuration
// const allowedOrigin = [
//     "http://localhost:5173",
//     "http://localhost:5174",
//     "http://127.0.0.1:5173",
//     "http://127.0.0.1:5174",
//     "https://hr-ppf-frontend.vercel.app"  // ← add your frontend Vercel URL here
// ];
// app.use(
//     cors({
//         origin: function (origin, callback) {
//             console.log("Origin requested:", origin); // Debugging
//             if (allowedOrigin.includes(origin) || !origin) {
//                 callback(null, true);
//             } else {
//                 callback(new Error("Not allowed by CORS"));
//             }
//         },
//         credentials: true
//     })
// );

// // Middlewares
// // app.use(express.json());
// app.use(express.json({ limit: "500mb" }));
// app.use(express.urlencoded({ limit: "500mb", extended: true }));
// app.use('/api/auth', authRoutes);
// // Database Connection
// connectDB();

// // Welcome Route
// app.get("/", (req, res) => {
//     res.json({
//         message: "WELCOME TO HR BACKEND",
//         status: "Running",
//         version: "1.0.0"
//     });
// });

// app.post("/api/v1/upload", upload.single("file"), (req, res) => {
//     try {
//         res.status(200).json({
//             message: "File uploaded successfully",
//             file: req.file
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "File upload failed",
//             error: err.message
//         });
//     }
// });


// // Routes
// app.use("/api/v1/candidate", candidateRoute);
// // app.use("/api/v1/auth", AuthRouter);
// app.use("/uploads", express.static("uploads"));
// app.use("/api/addAdmin", addAdminRoute);
// // app.use('/api/superAdmin', superAdminRoute);
// app.use('/api/auth', authRoutes);

// // Generic Error Handler
// app.use((err, req, res, next) => {
//     console.error(err.message);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

// // Server Initialization
// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//     console.log("Server is running on port", port);
// });

// module.exports = app;


const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const connectDB = require("./config/db");
const candidateRoute = require("./routes/candidateForm.route");
require("dotenv").config();

const app = express();
app.use(cookieParser());
const addAdminRoute = require("./routes/addAdminRoute");
const authRoutes = require('./routes/auth');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "hr-ppf-uploads",
        allowed_formats: ["jpeg", "jpg", "png", "pdf"],
        resource_type: "auto",
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Invalid file type"));
    }
});

// CORS Configuration
const allowedOrigin = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://hr-ppf-s3wt.vercel.app",
    "https://manjushree-hr.vercel.app",
    "https://hr-ppf.vercel.app"
];

// Manual CORS and Pre-flight Handler
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const isVercel = origin && /https?:\/\/.*\.vercel\.app$/.test(origin);
    
    if (allowedOrigin.includes(origin) || isVercel) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin');
    }

    // Handle Private Network Access (Chrome/Edge optimization)
    if (req.headers['access-control-request-private-network']) {
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }

    // Immediate response for OPTIONS pre-flight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Middlewares
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// Database Connection
connectDB();

// Welcome Route
app.get("/", (req, res) => {
    res.json({
        message: "WELCOME TO HR BACKEND",
        status: "Running",
        version: "1.0.0"
    });
});

// Upload Route
app.post("/api/v1/upload", upload.single("file"), (req, res) => {
    try {
        res.status(200).json({
            message: "File uploaded successfully",
            file: {
                url: req.file.path,        // Cloudinary URL
                public_id: req.file.filename // Cloudinary public_id
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "File upload failed",
            error: err.message
        });
    }
});

// Routes
app.use("/api/v1/candidate", candidateRoute);
app.use("/api/addAdmin", addAdminRoute);
app.use('/api/auth', authRoutes);

// Generic Error Handler
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Server Initialization
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Server is running on port", port);
});

module.exports = app;