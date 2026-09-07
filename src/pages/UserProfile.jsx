import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MediaCard from '../components/MediaCard';
import { useAuth } from '../context/AuthContext';
import { useMCU } from '../context/MCUContext';
import { UserPlus, UserMinus } from 'lucide-react';

// Import all data sources
import { mcuData } from '../data/mcuData';
import { foxData } from '../data/foxData';
import { animatedData } from '../data/animatedData';
import { defendersData } from '../data/defendersData';
import { raimiSpiderManData, amazingSpiderManData, spiderVerseData, yfnsmData, venomData } from '../data/spiderManData';
import { legacyData } from '../data/legacyData';

import './Timeline.css'; // Reuse timeline styles for the grid

const UserProfile = () => {
  const { searchId } = useParams();
  const { currentUser } = useAuth();
  const { following, toggleFollow } = useMCU();
  
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [fetchedDisplayName, setFetchedDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const userDocRef = doc(db, 'users', searchId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFetchedUserData(data.watchData || {});
          setFetchedDisplayName(data.displayName || 'Anonymous Agent');
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError('Error fetching user data or you do not have permission.');
      } finally {
        setLoading(false);
      }
    };

    if (searchId) {
      fetchUser();
    }
  }, [searchId]);

  if (loading) {
    return (
      <div className="timeline-page">
        <div className="timeline-header glass-panel">
          <h1>Loading User Profile...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-page">
        <div className="timeline-header glass-panel">
          <h1>{error}</h1>
          <p>Please make sure the User ID is correct and that the user has allowed their profile to be viewed.</p>
        </div>
      </div>
    );
  }

  // Combine all movies to check which ones the user has rated
  const allMovies = [
    ...mcuData,
    ...foxData,
    ...animatedData,
    ...defendersData,
    ...raimiSpiderManData,
    ...amazingSpiderManData,
    ...spiderVerseData,
    ...yfnsmData,
    ...venomData,
    ...legacyData
  ];

  const ratedMovies = allMovies.filter(item => {
    const itemData = fetchedUserData[item.id];
    
    let hasEpisodeActivity = false;
    if (item.type === 'series' && item.episodes) {
      hasEpisodeActivity = item.episodes.some(ep => {
        const epData = fetchedUserData[ep.id];
        return epData && (epData.rating > 0 || epData.watched);
      });
    }

    if (!itemData && !hasEpisodeActivity) return false;
    return (itemData && (itemData.watched || itemData.rating > 0 || itemData.customRating)) || hasEpisodeActivity;
  });

  // Sort them so highly rated ones appear first, or just sort by release date
  // Let's sort by release date for now
  ratedMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  const isFollowing = following.includes(searchId);
  const isOwnProfile = currentUser && currentUser.id === searchId;

  return (
    <div className="timeline-page">
      <div className="timeline-page-bg" style={{ backgroundImage: "url('/avengers_hero.png')" }}></div>
      <div className="timeline-container animate-fade-in">
        <div className="timeline-header glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{fetchedDisplayName}'s Profile</h1>
            <p>Displaying {ratedMovies.length} items rated by user ID: {searchId}</p>
          </div>
          
          {currentUser && !isOwnProfile && (
            <button 
              onClick={() => toggleFollow(searchId)}
              className="watch-btn"
              style={{ 
                background: isFollowing ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-primary)',
                border: isFollowing ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                minWidth: '120px',
                justifyContent: 'center'
              }}
            >
              {isFollowing ? (
                <><UserMinus size={18}/> Unfollow</>
              ) : (
                <><UserPlus size={18}/> Follow</>
              )}
            </button>
          )}
        </div>

        {ratedMovies.length > 0 ? (
          <div className="media-grid">
            {ratedMovies.map((item, index) => (
              <MediaCard 
                key={item.id} 
                item={item} 
                index={index} 
                readOnly={true} 
                customUserData={fetchedUserData}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>No ratings found</h2>
            <p>This user hasn't rated any movies or TV shows yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
