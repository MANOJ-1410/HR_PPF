import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to check authentication
    const fetchAuthStatus = async () => {
      try {
        // Example: Replace this with your actual authentication API call
        const response = await fetch("/api/auth/check-login");
        const result = await response.json();
        setIsAuthenticated(result.isAuthenticated); // Set true if admin is logged in
      } catch (error) {
        console.error("Authentication check failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking auth
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
