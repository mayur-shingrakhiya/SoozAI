import React, { useState } from 'react';
import {
  FaThumbsUp,
  FaThumbsDown,
  FaCopy,
  FaSyncAlt,
 
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/MessageBubble.css';

const MessageBubble = ({
  message,
  isUser,
  isStreaming = false,
  onRegenerate,
  onEditMessage
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    /* ========= USER MESSAGE ========= */
    if (isUser) {
      if (isEditing) {
        return (
          <div className="edit-message-box">
            <div className="edit-container">
              <textarea
                className="edit-textarea"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </div>
            <div className="edit-actions">
              <button
                className="action-btn success"
                title="Save"
                onClick={() => {
                  onEditMessage(editText);
                  setIsEditing(false);
                }}
              >
                <FaCheck />
              </button>
              <button
                className="action-btn danger"
                title="Cancel"
                onClick={() => {
                  setEditText(message.content);
                  setIsEditing(false);
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="message-text-plain">
          {message.content}
           {/* USER ACTIONS */}
            {isUser && !isStreaming && !isEditing && (
                <button
                  className="edit-btn"
                  title="Edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✎
                </button>
              
            )}
          {message.edited && <small className="edited-tag"> (edited)</small>}
        </div>
      );
    }

    /* ========= AI MESSAGE ========= */
    return (
      <ReactMarkdown
        className="message-markdown"
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="code-block-container">
                <div className="code-block-header">
                  <span className="code-language">{match[1]}</span>
                  <button
                    className="copy-code-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(String(children));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>{children}</code>
            );
          }
        }}
      >
        {message.content}
      </ReactMarkdown>
    );
  };

  return (
    <div className={`message-bubble-container ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-bubble">
        <div className={`message-content ${isUser ? 'user-message' : 'assistant-message'}`}>
          <div className="message-text">
            {renderContent()}
            {isStreaming && <span className="typing-cursor">|</span>}
          </div>

          {/* AI ACTIONS */}
          {!isUser && !isStreaming && (
            <div className="message-actions">
              <button className="action-btn"><FaThumbsUp /></button>
              <button className="action-btn"><FaThumbsDown /></button>
              <button className="action-btn" onClick={handleCopy}><FaCopy /></button>
              <button className="action-btn regenerate-btn" onClick={onRegenerate}>
                <FaSyncAlt /> Regenerate
              </button>
            </div>
          )}

         

        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
