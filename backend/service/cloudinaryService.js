require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Candidate = require('../models/newCandidateForm.models');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully!");

        const candidates = await Candidate.find({});
        console.log(`Found ${candidates.length} candidates. Starting migration...`);

        for (let candidate of candidates) {
            let updated = false;

            if (candidate.personalDetail?.photo && candidate.personalDetail.photo.startsWith('/uploads')) {
                const localPath = path.join(__dirname, '..', candidate.personalDetail.photo);
                if (fs.existsSync(localPath)) {
                    console.log(`Uploading photo for ${candidate.personalDetail.name || candidate._id}...`);
                    const result = await cloudinary.uploader.upload(localPath, {
                        folder: "hr-ppf-uploads/personalDetail"
                    });
                    candidate.personalDetail.photo = result.secure_url;
                    updated = true;
                } else {
                    console.warn(`File not found: ${localPath}`);
                }
            }

            // Migrate Signature
            if (candidate.declaration?.signature && candidate.declaration.signature.startsWith('/uploads')) {
                const localPath = path.join(__dirname, '..', candidate.declaration.signature);
                if (fs.existsSync(localPath)) {
                    console.log(`Uploading signature for ${candidate.personalDetail?.name || candidate._id}...`);
                    const result = await cloudinary.uploader.upload(localPath, {
                        folder: "hr-ppf-uploads/signatureImage"
                    });
                    candidate.declaration.signature = result.secure_url;
                    updated = true;
                } else {
                    console.warn(`File not found: ${localPath}`);
                }
            }

            if (updated) {
                await candidate.save();
                console.log(`Updated candidate: ${candidate.personalDetail?.name || candidate._id}`);
            }
        }

        console.log("Migration completed!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
