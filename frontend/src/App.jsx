import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loader from './components/Loader';

// Lazy load components
const Login = lazy(() => import("./pages/Login"));
const NewCandidateForm = lazy(() => import("./Candidate/CandidateForm/NewCandidateForm"));
const AllCandidateList = lazy(() => import("./Candidate/CandidateList/AllCandidateList"));
const CandidateView = lazy(() => import("./Candidate/CandidateView/CandidateView"));
const Navbar = lazy(() => import("./Candidate/CandidateForm/Navbar/Navbar"));
const AddAdmin = lazy(() => import("./Candidate/CandidateForm/NabarPages/AddAdminPage"));
const EditProfile = lazy(() => import("./Candidate/CandidateForm/NabarPages/EditProfilePage"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const HomePage = lazy(() => import("./pages/HomePage"));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const location = useLocation();

  // Navbar is hidden on the login page as requested, but remains on others for consistency
  const hideNavbar = location.pathname === '/superadmin'; 


  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  // Protected Route Component
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/superadmin" replace />;
  };

  return (
    <Suspense fallback={<Loader />}>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Your existing routes - kept exactly the same */}
        <Route path='/' element={<HomePage/>} />
        <Route path="/" element={<Navigate to="/new-candidate" replace />} />
        <Route path="/new-candidate" element={<NewCandidateForm />} />
        <Route path="/superadmin" element={<Login onLogin={handleLogin} />} />
        <Route path="/all-candidate-list" element={<AllCandidateList />} />
        <Route path="/candidate-view/:candidateId" element={<CandidateView />} />
        <Route path="/add-admins" element={<AddAdmin />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/application-success" element={<SuccessPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;