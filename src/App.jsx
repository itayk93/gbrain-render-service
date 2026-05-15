import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Billboard from './components/Billboard';
import RightSidebar from './components/RightSidebar';
import Directory from './pages/Directory';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div className="grid-layout">
            <Sidebar />
            <Billboard />
            <RightSidebar />
          </div>
        );
      case 'directory':
        return <Directory />;
      case 'profile':
        return <Profile />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="app">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="container">
        {renderPage()}
      </div>
      
      {/* Messaging Dock Placeholder */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        right: '24px',
        width: '280px',
        height: '48px',
        backgroundColor: 'white',
        border: '1px solid var(--border-color)',
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        justifyContent: 'space-between',
        cursor: 'pointer',
        zIndex: 200
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
            <img src="/images/male.png" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Messaging</span>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>•••</div>
      </div>
    </div>
  );
}

export default App;
