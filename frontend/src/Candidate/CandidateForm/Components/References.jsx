import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  User,
  Briefcase,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Info,
  AlertCircle
} from "lucide-react";
import {
  updateReference,
  setError,
} from "../../../redux/slices/candidatesSlice";
import {
  validateEmail,
  validatePhone,
  validateName,
  validateRequired,
} from "../utils/validation";

// --- Reusable Input Component ---
const InputField = ({
  label,
  value,
  onChange,
  error,
  icon: Icon,
  type = "text",
  placeholder
}) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          block w-full pl-10 pr-3 py-3.5
          bg-white border rounded-xl text-gray-900 text-sm md:text-base 
          transition-all duration-200 ease-in-out outline-none shadow-sm
          focus:ring-2 focus:ring-offset-1
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100/50 hover:border-gray-300'}
        `}
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-red-500 text-xs mt-1.5 ml-1 font-medium"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// --- Reusable Text Area Component ---
const TextAreaField = ({
  label,
  value,
  onChange,
  error,
  icon: Icon,
  rows = 3,
  placeholder
}) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
        <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} />
      </div>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`
          block w-full pl-10 pr-3 py-3.5
          bg-white border rounded-xl text-gray-900 text-sm md:text-base 
          transition-all duration-200 ease-in-out outline-none resize-none shadow-sm
          focus:ring-2 focus:ring-offset-1
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100/50 hover:border-gray-300'}
        `}
      />
    </div>
  </div>
);

// --- Main Component ---
const References = () => {
  const dispatch = useDispatch();
  const references = useSelector((state) => state.candidateForm.references);
  const errors = useSelector((state) => state.candidateForm.errors);

  const handleInputChange = (index, field, value) => {
    dispatch(updateReference({ index, field, value }));
    validateField(index, field, value);
  };

  const validateField = (index, field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!validateName(value)) error = "Invalid name";
        break;
      case "email":
        if (!validateEmail(value)) error = "Invalid email address";
        break;
      case "phoneNo":
        if (!validatePhone(value)) error = "Invalid phone number";
        break;
      default:
        if (!validateRequired(value)) error = "Required";
    }

    dispatch(setError({ field: `references.${index}.${field}`, error }));
    return !error;
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto font-sans p-4"
    >
      {/* Header Section */}
      <div className="mb-8 pb-4 border-b border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-lg shadow-lg text-white">
          <Users size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">References</h3>
          <p className="text-gray-500 text-sm mt-1">Professional references from previous organizations.</p>
        </div>
      </div>

      {/* Info Alert Box */}
      <motion.div
        variants={cardVariants}
        className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 text-blue-800"
      >
        <Info className="shrink-0 mt-0.5" size={20} />
        <p className="text-sm leading-relaxed">
          Please provide <strong>3 references</strong>. Such references may be from your Superior, MDs of large organizations, persons of high repute in Society, or officials in Civil Services. <br />
          <span className="font-semibold text-red-500 block mt-1">Note: Please do not provide references of any relatives.</span>
        </p>
      </motion.div>

      <div className="space-y-8">
        {references.referees.map((referee, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group"
          >
            {/* Card Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">
                {index + 1}
              </div>
              <h4 className="text-lg font-bold text-gray-800 tracking-tight">
                Reference Details
              </h4>
            </div>

            {/* Card Form */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                label="Name"
                icon={User}
                value={referee.name}
                onChange={(e) => handleInputChange(index, "name", e.target.value)}
                error={errors[`references.${index}.name`]}
                placeholder="Referee Name"
              />

              <InputField
                label="Designation"
                icon={Briefcase}
                value={referee.designation}
                onChange={(e) => handleInputChange(index, "designation", e.target.value)}
                error={errors[`references.${index}.designation`]} // Assuming error exists or optional
                placeholder="Job Title"
              />

              <InputField
                label="Phone Number"
                icon={Phone}
                type="tel"
                value={referee.phoneNo}
                onChange={(e) => handleInputChange(index, "phoneNo", e.target.value)}
                error={errors[`references.${index}.phoneNo`]}
                placeholder="Mobile Number"
              />

              <InputField
                label="Email"
                icon={Mail}
                type="email"
                value={referee.email}
                onChange={(e) => handleInputChange(index, "email", e.target.value)}
                error={errors[`references.${index}.email`]}
                placeholder="email@example.com"
              />

              <div className="md:col-span-2">
                <InputField
                  label="Since how long you know?"
                  icon={Clock}
                  value={referee.knownSince}
                  onChange={(e) => handleInputChange(index, "knownSince", e.target.value)}
                  error={errors[`references.${index}.knownSince`]} // Assuming error exists or optional
                  placeholder="e.g. 5 Years"
                />
              </div>

            </div>
          </motion.div>
        ))}

        {/* Verification Section */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6"
        >
          <div className="flex items-start gap-3">
            <div className="relative flex items-center h-5 mt-1">
              <input
                id="verify-checkbox"
                type="checkbox"
                checked={references.canVerifyCurrentEmployer}
                onChange={(e) =>
                  dispatch(
                    updateReference({
                      field: "canVerifyCurrentEmployer",
                      value: e.target.checked,
                    })
                  )
                }
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="ml-1">
              <label htmlFor="verify-checkbox" className="text-sm font-bold text-gray-800 cursor-pointer">
                Consent to Verify Employment
              </label>
              <p className="text-gray-500 text-sm mt-1">
                Please confirm whether we can verify your employment details from your current employer.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {!references.canVerifyCurrentEmployer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <TextAreaField
                    label="If no, please explain us why:"
                    icon={AlertCircle}
                    value={references.reasonIfNo}
                    onChange={(e) =>
                      dispatch(
                        updateReference({
                          field: "reasonIfNo",
                          value: e.target.value,
                        })
                      )
                    }
                    placeholder="Please provide a brief explanation..."
                    rows={3}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default References;