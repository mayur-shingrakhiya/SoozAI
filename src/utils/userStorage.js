// User-specific storage utility
// This replaces localStorage with user-wise data management

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get storage key for current user
const getUserStorageKey = (userId) => {
  return `soozai_user_data_${userId}`;
};

// Get current user ID from auth
const getCurrentUserId = () => {
  try {
    const currentUser = localStorage.getItem('soozai_current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
};

// Get all data for current user
export const getAllData = () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      return initializeStorage(null);
    }

    const storageKey = getUserStorageKey(userId);
    const data = localStorage.getItem(storageKey);
    
    if (!data) {
      return initializeStorage(userId);
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user data:', error);
    return initializeStorage(getCurrentUserId());
  }
};

// Initialize storage for a user
export const initializeStorage = (userId) => {
  const initialData = {
    userId: userId,
    chats: [],
    currentChatId: null,
    settings: { 
      theme: 'dark', 
      streamingEnabled: true 
    },
    profile: {
      preferences: {},
      lastActive: new Date().toISOString()
    }
  };

  if (userId) {
    const storageKey = getUserStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify(initialData));
  }
  
  return initialData;
};

// Save all data for current user
export const saveAllData = (data) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.warn('No user logged in, cannot save data');
      return false;
    }

    const storageKey = getUserStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Export user data to text file
export const exportUserDataToFile = () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) return null;

    const userData = getAllData();
    const currentUser = JSON.parse(localStorage.getItem('soozai_current_user'));

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        provider: currentUser.provider
      },
      data: userData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soozai_backup_${currentUser.email}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return false;
  }
};

// Import user data from text file
export const importUserDataFromFile = (fileContent) => {
  try {
    const importedData = JSON.parse(fileContent);
    
    if (!importedData.data || !importedData.user) {
      throw new Error('Invalid data format');
    }

    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('No user logged in');
    }

    // Merge imported data with existing data
    const currentData = getAllData();
    const mergedData = {
      ...currentData,
      chats: [...currentData.chats, ...importedData.data.chats],
      settings: { ...currentData.settings, ...importedData.data.settings }
    };

    saveAllData(mergedData);
    return true;
  } catch (error) {
    console.error('Error importing user data:', error);
    return false;
  }
};

// Chat operations
export const getAllChats = () => {
  const data = getAllData();
  return data.chats || [];
};

export const getChatById = (chatId) => {
  const data = getAllData();
  return data.chats.find(chat => chat.id === chatId) || null;
};

export const createNewChat = (title = null, toolId = null, model = null) => {
  const data = getAllData();
  const newChat = {
    id: generateId(),
    title: title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    toolId: toolId,
    model: model
  };
  
  data.chats.unshift(newChat);
  data.currentChatId = newChat.id;
  saveAllData(data);
  
  return newChat;
};

export const updateChatTitle = (chatId, newTitle) => {
  const data = getAllData();
  const chatIndex = data.chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex !== -1) {
    data.chats[chatIndex].title = newTitle;
    data.chats[chatIndex].updatedAt = new Date().toISOString();
    saveAllData(data);
    return true;
  }
  return false;
};

export const addMessageToChat = (chatId, message) => {
  const data = getAllData();
  const chatIndex = data.chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex !== -1) {
    const newMessage = {
      id: generateId(),
      role: message.role,
      content: message.content,
      timestamp: new Date().toISOString()
    };
    
    data.chats[chatIndex].messages.push(newMessage);
    data.chats[chatIndex].updatedAt = new Date().toISOString();
    saveAllData(data);
    
    return newMessage;
  }
  return null;
};

export const deleteChat = (chatId) => {
  const data = getAllData();
  data.chats = data.chats.filter(chat => chat.id !== chatId);
  
  if (data.currentChatId === chatId) {
    data.currentChatId = data.chats.length > 0 ? data.chats[0].id : null;
  }
  
  saveAllData(data);
  return true;
};

export const setCurrentChat = (chatId) => {
  const data = getAllData();
  data.currentChatId = chatId;
  saveAllData(data);
  return true;
};

export const getCurrentChatId = () => {
  const data = getAllData();
  return data.currentChatId;
};

export const getCurrentChat = () => {
  const data = getAllData();
  if (!data.currentChatId) return null;
  return data.chats.find(chat => chat.id === data.currentChatId) || null;
};

export const clearAllChats = () => {
  const data = getAllData();
  data.chats = [];
  data.currentChatId = null;
  saveAllData(data);
  return true;
};

export const updateMessageInChat = (chatId, messageId, newContent) => {
  const data = getAllData();
  const chat = data.chats.find(c => c.id === chatId);

  if (!chat) return false;

  const msgIndex = chat.messages.findIndex(m => m.id === messageId);
  if (msgIndex === -1) return false;

  chat.messages[msgIndex].content = newContent;
  chat.messages[msgIndex].edited = true;
  chat.updatedAt = new Date().toISOString();

  saveAllData(data);
  return true;
};

export const updateMessageAndTrimChat = (chatId, messageId, newContent) => {
  const data = getAllData();
  const chat = data.chats.find(c => c.id === chatId);
  if (!chat) return null;

  const index = chat.messages.findIndex(m => m.id === messageId);
  if (index === -1) return null;

  chat.messages[index].content = newContent;
  chat.messages[index].edited = true;

  // Remove assistant messages after edited user message
  chat.messages = chat.messages.slice(0, index + 1);

  chat.updatedAt = new Date().toISOString();
  saveAllData(data);

  return chat.messages[index];
};

const storage = {
  generateId,
  getAllData,
  initializeStorage,
  saveAllData,
  getAllChats,
  getChatById,
  createNewChat,
  updateChatTitle,
  addMessageToChat,
  deleteChat,
  setCurrentChat,
  getCurrentChatId,
  getCurrentChat,
  clearAllChats,
  updateMessageInChat,
  updateMessageAndTrimChat,
  exportUserDataToFile,
  importUserDataFromFile
};

export default storage;
