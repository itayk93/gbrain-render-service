import React from 'react';
import { MapPin, Link as LinkIcon, FileText, Image as ImageIcon, Download, Eye } from 'lucide-react';

const Profile = () => {
  return (
    <div className="fade-in" style={{ paddingTop: '24px' }}>
      {/* Intro Card */}
      <div className="card">
        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
          <img src="/images/banner.png" alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '0 24px 24px', position: 'relative' }}>
          <div style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: '4px white solid',
            overflow: 'hidden',
            position: 'absolute',
            top: '-80px',
            backgroundColor: '#ddd'
          }}>
            <img src="/images/male.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div style={{ paddingTop: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '24px' }}>Dimi Septuagint</h1>
              <p style={{ fontSize: '16px', marginTop: '4px' }}>PhD Candidate in Ancient Texts at Oxford University</p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> Oxford, United Kingdom</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontWeight: '600' }}><LinkIcon size={14} /> Contact info</span>
              </div>
              <div style={{ marginTop: '12px', color: 'var(--primary-color)', fontWeight: '600', fontSize: '14px' }}>
                532 connections
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary">Open to</button>
              <button className="btn-secondary">Add profile section</button>
              <button style={{ 
                border: '1px solid var(--text-secondary)', 
                color: 'var(--text-secondary)', 
                borderRadius: '50%', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>•••</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginTop: '24px' }}>
        <div>
          {/* About Section */}
          <div className="card" style={{ padding: '24px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>About</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)' }}>
              I am a PhD candidate specializing in the textual history of the Septuagint, with a focus on the Minor Prophets. My research combines traditional philology with digital humanities tools to map the development of Greek translations from the 2nd century BCE to the 4th century CE. 
            </p>
          </div>

          {/* Portfolio Section */}
          <div className="card" style={{ padding: '24px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px' }}>Research Portfolio</h2>
              <button style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '14px' }}>Add document</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <PortfolioItem 
                type="pdf" 
                name="The Lucianic Recension.pdf" 
                size="2.4 MB" 
              />
              <PortfolioItem 
                type="docx" 
                name="Manuscript_Analysis_V2.docx" 
                size="1.1 MB" 
              />
            </div>
          </div>

          {/* Research Gallery */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Research Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <GalleryItem src="/images/billboard.png" label="Fragment 4Q122 Analysis" />
              <div style={{ backgroundColor: '#f3f6f8', borderRadius: '4px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <ImageIcon size={32} />
              </div>
              <div style={{ backgroundColor: '#f3f6f8', borderRadius: '4px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <ImageIcon size={32} />
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Education */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Education</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#edf3f8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                U
              </div>
              <div>
                <h4 style={{ fontSize: '14px' }}>University of Oxford</h4>
                <p style={{ fontSize: '12px' }}>Doctor of Philosophy - PhD, Ancient Texts</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2023 - 2027</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioItem = ({ type, name, size }) => (
  <div style={{ 
    border: '1px solid var(--border-color)', 
    borderRadius: '8px', 
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }}>
    <div style={{ 
      backgroundColor: type === 'pdf' ? '#fdeced' : '#eaf3ff', 
      width: '40px', 
      height: '40px', 
      borderRadius: '4px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: type === 'pdf' ? '#d93025' : '#1a73e8'
    }}>
      <FileText size={20} />
    </div>
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <p style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{size}</p>
    </div>
    <div style={{ display: 'flex', gap: '4px' }}>
      <button style={{ padding: '4px' }}><Eye size={16} color="var(--text-secondary)" /></button>
      <button style={{ padding: '4px' }}><Download size={16} color="var(--text-secondary)" /></button>
    </div>
  </div>
);

const GalleryItem = ({ src, label }) => (
  <div style={{ position: 'relative', cursor: 'pointer' }}>
    <img src={src} alt={label} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
    <div style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      backgroundColor: 'rgba(0,0,0,0.6)', 
      color: 'white', 
      fontSize: '10px', 
      padding: '4px', 
      borderBottomLeftRadius: '4px', 
      borderBottomRightRadius: '4px' 
    }}>
      {label}
    </div>
  </div>
);

export default Profile;
