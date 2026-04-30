import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Building2,
  IndianRupee, // Changed to Rupee icon
  User,
  Calendar,
  Clock,
  FileText,
  Plus,
  Trash2,
  TrendingUp
} from 'lucide-react';
import {
  updateCareer,
  addCareerEntry,
  removeCareerEntry,
  setError
} from '../../../redux/slices/candidatesSlice';
import { validateRequired, validateCTC, validateDate } from '../utils/validation';

// --- Reusable Input Component ---
const InputField = ({
  label,
  value,
  onChange,
  error,
  icon: Icon,
  type = "text",
  placeholder,
  readOnly = false
}) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/* The icon color changes based on error or focus state */}
        <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'} ${!readOnly && 'group-focus-within:text-blue-600'}`} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`
          block w-full pl-10 pr-3 py-3.5
          border rounded-xl text-gray-900 text-sm md:text-base
          transition-all duration-200 ease-in-out outline-none
          ${readOnly
            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed shadow-inner'
            : 'bg-white focus:ring-2 focus:ring-offset-1 shadow-sm'}
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : !readOnly && 'border-gray-200 focus:border-blue-500 focus:ring-blue-100/50 hover:border-gray-300'}
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

// --- Main Component ---
const CareerProgression = () => {
  const dispatch = useDispatch();
  const careerProgression = useSelector(state => state.candidateForm.careerProgression);
  const errors = useSelector(state => state.candidateForm.errors);

  const handleInputChange = (index, field, value) => {
    dispatch(updateCareer({ index, field, value }));
    validateField(index, field, value);
  };

  const validateField = (index, field, value) => {
    let error = '';

    switch (field) {
      case 'ctcWhileLeaving':
        if (!validateCTC(value)) error = 'Invalid CTC amount';
        break;
      case 'periodFrom':
      case 'periodTo':
        if (!validateDate(value)) error = 'Invalid date';
        if (field === 'periodTo') {
          const from = new Date(careerProgression.experiences[index].periodFrom);
          const to = new Date(value);
          if (to < from) error = 'End date cannot be before start date';
        }
        break;
      case 'companyRevenue':
        if (value && !validateCTC(value)) error = 'Invalid revenue amount';
        break;
      default:
        if (!validateRequired(value)) error = 'This field is required';
    }

    dispatch(setError({ field: `career.${index}.${field}`, error }));
    return !error;
  };

  const calculateTotalService = (fromDate, toDate) => {
    if (!fromDate || !toDate) return '';
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffYears = end.getFullYear() - start.getFullYear();
    const diffMonths = end.getMonth() - start.getMonth();
    let total = diffYears * 12 + diffMonths;
    if (total < 0) return 'Invalid dates';
    return `${Math.floor(total / 12)} years ${total % 12} months`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto font-sans p-4"
    >
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-lg shadow-lg text-white">
          <Briefcase size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Career Progression</h3>
          <p className="text-gray-500 text-sm mt-1">Please detail your previous employment history.</p>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode='popLayout'>
            {careerProgression.experiences.map((exp, index) => (
            <motion.div
              key={exp.id || exp._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              layout
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">
                    {index + 1}
                  </span>
                  <h4 className="text-lg font-bold text-gray-800 tracking-tight">
                    {index === 0 ? 'Current / Last Company' : `Previous Company`}
                  </h4>
                </div>

                {/* Improved Delete Button */}
                {index > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => dispatch(removeCareerEntry(index))}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                    REMOVE
                  </motion.button>
                )}
              </div>

              {/* Form Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <InputField
                  label="Company Name *"
                  icon={Building2}
                  value={exp.companyName}
                  onChange={(e) => handleInputChange(index, 'companyName', e.target.value)}
                  error={errors[`career.${index}.companyName`]}
                  placeholder="e.g. Microsoft"
                />

                <InputField
                  label="Business Type *"
                  icon={Briefcase}
                  value={exp.businessType}
                  onChange={(e) => handleInputChange(index, 'businessType', e.target.value)}
                  error={errors[`career.${index}.businessType`]}
                  placeholder="e.g. Software Development"
                />

                <InputField
                  label="Location *"
                  icon={MapPin}
                  value={exp.location}
                  onChange={(e) => handleInputChange(index, 'location', e.target.value)}
                  error={errors[`career.${index}.location`]}
                  placeholder="City, Country"
                />

                <InputField
                  label="Company Revenue"
                  icon={IndianRupee} // Rupee Icon
                  value={exp.companyRevenue}
                  onChange={(e) => handleInputChange(index, 'companyRevenue', e.target.value)}
                  error={errors[`career.${index}.companyRevenue`]}
                  placeholder="e.g. 10,00,000"
                />

                <InputField
                  label="Designation *"
                  icon={User}
                  value={exp.designation}
                  onChange={(e) => handleInputChange(index, 'designation', e.target.value)}
                  error={errors[`career.${index}.designation`]}
                  placeholder="Your Job Title"
                />

                <InputField
                  label="Reporting To *"
                  icon={User}
                  value={exp.reportingTo}
                  onChange={(e) => handleInputChange(index, 'reportingTo', e.target.value)}
                  error={errors[`career.${index}.reportingTo`]}
                  placeholder="Manager's Designation"
                />

                <InputField
                  label="Period From *"
                  icon={Calendar}
                  type="date"
                  value={exp.periodFrom}
                  onChange={(e) => {
                    handleInputChange(index, 'periodFrom', e.target.value);
                    if (exp.periodTo) {
                      dispatch(updateCareer({
                        index,
                        field: 'totalService',
                        value: calculateTotalService(e.target.value, exp.periodTo)
                      }));
                    }
                  }}
                  error={errors[`career.${index}.periodFrom`]}
                />

                <InputField
                  label="Period To *"
                  icon={Calendar}
                  type="date"
                  value={exp.periodTo}
                  onChange={(e) => {
                    handleInputChange(index, 'periodTo', e.target.value);
                    if (exp.periodFrom) {
                      handleInputChange(
                        index,
                        'totalService',
                        calculateTotalService(exp.periodFrom, e.target.value)
                      );
                    }
                  }}
                  error={errors[`career.${index}.periodTo`]}
                />

                <InputField
                  label="Total Service"
                  icon={Clock}
                  value={exp.totalService}
                  readOnly={true}
                  placeholder="Auto Calculated"
                />

                <InputField
                  label="CTC while leaving *"
                  icon={IndianRupee} // Rupee Icon
                  value={exp.ctcWhileLeaving}
                  onChange={(e) => handleInputChange(index, 'ctcWhileLeaving', e.target.value)}
                  error={errors[`career.${index}.ctcWhileLeaving`]}
                  placeholder="e.g. 12,00,000"
                />

                <div className="md:col-span-2">
                  <TextAreaField
                    label="Reason for Leaving *"
                    icon={FileText}
                    value={exp.reasonForLeaving}
                    onChange={(e) => handleInputChange(index, 'reasonForLeaving', e.target.value)}
                    error={errors[`career.${index}.reasonForLeaving`]}
                    placeholder="Briefly describe your reason for change..."
                  />
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Improved Add Button - Bottom Full Width */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => dispatch(addCareerEntry())}
          className="w-full py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-blue-100 transition-all shadow-sm mt-2"
        >
          <Plus size={20} />
          <span>ADD EXPERIENCE</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CareerProgression;