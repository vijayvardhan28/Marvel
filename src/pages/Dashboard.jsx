import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMCU } from '../context/MCUContext';
import { mcuData, calculateTotalRuntime, formatRuntime } from '../data/mcuData';
import { foxData } from '../data/foxData';
import { animatedData } from '../data/animatedData';
import { raimiSpiderManData, amazingSpiderManData, spiderVerseData, yfnsmData } from '../data/spiderManData';
import { Clock, CheckCircle, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { userData } = useMCU();
  const navigate = useNavigate();

  const spiderManData = [...raimiSpiderManData, ...amazingSpiderManData, ...spiderVerseData, ...yfnsmData];
  const totalRuntime = calculateTotalRuntime([...mcuData, ...foxData, ...spiderManData, ...animatedData]);
  
  const watchedMcuItems = mcuData.filter(item => userData[item.id]?.watched);
  const watchedFoxItems = foxData.filter(item => userData[item.id]?.watched);
  const watchedSpiderManItems = spiderManData.filter(item => userData[item.id]?.watched);
  const watchedAnimatedItems = animatedData.filter(item => userData[item.id]?.watched);
  const allWatchedItems = [...watchedMcuItems, ...watchedFoxItems, ...watchedSpiderManItems, ...watchedAnimatedItems];
  
  const watchedRuntime = calculateTotalRuntime(allWatchedItems);
  const remainingRuntime = totalRuntime - watchedRuntime;
  
  const mcuProgress = (calculateTotalRuntime(watchedMcuItems) / calculateTotalRuntime(mcuData)) * 100 || 0;
  const foxProgress = (calculateTotalRuntime(watchedFoxItems) / calculateTotalRuntime(foxData)) * 100 || 0;
  const spiderManProgress = (calculateTotalRuntime(watchedSpiderManItems) / calculateTotalRuntime(spiderManData)) * 100 || 0;
  const animatedProgress = (calculateTotalRuntime(watchedAnimatedItems) / calculateTotalRuntime(animatedData)) * 100 || 0;
  const totalProgress = (watchedRuntime / totalRuntime) * 100 || 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-bg" style={{backgroundImage: "url('/avengers_hero.png')"}}></div>
      <div className="dashboard animate-fade-in">
        <section className="hero-section avengers-theme">
          <div className="hero-bg" style={{backgroundImage: "url('/avengers_hero.png')"}}></div>
          <div className="hero-content">
            <h1 className="hero-title"><span className="hero-gradient-avengers">AVENGERS</span> ASSEMBLE</h1>
            <p className="hero-subtitle">Track your progress through the Marvel Cinematic Universe.</p>
          </div>
        </section>

        <section className="stats-container">
          <div 
            className="stat-card glass-panel delay-1" 
            onClick={() => navigate('/timeline?status=watched')}
            style={{ cursor: 'pointer' }}
            title="View all watched items"
          >
            <div className="stat-icon bg-primary"><CheckCircle size={24}/></div>
            <div className="stat-info">
              <h3>Watched</h3>
              <p className="stat-value">{allWatchedItems.length} <span className="stat-total">/ {mcuData.length + foxData.length + spiderManData.length + animatedData.length}</span></p>
            </div>
          </div>

          <div className="stat-card glass-panel delay-2">
            <div className="stat-icon bg-success"><Clock size={24}/></div>
            <div className="stat-info">
              <h3>Time Watched</h3>
              <p className="stat-value">{formatRuntime(watchedRuntime)}</p>
            </div>
          </div>

          <div className="stat-card glass-panel delay-3">
            <div className="stat-icon bg-warning"><TrendingUp size={24}/></div>
            <div className="stat-info">
              <h3>Time Remaining</h3>
              <p className="stat-value">{formatRuntime(remainingRuntime)}</p>
            </div>
          </div>
        </section>

        <section className="progress-section glass-panel delay-2">
          <div className="progress-header">
            <h3>🌟 Overall Universe Progress</h3>
            <span>{totalProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container" style={{ marginBottom: '2rem' }}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${totalProgress}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)', boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}
            ></div>
          </div>

          <div className="progress-header">
            <h3>MCU Progress</h3>
            <span>{mcuProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container" style={{ marginBottom: '2rem' }}>
            <div className="progress-bar-fill" style={{ width: `${mcuProgress}%` }}></div>
          </div>

          <div className="progress-header">
            <h3>Fox Universe Progress</h3>
            <span>{foxProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container" style={{ marginBottom: '2rem' }}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${foxProgress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
            ></div>
          </div>

          <div className="progress-header">
            <h3>🕷️ Spider-Man Universe Progress</h3>
            <span>{spiderManProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container" style={{ marginBottom: '2rem' }}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${spiderManProgress}%`, background: 'linear-gradient(90deg, #e63946, #1d3557)', boxShadow: '0 0 10px rgba(230, 57, 70, 0.5)' }}
            ></div>
          </div>

          <div className="progress-header">
            <h3>🎨 Animated Series Progress</h3>
            <span>{animatedProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${animatedProgress}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
            ></div>
          </div>
        </section>

        <footer className="dashboard-credit">
          <div className="credit-inner">
            <span className="credit-icon">⚡</span>
            <span className="credit-text">
              Made with <span className="credit-heart">❤️</span> by{' '}
              <strong className="credit-name">Vijay Vardhan</strong>
            </span>
            <span className="credit-icon">⚡</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
