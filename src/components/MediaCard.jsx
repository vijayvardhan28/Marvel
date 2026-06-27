import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Star, PlayCircle, Calendar } from 'lucide-react';
import { useMCU } from '../context/MCUContext';
import { formatRuntime } from '../data/mcuData';
import './MediaCard.css';

const MediaCard = ({ item, index }) => {
  const { userData, markWatched } = useMCU();
  const itemData = userData[item.id] || {};
  const isWatched = itemData.watched || false;
  const customRating = itemData.customRating;

  const isReleased = new Date(item.releaseDate) <= new Date();

  // Create a consistent glowing gradient background based on item id hash
  const getGradient = (id) => {
    const charCode = id.charCodeAt(id.length - 1);
    if (charCode % 3 === 0) return 'linear-gradient(135deg, #1a0b2e, #4c1d95)';
    if (charCode % 3 === 1) return 'linear-gradient(135deg, #2e0b10, #991b1b)';
    return 'linear-gradient(135deg, #0f172a, #1e3a8a)';
  };

  const handleWatchToggle = (e) => {
    e.preventDefault();
    if (isReleased) markWatched(item.id, !isWatched);
  };

  const formatReleaseDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <Link to={`/detail/${item.id}`} className="media-card-link animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
      <div className={`media-card ${isWatched ? 'watched' : ''} ${!isReleased ? 'unreleased' : ''}`}>
        <div className="poster-container" style={{ background: item.imageUrl ? `url(${item.imageUrl}) center/cover no-repeat` : getGradient(item.id) }}>
          {customRating && isReleased ? (
            <div className="watched-overlay">
              <div className={`rating-stamp stamp-${customRating.toLowerCase()}`}>
                {customRating}
              </div>
            </div>
          ) : (
            isWatched && isReleased && <div className="watched-overlay"><CheckCircle size={48} className="text-success" /></div>
          )}
          {!isReleased && (
            <div className="coming-soon-badge">COMING SOON</div>
          )}
          <div className="poster-content">
            <h3 className="poster-title">{item.title}</h3>
            <span className={`type-badge ${item.type}`}>{item.type}</span>
          </div>
        </div>
        
        <div className="card-info">
          <div className="info-row">
            {isReleased ? (
              <>
                <span className="info-item"><Clock size={14} /> {formatRuntime(item.runtime)}</span>
                {itemData.rating && <span className="info-item rating"><Star size={14} className="star-filled" /> {itemData.rating}/5</span>}
              </>
            ) : (
              <span className="info-item release-date-info"><Calendar size={14} /> {formatReleaseDate(item.releaseDate)}</span>
            )}
          </div>
          <div className="card-actions">
            {isReleased ? (
              <button 
                className={`watch-btn ${isWatched ? 'is-watched' : ''}`}
                onClick={handleWatchToggle}
              >
                {(item.title.includes('Eww-Hulk') || item.title.includes('niggaheart')) ? 
                  (isWatched ? <><CheckCircle size={16}/> Marked as ignore this shit</> : <><PlayCircle size={16}/> Mark as ignore this shit</>) :
                  (isWatched ? <><CheckCircle size={16}/> Watched</> : <><PlayCircle size={16}/> Mark Watched</>)
                }
              </button>
            ) : (
              <button className="watch-btn unreleased-btn" disabled>
                <Calendar size={16}/> Not Released Yet
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
