// import { createSlice } from "@reduxjs/toolkit";

// const validData = {
//   personalDetail: {
//     name: "John Doe",
//     positionApplied: "Software Engineer",
//     dateOfBirth: "1990-01-01",
//     age: "33",
//     email: "john.doe@example.com",
//     photo: "",
//     phoneNo: "9876543210",
//     permanentAddress: "123 Main Street, City, Country",
//     presentAddress: "456 Elm Street, City, Country",
//     houseOwnership: "Own",
//     workLocationDistance: "10",
//     languages: [
//       { language: "English", read: true, speak: true, write: true },
//       { language: "Spanish", read: true, speak: false, write: false },
//     ],
//     noticePeriod: "1",
//     canJoinIn30Days: true,
//     currentCTC: "1500000",
//     variablePay: "150000",
//     totalCTC: "1650000",
//     previousIncrementPercent: "10",
//     previousIncrementAmount: "150000",
//     vehicleOwnership: { twoWheeler: true, fourWheeler: false },
//   },
//   academics: {
//     qualifications: [
//       {
//         level: "Matriculation",
//         yearOfPassing: "2012",
//         mode: "Full-Time",
//         specialization: "Computer Science",
//         college: "XYZ College",
//         university: "ABC University",
//         percentage: "75%",
//       },
//       {
//         level: "Plus II",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Diploma",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Graduation",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Post-Graduation",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "PG Diploma",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Doctorate",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//     ],
//   },
//   careerProgression: {
//     experiences: [
//       {
//         companyName: "Tech Corp",
//         businessType: "IT Services",
//         location: "City, Country",
//         companyRevenue: "50M USD",
//         designation: "Senior Developer",
//         reportingTo: "Team Lead",
//         periodFrom: "2015-06-01",
//         periodTo: "2020-08-01",
//         totalService: "5 Years",
//         ctcWhileLeaving: "12 LPA",
//         reasonForLeaving: "Career Growth",
//       },
      
//     ],
//   },
//   familyDetails: {
//     spouse: {
//       name: "Jane Doe",
//       age: "30",
//       profession: "Teacher",
//       placeOfResidence: "City, Country",
//     },
//     father: {
//       name: "Robert Doe",
//       age: "65",
//       profession: "Retired",
//       placeOfResidence: "City, Country",
//     },
//     mother: {
//       name: "Mary Doe",
//       age: "60",
//       profession: "Homemaker",
//       placeOfResidence: "City, Country",
//     },
//     children: [{ name: "Child Doe", age: "5", school: "ABC School", class: "KG" }],
//   },
//   references: {
//     referees: [
//       {
//         name: "Referee One",
//         designation: "Manager",
//         phoneNo: "9876543210",
//         email: "ref.one@example.com",
//         knownSince: "5 years",
//       },
//       {
//         name: "",
//         designation: "",
//         phoneNo: "",
//         email: "",
//         knownSince: "",
//       },
//       {
//         name: "",
//         designation: "",
//         phoneNo: "",
//         email: "",
//         knownSince: "",
//       },
//     ],
//     canVerifyCurrentEmployer: true,
//     reasonIfNo: "",
//   },
//   declaration: {
//     signature: "base64SignatureString",
//     agreed: true,
//   },
// };


// const initialState = {
//   personalDetail: {
//     name: "",
//     positionApplied: "",
//     dateOfBirth: "",
//     age: "",
//     email: "",
//     photo: null,
//     phoneNo: "",
//     permanentAddress: "",
//     presentAddress: "",
//     houseOwnership: "",
//     workLocationDistance: "",
//     languages: [{ language: "", read: false, speak: false, write: false }],
//     noticePeriod: "",
//     canJoinIn30Days: false,
//     currentCTC: "",
//     variablePay: "",
//     totalCTC: "",
//     previousIncrementPercent: "",
//     previousIncrementAmount: "",
//     vehicleOwnership: { twoWheeler: false, fourWheeler: false },
//   },
//   academics: {
//     qualifications: [
//       {
//         level: "Matriculation",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Plus II",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Diploma",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Graduation",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Post-Graduation",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "PG Diploma",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//       {
//         level: "Doctorate",
//         yearOfPassing: "",
//         mode: "",
//         specialization: "",
//         college: "",
//         university: "",
//         percentage: "",
//       },
//     ],
//   },
//   careerProgression: {
//     experiences: [
//       {
//         companyName: "",
//         businessType: "",
//         location: "",
//         companyRevenue: "",
//         designation: "",
//         reportingTo: "",
//         periodFrom: "",
//         periodTo: "",
//         totalService: "",
//         ctcWhileLeaving: "",
//         reasonForLeaving: "",
//       },
//     ],
//   },
//   familyDetails: {
//     spouse: {
//       name: "",
//       age: "",
//       profession: "",
//       placeOfResidence: "",
//     },
//     father: {
//       name: "",
//       age: "",
//       profession: "",
//       placeOfResidence: "",
//     },
//     mother: {
//       name: "",
//       age: "",
//       profession: "",
//       placeOfResidence: "",
//     },
//     children: [
//       {
//         name: "",
//         age: "",
//         school: "",
//         class: "",
//       },
//     ],
//   },
//   references: {
//     referees: [
//       {
//         name: "",
//         designation: "",
//         phoneNo: "",
//         email: "",
//         knownSince: "",
//       },
//       {
//         name: "",
//         designation: "",
//         phoneNo: "",
//         email: "",
//         knownSince: "",
//       },
//       {
//         name: "",
//         designation: "",
//         phoneNo: "",
//         email: "",
//         knownSince: "",
//       },
//     ],
//     canVerifyCurrentEmployer: false,
//     reasonIfNo: "",
//   },
//   declaration: {
//     signature: null,
//     agreed: false,
//   },
//   ...validData,
//   personalImageFileName:"",
//   signatureImageFileName:"",
//   errors: {},
// };

// const candidateDetailsSlice = createSlice({
//   name: "candidateForm",
//   initialState,
//   reducers: {
//     updatePersonalDetail: (state, action) => {
//       const { field, value } = action.payload;
//       state.personalDetail[field] = value;
//     },
//     updateLanguage: (state, action) => {
//       const { index, field, value } = action.payload;
//       state.personalDetail.languages[index][field] = value;
//     },
//     updateVehicleOwnership: (state, action) => {
//       const { field, value } = action.payload;
//       state.personalDetail.vehicleOwnership[field] = value;
//     },
//     addLanguage: (state) => {
//       state.personalDetail.languages.push({
//         language: "",
//         read: false,
//         speak: false,
//         write: false,
//       });
//     },
//     removeLanguage: (state, action) => {
//       state.personalDetail.languages.splice(action.payload, 1);
//     },
//     updateAcademic: (state, action) => {
//       const { index, field, value } = action.payload;
//       state.academics.qualifications[index][field] = value;
//     },
//     updateCareer: (state, action) => {
//       const { index, field, value } = action.payload;
//       state.careerProgression.experiences[index][field] = value;
//     },
//     addCareerEntry: (state) => {
//       state.careerProgression.experiences.push({
//         companyName: "",
//         businessType: "",
//         location: "",
//         companyRevenue: "",
//         designation: "",
//         reportingTo: "",
//         periodFrom: "",
//         periodTo: "",
//         totalService: "",
//         ctcWhileLeaving: "",
//         reasonForLeaving: "",
//       });
//     },
//     removeCareerEntry: (state, action) => {
//       state.careerProgression.experiences.splice(action.payload, 1);
//     },
//     updateFamilyMember: (state, action) => {
//       const { memberType, field, value } = action.payload;
//       state.familyDetails[memberType][field] = value;
//     },
//     updateChild: (state, action) => {
//       const { index, field, value } = action.payload;
//       state.familyDetails.children[index][field] = value;
//     },
//     addChild: (state) => {
//       state.familyDetails.children.push({
//         name: "",
//         age: "",
//         school: "",
//         class: "",
//       });
//     },
//     removeChild: (state, action) => {
//       state.familyDetails.children.splice(action.payload, 1);
//     },
//     updateReference: (state, action) => {
//       const { index, field, value } = action.payload;
//       state.references.referees[index][field] = value;
//     },
//     updateDeclaration: (state, action) => {
//       const { field, value } = action.payload;
//       state.declaration[field] = value;
//     },
//     updateKeyAndValue: (state, action) =>{
//       const { field, value } = action.payload;
//       state[field] = value;
//     },
//     setError: (state, action) => {
//       const { field, error } = action.payload;
//       state.errors[field] = error;
//     },
//     clearErrors: (state) => {
//       state.errors = {};
//     },
//   },
// });

// export const {
//   updatePersonalDetail,
//   updateLanguage,
//   updateVehicleOwnership,
//   addLanguage,
//   removeLanguage,
//   updateAcademic,
//   updateCareer,
//   addCareerEntry,
//   removeCareerEntry,
//   updateFamilyMember,
//   updateChild,
//   addChild,
//   removeChild,
//   updateReference,
//   updateDeclaration,
//   setError,
//   clearErrors,
//   updateKeyAndValue
// } = candidateDetailsSlice.actions;

// export default candidateDetailsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personalDetail: {
    name: "",
    positionApplied: "",
    dateOfBirth: "",
    age: "",
    email: "",
    photo: null,
    phoneNo: "",
    permanentAddress: "",
    presentAddress: "",
    houseOwnership: "",
    workLocationDistance: "",
    languages: [
      { language: "", read: false, speak: false, write: false, id: Date.now() },
    ],
    noticePeriod: "",
    canJoinIn30Days: false,
    currentCTC: "",
    variablePay: "",
    totalCTC: "",
    previousIncrementPercent: "",
    previousIncrementAmount: "",
    vehicleOwnership: { twoWheeler: false, fourWheeler: false },
  },
  academics: {
    qualifications: [
      { level: "Matriculation",   yearOfPassing: "", mode: "", specialization: "", college: "", university: "", percentage: "" },
      { level: "Plus II",         yearOfPassing: "", mode: "", specialization: "", college: "", university: "", percentage: "" },
      { level: "Diploma",         yearOfPassing: "", mode: "", specialization: "", college: "", university: "", percentage: "" },
      { level: "Graduation",      yearOfPassing: "", mode: "", specialization: "", college: "", university: "", percentage: "" },
      { level: "Post-Graduation", yearOfPassing: "", mode: "", specialization: "", college: "", university: "", percentage: "" },
      { level: "PG Diploma",      yearOfPassing: "", mode: "", specialization: "", college: "", university: "", percentage: "" },
      { level: "Doctorate",       yearOfPassing: "", mode: "", specialization: "", college: "", university: "", percentage: "" },
    ],
  },
  careerProgression: {
    experiences: [
      {
        companyName: "",
        businessType: "",
        location: "",
        companyRevenue: "",
        designation: "",
        reportingTo: "",
        periodFrom: "",
        periodTo: "",
        totalService: "",
        ctcWhileLeaving: "",
        reasonForLeaving: "",
        id: Date.now(),
      },
    ],
  },
  familyDetails: {
    spouse:   { name: "", age: "", profession: "", placeOfResidence: "" },
    father:   { name: "", age: "", profession: "", placeOfResidence: "" },
    mother:   { name: "", age: "", profession: "", placeOfResidence: "" },
    children: [{ name: "", age: "", school: "", class: "" }],
  },
  references: {
    referees: [
      { name: "", designation: "", phoneNo: "", email: "", knownSince: "" },
      { name: "", designation: "", phoneNo: "", email: "", knownSince: "" },
      { name: "", designation: "", phoneNo: "", email: "", knownSince: "" },
    ],
    canVerifyCurrentEmployer: false,
    reasonIfNo: "",
  },
  declaration: {
    signature: null,
    agreed: false,
  },
  personalImageFileName: "",
  signatureImageFileName: "",
  isEditMode: false,
  candidateId: null,
  errors: {},
};

const candidateDetailsSlice = createSlice({
  name: "candidateForm",
  initialState,
  reducers: {
    // ── Personal Detail ──────────────────────────────────────────────────────
    updatePersonalDetail: (state, action) => {
      const { field, value } = action.payload;
      state.personalDetail[field] = value;
    },
    updateLanguage: (state, action) => {
      const { index, field, value } = action.payload;
      state.personalDetail.languages[index][field] = value;
    },
    updateVehicleOwnership: (state, action) => {
      const { field, value } = action.payload;
      state.personalDetail.vehicleOwnership[field] = value;
    },
    addLanguage: (state) => {
      state.personalDetail.languages.push({
        language: "",
        read: false,
        speak: false,
        write: false,
        id: Date.now(),
      });
    },
    removeLanguage: (state, action) => {
      state.personalDetail.languages.splice(action.payload, 1);
    },

    // ── Academics ────────────────────────────────────────────────────────────
    updateAcademic: (state, action) => {
      const { index, field, value } = action.payload;
      state.academics.qualifications[index][field] = value;
    },

    // ── Career Progression ───────────────────────────────────────────────────
    updateCareer: (state, action) => {
      const { index, field, value } = action.payload;
      state.careerProgression.experiences[index][field] = value;
    },
    addCareerEntry: (state) => {
      state.careerProgression.experiences.push({
        companyName: "",
        businessType: "",
        location: "",
        companyRevenue: "",
        designation: "",
        reportingTo: "",
        periodFrom: "",
        periodTo: "",
        totalService: "",
        ctcWhileLeaving: "",
        reasonForLeaving: "",
        id: Date.now(),
      });
    },
    removeCareerEntry: (state, action) => {
      state.careerProgression.experiences.splice(action.payload, 1);
    },

    // ── Family Details ───────────────────────────────────────────────────────
    updateFamilyMember: (state, action) => {
      const { memberType, field, value } = action.payload;
      state.familyDetails[memberType][field] = value;
    },
    updateChild: (state, action) => {
      const { index, field, value } = action.payload;
      state.familyDetails.children[index][field] = value;
    },
    addChild: (state) => {
      state.familyDetails.children.push({
        name: "",
        age: "",
        school: "",
        class: "",
      });
    },
    removeChild: (state, action) => {
      state.familyDetails.children.splice(action.payload, 1);
    },

    // ── References ───────────────────────────────────────────────────────────
    updateReference: (state, action) => {
      const { index, field, value } = action.payload;
      if (index !== undefined) {
        state.references.referees[index][field] = value;
      } else {
        state.references[field] = value;
      }
    },

    // ── Declaration ──────────────────────────────────────────────────────────
    updateDeclaration: (state, action) => {
      const { field, value } = action.payload;
      state.declaration[field] = value;
    },

    // ── Generic key/value updater ────────────────────────────────────────────
    updateKeyAndValue: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    // ── Errors ───────────────────────────────────────────────────────────────
    setError: (state, action) => {
      const { field, error } = action.payload;
      state.errors[field] = error;
    },
    // Clears a single field's error (e.g. when user fixes a value)
    clearError: (state, action) => {
      delete state.errors[action.payload.field];
    },
    // Clears ALL errors at once (e.g. on form reset)
    clearErrors: (state) => {
      state.errors = {};
    },
    setCandidateData: (state, action) => {
      return { ...state, ...action.payload, errors: {} };
    },
    resetCandidateForm: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  updatePersonalDetail,
  updateLanguage,
  updateVehicleOwnership,
  addLanguage,
  removeLanguage,
  updateAcademic,
  updateCareer,
  addCareerEntry,
  removeCareerEntry,
  updateFamilyMember,
  updateChild,
  addChild,
  removeChild,
  updateReference,
  updateDeclaration,
  updateKeyAndValue,
  setError,
  clearError,
  clearErrors,
  setCandidateData,
  resetCandidateForm,
} = candidateDetailsSlice.actions;

export default candidateDetailsSlice.reducer;