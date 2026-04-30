import React, { useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  IndianRupee,
  TrendingUp,
  Home,
  Navigation,
  Languages,
  PenTool,
  BookOpen,
  Mic,
  Car,
  Bike,
  UploadCloud,
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import {
  updatePersonalDetail,
  updateLanguage,
  addLanguage,
  removeLanguage,
  setError,
  clearError,
  updateVehicleOwnership,
  updateKeyAndValue,
} from "../../../redux/slices/candidatesSlice";
import { backendUrl } from "../../../backendUrl";
import {
  validateEmail,
  validatePhone,
  validateName,
  validateDate,
  validateCTC,
  validateRequired,
  validateFileSize,
  validateFileType,
} from "../utils/validation";

// ─── Constants & variants (outside component → created once) ─────────────────

const HOUSE_OPTIONS    = ["Own", "Leased", "Rented"];
const MAX_LANGUAGES    = 5;
const LANG_SKILLS      = [
  { key: "read",  label: "Read",  Icon: BookOpen },
  { key: "speak", label: "Speak", Icon: Mic      },
  { key: "write", label: "Write", Icon: PenTool  },
];

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const sectionVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const errorVariants = {
  hidden:  { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0  },
  exit:    { opacity: 0        },
};

// ─── Validation helpers ───────────────────────────────────────────────────────

const validators = {
  name:                    (v) => validateName(v)    ? "" : "Full name is required (min 2 characters).",
  email:                   (v) => validateEmail(v)   ? "" : "Please enter a valid email address.",
  phoneNo:                 (v) => validatePhone(v)   ? "" : "Please enter a valid 10-digit phone number.",
  dateOfBirth:             (v) => validateDate(v)    ? "" : "Please enter a valid date of birth.",
  positionApplied:         (v) => validateRequired(v)? "" : "Position applied is required.",
  permanentAddress:        (v) => validateRequired(v)? "" : "Permanent address is required.",
  presentAddress:          (v) => validateRequired(v)? "" : "Present address is required.",
  currentCTC:              (v) => validateCTC(v)     ? "" : "Please enter a valid CTC amount.",
};

const validate = (field, value) =>
  validators[field] ? validators[field](value) : "";

// ─── Reusable Components ──────────────────────────────────────────────────────

const FieldError = ({ id, message }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        id={id}
        role="alert"
        variants={errorVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-red-500 text-xs mt-1 ml-0.5"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const InputField = ({
  label, value, onChange, onBlur, error,
  icon: Icon, type = "text", placeholder, min, max, inputMode,
}) => {
  const errorId = `${label.replace(/\s+/g, "-").toLowerCase()}-error`;
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-4 w-4 transition-colors duration-150 ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"}`} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          min={min}
          max={max}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`block w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-gray-900 text-sm md:text-base
            transition-all duration-150 outline-none focus:ring-2 focus:ring-offset-0
            ${error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100/50 shadow-sm"
            }`}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
};

const TextAreaField = ({
  label, value, onChange, onBlur, error,
  icon: Icon, rows = 3, placeholder,
}) => {
  const errorId = `${label.replace(/\s+/g, "-").toLowerCase()}-error`;
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
          <Icon className={`h-4 w-4 transition-colors duration-150 ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"}`} />
        </div>
        <textarea
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`block w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-gray-900 text-sm md:text-base
            transition-all duration-150 outline-none resize-none focus:ring-2 focus:ring-offset-0
            ${error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100/50 shadow-sm"
            }`}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
};

// Native <select> is fine here — no need for a custom dropdown for 3 options
const SelectField = ({ label, value, onChange, onBlur, options, error, icon: Icon }) => {
  const errorId = `${label.replace(/\s+/g, "-").toLowerCase()}-error`;
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-4 w-4 transition-colors duration-150 ${error ? "text-red-400" : "text-gray-400"}`} />
        </div>
        {/* Chevron */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <select
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`block w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-gray-900 text-sm md:text-base
            appearance-none transition-all duration-150 outline-none cursor-pointer focus:ring-2 focus:ring-offset-0
            ${error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100/50 shadow-sm"
            }`}
        >
          <option value="">Select option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
};

// ─── SectionHeader ────────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, title }) => (
  <h4 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
    <Icon size={18} className="text-blue-500" />
    {title}
  </h4>
);

// ─── PersonalDetails ──────────────────────────────────────────────────────────

const PersonalDetails = () => {
  const dispatch      = useDispatch();
  const fileInputRef  = useRef(null);

  const personalDetail       = useSelector((s) => s.candidateForm.personalDetail);
  const personalImageFileName = useSelector((s) => s.candidateForm.personalImageFileName);
  const errors               = useSelector((s) => s.candidateForm.errors);

  // ── Field change: update state + clear/set error immediately ───────────────
  const handleChange = useCallback(
    (field, value) => {
      dispatch(updatePersonalDetail({ field, value }));

      // Auto-calculate age when DOB changes
      if (field === "dateOfBirth" && value) {
        const dob  = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        dispatch(updatePersonalDetail({ field: "age", value: age > 0 ? String(age) : "" }));
      }

      // Auto-calculate totalCTC when currentCTC or variablePay changes
      if (field === "currentCTC" || field === "variablePay") {
        const current  = field === "currentCTC"  ? Number(value) : Number(personalDetail.currentCTC);
        const variable = field === "variablePay" ? Number(value) : Number(personalDetail.variablePay);
        dispatch(updatePersonalDetail({ field: "totalCTC", value: String(current + variable) }));
      }

      const error = validate(field, value);
      if (error) {
        dispatch(setError({ field: `personal.${field}`, error }));
      } else {
        dispatch(clearError({ field: `personal.${field}` }));
      }
    },
    [dispatch, personalDetail.currentCTC, personalDetail.variablePay],
  );

  // ── Blur: show error only after user leaves the field ─────────────────────
  const handleBlur = useCallback(
    (field, value) => {
      const error = validate(field, value);
      if (error) dispatch(setError({ field: `personal.${field}`, error }));
    },
    [dispatch],
  );

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileSize(file) || !validateFileType(file)) {
      dispatch(setError({ field: "personal.photo", error: "Use JPEG or PNG, max 5 MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(updatePersonalDetail({ field: "photo", value: reader.result }));
      dispatch(updateKeyAndValue({ field: "personalImageFileName", value: file.name }));
      dispatch(clearError({ field: "personal.photo" }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    dispatch(updatePersonalDetail({ field: "photo", value: "" }));
    dispatch(updateKeyAndValue({ field: "personalImageFileName", value: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePhotoZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto font-sans p-4 md:p-6"
    >
      {/* Page header */}
      <div className="mb-8 pb-5 border-b border-gray-100 flex items-center gap-4">
        <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
          <User size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Personal Details</h3>
          <p className="text-gray-400 text-sm mt-0.5">Basic information and contact details.</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* ── Section 1: Identity ─────────────────────────────────────────── */}
        <motion.div variants={sectionVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <SectionHeader icon={User} title="Identity Information" />

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Photo upload */}
            <div className="w-full lg:w-1/3">
              <div
                onClick={handlePhotoZoneClick}
                className={`relative w-full min-h-[220px] border-2 border-dashed rounded-xl
                  flex flex-col items-center justify-center cursor-pointer transition-all
                  ${errors["personal.photo"]
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {personalDetail.photo ? (
                  <div className="p-4 flex flex-col items-center gap-2">
                    <img
                      src={personalDetail.photo.startsWith('data:image') || personalDetail.photo.startsWith('http') 
                        ? personalDetail.photo 
                        : `${backendUrl}${personalDetail.photo}`}
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover shadow border-4 border-white"
                    />
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <Check size={11} />
                      {personalImageFileName || "Current Photo"}
                    </span>
                    {/* Remove button — stopPropagation prevents re-opening file picker */}
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-2 right-2 p-1.5 bg-white text-red-400 rounded-full shadow border hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Upload Photo</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG / PNG · Max 5 MB</p>
                  </div>
                )}
              </div>
              {errors["personal.photo"] && (
                <p className="text-red-500 text-xs mt-1.5 text-center">{errors["personal.photo"]}</p>
              )}
            </div>

            {/* Basic inputs */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Full Name" icon={User}
                value={personalDetail.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name", personalDetail.name)}
                error={errors["personal.name"]}
                placeholder="Your full name"
              />
              <InputField
                label="Position Applied" icon={Briefcase}
                value={personalDetail.positionApplied}
                onChange={(e) => handleChange("positionApplied", e.target.value)}
                onBlur={() => handleBlur("positionApplied", personalDetail.positionApplied)}
                error={errors["personal.positionApplied"]}
                placeholder="Job position"
              />
              <InputField
                label="Date of Birth" icon={Calendar} type="date"
                value={personalDetail.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                onBlur={() => handleBlur("dateOfBirth", personalDetail.dateOfBirth)}
                error={errors["personal.dateOfBirth"]}
              />
              {/* Age: read-only, auto-calculated from DOB */}
              <div className="w-full">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-300" />
                  </div>
                  <input
                    type="text"
                    value={personalDetail.age ? `${personalDetail.age} yrs` : ""}
                    readOnly
                    placeholder="Auto-calculated from DOB"
                    className="block w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 text-sm md:text-base cursor-not-allowed shadow-inner"
                  />
                </div>
              </div>
              <InputField
                label="Email Address" icon={Mail} type="email"
                value={personalDetail.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email", personalDetail.email)}
                error={errors["personal.email"]}
                placeholder="email@example.com"
              />
              <InputField
                label="Phone Number" icon={Phone} type="tel"
                value={personalDetail.phoneNo}
                onChange={(e) => handleChange("phoneNo", e.target.value)}
                onBlur={() => handleBlur("phoneNo", personalDetail.phoneNo)}
                error={errors["personal.phoneNo"]}
                placeholder="10-digit number"
                inputMode="numeric"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Section 2: Address ──────────────────────────────────────────── */}
        <motion.div variants={sectionVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <SectionHeader icon={MapPin} title="Address Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextAreaField
              label="Present Address" icon={MapPin}
              value={personalDetail.presentAddress}
              onChange={(e) => handleChange("presentAddress", e.target.value)}
              onBlur={() => handleBlur("presentAddress", personalDetail.presentAddress)}
              error={errors["personal.presentAddress"]}
              placeholder="Current address"
            />
            <TextAreaField
              label="Permanent Address" icon={Home}
              value={personalDetail.permanentAddress}
              onChange={(e) => handleChange("permanentAddress", e.target.value)}
              onBlur={() => handleBlur("permanentAddress", personalDetail.permanentAddress)}
              error={errors["personal.permanentAddress"]}
              placeholder="Permanent address"
            />
            <SelectField
              label="House Ownership" icon={Home}
              value={personalDetail.houseOwnership}
              options={HOUSE_OPTIONS}
              onChange={(e) => handleChange("houseOwnership", e.target.value)}
              onBlur={() => handleBlur("houseOwnership", personalDetail.houseOwnership)}
            />
            <InputField
              label="Distance to Work (km)" icon={Navigation} type="number"
              value={personalDetail.workLocationDistance}
              onChange={(e) => handleChange("workLocationDistance", e.target.value)}
              placeholder="0"
              inputMode="numeric"
              min={0}
            />
          </div>
        </motion.div>

        {/* ── Section 3: Employment & CTC ─────────────────────────────────── */}
        <motion.div variants={sectionVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <SectionHeader icon={TrendingUp} title="Employment & Compensation" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              label="Current CTC (₹/yr)" icon={IndianRupee} type="number"
              value={personalDetail.currentCTC}
              onChange={(e) => handleChange("currentCTC", e.target.value)}
              onBlur={() => handleBlur("currentCTC", personalDetail.currentCTC)}
              error={errors["personal.currentCTC"]}
              placeholder="0"
              inputMode="numeric"
              min={0}
            />
            <InputField
              label="Variable Pay (₹/yr)" icon={IndianRupee} type="number"
              value={personalDetail.variablePay}
              onChange={(e) => handleChange("variablePay", e.target.value)}
              placeholder="0"
              inputMode="numeric"
              min={0}
            />
            {/* Total CTC: read-only, auto-calculated */}
            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
                Total CTC (₹/yr)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-4 w-4 text-gray-300" />
                </div>
                <input
                  type="text"
                  value={personalDetail.totalCTC ? `₹ ${Number(personalDetail.totalCTC).toLocaleString("en-IN")}` : ""}
                  readOnly
                  placeholder="Auto-calculated"
                  className="block w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 text-sm md:text-base cursor-not-allowed shadow-inner"
                />
              </div>
            </div>

            <InputField
              label="Prev. Increment (%)" icon={TrendingUp} type="number"
              value={personalDetail.previousIncrementPercent}
              onChange={(e) => handleChange("previousIncrementPercent", e.target.value)}
              placeholder="0"
              inputMode="numeric"
              min={0}
              max={100}
            />
            <InputField
              label="Prev. Increment Amt (₹)" icon={IndianRupee} type="number"
              value={personalDetail.previousIncrementAmount}
              onChange={(e) => handleChange("previousIncrementAmount", e.target.value)}
              placeholder="0"
              inputMode="numeric"
              min={0}
            />
            <InputField
              label="Notice Period (Days)" icon={Calendar} type="number"
              value={personalDetail.noticePeriod}
              onChange={(e) => handleChange("noticePeriod", e.target.value)}
              placeholder="e.g. 30"
              inputMode="numeric"
              min={0}
            />

            {/* Can join in 30 days toggle */}
            <div className="lg:col-span-3 pt-1">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                    ${personalDetail.canJoinIn30Days
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300 group-hover:border-blue-400"
                    }`}
                >
                  {personalDetail.canJoinIn30Days && <Check size={13} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={personalDetail.canJoinIn30Days}
                  onChange={(e) => handleChange("canJoinIn30Days", e.target.checked)}
                  className="hidden"
                />
                <span className="text-sm font-medium text-gray-700">
                  Can join within 30 days
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* ── Section 4: Languages & Vehicles ─────────────────────────────── */}
        <motion.div variants={sectionVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Languages */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <SectionHeader icon={Languages} title="Languages Known" />
                {personalDetail.languages.length < MAX_LANGUAGES && (
                  <button
                    type="button"
                    onClick={() => dispatch(addLanguage())}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 flex items-center gap-1 transition-colors"
                  >
                    <Plus size={13} /> Add
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {personalDetail.languages.map((lang, index) => (
                  <div
                    key={lang.id || lang._id || index}
                    className={`p-3 rounded-xl border ${
                      index === 0
                        ? "bg-blue-50/50 border-blue-100"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      {/* Language name input */}
                      <div className="w-full sm:w-40 relative">
                        {index === 0 && (
                          <span className="absolute -top-2 -right-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold leading-none">
                            Mother Tongue
                          </span>
                        )}
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) => dispatch(updateLanguage({ index, field: "language", value: e.target.value }))}
                          placeholder={index === 0 ? "Mother tongue" : "Language"}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                        />
                      </div>

                      {/* Read / Speak / Write toggles */}
                      <div className="flex-1 flex items-center justify-around gap-2">
                        {LANG_SKILLS.map(({ key, label, Icon }) => (
                          <label key={key} className="flex flex-col items-center cursor-pointer group">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all
                                ${lang[key]
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-white border-gray-200 text-gray-400 group-hover:border-blue-400"
                                }`}
                            >
                              <Icon size={13} />
                            </div>
                            <input
                              type="checkbox"
                              checked={lang[key]}
                              onChange={(e) => dispatch(updateLanguage({ index, field: key, value: e.target.checked }))}
                              className="hidden"
                            />
                            <span className="text-[10px] mt-1 font-medium text-gray-400">{label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Remove (not for mother tongue) */}
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => dispatch(removeLanguage(index))}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Ownership */}
            <div>
              <SectionHeader icon={Car} title="Vehicle Ownership" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { field: "twoWheeler",  label: "Two Wheeler",  Icon: Bike },
                  { field: "fourWheeler", label: "Four Wheeler", Icon: Car  },
                ].map(({ field, label, Icon }) => (
                  <label
                    key={field}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all
                      ${personalDetail.vehicleOwnership[field]
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                      }`}
                  >
                    <div
                      className={`p-3 rounded-full transition-colors
                        ${personalDetail.vehicleOwnership[field]
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="font-semibold text-sm text-gray-700">{label}</span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={personalDetail.vehicleOwnership[field]}
                      onChange={(e) => dispatch(updateVehicleOwnership({ field, value: e.target.checked }))}
                    />
                    {personalDetail.vehicleOwnership[field] && (
                      <Check size={15} className="text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default PersonalDetails;