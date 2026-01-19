import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import '../styles/InstallPrompt.css';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed prompt before
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      console.log('PWA installed successfully!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    // Clear prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <button 
          className="install-close-btn"
          onClick={handleDismiss}
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <div className="install-icon">
          <div className="logo-icon">⚡</div>
        </div>

        <h3 className="install-title">Install SoozAI</h3>
        <p className="install-description">
          Install our app for a better experience. Access it anytime, even offline!
        </p>

        <div className="install-features">
          <div className="install-feature">
            <span className="feature-icon">⚡</span>
            <span>Fast & Lightweight</span>
          </div>
          <div className="install-feature">
            <span className="feature-icon">📱</span>
            <span>Works Offline</span>
          </div>
          <div className="install-feature">
            <span className="feature-icon">🔒</span>
            <span>Secure & Private</span>
          </div>
        </div>

        <button 
          className="install-button"
          onClick={handleInstallClick}
        >
          <FaDownload />
          Install App
        </button>

        <button 
          className="install-skip-btn"
          onClick={handleDismiss}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;