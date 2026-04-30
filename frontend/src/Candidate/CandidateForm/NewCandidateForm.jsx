import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Steps } from "antd";
import "antd/es/style/reset.css";
import PersonalDetails from "./Components/PersonalDetails";
import Academics from "./Components/Academics";
import CareerProgression from "./Components/CareerProgression";
import FamilyDetails from "./Components/FamilyDetails";
import References from "./Components/References";
import Declaration from "./Components/Declaration";
import { message } from "antd";
import { validateAllFields } from "./utils/validation";

const NewCandidateForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const isEditMode = useSelector((state) => state.candidateForm.isEditMode);

  const stepsList = [
    { title: "Personal Details" },
    { title: "Academics" },
    { title: "Career Progression" },
    { title: "Family Details" },
    { title: "References" },
    { title: "Declaration" },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalDetails />;
      case 1:
        return <Academics />;
      case 2:
        return <CareerProgression />;
      case 3:
        return <FamilyDetails />;
      case 4:
        return <References />;
      case 5:
        return <Declaration />;
      default:
        return null;
    }
  };

  const candidateForm = useSelector((state) => state.candidateForm);

  const validateCurrentStep = () => {
    const errors = validateAllFields(candidateForm);
    
    // Filter errors based on the current step
    const stepErrors = Object.keys(errors).filter(key => {
      if (currentStep === 0) return key.startsWith("personal.");
      if (currentStep === 1) return key.startsWith("academics.");
      if (currentStep === 2) return key.startsWith("career.");
      if (currentStep === 3) return key.startsWith("family.");
      if (currentStep === 4) return key.startsWith("references.");
      if (currentStep === 5) return key.startsWith("declaration.");
      return false;
    });

    if (stepErrors.length > 0) {
      // Show the first error message
      const firstErrorKey = stepErrors[0];
      message.error(errors[firstErrorKey]);
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < stepsList.length - 1) setCurrentStep(currentStep + 1);
    }
  };

  const goPrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-[85rem] mx-auto font-sans py-8 px-4">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">
        {isEditMode ? "Edit Candidate" : "Candidate Form"}
      </h2>
      <div>
        <Steps
          className=" font-sans text-xl font-semibold mt-6 ml-2"
          current={currentStep}
          onChange={(step) => {
            if (step < currentStep) {
              setCurrentStep(step);
            } else if (step === currentStep + 1) {
              goNext();
            } else if (step > currentStep + 1) {
              // Optionally prevent skipping multiple steps forward
              message.warning("Please complete the steps in order.");
            }
          }}
          items={stepsList}
        />
        <div className="step-content mt-8 ">
          {renderStepContent(currentStep)}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          {currentStep ? (
            <button
              className="px-8 py-3 text-white bg-blue-600 rounded-lg border border-blue-600 hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-colors"
              onClick={goPrevious}
              disabled={currentStep === 0}
            >
              Previous
            </button>
          ) : null}
          {currentStep < stepsList.length - 1 ? (
            <button
              className="px-6 py-2 text-white bg-blue-600 rounded-lg border border-blue-600 hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-colors"
              onClick={goNext}
              disabled={currentStep === stepsList.length - 1}
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NewCandidateForm;
