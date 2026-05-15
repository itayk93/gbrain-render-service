import React from 'react';
import { Search, Filter, MapPin } from 'lucide-react';

const Directory = () => {
  const researchers = [
    { name: 'Dr. James Aitken', role: 'Professor of Hebrew and Old Testament', institution: 'University of Cambridge', avatar: '/images/male.png', interests: ['Septuagint Lexicography', 'Hellenistic Greek'] },
    { name: 'Dr. Jennifer Dines', role: 'Senior Research Fellow', institution: 'Heythrop College', avatar: '/images/female.png', interests: ['The Septuagint', 'Prophetic Literature'] },
    { name: 'Emanuel Tov', role: 'Professor Emeritus', institution: 'Hebrew University of Jerusalem', avatar: '/images/male.png', interests: ['Dead Sea Scrolls', 'Textual Criticism'] },
    { name: 'Tessa Rajak', role: 'Professor of Ancient History', institution: 'University of Reading', avatar: '/images/female.png', interests: ['Jewish-Greek Literature', 'Josephus'] },
  ];

  return (
    <div className="fade-in" style={{ paddingTop: '24px' }}>
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Researchers Directory</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            flex: 1,
            backgroundColor: '#edf3f8',
            borderRadius: '4px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            height: '40px'
          }}>
            <Search size={20} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search by name, institution, or research focus..." 
              style={{ background: 'transparent', border: 'none', outline: 'none', padding: '0 12px', fontSize: '14px', width: '100%' }}
            />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {researchers.map((r, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px' }}>
              <img src={r.avatar} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{r.name}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>{r.role}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {r.institution}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginBottom: '16px' }}>
              {r.interests.map((tag, j) => (
                <span key={j} style={{ fontSize: '10px', backgroundColor: '#f3f6f8', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <button className="btn-secondary" style={{ width: '100%' }}>Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Directory;
