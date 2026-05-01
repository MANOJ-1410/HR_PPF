import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/MV Logo.png';
import bgImage from '../assets/login-bg.png';
import { LoginAdmin } from '../apiHandler/authenticate';

const Login = ({ onLogin }) => {
  // State Management
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const data = await LoginAdmin(formData);

      if (data.hasError) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, token } = data;

      // Persist UI-related user info
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role || 'hr');
      
      // Update app state
      if (onLogin) onLogin(user.role);

      toast.success(`Access Granted. Welcome, ${user.name || 'Admin'}`);

      setTimeout(() => {
        navigate('/all-candidate-list');
      }, 1000);

    } catch (error) {
      toast.error(error.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white overflow-hidden">
      {/* Left Side: Branded Image Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-mv-navy overflow-hidden">
        <img 
          src={bgImage} 
          alt="Corporate Office" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-mv-navy via-mv-navy/90 to-mv-navy/40"></div>
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-20">
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-6 font-sans">
            Human Resources <br/>
            <span className="text-mv-red">Management Portal</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-md font-sans font-medium">
            Seamlessly manage your workforce with our integrated PPF application system. Precision, security, and efficiency in one place.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 relative bg-white">
        <div className="max-w-[400px] w-full">
          {/* Professional Single Logo Placement - Centered */}
          <div className="mb-14 flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-14 w-auto mb-10" />
            <h1 className="text-3xl font-black text-mv-navy tracking-tight mb-2 font-sans">HR Login</h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <div className={`group flex items-center transition-all duration-300 border-b-2 py-3 ${errors.email ? 'border-mv-red' : 'border-slate-100 focus-within:border-mv-navy'}`}>
                <AiOutlineMail className={`mr-4 ${errors.email ? 'text-mv-red' : 'text-slate-300 group-focus-within:text-mv-navy'}`} size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@manjushree.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-300 font-bold text-sm font-sans"
                />
              </div>
              {errors.email && <p className="text-mv-red text-[10px] font-black uppercase mt-2 ml-1 tracking-wider">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                <button type="button" className="text-[10px] font-black text-mv-navy hover:text-mv-red transition-colors uppercase tracking-[0.2em] opacity-60">Forgot?</button>
              </div>
              <div className={`group flex items-center transition-all duration-300 border-b-2 py-3 ${errors.password ? 'border-mv-red' : 'border-slate-100 focus-within:border-mv-navy'}`}>
                <AiOutlineLock className={`mr-4 ${errors.password ? 'text-mv-red' : 'text-slate-300 group-focus-within:text-mv-navy'}`} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-300 font-bold text-sm font-sans"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} 
                  className="ml-2 text-slate-300 hover:text-mv-navy transition-colors focus:outline-none"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/>}
                </button>
              </div>
              {errors.password && <p className="text-mv-red text-[10px] font-black uppercase mt-2 ml-1 tracking-wider">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mv-navy text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transform active:scale-[0.98] transition-all duration-300 shadow-xl shadow-mv-navy/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <AiOutlineLoading3Quarters className="animate-spin" size={18} />
                  <span className="font-sans">Authenticating...</span>
                </div>
              ) : (
                <>
                  <span className="font-sans">Sign In</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-20 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-relaxed font-sans">
              &copy; {new Date().getFullYear()} Manjushree Ventures <br/>
              Internal Systems Division
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />
    </div>

  );
};

export default Login;