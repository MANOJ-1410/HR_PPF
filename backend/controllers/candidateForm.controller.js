const Candidate = require('../models/candidateForm.model');
const path = require("path");
const fs = require("fs");
const newCandidateFormModels = require('../models/newCandidateForm.models');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to ensure an image is on Cloudinary
const uploadToCloudinary = async (imagePath, folder) => {
    if (!imagePath) return null;
    
    // If it's already a Cloudinary URL, return it
    if (imagePath.startsWith('http')) return imagePath;

    try {
        let source = imagePath;
        
        // If it's a local path (e.g. /uploads/...), get the absolute path
        if (imagePath.startsWith('/uploads')) {
            source = path.join(__dirname, '..', imagePath);
            if (!fs.existsSync(source)) {
                console.warn(`Local file not found: ${source}`);
                return imagePath; // Return original if not found
            }
        }
        
        // Upload to Cloudinary (handles Base64, URLs, and local paths)
        const uploadResponse = await cloudinary.uploader.upload(source, { folder });
        return uploadResponse.secure_url;
    } catch (error) {
        console.error(`Cloudinary upload failed for ${imagePath}:`, error);
        return imagePath; // Fallback to original path on error
    }
};

// Replace createCandidate function
exports.createCandidate = async (req, res) => {
    try {
        const { formData } = req.body;

        if (formData.personalDetails.userPhoto) {
            const uploadResponse = await cloudinary.uploader.upload(
                formData.personalDetails.userPhoto,
                { folder: "hr-ppf-uploads/personalDetail" }
            );
            formData.personalDetails.userPhoto = uploadResponse.secure_url;
        }

        const candidate = new Candidate(formData);
        const candidateSave = await candidate.save();
        res.status(201).json(candidate);
    } catch (error) {
        console.log("Error during candidate save:", error);
        res.status(400).json({ message: error.message });
    }
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a candidate by ID
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a candidate by ID
exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a candidate by ID
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch all candidate data from the database
exports.getCandidates = async (req, res) => {
    try {
      const candidates = await Candidate.find(); // Fetching all candidates
      res.status(200).json(candidates); // Sending candidates data to frontend
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  };




exports.createNewCandidate = async (req, res) => {
    try {
        const formData = req.body;
        console.log("formData", formData);

        // Upload photo to Cloudinary
        if (formData.personalDetail.photo) {
            formData.personalDetail.photo = await uploadToCloudinary(
                formData.personalDetail.photo,
                "hr-ppf-uploads/personalDetail"
            );
        }

        // Upload signature to Cloudinary
        if (formData.declaration.signature) {
            formData.declaration.signature = await uploadToCloudinary(
                formData.declaration.signature,
                "hr-ppf-uploads/signatureImage"
            );
        }

        const newCandidate = new newCandidateFormModels(formData);
        const candidateSave = await newCandidate.save();
        res.status(201).json(candidateSave);

    } catch (error) {
        console.log("Error during candidate save:", error);
        res.status(400).json({ message: error.message });
    }
}

exports.getAllNewCandidate = async (req, res) => {

    try {
        const candidates = await newCandidateFormModels.find({}).lean();

        return res.status(200).json(candidates);
    } catch (error) {
        console.log("Error during candidate save:", error);
        res.status(400).json({ message: error.message });
    }
}


exports.getSingleCandidateDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if(id){

            const candidateDetail = await newCandidateFormModels.findOne({ _id: id})
            return res.status(200).json(candidateDetail)
        }
        return res.status(400).send({error: "Id not found"})
    } catch (error) {
        console.log("Error during candidate save:", error);
        res.status(400).json({ message: error.message });
    }
}

exports.updateNewCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const formData = req.body;

        const existingCandidate = await newCandidateFormModels.findById(id);
        if (!existingCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Upload photo to Cloudinary if it's a new Base64 string or a local path
        if (formData.personalDetail.photo) {
            formData.personalDetail.photo = await uploadToCloudinary(
                formData.personalDetail.photo,
                "hr-ppf-uploads/personalDetail"
            );
        }

        // Upload signature to Cloudinary if it's a new Base64 string or a local path
        if (formData.declaration.signature) {
            formData.declaration.signature = await uploadToCloudinary(
                formData.declaration.signature,
                "hr-ppf-uploads/signatureImage"
            );
        }

        const updatedCandidate = await newCandidateFormModels.findByIdAndUpdate(id, formData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedCandidate);

    } catch (error) {
        console.log("Error during candidate update:", error);
        res.status(400).json({ message: error.message });
    }
}

exports.deleteSingleCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        if(id){
            const deleteCandidate = await newCandidateFormModels.deleteOne({ _id : id});

            return res.status(200).json(deleteCandidate)
        }
        return res.status(400).send({error: "Id not found"})

    } catch (error) {
        console.log("Error during candidate save:", error);
        res.status(400).json({ message: error.message });
    }
}