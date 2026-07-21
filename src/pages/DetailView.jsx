import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allMediaData } from '../data/allData';
import { useMCU } from '../context/MCUContext';
import { useAuth } from '../context/AuthContext';
import { Star, StarHalf, ArrowLeft, CheckCircle, Clock, Tv, Lock, Calendar, Timer } from 'lucide-react';
import './DetailView.css';

// Countdown timer hook
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

const DetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, updateItem, markWatched, rateItem, setCustomRating } = useMCU();
  const { currentUser } = useAuth();
  
  const item = allMediaData.find(m => m.id === id);
  const itemData = userData[id] || {};
  
  const [review, setReview] = useState(itemData.review || '');
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (!item) navigate('/timeline');
  }, [item, navigate]);

  if (!item) return null;

  const isSeries = item.type === 'series';
  const isWatched = itemData.watched || false;
  const isReleased = new Date(item.releaseDate) <= new Date();

  // Countdown target: use item.premiereTime if available, otherwise releaseDate
  const countdownTarget = item.premiereTime || item.releaseDate;
  const timeLeft = useCountdown(!isReleased ? countdownTarget : null);

  // Dynamic rating logic
  let displayRating = itemData.rating || 0;
  let isReadOnlyRating = false;
  
  if (isSeries && item.episodes?.length > 0) {
    isReadOnlyRating = true;
    const ratedEps = item.episodes.filter(ep => userData[ep.id]?.rating > 0);
    if (ratedEps.length > 0) {
      const sum = ratedEps.reduce((acc, ep) => acc + userData[ep.id].rating, 0);
      displayRating = (sum / ratedEps.length).toFixed(1);
    } else {
      displayRating = 0;
    }
  }

  const handleSaveReview = () => {
    updateItem(id, { review });
  };

  const handleDeleteReview = () => {
    setReview('');
    if (!isSeries) {
      updateItem(id, { review: '', rating: 0 });
    } else {
      updateItem(id, { review: '' });
    }
  };

  const handleSeriesMainRatingClick = (val) => {
    if (!isReadOnlyRating) {
      rateItem(id, val);
    }
  };

  const formatFullDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="detail-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="detail-container glass-panel">
        <div className="detail-header" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {item.imageUrl && (
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              style={{ width: '200px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            />
          )}
          <div style={{ flex: 1 }}>
            <div className="detail-title-section">
              <h1 className="detail-title">{item.title}</h1>
              <div className="detail-meta" style={{ marginBottom: '2rem' }}>
                <span className={`type-badge ${item.type}`}>{item.type}</span>
                {isReleased ? (
                  <span className="meta-item"><Clock size={16}/> {item.runtime} min</span>
                ) : (
                  <span className="meta-item" style={{ color: '#f59e0b' }}>
                    <Calendar size={16}/> {formatFullDate(item.releaseDate)}
                  </span>
                )}
                <span className="meta-item">Release: {new Date(item.releaseDate).getFullYear()}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {item.id === 's14' ? (
                <button 
                  className="btn-primary watch-toggle-btn"
                  disabled
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
                >
                  Not a Marvel Series
                </button>
              ) : !isReleased ? (
                <button 
                  className="btn-primary watch-toggle-btn"
                  disabled
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', cursor: 'not-allowed', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  <Calendar size={20}/> Not Released Yet
                </button>
              ) : (
                <>
                  <button 
                    className={`btn-primary watch-toggle-btn ${isWatched ? 'watched' : ''}`}
                    onClick={() => currentUser ? markWatched(id, !isWatched) : navigate('/login')}
                    style={!currentUser ? { opacity: 0.7 } : {}}
                  >
                    {!currentUser ? <><Lock size={20}/> Login to Track</> : 
                      (item.title.includes('Eww-Hulk') || item.title.includes('niggaheart')) ? 
                        (isWatched ? <><CheckCircle size={20}/> Marked as ignore this shit</> : 'Mark as ignore this shit') :
                        (isWatched ? <><CheckCircle size={20}/> Watched</> : 'Mark as Watched')
                    }
                  </button>

                  {item.watchLink && (
                    <a 
                      href={item.watchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary watch-link-btn"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e50914' }}
                    >
                      <Tv size={20}/> Watch Now
                    </a>
                  )}
                </>
              )}
              {isReleased && currentUser && (
                <div className="custom-ratings-container" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Rank:</span>
                  {['Goated', 'Best', 'Good', 'Ok', 'DogShit'].map(tier => (
                    <button
                      key={tier}
                      className={`custom-tier-btn ${itemData.customRating === tier ? 'active tier-' + tier.toLowerCase() : ''}`}
                      onClick={() => {
                        if (itemData.customRating === tier) {
                          updateItem(id, { customRating: null });
                        } else {
                          setCustomRating(id, tier);
                        }
                      }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="detail-content">

          {/* Countdown Timer for unreleased movies */}
          {!isReleased && timeLeft && (
            <div className="countdown-section glass-panel" style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(239,68,68,0.05))',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Timer size={22} style={{ color: '#f59e0b' }} />
                <h3 style={{ margin: 0, color: '#f59e0b' }}>
                  {item.premiereTime ? 'Premieres In' : 'Releases In'}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    minWidth: '80px'
                  }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f59e0b', lineHeight: 1 }}>
                      {String(value).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '1.5rem', marginBottom: 0 }}>
                🔒 Rating and review will unlock after release
              </p>
            </div>
          )}

          {/* Rating & Review — only for released movies */}
          {isReleased && (
            <>
              <div className="rating-section">
                <h3>{isSeries ? 'Overall Series Rating (Avg)' : 'Your Rating'}</h3>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const currentRating = Number(hoverRating) || Number(displayRating);
                    const isFull = currentRating >= starValue;
                    const isHalf = currentRating >= starValue - 0.5 && currentRating < starValue;
                    
                    return (
                      <div
                        key={starValue}
                        style={{ display: 'inline-flex', cursor: isReadOnlyRating || !currentUser ? 'default' : 'pointer' }}
                        onMouseMove={(e) => {
                          if (!isReadOnlyRating && currentUser) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);
                            setHoverRating(isLeftHalf ? starValue - 0.5 : starValue);
                          }
                        }}
                        onMouseLeave={() => !isReadOnlyRating && currentUser && setHoverRating(0)}
                        onClick={(e) => {
                          if (!currentUser) return navigate('/login');
                          const rect = e.currentTarget.getBoundingClientRect();
                          // Support mobile by checking click coordinates since hover doesn't trigger on touch
                          const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);
                          const clickedRating = isLeftHalf ? starValue - 0.5 : starValue;
                          handleSeriesMainRatingClick(clickedRating);
                        }}
                      >
                        {isHalf ? (
                          <StarHalf 
                            size={32}
                            className={`star filled ${isReadOnlyRating || !currentUser ? 'read-only' : ''}`}
                          />
                        ) : (
                          <Star 
                            size={32}
                            className={`star ${isFull ? 'filled' : ''} ${isReadOnlyRating || !currentUser ? 'read-only' : ''}`}
                          />
                        )}
                      </div>
                    );
                  })}
                  <span className="rating-text">
                    {hoverRating > 0 ? `${hoverRating}/5` : (displayRating > 0 ? `${displayRating}/5` : 'No ratings yet')}
                  </span>
                </div>
                {isSeries && <p className="rating-hint">Series rating is automatically calculated from your episode ratings.</p>}
              </div>

              <div className="review-section">
                <h3>Your Review</h3>
                {!currentUser ? (
                  <div className="login-prompt-box">
                    <Lock size={24} style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }} />
                    <p>Please <span onClick={() => navigate('/login')} style={{ color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}>log in</span> to track activity, rate, and leave reviews.</p>
                  </div>
                ) : (
                  <>
                    <textarea 
                      className="review-input"
                      placeholder="Write your thoughts here..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                    />
                    <div className="review-actions" style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                      {(itemData.review || (!isSeries && itemData.rating > 0)) && (
                        <button className="btn-outline delete-review-btn" onClick={handleDeleteReview} style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}>
                          Delete Review
                        </button>
                      )}
                      <button className="btn-outline save-review-btn" onClick={handleSaveReview} style={{float: 'none'}}>
                        Save Review
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Episode List Section */}
          {isSeries && item.episodes && item.id !== 's14' && isReleased && (
            <div className="episodes-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                <Tv size={28} className="text-primary" /> Episodes
              </h3>
              <div className="episodes-list">
                {item.episodes.map(ep => {
                  const epData = userData[ep.id] || {};
                  const epRating = epData.rating || 0;
                  const epWatched = epData.watched || false;

                  return (
                    <div key={ep.id} className={`episode-item ${epWatched ? 'watched' : ''}`}>
                      <div className="episode-info">
                        <span className="episode-number">Episode {ep.episodeNumber}</span>
                        <h4 className="episode-title">{ep.title}</h4>
                      </div>
                      
                      <div className="episode-actions">
                        <div className="mini-stars">
                          {[1, 2, 3, 4, 5].map((starValue) => {
                            const isFull = epRating >= starValue;
                            const isHalf = epRating >= starValue - 0.5 && epRating < starValue;
                            return (
                              <div
                                key={starValue}
                                style={{ display: 'inline-flex', cursor: !currentUser ? 'default' : 'pointer' }}
                                onClick={(e) => {
                                  if (!currentUser) return navigate('/login');
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);
                                  const clickedRating = isLeftHalf ? starValue - 0.5 : starValue;
                                  rateItem(ep.id, clickedRating === epRating ? 0 : clickedRating);
                                }}
                              >
                                {isHalf ? (
                                  <StarHalf 
                                    size={20}
                                    className={`star filled ${!currentUser ? 'read-only' : ''}`}
                                  />
                                ) : (
                                  <Star 
                                    size={20}
                                    className={`star ${isFull ? 'filled' : ''} ${!currentUser ? 'read-only' : ''}`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <button 
                          className={`ep-watch-btn ${epWatched ? 'watched' : ''}`}
                          onClick={() => currentUser ? markWatched(ep.id, !epWatched) : navigate('/login')}
                          title={!currentUser ? "Login to Track" : epWatched ? "Mark Unwatched" : "Mark Watched"}
                        >
                          {currentUser ? <CheckCircle size={24} /> : <Lock size={20} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
