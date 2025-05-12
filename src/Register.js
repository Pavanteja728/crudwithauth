import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import './Auth.css';

const Register = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  
  const validateUsername = (value) => {
    const usernameRegex = /^[a-zA-Z0-9]{5,}$/;
    if (!usernameRegex.test(value)) {
      setUsernameError('Username must be at least 5 characters long and alphanumeric.');
    } else {
      setUsernameError('');
    }
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,}$/;


    if (!passwordRegex.test(value)) {
      setPasswordError('Password must be at least 6 characters, with 1 uppercase letter and 1 special character.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameError || passwordError) {
      setError('Please fix validation errors before submitting.');
      return;
    }

    setError('');
    try {
      const response = await fetch('https://localhost:44362/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const loginResponse = await fetch('https://localhost:44362/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) throw new Error('Auto-login failed');

      const data = await loginResponse.json();
      AuthService.login(data.token, data.role);
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(data.token, data.role);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              validateUsername(e.target.value);
            }}
            required
          />
          {usernameError && <div className="validation-error">{usernameError}</div>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            required
          />
          {passwordError && <div className="validation-error">{passwordError}</div>}
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} className="auth-link">Login</span>
      </p>
    </div>
  );
};

export default Register;
