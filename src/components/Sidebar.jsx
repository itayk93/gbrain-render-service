import React from 'react';
import { Bookmark, Plus } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside style={{ width: '225px' }}>
      <div className="card fade-in" style={{ paddingBottom: '12px' }}>
        <div style={{
          height: '56px',
          background: 'linear-gradient(to right, #a0b1c5, #d9e2ec)',
          borderBottom: '1px solid var(--border-color)'
        }} />
        <div style={{
          marginTop: '-32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 12px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '2px white solid',
            overflow: 'hidden',
            backgroundColor: '#ddd'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <h3 style={{ marginTop: '12px', fontSize: '16px' }}>Dimi Septuagint</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '4px' }}>
            PhD Candidate in Ancient Texts at Oxford University
          </p>
        </div>
        
        <div style={{
          marginTop: '16px',
          padding: '12px 0',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div className="sidebar-link">
            <span className="sidebar-label">Profile viewers</span>
            <span className="sidebar-value">42</span>
          </div>
          <div className="sidebar-link">
            <span className="sidebar-label">Post impressions</span>
            <span className="sidebar-value">1,204</span>
          </div>
        </div>

        <div className="sidebar-link" style={{ padding: '12px' }}>
          <Bookmark size={16} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
          <span style={{ fontSize: '12px', fontWeight: '600' }}>My Items</span>
        </div>
      </div>

      <div className="card fade-in" style={{ padding: '12px', marginTop: '8px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Recent</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>
          <span>#septuagint</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
          <span>#ancient-greek</span>
        </div>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          justify-content: space-between;
          padding: 4px 12px;
          cursor: pointer;
        }
        .sidebar-link:hover {
          background-color: rgba(0,0,0,0.05);
        }
        .sidebar-label {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .sidebar-value {
          font-size: 12px;
          color: var(--primary-color);
          font-weight: 600;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
