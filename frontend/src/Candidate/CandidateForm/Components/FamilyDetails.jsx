import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  User,
  Baby,
  Briefcase,
  MapPin,
  Calendar,
  School,
  GraduationCap,
  Plus,
  Trash2
} from 'lucide-react';
import {
  updateFamilyMember,
  updateChild,
  addChild,
  removeChild,
  setError
} from '../../../redux/slices/candidatesSlice';
import { validateName, validateAge, validateRequired } from '../utils/validation';

// --- Reusable Input Component (Standardized) ---
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
          transition-all duration-200 ease-in-out outline-none
          focus:ring-2 focus:ring-offset-1
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100/50 hover:border-gray-400 shadow-sm'}
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

const FamilyDetails = () => {
  const dispatch = useDispatch();
  const familyDetails = useSelector(state => state.candidateForm.familyDetails);
  const errors = useSelector(state => state.candidateForm.errors);

  // --- Handlers ---
  const handleFamilyMemberChange = (memberType, field, value) => {
    dispatch(updateFamilyMember({ memberType, field, value }));
    validateField(memberType, field, value);
  };

  const handleChildChange = (index, field, value) => {
    dispatch(updateChild({ index, field, value }));
    validateChildField(index, field, value);
  };

  const validateField = (memberType, field, value) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!validateName(value)) error = 'Invalid name';
        break;
      case 'age':
        if (!validateAge(value)) error = 'Invalid age';
        break;
      default:
        if (!validateRequired(value)) error = 'This field is required';
    }
    dispatch(setError({ field: `family.${memberType}.${field}`, error }));
  };

  const validateChildField = (index, field, value) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!validateName(value)) error = 'Invalid name';
        break;
      case 'age':
        if (!validateAge(value)) error = 'Invalid age';
        break;
      default:
        if (!validateRequired(value)) error = 'This field is required';
    }
    dispatch(setError({ field: `family.children.${index}.${field}`, error }));
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // --- Helper to Render Adult Members (Spouse, Father, Mother) ---
  const renderAdultMember = (key, title, HeaderIcon) => {
    const data = familyDetails[key];
    return (
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <div className={`p-2 rounded-full bg-blue-100 text-blue-600`}>
            <HeaderIcon size={20} />
          </div>
          <h4 className="text-lg font-bold text-gray-800 tracking-tight capitalize">
            {title}
          </h4>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Name"
            icon={User}
            value={data.name}
            onChange={(e) => handleFamilyMemberChange(key, 'name', e.target.value)}
            error={errors[`family.${key}.name`]}
            placeholder={`Enter ${title}'s Name`}
          />

          <InputField
            label="Age"
            icon={Calendar}
            type="number"
            value={data.age}
            onChange={(e) => handleFamilyMemberChange(key, 'age', e.target.value)}
            error={errors[`family.${key}.age`]}
            placeholder="Age"
          />

          <InputField
            label="Profession"
            icon={Briefcase}
            value={data.profession}
            onChange={(e) => handleFamilyMemberChange(key, 'profession', e.target.value)}
            error={errors[`family.${key}.profession`]} // Assuming validation exists or is optional
            placeholder="Occupation"
          />

          <InputField
            label="Place of Residence"
            icon={MapPin}
            value={data.placeOfResidence}
            onChange={(e) => handleFamilyMemberChange(key, 'placeOfResidence', e.target.value)}
            error={errors[`family.${key}.placeOfResidence`]}
            placeholder="City, Location"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto font-sans p-4"
    >
      {/* Main Header */}
      <div className="mb-8 pb-4 border-b border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-lg shadow-lg text-white">
          <Users size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Family Details</h3>
          <p className="text-gray-500 text-sm mt-1">Information about your immediate family members.</p>
        </div>
      </div>

      <div className="space-y-8">

        {/* 1. Adult Members Section */}
        {renderAdultMember('spouse', 'Spouse', User)}
        {renderAdultMember('father', 'Father', User)}
        {renderAdultMember('mother', 'Mother', User)}

        {/* 2. Children Section */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Children Details</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <AnimatePresence mode='popLayout'>
            {familyDetails.children.map((child, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 group"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <Baby size={20} />
                    </div>
                    <h5 className="text-lg font-bold text-gray-800">Child {index + 1}</h5>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => dispatch(removeChild(index))}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                    REMOVE
                  </motion.button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Name"
                    icon={User}
                    value={child.name}
                    onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                    error={errors[`family.children.${index}.name`]}
                    placeholder="Child's Name"
                  />

                  <InputField
                    label="Age"
                    icon={Calendar}
                    type="number"
                    value={child.age}
                    onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                    error={errors[`family.children.${index}.age`]}
                    placeholder="Age"
                  />

                  <InputField
                    label="School and Location"
                    icon={School}
                    value={child.school}
                    onChange={(e) => handleChildChange(index, 'school', e.target.value)}
                    error={errors[`family.children.${index}.school`]}
                    placeholder="School Name, City"
                  />

                  <InputField
                    label="Class"
                    icon={GraduationCap}
                    value={child.class}
                    onChange={(e) => handleChildChange(index, 'class', e.target.value)}
                    error={errors[`family.children.${index}.class`]}
                    placeholder="Current Standard/Grade"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Child Button */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => dispatch(addChild())}
            className="w-full py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-blue-100 transition-all shadow-sm mt-2"
          >
            <Plus size={20} />
            <span>ADD CHILD</span>
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};

export default FamilyDetails;