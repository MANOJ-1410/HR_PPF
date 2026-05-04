import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Calendar,
  Award,
  Building2,
  BookOpen,
  Percent,
  Layers,
  ChevronDown,
  Check,
} from 'lucide-react';
import { updateAcademic, setError, clearError } from '../../../redux/slices/candidatesSlice';

// ─── Constants (outside component → created once) ────────────────────────────

const STUDY_MODES = ['Regular', 'Distance'];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1950;

// ─── Validation helpers ───────────────────────────────────────────────────────

const validators = {
  university: (v) => v.trim().length >= 2 ? '' : 'University / Board name is required.',
  college: (v) => v.trim().length >= 2 ? '' : 'Institute / College name is required.',
  specialization: (v) => v.trim().length >= 2 ? '' : 'Specialization is required.',
  yearOfPassing: (v) => {
    const yr = Number(v);
    if (!v || isNaN(yr)) return 'Year of passing is required.';
    if (yr < MIN_YEAR) return `Year must be after ${MIN_YEAR}.`;
    if (yr > CURRENT_YEAR + 1) return `Year cannot exceed ${CURRENT_YEAR + 1}.`;
    return '';
  },
  percentage: (v) => {
    const n = parseFloat(v);
    if (v === '' || isNaN(n)) return 'Percentage / CGPA is required.';
    if (n < 0 || n > 100) return 'Enter a value between 0 and 100.';
    return '';
  },
  mode: (v) => STUDY_MODES.includes(v) ? '' : 'Please select a mode of study.',
};

const validate = (field, value, qualification) => {
  const trimmedValue = (value || '').toString().trim();

  // If the current field is being cleared, check if the rest of the row is also empty
  if (trimmedValue === '') {
    const hasOtherContent = Object.entries(qualification).some(([k, v]) =>
      k !== 'level' && k !== 'id' && k !== field && v && v.toString().trim() !== ''
    );
    // If no other field is filled, this row doesn't "need" validation yet
    if (!hasOtherContent) return '';
  }

  return validators[field] ? validators[field](value) : '';
};

// ─── Animation variants (outside component → created once) ───────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const errorVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

// ─── InputField ───────────────────────────────────────────────────────────────

const InputField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  inputMode,
  min,
  max,
}) => (
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon
          className={`h-4 w-4 transition-colors duration-150 ${error
              ? 'text-red-400'
              : 'text-gray-400 group-focus-within:text-blue-500'
            }`}
        />
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
        aria-describedby={error ? `${label}-error` : undefined}
        className={`
          block w-full pl-10 pr-3 py-2.5
          bg-white border rounded-xl text-gray-900 text-sm md:text-base
          transition-all duration-150 outline-none
          focus:ring-2 focus:ring-offset-0
          ${error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100/50 shadow-sm'
          }
        `}
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          id={`${label}-error`}
          role="alert"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-red-500 text-xs mt-1 ml-0.5"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ─── CustomSelect ─────────────────────────────────────────────────────────────
// Accepts a plain `value` string and calls `onChange(newValue)` — no fake events.

const CustomSelect = ({ label, value, onChange, onBlur, options, error, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const listId = `select-list-${label.replace(/\s+/g, '-').toLowerCase()}`;

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onBlur]);

  const handleSelect = (option) => {
    onChange(option);          // ← plain value, no fake event
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          relative w-full pl-10 pr-10 py-2.5 text-left
          bg-white border rounded-xl text-sm md:text-base
          transition-all duration-150 outline-none
          focus:ring-2 focus:ring-offset-0
          ${isOpen
            ? 'border-blue-500 ring-4 ring-blue-100/30 shadow-md'
            : error
              ? 'border-red-300 hover:border-red-400'
              : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100/50 shadow-sm'
          }
        `}
      >
        {/* Left icon */}
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-4 w-4 ${error ? 'text-red-400' : isOpen ? 'text-blue-500' : 'text-gray-400'}`} />
        </span>

        {/* Selected value or placeholder */}
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || 'Select option'}
        </span>

        {/* Chevron */}
        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.span>
        </span>
      </button>

      {/* Dropdown — rendered in normal flow so z-index stacks correctly */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 2, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto py-1"
          >
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                onClick={() => handleSelect(opt)}
                className={`
                  px-4 py-2 mx-1.5 rounded-lg cursor-pointer flex items-center justify-between text-sm md:text-base
                  transition-all duration-200
                  ${value === opt
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }
                `}
              >
                {opt}
                {value === opt && <Check className="h-3.5 w-3.5 text-blue-600" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-red-500 text-xs mt-1 ml-0.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Academics (main) ─────────────────────────────────────────────────────────

const Academics = () => {
  const dispatch = useDispatch();
  const academics = useSelector((state) => state.candidateForm.academics);
  const errors = useSelector((state) => state.candidateForm.errors);

  // Validate on change — clear error immediately when value becomes valid
  const handleChange = useCallback(
    (index, field, value) => {
      dispatch(updateAcademic({ index, field, value }));

      // Get the current state of this qualification row
      const currentQual = academics.qualifications[index];
      const updatedQual = { ...currentQual, [field]: value };

      const error = validate(field, value, updatedQual);

      if (error) {
        dispatch(setError({ field: `academics.${index}.${field}`, error }));
      } else {
        dispatch(clearError({ field: `academics.${index}.${field}` }));
      }

      // Special case: if the whole row is now empty, clear ALL errors for this row
      const isRowEmpty = Object.entries(updatedQual).every(([k, v]) =>
        k === 'level' || k === 'id' || !v || v.toString().trim() === ''
      );
      if (isRowEmpty) {
        ['university', 'college', 'specialization', 'yearOfPassing', 'percentage', 'mode'].forEach(f => {
          dispatch(clearError({ field: `academics.${index}.${f}` }));
        });
      }
    },
    [dispatch, academics.qualifications],
  );

  // Only show error after the user leaves the field (better UX)
  const handleBlur = useCallback(
    (index, field, value) => {
      const qual = academics.qualifications[index];
      const error = validate(field, value, qual);
      if (error) {
        dispatch(setError({ field: `academics.${index}.${field}`, error }));
      }
    },
    [dispatch, academics.qualifications],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto font-sans p-4 md:p-6"
    >
      {/* Section header */}
      <div className="mb-8 pb-5 border-b border-gray-100 flex items-center gap-4">
        <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
          <GraduationCap size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Academic History</h3>
          <p className="text-gray-400 text-sm mt-0.5">
            Enter your educational qualifications below.
          </p>
        </div>
      </div>

      {/* Qualification cards */}
      <div className="space-y-6">
        {academics.qualifications.map((qual, index) => {
          // Ensure every item has a stable key; fall back to index only if id missing
          const cardKey = qual.id ?? index;

          return (
            <motion.div
              key={cardKey}
              variants={cardVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              {/* Card header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 rounded-t-2xl bg-gray-50/60">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold">
                  {index + 1}
                </span>
                <h4 className="text-base font-semibold text-gray-700">{qual.level}</h4>
              </div>

              {/* Fields grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <InputField
                  label="University / Board"
                  icon={Building2}
                  value={qual.university}
                  onChange={(e) => handleChange(index, 'university', e.target.value)}
                  onBlur={() => handleBlur(index, 'university', qual.university)}
                  error={errors[`academics.${index}.university`]}
                  placeholder="e.g. Mumbai University"
                />

                <InputField
                  label="Institute / College"
                  icon={BookOpen}
                  value={qual.college}
                  onChange={(e) => handleChange(index, 'college', e.target.value)}
                  onBlur={() => handleBlur(index, 'college', qual.college)}
                  error={errors[`academics.${index}.college`]}
                  placeholder="e.g. VJTI"
                />

                <InputField
                  label="Specialization"
                  icon={Award}
                  value={qual.specialization}
                  onChange={(e) => handleChange(index, 'specialization', e.target.value)}
                  onBlur={() => handleBlur(index, 'specialization', qual.specialization)}
                  error={errors[`academics.${index}.specialization`]}
                  placeholder="e.g. Computer Engineering"
                />

                <InputField
                  label="Year of Passing"
                  icon={Calendar}
                  value={qual.yearOfPassing}
                  onChange={(e) => handleChange(index, 'yearOfPassing', e.target.value)}
                  onBlur={() => handleBlur(index, 'yearOfPassing', qual.yearOfPassing)}
                  error={errors[`academics.${index}.yearOfPassing`]}
                  placeholder={`${CURRENT_YEAR}`}
                  type="number"
                  inputMode="numeric"
                  min={MIN_YEAR}
                  max={CURRENT_YEAR + 1}
                />

                <InputField
                  label="Percentage / CGPA"
                  icon={Percent}
                  value={qual.percentage}
                  onChange={(e) => handleChange(index, 'percentage', e.target.value)}
                  onBlur={() => handleBlur(index, 'percentage', qual.percentage)}
                  error={errors[`academics.${index}.percentage`]}
                  placeholder="e.g. 75.50"
                  inputMode="decimal"
                />

                {/* CustomSelect now receives plain value & plain onChange(value) */}
                <CustomSelect
                  label="Mode of Study"
                  icon={Layers}
                  value={qual.mode}
                  options={STUDY_MODES}
                  onChange={(val) => handleChange(index, 'mode', val)}
                  onBlur={() => handleBlur(index, 'mode', qual.mode)}
                  error={errors[`academics.${index}.mode`]}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Academics;