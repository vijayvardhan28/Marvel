import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css'; // We'll just reuse most of the styles from Login or create a specific one

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (name && email && password) {
      const result = await signup(name, email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } else {
      setError('Please fill in all fields.');
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
          <h2>Join the Initiative</h2>
          <p>Create an account to track your MCU journey</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignup} className="login-form">
          <div className="input-group">
            <label htmlFor="name">Agent Name</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Phil Coulson"
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="coulson@shield.gov"
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
          
          <button type="submit" className="login-btn">
            Register
          </button>
        </form>

        <div className="login-footer">
          <p>Already have clearance? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
