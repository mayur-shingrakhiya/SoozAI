import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import * as storage from "./utils/localStorage";
import * as api from "./utils/api";
import "./App.css";
import LoginModal from "./components/LoginModal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "./components/Header";
function App() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    return localStorage.getItem('app-theme') || 'dark';
  });

  useEffect(() => {
    loadChatsFromStorage();
    checkAPIConfiguration();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      const chat = storage.getChatById(currentChatId);
      setCurrentChat(chat);
      setIsMobileSidebarOpen(false);
    } else {
      setCurrentChat(null);
    }
  }, [currentChatId]);

  useEffect(() => {
    // Apply theme class to document body
    document.body.className = theme === 'light' ? 'light-theme' : '';
    // Save theme to localStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const checkAPIConfiguration = () => {
    const isConfigured = api.checkAPIKey();
    setApiKeyConfigured(isConfigured);
    if (!isConfigured) {
      console.warn("⚠️ OpenRouter API key not configured");
    }
  };

  const loadChatsFromStorage = () => {
    const allChats = storage.getAllChats();
    setChats(allChats);

    const currentId = storage.getCurrentChatId();
    if (currentId) {
      setCurrentChatId(currentId);
    } else if (allChats.length > 0) {
      setCurrentChatId(allChats[0].id);
      storage.setCurrentChat(allChats[0].id);
    }
  };

  const handleNewChat = () => {
    const newChat = storage.createNewChat();
    setChats(storage.getAllChats());
    setCurrentChatId(newChat.id);
    setCurrentChat(newChat);
  };

  const handleToolSelect = (tool) => {
    // Create new chat with selected tool's model
    const newChat = storage.createNewChat(null, tool.id, tool.model);
    setChats(storage.getAllChats());
    setCurrentChatId(newChat.id);
    setCurrentChat(newChat);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    storage.setCurrentChat(chatId);
  };

  const handleDeleteChat = async (chatId) => {
    setIsDeleting(true);
    
    // Add delay to show loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    storage.deleteChat(chatId);
    const updatedChats = storage.getAllChats();
    setChats(updatedChats);

    if (chatId === currentChatId) {
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id);
        storage.setCurrentChat(updatedChats[0].id);
      } else {
        setCurrentChatId(null);
        setCurrentChat(null);
      }
    }
    
    setIsDeleting(false);
  };

  const handleSendMessage = async (message) => {
    if (!apiKeyConfigured) {
      alert(
        "⚠️ OpenRouter API key missing!\n\nAdd in .env:\nREACT_APP_OPENROUTER_KEY=or_xxxxx"
      );
      return;
    }

    if (!currentChatId) {
      // Create new chat without title
      const newChat = storage.createNewChat();
      setChats(storage.getAllChats());
      setCurrentChatId(newChat.id);
      setCurrentChat(newChat);

      // Generate title from first message
      generateChatTitle(newChat.id, message);
      sendMessageToChat(newChat.id, message);
    } else {
      // Check if current chat has no title (first message)
      const currentChatData = storage.getChatById(currentChatId);
      if (currentChatData && !currentChatData.title && currentChatData.messages.length === 0) {
        generateChatTitle(currentChatId, message);
      }
      sendMessageToChat(currentChatId, message);
    }
  };

  const sendMessageToChat = async (chatId, message) => {
    storage.addMessageToChat(chatId, {
      role: "user",
      content: message,
    });

    setCurrentChat(storage.getChatById(chatId));
    setChats(storage.getAllChats());
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const chat = storage.getChatById(chatId);
      const history = chat.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Use chat's specific model if available, otherwise use default
      const modelToUse = chat.model || "mistralai/mixtral-8x7b-instruct";

      // Check if this is an image generation model
      const isImageGenModel = modelToUse.includes('image-preview') || modelToUse.includes('imagen');
      const modalities = isImageGenModel ? ['image', 'text'] : null;

      await api.sendMessageStreaming(
        message,
        history.slice(0, -1),
        (chunk, full) => {
          setStreamingMessage(full);
        },
        (full) => {
          storage.addMessageToChat(chatId, {
            role: "assistant",
            content: full,
          });

          setCurrentChat(storage.getChatById(chatId));
          setChats(storage.getAllChats());
          setStreamingMessage("");
          setIsLoading(false);
        },
        (error) => {
          const errorMessage = `❌ ${error.message}`;
          storage.addMessageToChat(chatId, {
            role: "assistant",
            content: errorMessage,
          });

          setCurrentChat(storage.getChatById(chatId));
          setChats(storage.getAllChats());
          setStreamingMessage("");
          setIsLoading(false);
        },
        modelToUse, // Pass the model to use
        modalities // Pass modalities for image generation
      );
    } catch (error) {
      storage.addMessageToChat(chatId, {
        role: "assistant",
        content: `❌ ${error.message}`,
      });

      setCurrentChat(storage.getChatById(chatId));
      setChats(storage.getAllChats());
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  const generateChatTitle = async (chatId, firstMessage) => {
    try {
      console.log("🎯 Generating title for:", firstMessage.substring(0, 50));
      const title = await api.generateChatTitle(firstMessage);
      console.log("✅ Generated title:", title);
      
      if (title && title.length > 0) {
        storage.updateChatTitle(chatId, title);
        setChats(storage.getAllChats());
        const updatedChat = storage.getChatById(chatId);
        if (updatedChat) {
          setCurrentChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("❌ Title generation failed:", error);
      // Fallback: use first 40 chars of message
      const fallback = firstMessage.trim().substring(0, 40);
      const finalTitle = fallback + (firstMessage.length > 40 ? '...' : '');
      storage.updateChatTitle(chatId, finalTitle);
      setChats(storage.getAllChats());
      const updatedChat = storage.getChatById(chatId);
      if (updatedChat) {
        setCurrentChat(updatedChat);
      }
    }
  };

  const handleRegenerate = (message) => {
    if (message.role === "assistant") {
      const msgs = currentChat.messages;
      const index = msgs.findIndex((m) => m.id === message.id);
      if (index > 0) {
        const userMsg = msgs[index - 1];
        if (userMsg.role === "user") {
          const chat = storage.getChatById(currentChatId);
          chat.messages = msgs.slice(0, index);
          storage.saveAllData(storage.getAllData());
          sendMessageToChat(currentChatId, userMsg.content);
        }
      }
    }
  };


  const regenerateFromEditedPrompt = async (chatId, prompt) => {
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const chat = storage.getChatById(chatId);

      const history = chat.messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Use chat's specific model if available
      const modelToUse = chat.model || "mistralai/mixtral-8x7b-instruct";

      // Check if this is an image generation model
      const isImageGenModel = modelToUse.includes('image-preview') || modelToUse.includes('imagen');
      const modalities = isImageGenModel ? ['image', 'text'] : null;

      await api.sendMessageStreaming(
        prompt,
        history.slice(0, -1), // user message already exists
        (chunk, full) => {
          setStreamingMessage(full);
        },
        (full) => {
          storage.addMessageToChat(chatId, {
            role: "assistant",
            content: full,
          });

          setCurrentChat(storage.getChatById(chatId));
          setChats(storage.getAllChats());
          setStreamingMessage("");
          setIsLoading(false);
        },
        (error) => {
          storage.addMessageToChat(chatId, {
            role: "assistant",
            content: `❌ ${error.message}`,
          });

          setCurrentChat(storage.getChatById(chatId));
          setChats(storage.getAllChats());
          setStreamingMessage("");
          setIsLoading(false);
        },
        modelToUse, // Pass the model to use
        modalities // Pass modalities for image generation
      );
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    if (!currentChatId) return;

    // 1️⃣ Update edited message & trim chat
    const updatedUserMsg = storage.updateMessageAndTrimChat(
      currentChatId,
      messageId,
      newText
    );

    if (!updatedUserMsg) return;

    // 2️⃣ Update UI immediately
    const updatedChat = storage.getChatById(currentChatId);
    setCurrentChat(updatedChat);
    setChats(storage.getAllChats());

    // 3️⃣ Regenerate AI ONLY (no new user message)
    regenerateFromEditedPrompt(currentChatId, updatedUserMsg.content);
  };
  const [showLogin, setShowLogin] = useState(false);



  return (
     <GoogleOAuthProvider clientId="215817926927-9f123rfa1u1j8ripjrl7j2pkcke2gn70.apps.googleusercontent.com">
      <div className="app">
        
        {/* Full Screen Delete Loader */}
        {isDeleting && (
          <div className="full-screen-loader">
            <div className="loader-spinner"></div>
            <p className="loader-text">Deleting chat...</p>
          </div>
        )}

        {!apiKeyConfigured && (
          <div className="alert api-key-alert">
            <strong>⚠️ OpenRouter API key missing!</strong>
            Add in .env → <code>REACT_APP_OPENROUTER_KEY=or_xxxxx</code>
          </div>
        )}

        <div className="app-container">

          <Header
            chats={chats}
            currentChatId={currentChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            isMobileOpen={isMobileSidebarOpen}
            onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onToggleLogin={() => setShowLogin(!showLogin)}
            onToggleLoginClose={() => setShowLogin(false)}
            theme={theme}
            onThemeChange={handleThemeChange}
            isDeleting={isDeleting}
            onToolSelect={handleToolSelect}
          />

          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            isMobileOpen={isMobileSidebarOpen}
            onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            onToggleLogin={() => setShowLogin(!showLogin)}
            onToggleLoginClose={() => setShowLogin(false)}
            theme={theme}
            onThemeChange={handleThemeChange}
            isDeleting={isDeleting}
            onToolSelect={handleToolSelect}
          />

          <ChatWindow
            currentChat={currentChat}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            streamingMessage={streamingMessage}
            onRegenerate={handleRegenerate}
            onEditMessage={handleEditMessage}
          />

          <LoginModal
          open={showLogin}
          onClose={() => setShowLogin(false)}
        />
        </div>
      </div>
     </GoogleOAuthProvider>
  );
}

export default App;