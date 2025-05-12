import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Movie from './Movie';
import AuthService from './AuthService';
import AdminUserManagement from './AdminUserManagement';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [userRole, setUserRole] = useState(AuthService.getUserRole());

  useEffect(() => {
    const token = localStorage.getItem('movie_app_token');
    const role = localStorage.getItem('movie_app_role');

    console.log("App loaded. Token:", token);  
    console.log("App loaded. Role from localStorage:", role);  

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (token, role) => {
    AuthService.login(token, role);
    setIsAuthenticated(true);
    setUserRole(role);
    console.log("User logged in. Role:", role);  
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    console.log("User logged out.");
  };

  console.log("Rendering App. Authenticated:", isAuthenticated, "Role:", userRole);  

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? <Login onLoginSuccess={handleLogin} /> : <Navigate to="/" />
          } />
          <Route path="/register" element={
            !isAuthenticated ? <Register onLoginSuccess={handleLogin} /> : <Navigate to="/" />
          } />
          <Route path="/" element={
            isAuthenticated ? (
              <Movie key={userRole} userRole={userRole} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/admin/users" element={
            isAuthenticated && userRole === 'Admin' ? (
              <AdminUserManagement onLogout={handleLogout} />
            ) : isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
