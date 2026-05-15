import React from 'react';
import { Search, Home, Users, Briefcase, MessageCircle, Bell, User } from 'lucide-react';

const Navbar = ({ onNavigate, currentPage }) => {
  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '52px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            fontWeight: 'bold',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '18px'
          }}>S</div>
          <div style={{
            backgroundColor: '#edf3f8',
            borderRadius: '4px',
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            height: '34px',
            width: '280px'
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search researchers, CFPs..." 
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '0 8px',
                fontSize: '14px',
                width: '100%'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <NavItem icon={<Home size={20} />} label="Home" active={currentPage === 'home'} onClick={() => onNavigate('home')} />
          <NavItem icon={<Users size={20} />} label="Network" onClick={() => {}} />
          <NavItem icon={<Briefcase size={20} />} label="Directory" active={currentPage === 'directory'} onClick={() => onNavigate('directory')} />
          <NavItem icon={<MessageCircle size={20} />} label="Messaging" onClick={() => {}} />
          <NavItem icon={<Bell size={20} />} label="Notifications" onClick={() => {}} />
          <NavItem icon={<User size={20} />} label="Me" isProfile active={currentPage === 'profile'} onClick={() => onNavigate('profile')} />
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, active, isProfile, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: active ? 'var(--text-main)' : 'var(--text-secondary)',
      cursor: 'pointer',
      fontSize: '12px',
      position: 'relative',
      minWidth: '60px'
    }}>
      <div style={{ marginBottom: '2px' }}>{icon}</div>
      <span>{label}</span>
      {active && (
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          width: '100%',
          height: '2px',
          backgroundColor: 'var(--text-main)'
        }} />
      )}
    </div>
  );
};

export default Navbar;
