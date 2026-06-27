import React, { useState, useMemo } from 'react';
import { raimiSpiderManData, amazingSpiderManData, spiderVerseData, yfnsmData } from '../data/spiderManData';
import { useMCU } from '../context/MCUContext';
import MediaCard from '../components/MediaCard';
import './Timeline.css';
import './SpiderManTimeline.css';

const SpiderManTimeline = () => {
  const [watchFilter, setWatchFilter] = useState('all');
  const { userData } = useMCU();

  const filterData = (data) => {
    let result = [...data];
    if (watchFilter === 'ignored') {
      result = result.filter(item => item.id === 's9' || item.id === 's14');
    } else {
      result = result.filter(item => item.id !== 's9' && item.id !== 's14');
      if (watchFilter === 'watched') {
        result = result.filter(item => userData[item.id]?.watched);
      } else if (watchFilter === 'unwatched') {
        result = result.filter(item => !userData[item.id]?.watched);
      }
    }
    return result;
  };

  const raimiFiltered    = useMemo(() => filterData([...raimiSpiderManData].sort((a, b) => a.timelineOrder - b.timelineOrder)), [watchFilter, userData]);
  const amazingFiltered  = useMemo(() => filterData([...amazingSpiderManData].sort((a, b) => a.timelineOrder - b.timelineOrder)), [watchFilter, userData]);
  const verseFiltered    = useMemo(() => filterData([...spiderVerseData].sort((a, b) => a.timelineOrder - b.timelineOrder)), [watchFilter, userData]);
  const yfnsmFiltered    = useMemo(() => filterData([...yfnsmData]), [watchFilter, userData]);

  const Section = ({ children, badge, badgeClass, years, delay }) => (
    <div className={`spiderman-section animate-fade-in ${delay}`}>
      <div className="section-header">
        <div className="section-header-line" />
        <div className="section-header-content">
          <span className={`section-badge ${badgeClass}`}>{badge}</span>
          <span className="section-years">{years}</span>
        </div>
        <div className="section-header-line" />
      </div>
      {children}
    </div>
  );

  const Grid = ({ items }) =>
    items.length > 0 ? (
      <div className="media-grid">
        {items.map((item, index) => <MediaCard key={item.id} item={item} index={index} />)}
      </div>
    ) : (
      <p className="no-results">No movies match the current filter.</p>
    );

  return (
    <div className="timeline-page">
      <div className="timeline-header">
        <h1 className="page-title animate-fade-in">
          Spider-Man <span className="spiderman-gradient">Universe</span>
        </h1>

        <div className="controls animate-fade-in delay-1">
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
          </div>
        </div>
      </div>

      {/* Sam Raimi Trilogy */}
      <Section badge="Sam Raimi Trilogy" badgeClass="raimi-badge" years="2002 – 2007" delay="delay-1">
        <Grid items={raimiFiltered} />
      </Section>

      {/* The Amazing Spider-Man */}
      <Section badge="The Amazing Spider-Man" badgeClass="amazing-badge" years="2012 – 2014" delay="delay-2">
        <Grid items={amazingFiltered} />
      </Section>

      {/* Spider-Verse */}
      <Section badge="🕷 Spider-Verse" badgeClass="verse-badge" years="2018 – Present" delay="delay-3">
        <Grid items={verseFiltered} />
      </Section>

      {/* Your Friendly Neighborhood Spider-Man */}
      <Section badge="Your Friendly Neighborhood Spider-Man" badgeClass="yfnsm-badge" years="2025 – Present" delay="delay-4">
        <Grid items={yfnsmFiltered} />
      </Section>
    </div>
  );
};

export default SpiderManTimeline;
