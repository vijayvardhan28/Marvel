import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
        if (result.error === 'User does not exist') {
          // Provide an immediate prompt to create an account
          setTimeout(() => navigate('/signup'), 2500); // Redirect after brief delay
        }
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      <div className="login-card">
        <div className="login-header">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg" 
            alt="Marvel Logo" 
            className="login-logo" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://cdn.worldvectorlogo.com/logos/marvel.svg';
            }}
          />
          <h2>Welcome Back, Agent</h2>
          <p>Sign in to access your MCU database</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            {error === 'User does not exist' && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                Redirecting to create account...
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="fury@shield.gov"
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="form-actions">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          
          <button type="submit" className="login-btn">
            Assemble
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have clearance? <Link to="/signup">Request Access</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
