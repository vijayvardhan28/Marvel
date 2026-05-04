import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Star, PlayCircle } from 'lucide-react';
import { useMCU } from '../context/MCUContext';
import { formatRuntime } from '../data/mcuData';
import './MediaCard.css';

const MediaCard = ({ item, index }) => {
  const { userData, markWatched } = useMCU();
  const itemData = userData[item.id] || {};
  const isWatched = itemData.watched || false;
  
  // Create a consistent glowing gradient background based on item id hash
  const getGradient = (id) => {
    const charCode = id.charCodeAt(id.length - 1);
    if (charCode % 3 === 0) return 'linear-gradient(135deg, #1a0b2e, #4c1d95)'; // Purple/Thanos
    if (charCode % 3 === 1) return 'linear-gradient(135deg, #2e0b10, #991b1b)'; // Red/Marvel
    return 'linear-gradient(135deg, #0f172a, #1e3a8a)'; // Blue/Cap
  };

  const handleWatchToggle = (e) => {
    e.preventDefault();
    markWatched(item.id, !isWatched);
  };

  return (
    <Link to={`/detail/${item.id}`} className="media-card-link animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
      <div className={`media-card ${isWatched ? 'watched' : ''}`}>
        <div className="poster-container" style={{ background: item.imageUrl ? `url(${item.imageUrl}) center/cover no-repeat` : getGradient(item.id) }}>
          {isWatched && <div className="watched-overlay"><CheckCircle size={48} className="text-success" /></div>}
          <div className="poster-content">
            <h3 className="poster-title">{item.title}</h3>
            <span className={`type-badge ${item.type}`}>{item.type}</span>
          </div>
        </div>
        
        <div className="card-info">
          <div className="info-row">
            <span className="info-item"><Clock size={14} /> {formatRuntime(item.runtime)}</span>
            {itemData.rating && <span className="info-item rating"><Star size={14} className="star-filled" /> {itemData.rating}/5</span>}
          </div>
          <div className="card-actions">
            <button 
              className={`watch-btn ${isWatched ? 'is-watched' : ''}`}
              onClick={handleWatchToggle}
            >
              {isWatched ? <><CheckCircle size={16}/> Watched</> : <><PlayCircle size={16}/> Mark Watched</>}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
