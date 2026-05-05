import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  ShieldCheck,
  ChevronDown,
  Briefcase,
  Users
} from "lucide-react";
import { useDispatch } from "react-redux";
import { resetCandidateForm } from "../../../redux/slices/candidatesSlice";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../assets/MV Logo.png";

import { LogoutAdmin } from "../../../apiHandler/authenticate";

const Navbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const menuRef = useRef(null);

  // --- Authentication Check ---
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const role = localStorage.getItem('userRole');

    if (userStr && role) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUserRole(role);
      setUserEmail(user.email);
      setIsSuperAdmin(role === 'superadmin');
    } else {
      setIsLoggedIn(false);
      setUserRole('');
      setUserEmail('');
      setIsSuperAdmin(false);
    }
  }, [location.pathname]);

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Click Outside to Close ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    if (path === "/new-candidate") {
      dispatch(resetCandidateForm());
    }
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = useCallback(async () => {
    try {
      await LogoutAdmin();
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole('');
    setUserEmail('');
    setIsSuperAdmin(false);
    setIsMenuOpen(false);
    
    // Notify App component to lock routes immediately
    if (onLogout) onLogout();
    
    toast.success("Logged out successfully", { 
      position: "top-center",
      autoClose: 1500,
      theme: "light",
      hideProgressBar: true
    });
  
    setTimeout(() => {
      navigate("/superadmin");
      window.location.reload(); 
    }, 1000);
  }, [navigate, onLogout]);

  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  // --- Animation Variants ---
  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95, transformOrigin: "top right" },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
      ${scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-3" 
        : "bg-white border-b border-slate-100 py-4"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 1. Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <img 
              src={logo} 
              alt="MV Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* 2. Right Side Actions */}
          <div className="flex items-center gap-4" ref={menuRef}>
            
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-mv-navy/10 group"
                >
                  {/* Text Info */}
                  <div className="hidden md:flex flex-col items-end mr-1">
                    <span className="text-[10px] font-black text-mv-navy uppercase tracking-[0.15em] mb-0.5">
                      {userRole}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                      {userEmail}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="h-8 w-8 rounded-lg bg-mv-navy flex items-center justify-center text-white font-black text-xs shadow-sm ring-2 ring-mv-navy/5">
                    {getInitials(userEmail)}
                  </div>
                  
                  <div className="text-slate-300 group-hover:text-mv-navy transition-colors">
                    <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }}>
                      <ChevronDown size={14} strokeWidth={3} />
                    </motion.div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden origin-top-right"
                    >
                      <div className="p-1">
                        <MenuItem 
                          icon={User} 
                          label="Edit Profile" 
                          onClick={() => handleNavigation("/edit-profile")} 
                        />
                        
                        {isSuperAdmin && (
                          <MenuItem 
                            icon={ShieldCheck} 
                            label="Manage Admins" 
                            onClick={() => handleNavigation("/add-admins")} 
                            highlight
                          />
                        )}

                        <MenuItem 
                          icon={Briefcase} 
                          label="Candidate Form" 
                          onClick={() => handleNavigation("/new-candidate")} 
                        />
                        <MenuItem 
                          icon={Users} 
                          label="Candidate List" 
                          onClick={() => handleNavigation("/all-candidate-list")} 
                        />

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-mv-red hover:bg-red-50 rounded-lg flex items-center gap-3 transition-all duration-200"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Login Button - Only shown on Home page or if not on the login page itself
              location.pathname !== '/superadmin' && location.pathname !== '/new-candidate' && (
                <button
                  onClick={() => window.open("/superadmin", "_blank")}
                  className="group inline-flex items-center justify-center px-6 py-2 bg-mv-navy text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:shadow-mv-navy/20 focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <User size={14} strokeWidth={2.5} />
                    HR Access
                  </span>
                </button>
              )
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Reusable Menu Item Component ---
const MenuItem = ({ icon: Icon, label, onClick, highlight = false }) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-3 transition-all duration-200 group
      ${highlight 
        ? 'text-mv-navy hover:bg-slate-50' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-mv-navy'}
    `}
  >
    <Icon 
      size={16} 
      className={`
        transition-colors duration-200
        ${highlight 
          ? 'text-mv-navy' 
          : 'text-slate-400 group-hover:text-mv-navy'}
      `} 
    />
    <span>{label}</span>
  </button>
);

export default Navbar;