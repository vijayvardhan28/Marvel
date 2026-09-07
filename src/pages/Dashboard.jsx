import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMCU } from '../context/MCUContext';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { mcuData, calculateTotalRuntime, formatRuntime } from '../data/mcuData';
import { foxData } from '../data/foxData';
import { animatedData } from '../data/animatedData';
import { defendersData } from '../data/defendersData';
import { raimiSpiderManData, amazingSpiderManData, spiderVerseData, yfnsmData, venomData } from '../data/spiderManData';
import { legacyData } from '../data/legacyData';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, TrendingUp, Copy, Check, Users, UserPlus } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { userData, following, toggleFollow } = useMCU();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  
  const [followingUsers, setFollowingUsers] = React.useState([]);
  const [followerUsers, setFollowerUsers] = React.useState([]);
  const [discoverUsers, setDiscoverUsers] = React.useState([]);
  const [socialTab, setSocialTab] = React.useState('following');

  React.useEffect(() => {
    if (!currentUser) return;
    
    const fetchFollowing = async () => {
      if (!following || following.length === 0) {
        setFollowingUsers([]);
        return;
      }
      const users = [];
      for (const id of following) {
        try {
          const d = await getDoc(doc(db, 'users', id));
          if (d.exists()) {
             users.push({ id, displayName: d.data().displayName || 'Agent', ratedCount: Object.keys(d.data().watchData || {}).length });
          }
        } catch(e) { console.error(e) }
      }
      setFollowingUsers(users);
    };
    
    const fetchFollowers = async () => {
      try {
        const q = query(collection(db, 'users'), where('following', 'array-contains', currentUser.id));
        const snap = await getDocs(q);
        const users = [];
        snap.forEach(d => {
          users.push({ id: d.id, displayName: d.data().displayName || 'Agent', ratedCount: Object.keys(d.data().watchData || {}).length });
        });
        setFollowerUsers(users);
      } catch(e) { console.error(e) }
    };

    const fetchDiscover = async () => {
      try {
        const q = query(collection(db, 'users'), limit(50));
        const snap = await getDocs(q);
        const users = [];
        snap.forEach(d => {
          if (d.id !== currentUser.id) {
            users.push({ id: d.id, displayName: d.data().displayName || 'Agent', ratedCount: Object.keys(d.data().watchData || {}).length });
          }
        });
        setDiscoverUsers(users);
      } catch(e) { console.error(e) }
    };

    fetchFollowing();
    fetchFollowers();
    fetchDiscover();
  }, [following, currentUser]);

  const handleCopyId = () => {
    if (currentUser) {
      navigator.clipboard.writeText(currentUser.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dashboardMcuData = mcuData.filter(item => !item.excludeFromDashboard);
  const spiderManData = [...raimiSpiderManData, ...amazingSpiderManData, ...spiderVerseData, ...yfnsmData, ...venomData];
  const totalRuntime = calculateTotalRuntime([...dashboardMcuData, ...foxData, ...spiderManData, ...animatedData, ...defendersData, ...legacyData]);

  const watchedMcuItems = dashboardMcuData.filter(item => userData[item.id]?.watched);
  const watchedFoxItems = foxData.filter(item => userData[item.id]?.watched);
  const watchedSpiderManItems = spiderManData.filter(item => userData[item.id]?.watched);
  const watchedAnimatedItems = animatedData.filter(item => userData[item.id]?.watched);
  const watchedDefendersItems = defendersData.filter(item => userData[item.id]?.watched);
  const watchedLegacyItems = legacyData.filter(item => userData[item.id]?.watched);
  const allWatchedItems = [...watchedMcuItems, ...watchedFoxItems, ...watchedSpiderManItems, ...watchedAnimatedItems, ...watchedDefendersItems, ...watchedLegacyItems];

  const watchedRuntime = calculateTotalRuntime(allWatchedItems);
  const remainingRuntime = totalRuntime - watchedRuntime;

  const mcuProgress = (calculateTotalRuntime(watchedMcuItems) / calculateTotalRuntime(dashboardMcuData)) * 100 || 0;
  const foxProgress = (calculateTotalRuntime(watchedFoxItems) / calculateTotalRuntime(foxData)) * 100 || 0;
  const spiderManProgress = (calculateTotalRuntime(watchedSpiderManItems) / calculateTotalRuntime(spiderManData)) * 100 || 0;
  const animatedProgress = (calculateTotalRuntime(watchedAnimatedItems) / calculateTotalRuntime(animatedData)) * 100 || 0;
  const defendersProgress = (calculateTotalRuntime(watchedDefendersItems) / calculateTotalRuntime(defendersData)) * 100 || 0;
  const legacyProgress = (calculateTotalRuntime(watchedLegacyItems) / calculateTotalRuntime(legacyData)) * 100 || 0;
  const totalProgress = (watchedRuntime / totalRuntime) * 100 || 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-bg" style={{ backgroundImage: "url('/avengers_hero.png')" }}></div>
      <div className="dashboard animate-fade-in">
        <section className="hero-section avengers-theme">
          <div className="hero-bg" style={{ backgroundImage: "url('/avengers_hero.png')" }}></div>
          <div className="hero-content">
            <h1 className="hero-title"><span className="hero-gradient-avengers">AVENGERS</span> ASSEMBLE</h1>
            <p className="hero-subtitle">Track your progress through the Marvel Cinematic Universe.</p>
            {currentUser && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Share your ratings with friends:</p>
                <button 
                  onClick={handleCopyId}
                  className="glass-panel"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : `Copy My User ID: ${currentUser.id}`}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="stats-container">
          <div
            className="stat-card glass-panel delay-1"
            onClick={() => navigate('/timeline?status=watched')}
            style={{ cursor: 'pointer' }}
            title="View all watched items"
          >
            <div className="stat-icon bg-primary"><CheckCircle size={24} /></div>
            <div className="stat-info">
              <h3>Watched</h3>
              <p className="stat-value">{allWatchedItems.length} <span className="stat-total">/ {dashboardMcuData.length + foxData.length + spiderManData.length + animatedData.length + defendersData.length + legacyData.length}</span></p>
            </div>
          </div>

          <div className="stat-card glass-panel delay-2">
            <div className="stat-icon bg-success"><Clock size={24} /></div>
            <div className="stat-info">
              <h3>Time Watched</h3>
              <p className="stat-value">{formatRuntime(watchedRuntime)}</p>
            </div>
          </div>

          <div className="stat-card glass-panel delay-3">
            <div className="stat-icon bg-warning"><TrendingUp size={24} /></div>
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
            <h3>X-Men Progress</h3>
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
            <h3>The Defenders Saga Progress</h3>
            <span>{defendersProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container" style={{ marginBottom: '2rem' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${defendersProgress}%`, background: 'linear-gradient(90deg, #4ade80, #14532d)', boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}
            ></div>
          </div>

          <div className="progress-header">
            <h3>Animated Series Progress</h3>
            <span>{animatedProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container" style={{ marginBottom: '2rem' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${animatedProgress}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
            ></div>
          </div>

          <div className="progress-header">
            <h3>🦇 Legacy Marvel Progress</h3>
            <span>{legacyProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${legacyProgress}%`, background: 'linear-gradient(90deg, #9ca3af, #4b5563)', boxShadow: '0 0 10px rgba(156, 163, 175, 0.5)' }}
            ></div>
          </div>
        </section>

        {currentUser && (
          <section className="social-section glass-panel delay-3" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <div className="progress-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h3><Users size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }}/> Social Network</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setSocialTab('following')}
                  style={{ background: 'transparent', border: 'none', color: socialTab === 'following' ? 'var(--color-primary)' : 'white', fontWeight: socialTab === 'following' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Following ({followingUsers.length})
                </button>
                <button 
                  onClick={() => setSocialTab('followers')}
                  style={{ background: 'transparent', border: 'none', color: socialTab === 'followers' ? 'var(--color-primary)' : 'white', fontWeight: socialTab === 'followers' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Followers ({followerUsers.length})
                </button>
                <button 
                  onClick={() => setSocialTab('discover')}
                  style={{ background: 'transparent', border: 'none', color: socialTab === 'discover' ? 'var(--color-primary)' : 'white', fontWeight: socialTab === 'discover' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Discover
                </button>
              </div>
            </div>
            
            <div className="social-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(socialTab === 'following' ? followingUsers : socialTab === 'followers' ? followerUsers : discoverUsers).length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
                  {socialTab === 'following' ? "You aren't following anyone yet. Search for a User ID to follow them!" : socialTab === 'followers' ? "You don't have any followers yet." : "No users found."}
                </p>
              ) : (
                (socialTab === 'following' ? followingUsers : socialTab === 'followers' ? followerUsers : discoverUsers).map(user => (
                  <Link to={`/user/${user.id}`} key={user.id} style={{ textDecoration: 'none' }}>
                    <div className="social-user-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', fontWeight: 'bold' }}>
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, color: 'white' }}>{user.displayName}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>#{user.id.substring(0, 8)}...</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>• {user.ratedCount} ratings</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {socialTab === 'discover' && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFollow(user.id);
                            }}
                            style={{
                              background: following.includes(user.id) ? 'rgba(255,255,255,0.1)' : 'var(--color-primary)',
                              border: following.includes(user.id) ? '1px solid rgba(255,255,255,0.2)' : 'none',
                              color: 'white',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.85rem'
                            }}
                          >
                            {following.includes(user.id) ? <Check size={14}/> : <UserPlus size={14}/>}
                            {following.includes(user.id) ? 'Following' : 'Follow'}
                          </button>
                        )}
                        <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                          View Profile
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        )}

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
