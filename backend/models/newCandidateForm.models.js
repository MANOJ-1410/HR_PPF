// const mongoose = require('mongoose');

// const newCandidateSchema = new mongoose.Schema({
    
//     personalDetail: {
//       name: String,
//       positionApplied: String,
//       dateOfBirth: String,
//       age: String,
//       email: String,
//       photo: Object,
//       phoneNo: String,
//       permanentAddress: String,
//       presentAddress: String,
//       houseOwnership: String,
//       workLocationDistance: String,
//       languages: [
//         {
//           language: String,
//           read: Boolean,
//           speak: Boolean,
//           write: Boolean,
//         },
//       ],
//       noticePeriod: String,
//       canJoinIn30Days: Boolean,
//       currentCTC: String,
//       variablePay: String,
//       totalCTC: String,
//       previousIncrementPercent: String,
//       previousIncrementAmount: String,
//       vehicleOwnership: {
//         twoWheeler: Boolean,
//         fourWheeler: Boolean,
//       },
//     },
//     academics: {
//       qualifications: [
//         {
//           level: String,
//           yearOfPassing: String,
//           mode: String,
//           specialization: String,
//           college: String,
//           university: String,
//           percentage: String,
//         },
//       ],
//     },
//     careerProgression: {
//       experiences: [
//         {
//           companyName: String,
//           businessType: String,
//           location: String,
//           companyRevenue: String,
//           designation: String,
//           reportingTo: String,
//           periodFrom: String,
//           periodTo: String,
//           totalService: String,
//           ctcWhileLeaving: String,
//           reasonForLeaving: String,
//         },
//       ],
//     },
//     familyDetails: {
//       spouse: {
//         name: String,
//         age: String,
//         profession: String,
//         placeOfResidence: String,
//       },
//       father: {
//         name: String,
//         age: String,
//         profession: String,
//         placeOfResidence: String,
//       },
//       mother: {
//         name: String,
//         age: String,
//         profession: String,
//         placeOfResidence: String,
//       },
//       children: [
//         {
//           name: String,
//           age: String,
//           school: String,
//           class: String,
//         },
//       ],
//     },
//     references: {
//       referees: [
//         {
//           name: String,
//           designation: String,
//           phoneNo: String,
//           email: String,
//           knownSince: String,
//         },
//       ],
//       canVerifyCurrentEmployer: Boolean,
//       reasonIfNo: String,
//     },
//     declaration: {
//       signature: Object,
//       agreed: Boolean,
//     },
// }, {timestamps: true});

// module.exports = mongoose.model('NewCandidate', newCandidateSchema);
  




const mongoose = require('mongoose');

const newCandidateSchema = new mongoose.Schema({
    personalDetail: {
      name: { type: String, required: true },
      positionApplied: String,
      dateOfBirth: String, // Keeping as String if you prefer raw input, but Date is better for PDF formatting
      age: String,
      email: { type: String, required: true },
      photo: String, // Cloudinary URL: https://res.cloudinary.com/...
      phoneNo: String,
      permanentAddress: String,
      presentAddress: String,
      houseOwnership: String,
      workLocationDistance: String,
      languages: [
        {
          language: String,
          read: { type: Boolean, default: false },
          speak: { type: Boolean, default: false },
          write: { type: Boolean, default: false },
        },
      ],
      noticePeriod: String,
      canJoinIn30Days: { type: Boolean, default: false },
      currentCTC: String,
      variablePay: String,
      totalCTC: String,
      previousIncrementPercent: String,
      previousIncrementAmount: String,
      vehicleOwnership: {
        twoWheeler: { type: Boolean, default: false },
        fourWheeler: { type: Boolean, default: false },
      },
    },
    academics: {
      qualifications: [
        {
          level: String,
          yearOfPassing: String,
          mode: String,
          specialization: String,
          college: String,
          university: String,
          percentage: String,
        },
      ],
    },
    careerProgression: {
      experiences: [
        {
          companyName: String,
          businessType: String,
          location: String,
          companyRevenue: String,
          designation: String,
          reportingTo: String,
          periodFrom: String,
          periodTo: String,
          totalService: String,
          ctcWhileLeaving: String,
          reasonForLeaving: String,
        },
      ],
    },
    familyDetails: {
      spouse: { name: String, age: String, profession: String, placeOfResidence: String },
      father: { name: String, age: String, profession: String, placeOfResidence: String },
      mother: { name: String, age: String, profession: String, placeOfResidence: String },
      children: [
        {
          name: String,
          age: String,
          school: String,
          class: String,
        },
      ],
    },
    references: {
      referees: [
        {
          name: String,
          designation: String,
          phoneNo: String,
          email: String,
          knownSince: String,
        },
      ],
      canVerifyCurrentEmployer: { type: Boolean, default: false },
      reasonIfNo: String,
    },
    declaration: {
      signature: String, // Cloudinary URL
      agreed: { type: Boolean, required: true },
    },
}, { timestamps: true });

module.exports = mongoose.model('NewCandidate', newCandidateSchema);