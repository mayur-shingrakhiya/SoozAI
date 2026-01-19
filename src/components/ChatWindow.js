import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaPaperclip } from 'react-icons/fa';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import '../styles/ChatWindow.css';

const ChatWindow = ({ 
  currentChat, 
  onSendMessage, 
  isLoading,
  streamingMessage,
  onRegenerate,
  onEditMessage
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, streamingMessage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-window">
      {/* Messages Area */}
      <div className="messages-container">
        {!currentChat || currentChat.messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">
              <FaRobot />
            </div>
            <h3>No Conversation</h3>
            <p>There are no chats in your feed</p>
          </div>
        ) : (
          <div className="messages-list">
            {currentChat.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.role === 'user'}
                onRegenerate={() => onRegenerate && onRegenerate(message)}
                onEditMessage={(newText) =>
                  onEditMessage(message.id, newText)
                }
              />
            ))}
            
            {streamingMessage && (
              <MessageBubble
                message={{
                  content: streamingMessage,
                  timestamp: new Date().toISOString()
                }}
                isUser={false}
                isStreaming={true}
              />
            )}
            
            {isLoading && !streamingMessage && <Loader />}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <button 
              type="button" 
              className="attach-btn" 
              title="Attach file"
              disabled={isLoading}
            >
              <FaPaperclip />
            </button>
            <textarea
              ref={textareaRef}
              className="message-input"
              placeholder="Send a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!inputMessage.trim() || isLoading}
            >
              <FaPaperPlane />
            </button>
          </div>
         
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
