import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, MonitorPlay, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/timeline', label: 'MCU', icon: <Film size={20} /> },
    { path: '/fox', label: 'Fox', icon: <Film size={20} /> },
    { path: '/spiderman', label: 'Spider-Man', icon: <MonitorPlay size={20} /> },
    { path: '/animated', label: 'Animated', icon: <MonitorPlay size={20} /> },
    { path: '/defenders', label: 'Defenders', icon: <Film size={20} /> }
  ];

  return (
    <header className="app-header glass-panel">
      <div className="header-container">
        <Link to="/" className="logo-container">
          <span className="logo-text">MCU<span className="hero-gradient">Tracker</span></span>
        </Link>
        
        <nav className="nav-links">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          {currentUser ? (
            <>
              <div className="nav-link" style={{ cursor: 'default', color: 'var(--color-primary)' }}>
                <User size={20} />
                <span>{currentUser.name}</span>
              </div>
              <button 
                onClick={logout}
                className="nav-link" 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
