import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/MV Logo.png';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <img src={logo} alt="Manjushree Ventures" className="h-12 mx-auto mb-10 opacity-80" />

        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-10 relative overflow-hidden">
          {/* Success Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-mv-navy"></div>
          
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-8 ring-slate-50/50">
              <svg className="w-12 h-12 text-mv-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-mv-navy mb-4 tracking-tight">Submission Received</h1>
          <p className="text-slate-600 mb-10 leading-relaxed font-medium">
            Your PPF application has been successfully transmitted to our HR department. Our team will verify your details and reach out shortly.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-mv-navy text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
            >
              Return to Portal
            </button>
            
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest pt-4">
              Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-slate-500 font-medium">
          Need assistance? <span className="text-mv-navy hover:text-mv-red cursor-pointer transition-colors underline decoration-slate-300 underline-offset-4">Contact HR Support</span>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;