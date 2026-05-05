import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import FoxTimeline from './pages/FoxTimeline';
import DetailView from './pages/DetailView';
import Login from './pages/Login';
import './App.css';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && <Header />}
      <main className={isLoginPage ? "login-main" : "main-content"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/fox" element={<FoxTimeline />} />
          <Route path="/detail/:id" element={<DetailView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
