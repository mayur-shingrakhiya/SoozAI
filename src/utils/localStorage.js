const STORAGE_KEY = 'soozai_chat_data';

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getAllData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return initializeStorage();
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return initializeStorage();
  }
};

export const initializeStorage = () => {
  const initialData = {
    chats: [],
    currentChatId: null,
    settings: { theme: 'dark', streamingEnabled: true }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const saveAllData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

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
    title: title,  // null initially - will be set after first message
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    toolId: toolId,  // Track which tool category this chat belongs to
    model: model     // Track which model to use for this chat
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

  // remove assistant messages after edited user message
  chat.messages = chat.messages.slice(0, index + 1);

  chat.updatedAt = new Date().toISOString();
  saveAllData(data);

  return chat.messages[index];
};


// 👇 Add this at the bottom

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
  updateMessageAndTrimChat
};

export default storage;