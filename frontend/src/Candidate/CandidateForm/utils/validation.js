export const validateRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone.toString().replace(/[^0-9]/g, ''));
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateAge = (age) => {
  const numAge = parseInt(age);
  return numAge >= 18 && numAge <= 100;
};

export const validateDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const currentDate = new Date();
  return selectedDate <= currentDate;
};

export const validateCTC = (value) => {
  if (!value) return true; // Optional field
  const amount = parseFloat(value);
  return !isNaN(amount) && amount >= 0;
};

export const validatePercentage = (value) => {
  if (!value) return true; // Optional field
  const percentage = parseFloat(value);
  return !isNaN(percentage) && percentage >= 0 && percentage <= 100;
};

export const validateFileSize = (file, maxSizeMB = 2) => {
  if (!file) return false;
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png']) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

export const validateAllFields = (formData) => {
  const errors = {};

  const requiredPersonalFields = {
    name: "Name",
    email: "Email",
    phoneNo: "Phone Number",
    dateOfBirth: "Date of Birth",
    permanentAddress: "Permanent Address",
    photo: "Profile Photo",
    positionApplied: "Position Applied",
  };

  Object.entries(requiredPersonalFields).forEach(([field, label]) => {
    if (!validateRequired(formData?.personalDetail?.[field])) {
      errors[`personal.${field}`] = `${label} is required`;
    }
  });

  if (formData?.personalDetail?.email && !validateEmail(formData?.personalDetail?.email)) {
    errors["personal.email"] = "Invalid email format";
  }

  if (formData?.personalDetail?.phoneNo && !validatePhone(formData?.personalDetail?.phoneNo)) {
    errors["personal.phoneNo"] = "Invalid phone number format";
  }

  const qualifications = formData?.academics?.qualifications || [];
  if (!qualifications.some((qual) => validateRequired(qual?.yearOfPassing))) {
    errors["academics.general"] = "At least one qualification is required";
  }

  qualifications.forEach((qual, index) => {
    if (validateRequired(qual?.yearOfPassing) || validateRequired(qual?.specialization)) {
      ["yearOfPassing", "specialization"].forEach((field) => {
        if (!validateRequired(qual[field])) {
          errors[`academics.${index}.${field}`] = `${field} is required for qualification at index ${index + 1}`;
        }
      });
    }
  });

  const experiences = formData?.careerProgression?.experiences || [];
  experiences.forEach((exp, index) => {
    if (
      validateRequired(exp?.companyName) ||
      validateRequired(exp?.designation) ||
      validateRequired(exp?.periodFrom) ||
      validateRequired(exp?.periodTo)
    ) {
      ["companyName", "designation", "periodFrom", "periodTo"].forEach((field) => {
        if (!validateRequired(exp[field])) {
          errors[`career.${index}.${field}`] = `${field} is required for experience at index ${index + 1}`;
        }
      });

      if (exp?.periodFrom && exp?.periodTo) {
        if (new Date(exp.periodTo) < new Date(exp.periodFrom)) {
          errors[`career.${index}.periodTo`] = "End date cannot be earlier than start date";
        }
      }
    }
  });

  const referees = formData?.references?.referees || [];
  if (referees.length === 0) {
    errors["references.general"] = "At least one reference is required";
  } else {
    referees.forEach((ref, index) => {
      if (validateRequired(ref?.name) || validateRequired(ref?.phoneNo) || validateRequired(ref?.email)) {
        ["name", "phoneNo", "email"].forEach((field) => {
          if (!validateRequired(ref[field])) {
            errors[`references.${index}.${field}`] = `${field} is required for reference at index ${index + 1}`;
          }
        });
      }
    });
  }

  if (!formData?.declaration?.agreed) {
    errors["declaration.agreed"] = "You must agree to the declaration";
  }
  if (!formData?.declaration?.signature) {
    errors["declaration.signature"] = "Digital signature is required";
  }

  return errors;
};
