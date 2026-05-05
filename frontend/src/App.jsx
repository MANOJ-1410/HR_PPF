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

import { GetMe } from './apiHandler/authenticate';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Navbar is hidden on the login page as requested
  const hideNavbar = location.pathname === '/superadmin'; 

  useEffect(() => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await GetMe();
        if (data && !data.hasError) {
          setIsLoggedIn(true);
          setUserRole(data.user.role);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userRole', data.user.role);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        // If it fails (e.g. 401), ensure state is cleared
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogoutState = () => {
    setIsLoggedIn(false);
    setUserRole('');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  // Protected Route Component
  const PrivateRoute = ({ children }) => {
    if (loading) return <Loader />;
    return isLoggedIn ? children : <Navigate to="/superadmin" replace />;
  };

  // Auth Redirect (prevent logged-in users from seeing login page)
  const AuthRedirect = ({ children }) => {
    if (loading) return <Loader />;
    return isLoggedIn ? <Navigate to="/all-candidate-list" replace /> : children;
  };

  return (
    <Suspense fallback={<Loader />}>
      {!hideNavbar && (
        <Navbar 
          onLogout={handleLogoutState} 
          isLoggedIn={isLoggedIn} 
          userRole={userRole}
          userEmail={JSON.parse(localStorage.getItem('user') || '{}').email}
        />
      )}

      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path="/new-candidate" element={<NewCandidateForm />} />
        
        {/* Auth Route - Redirects away if already logged in */}
        <Route path="/superadmin" element={
          <AuthRedirect>
            <Login onLogin={handleLogin} />
          </AuthRedirect>
        } />

        {/* Protected Admin Routes */}
        <Route path="/all-candidate-list" element={
          <PrivateRoute>
            <AllCandidateList />
          </PrivateRoute>
        } />
        <Route path="/candidate-view/:candidateId" element={
          <PrivateRoute>
            <CandidateView />
          </PrivateRoute>
        } />
        <Route path="/add-admins" element={
          <PrivateRoute>
            <AddAdmin />
          </PrivateRoute>
        } />
        <Route path="/edit-profile" element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        } />
        
        <Route path="/application-success" element={<SuccessPage />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/new-candidate" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;