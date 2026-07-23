import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import FoxTimeline from './pages/FoxTimeline';
import SpiderManTimeline from './pages/SpiderManTimeline';
import AnimatedTimeline from './pages/AnimatedTimeline';
import DefendersTimeline from './pages/DefendersTimeline';
import DetailView from './pages/DetailView';
import TheMarvelTimeline from './pages/TheMarvelTimeline';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? "login-main" : "main-content"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/the-marvel" element={<TheMarvelTimeline />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/fox" element={<FoxTimeline />} />
          <Route path="/spiderman" element={<SpiderManTimeline />} />
          <Route path="/animated" element={<AnimatedTimeline />} />
          <Route path="/defenders" element={<DefendersTimeline />} />
          <Route path="/detail/:id" element={<DetailView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
