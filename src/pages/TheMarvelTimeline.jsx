import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { allMediaData } from '../data/allData';
import { useMCU } from '../context/MCUContext';
import MediaCard from '../components/MediaCard';
import './Timeline.css';

const TheMarvelTimeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  
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
    let result = [...allMediaData];
    
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
    
    // Sort strictly by release order
    result.sort((a, b) => {
      if (!a.releaseDate) return 1;
      if (!b.releaseDate) return -1;
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    });
    
    return result;
  }, [filterType, watchFilter, userData]);

  return (
    <div className="timeline-page">
      <div className="timeline-header">
        <h1 className="page-title animate-fade-in">The <span className="text-gradient">Marvel</span></h1>
        
        <div className="controls animate-fade-in delay-1">
          <div className="toggle-group glass-panel">
            <button className="toggle-btn active" style={{cursor: 'default'}}>
              Release Order
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
              <option value="ignored">Ignored</option>
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

export default TheMarvelTimeline;
