import React from 'react';
import {  FaPen, FaMoon, FaSun } from 'react-icons/fa';
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";

import '../styles/Header.css';

const Header = ({ 
  isMobileOpen,
  onToggleMobile,
  onNewChat,
  theme,
  onThemeChange
}) => {
  return (
    <header className="mobile-header">
      <div className="mobile-header-content">
        {/* Left: Menu Button */}
        <div className='d-flex'>
          <button 
            className="mobile-menu-btn"
            onClick={onToggleMobile}
            aria-label="Toggle Menu"
          >
            <HiOutlineBars3BottomLeft/>
          </button>

          {/* Center: Logo */}
          <div className="mobile-logo">
            <span className="logo-text">SoozAI</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="mobile-actions">
          <button 
            className="mobile-action-btn"
            onClick={onNewChat}
            aria-label="New Chat"
          >
            <FaPen />
          </button>

          <button 
            className="mobile-action-btn theme-toggle-btn"
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
         
        </div>
      </div>
    </header>
  );
};

export default Header;