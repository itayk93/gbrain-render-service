import React from 'react';
import { Calendar, MapPin, Send, Share2, MessageSquare, ThumbsUp } from 'lucide-react';

const Billboard = () => {
  return (
    <main style={{ flex: 1 }}>
      {/* Create Post placeholder */}
      <div className="card fade-in" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
            <img src="/images/male.png" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <button style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '35px',
            textAlign: 'left',
            padding: '0 16px',
            color: 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Share a research update, CFP or manuscript find...
          </button>
        </div>
      </div>

      {/* Featured Billboard Post */}
      <div className="card fade-in" style={{ marginTop: '8px' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>FEATURED CALL FOR PAPERS</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Deadline: Oct 15, 2026</span>
        </div>
        <img src="/images/billboard.png" alt="Billboard" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Septuagint & Digital Humanities: New Perspectives</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            International Conference at the University of Oxford. We are looking for submissions focusing on computational linguistics applied to the Greek Old Testament.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} /> Oxford, UK
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> Dec 10-12, 2026
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: '16px', width: '100%' }}>Submit Abstract</button>
        </div>
      </div>

      {/* Regular Feed Item */}
      <FeedItem 
        author="Prof. Sarah Jenkins"
        title="Senior Research Fellow at Cambridge"
        avatar="/images/female.png"
        content="Excited to share that my latest paper on 'The Hesychian Recension and its Influence' has been published in the Journal of Septuagint and Cognate Studies!"
        time="2h • Edited"
      />
    </main>
  );
};

const FeedItem = ({ author, title, avatar, content, time }) => {
  return (
    <div className="card fade-in" style={{ marginTop: '8px', padding: '12px 0' }}>
      <div style={{ padding: '0 16px', display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
          <img src={avatar} alt={author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h4 style={{ fontSize: '14px' }}>{author}</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{title}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{time}</p>
        </div>
      </div>
      <div style={{ padding: '0 16px', fontSize: '14px', marginBottom: '12px' }}>
        {content}
      </div>
      <div style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '4px 12px', 
        display: 'flex', 
        gap: '8px' 
      }}>
        <FeedAction icon={<ThumbsUp size={18} />} label="Like" />
        <FeedAction icon={<MessageSquare size={18} />} label="Comment" />
        <FeedAction icon={<Share2 size={18} />} label="Repost" />
        <FeedAction icon={<Send size={18} />} label="Send" />
      </div>
    </div>
  );
};

const FeedAction = ({ icon, label }) => (
  <button style={{
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '14px',
    borderRadius: '4px'
  }} className="feed-action-btn">
    {icon}
    <span>{label}</span>
  </button>
);

export default Billboard;
