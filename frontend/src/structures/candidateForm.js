export const candidateForm = {
    personalDetails: {
        name: "",
        positionApplied: "",
        dob: "",
        age: "", // Automatically calculated from dob
        emailId: "",
        phoneNo: "",
        permanentResidentialAddress: "",
        presentResidentialAddress: "",
        houseOwnership: "", // Options: Leased, Own
        languages: [
            {
                language: "",
                read: false,
                speak: false,
                write: false
            }
        ],
        distanceToWorkLocation: "",

        // Subheading: Employment Terms
        vehicleOwnership: "", // Options: 2 Wheeler, 4 Wheeler
        noticePeriod: "", // Notice period in days
        canYouJoinIn30Days: false,
        currentCTC: "", // In rupee symbol
        variablePay: "", // In rupee symbol
        totalCTC: "", // In rupee symbol

        // Subheading: Previous Increment
        previousIncrement: {
            percentage: "", // As a percentage
            amount: "" // In rupee symbol
        },

        // Photo Upload
        uploadYourRecentPhoto: "" // URL or file reference for the uploaded photo
    },
    academics: [
        {
            "Matriculation": {
                yearOfPassing: null,
                mode: "Regular", // Default value: Regular
                specialization: "",
                college: "",
                university: "",
                percentage: ""
            },
            "Plus II": {
                yearOfPassing: null,
                mode: "Regular", // Default value: Regular
                specialization: "",
                college: "",
                university: "",
                percentage: ""
            },
            "Diploma": {
                yearOfPassing: null,
                mode: "Regular", // Default value: Regular
                specialization: "",
                college: "",
                university: "",
                percentage: ""
            },
            "Graduation": {
                yearOfPassing: null,
                mode: "Regular", // Default value: Regular
                specialization: "",
                college: "",
                university: "",
                percentage: ""
            },
            "Post - Graduation": {
                yearOfPassing: null,
                mode: "Regular", // Default value: Regular
                specialization: "",
                college: "",
                university: "",
                percentage: ""
            },
            "PG Diploma, if any": {
                yearOfPassing: null,
                mode: "Regular", // Default value: Regular
                specialization: "",
                college: "",
                university: "",
                percentage: ""
            },
            "Doctorate Studies": {
                yearOfPassing: null,
                mode: "Regular", // Default value: Regular
                specialization: "",
                college: "",
                university: "",
                percentage: ""
            },
        }
    ],
    careerProgression: [
        {
            companyName: "",
            typeOfBusiness: "",
            location: "",
            revenue: "",
            designation: "",
            reportingTo: "",
            periodFrom: "",
            periodTo: "",
            totalService: "",
            ctc: "",
            reasonForLeaving: ""
        }
    ],
    familyDetails: {
        familyMembers: [
            {
                name: "",
                age: null,
                profession: "",
                residence: ""
            }
        ],
        children: [
            {
                name: "",
                age: null,
                schoolLocation: "",
                class: ""
            }
        ]
    },
    references: [
        {
            details: "",
            reference1: "",
            reference2: "",
            reference3: ""
        }
    ],
    verification: {
        canVerify: false,
        explanation: ""
    },
    declaration: {
        isAgreed: false,
        signature: null, // Default: null for base64 or file path
        agreedDate: new Date() // Default: current date
    }
};
