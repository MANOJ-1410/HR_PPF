
const mongoose = require('mongoose');

// Define the schema for candidate data
const candidateSchema = new mongoose.Schema({
  personalDetails: {
    name: { type: String }, // Candidate's full name
    positionApplied: { type: String }, // Position the candidate is applying for
    dob: { type: Date }, // Date of Birth
    age: { type: Number }, // Automatically calculated from dob
    email: { type: String }, // Email ID
    phoneNo: { type: String }, // Phone number
    permanentAddress: { type: String }, // Permanent residential address
    presentAddress: { type: String }, // Present residential address
    userPhoto: { type: String }, 
    houseOwnership: { 
      type: String, 
      enum: ["",'Leased', 'Own']
    }, // Options: Leased or Own
    languages: [
      {
        language: { type: String }, // Name of the language
        read: { type: Boolean, default: false }, // Can read this language
        speak: { type: Boolean, default: false }, // Can speak this language
        write: { type: Boolean, default: false }, // Can write this language
      },
    ],
    distanceToWorkLocation: { type: String }, // Distance from residence to work location

    // Subheading: Employment Terms
    vehicleOwnership: { 
      type: String, 
      enum: ["",'2 Wheeler', '4 Wheeler']
    }, // Options: 2 Wheeler or 4 Wheeler
    noticePeriod: { type: String }, // Notice period in days
    canJoinIn30Days:  { 
      type: String, 
      enum: ["", 'YES', 'NO']
    }, // Whether the candidate can join in 30 days
    currentCTC: { type: String }, // Current CTC in rupee symbol
    variablePay: { type: String }, // Variable pay in rupee symbol
    totalCTC: { type: String }, // Total CTC in rupee symbol

    // Subheading: Previous Increment
    previousIncrement: {
      percentage: { type: String }, // Increment percentage
      amount: { type: String }, // Increment amount in rupee symbol
    },

    // Photo Upload
    uploadYourRecentPhoto: { type: String }, // URL or file reference for the uploaded photo
  },
  academics: [{
    qualification: String,
    yearOfPassing: Number,
    mode: String,
    specialization: String,
    college: String,
    university: String,
    percentage: String,
  }],
  careerProgression: [{
    companyName: String,
    typeOfBusiness: String,
    location: String,
    revenue: String,
    designation: String,
    reportingTo: String,
    periodFrom: String,
    periodTo: String,
    totalService: String,
    ctc: String,
    reasonForLeaving: String,
  }],
  references: [{
    details: String,
    reference1: String,
    reference2: String,
    reference3: String,
  }],
  declaration: {
    isAgreed: Boolean,
    signature: String,
    agreedDate: Date,
  },
});

module.exports = mongoose.model('Candidate', candidateSchema);
