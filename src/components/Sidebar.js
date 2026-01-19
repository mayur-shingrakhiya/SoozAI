import React, { useState } from 'react';
import { FaPlus, FaTrash, FaComments,  FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import '../styles/Sidebar.css';

// Base categories



// Merge all categories

const Sidebar = ({ 
  chats, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  isMobileOpen,
  onToggleMobile,
  onToggleLogin,
  onToggleLoginClose,
  theme,
  onThemeChange,
  isDeleting,
  onToolSelect // NEW: callback for tool category selection
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    if (deleteConfirm === chatId) {
      await onDeleteChat(chatId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(chatId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return 'Previous 7 Days';
    return 'November';
  };

  const groupedChats = chats.reduce((groups, chat) => {
    // Skip chats without titles (newly created, no messages yet)
    if (!chat.title) return groups;
    
    const date = formatDate(chat.updatedAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(chat);
    return groups;
  }, {});

  const filteredChats = searchQuery
    ? chats.filter(chat => chat.title && chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats.filter(chat => chat.title); // Only show chats with titles

  return (
    <>
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={onToggleMobile}></div>
      )}

      <div className={`sidebar ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src='../../image/16x16.png' alt='logo' width={64} height={64} />
            <span className="logo-text">SoozAI</span>
          </div>
          <button 
            className="sidebar-close-btn d-md-none"
            onClick={onToggleMobile}
          >
            <FaTimes />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="sidebar-actions">
          <button 
            className="new-chat-btn"
            onClick={onNewChat}
          >
            <FaPlus /> NEW CHAT
          </button>
        </div>

        {/* Tool Categories */}
        

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Chat History */}
        <div className="sidebar-content">
          {filteredChats.length === 0 ? (
            <div className="no-chats">
              <FaComments className="no-chats-icon" />
              <p>No chats yet</p>
              <small>Start a new conversation</small>
            </div>
          ) : (
            <div className="chat-history">
              {Object.entries(groupedChats).map(([date, dateChats]) => (
                <div key={date} className="chat-group">
                  <div className="chat-group-header">{date}</div>
                  {dateChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                      onClick={() => !isDeleting && onSelectChat(chat.id)}
                      style={{ 
                        pointerEvents: isDeleting ? 'none' : 'auto',
                        opacity: isDeleting ? 0.6 : 1
                      }}
                    >
                      <div className="chat-item-content">
                        <FaComments className="chat-item-icon" />
                        <span className="chat-item-title">{chat.title}</span>
                      </div>
                      <button
                        className={`chat-delete-btn ${
                          deleteConfirm === chat.id ? 'confirm-delete' : ''
                        }`}
                        onClick={(e) => handleDelete(chat.id, e)}
                        title={deleteConfirm === chat.id ? 'Click again to confirm' : 'Delete chat'}
                        disabled={isDeleting}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="setting-section">
            <button className="setting-btn">
              <span className="setting-icon">⚙️</span>
              <span>Setting</span>
              <FaPlus />
            </button>
          </div>
          
          <div className="theme-toggle">
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              <FaMoon /> Dark
            </button>
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              <FaSun /> Light
            </button>
          </div>

          <div className="user-profile" onClick={onToggleLogin}>
            <div className="user-avatar">👤</div>
            <span className="user-name">Login Here</span>
          </div>
        </div>
      </div>

    </>
  );
};

export default Sidebar;