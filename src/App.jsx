import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import FoxTimeline from './pages/FoxTimeline';
import DetailView from './pages/DetailView';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
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
