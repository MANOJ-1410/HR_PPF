import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { message } from "antd";
import { useNavigate } from "react-router-dom"; // <--- 1. IMPORT THIS
import { 
  FileSignature, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  X
} from "lucide-react";
import Loader from "../../../components/Loader";
import {
  updateDeclaration,
  setError,
  updateKeyAndValue,
} from "../../../redux/slices/candidatesSlice";
import {
  validateAllFields,
  validateFileSize,
  validateFileType,
} from "../utils/validation";
import { handleSubmitCandidateForm, handleUpdateCandidate } from "../../../apiHandler/candidate";
import { backendUrl } from "../../../backendUrl";

const Declaration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <--- 2. INITIALIZE HOOK
  const fileInputRef = useRef(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // <--- 3. NEW STATE to lock form

  // Redux State
  const declaration = useSelector((state) => state.candidateForm.declaration);
  const candidateForm = useSelector((state) => state.candidateForm);
  const errors = useSelector((state) => state.candidateForm.errors);
  const signatureImageFileName = useSelector(
    (state) => state?.candidateForm?.signatureImageFileName
  );
  const isEditMode = useSelector((state) => state.candidateForm.isEditMode);
  const candidateId = useSelector((state) => state.candidateForm.candidateId);

  // --- Handlers ---
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateFileType(file, ["image/jpeg", "image/png"])) {
        dispatch(setError({ field: "declaration.signature", error: "Invalid file format. Please upload JPEG or PNG." }));
        return;
      }
      if (!validateFileSize(file, 2)) {
        dispatch(setError({ field: "declaration.signature", error: "File size exceeds 2MB limit." }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateDeclaration({ field: "signature", value: reader.result }));
        dispatch(updateKeyAndValue({ field: "signatureImageFileName", value: file?.name || "" }));
        dispatch(setError({ field: "declaration.signature", error: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = (e) => {
    e.stopPropagation();
    dispatch(updateDeclaration({ field: "signature", value: "" }));
    dispatch(updateKeyAndValue({ field: "signatureImageFileName", value: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAgreementChange = (e) => {
    const isChecked = e.target.checked;
    dispatch(updateDeclaration({ field: "agreed", value: isChecked }));
    if (isChecked) {
      dispatch(setError({ field: "declaration.agreed", error: "" }));
    } else {
      dispatch(setError({ field: "declaration.agreed", error: "You must agree to the declaration to proceed." }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted) return; // Prevent double clicks

    const isEditMode = candidateForm.isEditMode;
    const candidateId = candidateForm.candidateId;

    setIsSubmitting(true);
    try {
      const formDataObj = { ...candidateForm };
      delete formDataObj.errors;

      const validateErrors = validateAllFields(formDataObj);
      
      if (Object.keys(validateErrors).length > 0) {
        message.error("Please fill out all required fields before submitting.");
        setIsSubmitting(false);
        return;
      }

      let response;
      if (isEditMode && candidateId) {
        response = await handleUpdateCandidate(candidateId, formDataObj);
      } else {
        response = await handleSubmitCandidateForm(formDataObj);
      }
      
      // Assuming your API returns a status or data on success
      if(response && !response.hasError) {
         setHasSubmitted(true); // Lock the button immediately
         message.success(isEditMode ? "Application updated successfully!" : "Application submitted successfully!");
         
         // <--- 4. REDIRECT THE USER
         // Give them 1.5 seconds to read the success message, then move them
         setTimeout(() => {
            navigate(isEditMode ? "/all-candidate-list" : "/application-success"); 
         }, 1500);
      } else {
        throw new Error(response?.message || "Operation failed");
      }
      
    } catch (error) {
      console.error(error);
      message.error("Submission failed. Please try again.");
      setIsSubmitting(false); // Only re-enable if it failed
    } 
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
    <AnimatePresence>
      {isSubmitting && <Loader fullScreen={true} text={isEditMode ? "Updating Profile..." : "Submitting Application..."} />}
    </AnimatePresence>
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto font-sans p-4"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg text-white">
            <FileSignature size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Declaration</h3>
            <p className="text-gray-500 text-sm mt-1">Final review and signature.</p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 space-y-8">
          
          {/* Declaration Text */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-gray-800 leading-relaxed text-justify text-sm md:text-base">
              I hereby declare that the information provided by me is TRUE to my
              knowledge and belief and if, found FALSE later on at any point of
              time during course of employment, I am liable to be terminated from
              employment under the grounds of misconduct without any employment
              terminal benefits.
            </p>
          </div>

          {/* Signature Section */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Digital Signature <span className="text-red-500">*</span>
            </label>

            <div 
              onClick={() => !hasSubmitted && fileInputRef.current.click()} 
              className={`
                relative group w-full border-2 border-dashed rounded-xl p-6
                flex flex-col items-center justify-center text-center cursor-pointer transition-all
                ${errors["declaration.signature"] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
                ${hasSubmitted ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-50 hover:border-blue-400'}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleSignatureChange}
                className="hidden"
                disabled={hasSubmitted}
              />

              {declaration?.signature ? (
                <div className="relative">
                   <img
                     src={declaration.signature.startsWith('data:image') || declaration.signature.startsWith('http') 
                       ? declaration.signature 
                       : `${backendUrl}${declaration.signature}`}
                     alt="Signature Preview"
                     className="h-24 md:h-32 object-contain rounded border bg-white p-2"
                   />
                   <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                      <Check size={14} />
                      <span>{signatureImageFileName}</span>
                   </div>
                   
                   {!hasSubmitted && (
                     <button
                       onClick={handleRemoveSignature}
                       className="absolute -top-3 -right-3 bg-white text-red-500 p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-red-50"
                     >
                       <X size={16} />
                     </button>
                   )}
                </div>
              ) : (
                <div className="py-4">
                  <UploadCloud className="text-blue-400 mx-auto mb-3" size={32} />
                  <p className="text-gray-700 font-medium text-sm">Click to upload signature</p>
                </div>
              )}
            </div>
            <AnimatePresence>
              {errors["declaration.signature"] && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-1 text-red-500 text-xs mt-2 font-medium"
                >
                  <AlertCircle size={12} />
                  {errors["declaration.signature"]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Agreement Checkbox */}
          <div>
            <label 
              className={`
                flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all
                ${declaration.agreed ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'}
                ${hasSubmitted ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <input
                type="checkbox"
                checked={declaration.agreed}
                onChange={handleAgreementChange}
                disabled={hasSubmitted}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <div>
                <span className="text-sm font-bold text-gray-800 block">
                  I Confirm
                </span>
                <span className="text-gray-600 text-sm leading-snug block mt-0.5">
                  I confirm that I have read and understood the above declaration, and
                  all the information provided by me in this form is true and accurate.
                </span>
              </div>
            </label>
            {errors["declaration.agreed"] && (
              <p className="text-red-500 text-xs font-medium mt-2 ml-1">{errors["declaration.agreed"]}</p>
            )}
          </div>
        </div>

        {/* Footer / Action Bar */}
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-end gap-4">
          <button
            type="button"
            // 5. DISABLE LOGIC: Disable if incomplete, submitting, or ALREADY submitted
            disabled={!declaration.agreed || !declaration.signature || isSubmitting || hasSubmitted}
            onClick={handleSubmit}
            className={`
              px-6 py-3 rounded-xl text-white font-semibold shadow-md flex items-center gap-2
              transition-all duration-200
              ${(declaration.agreed && declaration.signature && !isSubmitting && !hasSubmitted)
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                : "bg-gray-300 cursor-not-allowed shadow-none"}
            `}
          >
            {hasSubmitted ? (
              <>
                <Check size={18} />
                <span>{isEditMode ? "Updated!" : "Submitted!"}</span>
              </>
            ) : (
              <>
                <span>{isEditMode ? "Update Application" : "Submit Application"}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </motion.div>
    </>
  );
};

export default Declaration;