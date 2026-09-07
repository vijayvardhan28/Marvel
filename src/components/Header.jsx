import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, MonitorPlay, LayoutDashboard, LogIn, LogOut, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/the-marvel', label: 'The Marvel', icon: <Film size={20} /> },
    { path: '/timeline', label: 'MCU', icon: <Film size={20} /> },
    { path: '/spiderman', label: 'Spider-Man', icon: <MonitorPlay size={20} /> },
    { path: '/fox', label: 'X-Men', icon: <Film size={20} /> },
    { path: '/legacy', label: 'Legacy Marvel', icon: <Film size={20} /> },
    { path: '/defenders', label: 'Defenders', icon: <Film size={20} /> },
    { path: '/animated', label: 'Animated', icon: <MonitorPlay size={20} /> }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

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

        <form onSubmit={handleSearch} className="search-form" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '0.2rem 0.8rem' }}>
          <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search User ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.3rem 0.5rem', outline: 'none', width: '150px' }}
          />
        </form>

        <div className="auth-links">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
