import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/MV Logo.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-10">
      {/* Redundant local Navigation removed to use global Navbar */}

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className={`text-center transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-mv-navy tracking-tight mb-6">
              Empowering Our Workforce <br/>
              <span className="text-mv-red font-medium">Through Digital Transformation</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
              Welcome to the Manjushree Ventures PPF Application Portal. A streamlined, professional platform for employees and HR management.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
            {/* Candidate Card */}
            <div 
              className={`group bg-white p-10 rounded-2xl shadow-premium border border-slate-100 hover:border-mv-red transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} delay-300`}
            >
              <div className="w-14 h-14 bg-mv-red/10 rounded-xl flex items-center justify-center mb-6 text-mv-red group-hover:bg-mv-red group-hover:text-white transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-mv-navy mb-4">Employee Application</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Join our growing team. Complete your PPF application online with our secure and easy-to-use digital form.
              </p>
              <button 
                onClick={() => navigate('/new-candidate')}
                className="w-full py-4 bg-mv-navy text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center group/btn"
              >
                Start Application
                <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* HR Card */}
            <div 
              className={`group bg-white p-10 rounded-2xl shadow-premium border border-slate-100 hover:border-mv-navy transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} delay-500`}
            >
              <div className="w-14 h-14 bg-mv-navy/10 rounded-xl flex items-center justify-center mb-6 text-mv-navy group-hover:bg-mv-navy group-hover:text-white transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-mv-navy mb-4">HR Management</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Authorized personnel access. Securely review applications, manage records, and export reports for processing.
              </p>
              <button 
                onClick={() => window.open('/superadmin', '_blank')}
                className="w-full py-4 bg-white text-mv-navy border-2 border-mv-navy rounded-lg font-semibold hover:bg-mv-navy hover:text-white transition-all duration-300 flex items-center justify-center group/btn"
              >
                Access Dashboard
                <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <span className="text-lg font-bold text-white mr-2">Manjushree</span>
              <span className="text-lg font-light text-slate-300">Ventures</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Manjushree Ventures. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <span className="hover:text-white cursor-default transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-default transition-colors">Terms of Service</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs opacity-50 uppercase tracking-widest">
            Internal Corporate Use Only
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;