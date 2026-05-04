import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allMediaData } from '../data/allData';
import { useMCU } from '../context/MCUContext';
import { Star, ArrowLeft, CheckCircle, Clock, Tv } from 'lucide-react';
import './DetailView.css';

const DetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, updateItem, markWatched, rateItem } = useMCU();
  
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
                <span className="meta-item"><Clock size={16}/> {item.runtime} min</span>
                <span className="meta-item">Release: {new Date(item.releaseDate).getFullYear()}</span>
              </div>
            </div>
            
            {item.id === 's14' ? (
              <button 
                className="btn-primary watch-toggle-btn"
                disabled
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
              >
                Not a Marvel Series
              </button>
            ) : (
              <button 
                className={`btn-primary watch-toggle-btn ${isWatched ? 'watched' : ''}`}
                onClick={() => markWatched(id, !isWatched)}
              >
                {isWatched ? <><CheckCircle size={20}/> Watched</> : 'Mark as Watched'}
              </button>
            )}
          </div>
        </div>

        <div className="detail-content">
          <div className="rating-section">
            <h3>{isSeries ? 'Overall Series Rating (Avg)' : 'Your Rating'}</h3>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={32}
                  className={`star ${star <= (hoverRating || displayRating) ? 'filled' : ''} ${isReadOnlyRating ? 'read-only' : ''}`}
                  onMouseEnter={() => !isReadOnlyRating && setHoverRating(star)}
                  onMouseLeave={() => !isReadOnlyRating && setHoverRating(0)}
                  onClick={() => handleSeriesMainRatingClick(star)}
                />
              ))}
              <span className="rating-text">
                {displayRating > 0 ? `${displayRating}/5` : 'No ratings yet'}
              </span>
            </div>
            {isSeries && <p className="rating-hint">Series rating is automatically calculated from your episode ratings.</p>}
          </div>

          <div className="review-section">
            <h3>Your Review</h3>
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
          </div>

          {/* Episode List Section */}
          {isSeries && item.episodes && item.id !== 's14' && (
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
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={20}
                              className={`star ${star <= epRating ? 'filled' : ''}`}
                              onClick={() => rateItem(ep.id, star === epRating ? 0 : star)} // Click again to clear
                            />
                          ))}
                        </div>
                        <button 
                          className={`ep-watch-btn ${epWatched ? 'watched' : ''}`}
                          onClick={() => markWatched(ep.id, !epWatched)}
                          title={epWatched ? "Mark Unwatched" : "Mark Watched"}
                        >
                          <CheckCircle size={24} />
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
