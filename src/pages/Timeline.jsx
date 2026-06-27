import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mcuData } from '../data/mcuData';
import { useMCU } from '../context/MCUContext';
import MediaCard from '../components/MediaCard';
import './Timeline.css';

const Timeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  
  const [sortMethod, setSortMethod] = useState('release'); // 'release' or 'chronological'
  const [filterType, setFilterType] = useState('all'); // 'all', 'movie', 'series'
  const [watchFilter, setWatchFilter] = useState(initialStatus); // 'all', 'watched', 'unwatched'
  
  const { userData } = useMCU();

  // Update URL when filter changes
  useEffect(() => {
    if (watchFilter === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', watchFilter);
    }
    setSearchParams(searchParams, { replace: true });
  }, [watchFilter, searchParams, setSearchParams]);

  const sortedAndFilteredData = useMemo(() => {
    let result = [...mcuData];
    
    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }
    
    // Filter by watched status
    if (watchFilter === 'ignored') {
      result = result.filter(item => item.id === 's9' || item.id === 's14');
    } else if (watchFilter === 'watched') {
      result = result.filter(item => userData[item.id]?.watched && item.id !== 's9' && item.id !== 's14');
    } else if (watchFilter === 'unwatched') {
      result = result.filter(item => !userData[item.id]?.watched && item.id !== 's9' && item.id !== 's14');
    }
    
    // Sort
    if (sortMethod === 'release') {
      result.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    } else {
      result.sort((a, b) => a.timelineOrder - b.timelineOrder);
    }
    
    return result;
  }, [sortMethod, filterType, watchFilter, userData]);

  return (
    <div className="timeline-page">
      <div className="timeline-header">
        <h1 className="page-title animate-fade-in">MCU <span className="text-gradient">Timeline</span></h1>
        
        <div className="controls animate-fade-in delay-1">
          <div className="toggle-group glass-panel">
            <button 
              className={`toggle-btn ${sortMethod === 'release' ? 'active' : ''}`}
              onClick={() => setSortMethod('release')}
            >
              Release Order
            </button>
            <button 
              className={`toggle-btn ${sortMethod === 'chronological' ? 'active' : ''}`}
              onClick={() => setSortMethod('chronological')}
            >
              Chronological
            </button>
          </div>
          
          <div className="filter-group glass-panel">
            <select 
              value={watchFilter} 
              onChange={(e) => setWatchFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="watched">Watched Only</option>
              <option value="unwatched">Unwatched Only</option>
              <option value="ignored">Ignored Shit</option>
            </select>
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Media</option>
              <option value="movie">Movies Only</option>
              <option value="series">Series Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="media-grid">
        {sortedAndFilteredData.map((item, index) => (
          <MediaCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
