import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../../config/configuration';
import { useApp } from '../../context/AppContext';
import './SchedulerPage.css';

const SchedulerPage = () => {
  const { addToast } = useApp();
  const [scheduledPosts, setScheduledPosts] = useState([]);

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULED_POSTS);
      if (saved) {
        setScheduledPosts(JSON.parse(saved));
      } else {
        setScheduledPosts([]);
      }
    } catch (e) {
      console.error('Failed to load scheduled posts from local storage', e);
    }
  };

  const handleDelete = (idToDelete) => {
    const updatedList = scheduledPosts.filter(post => post.id !== idToDelete);
    setScheduledPosts(updatedList);
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(updatedList));
    addToast('Scheduled post deleted successfully.', 'info');
  };

  return (
    <main className="scheduler-page" id="main-content">
      <div className="scheduler-page__header">
        <h1 className="scheduler-page__title">Content Scheduler</h1>
        <p className="scheduler-page__subtitle">
          Manage your locally mapped scheduled posts.
        </p>
      </div>

      <div className="scheduler-page__content">
        {scheduledPosts.length === 0 ? (
          <div className="scheduler-empty-state">
            <span className="scheduler-empty-icon" aria-hidden="true">📭</span>
            <h2>No scheduled posts</h2>
            <p>Go to the Composer, select a future date, and click Publish to schedule.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {scheduledPosts.map((post) => (
              <div key={post.id} className="scheduler-card card">
                <div className="scheduler-card__header">
                  <div className="scheduler-card__status">
                    <span className="status-dot"></span>
                    Scheduled Post
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDelete(post.id)}
                    aria-label="Delete scheduled post"
                  >
                    Delete Post
                  </button>
                </div>
                
                <div className="scheduler-card__body">
                  <div className="scheduler-card__date">
                    <strong>Scheduled for:</strong> {new Date(post.scheduledDate).toLocaleString()}
                  </div>
                  
                  <div className="scheduler-card__platforms">
                    <strong>Platforms:</strong> 
                    {post.selectedPlatforms?.length > 0 
                      ? post.selectedPlatforms.join(', ').toUpperCase() 
                      : ' None selected'}
                  </div>

                  <div className="scheduler-card__text">
                    {post.content || <em style={{opacity: 0.5}}>No text content</em>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SchedulerPage;
