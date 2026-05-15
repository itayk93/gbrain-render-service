import React from 'react';
import { Info, Plus } from 'lucide-react';

const RightSidebar = () => {
  return (
    <aside style={{ width: '300px' }}>
      <div className="card fade-in" style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px' }}>Network News</h3>
          <Info size={16} color="var(--text-secondary)" />
        </div>
        
        <NewsItem 
          title="New Lexicon Project Launches"
          meta="Top news • 1,240 readers"
        />
        <NewsItem 
          title="Upcoming: LXX Graduate Seminar"
          meta="2d ago • 856 readers"
        />
        <NewsItem 
          title="Grants for Manuscripts Research"
          meta="5d ago • 2,102 readers"
        />
        
        <button style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '14px', 
          fontWeight: '600', 
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          Show more
        </button>
      </div>

      <div className="card fade-in" style={{ marginTop: '8px', padding: '12px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Add to your network</h3>
        
        <Recommendation 
          name="Dr. Michael Strauss"
          role="Professor of Hellenistic Greek"
          avatar="/images/male.png"
        />
        <Recommendation 
          name="Ana Maria Silva"
          role="PhD Researcher, Coimbra"
          avatar="/images/female.png"
        />
        
        <button style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '14px', 
          fontWeight: '600', 
          marginTop: '12px',
          padding: '4px 8px',
          borderRadius: '4px',
          width: '100%',
          textAlign: 'left'
        }}>
          View all recommendations
        </button>
      </div>
    </aside>
  );
};

const NewsItem = ({ title, meta }) => (
  <div style={{ marginBottom: '12px', cursor: 'pointer' }}>
    <h4 style={{ fontSize: '14px', fontWeight: '600' }}>• {title}</h4>
    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '12px' }}>{meta}</p>
  </div>
);

const Recommendation = ({ name, role, avatar }) => (
  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
      <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: 1 }}>
      <h4 style={{ fontSize: '14px' }}>{name}</h4>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{role}</p>
      <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Plus size={14} /> Follow
      </button>
    </div>
  </div>
);

export default RightSidebar;
