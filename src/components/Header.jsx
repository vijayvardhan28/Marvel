import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, MonitorPlay, LayoutDashboard, LogIn } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/timeline', label: 'MCU', icon: <Film size={20} /> },
    { path: '/fox', label: 'Fox', icon: <Film size={20} /> },
    { path: '/login', label: 'Login', icon: <LogIn size={20} /> }
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
