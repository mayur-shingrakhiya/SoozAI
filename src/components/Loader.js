import React from 'react';
import { FaRobot } from 'react-icons/fa';
import '../styles/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-bubble">
        <div className="loader-avatar">
          <FaRobot className="avatar-icon" />
        </div>
        <div className="loader-content">
          <div className="loader-header">
            <span className="loader-role">SoozAI</span>
          </div>
          <div className="typing-indicator">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
