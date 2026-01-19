# 🎨 SoozAI - Architecture & Flow Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐              ┌──────────────────────────┐   │
│  │   SIDEBAR    │              │     CHAT WINDOW          │   │
│  ├──────────────┤              ├──────────────────────────┤   │
│  │              │              │                          │   │
│  │ 📝 Text      │◄────────────►│  Message Input           │   │
│  │ 🎨 Image     │   Select     │  Message History         │   │
│  │ 💻 Code      │   Tool       │  Streaming Response      │   │
│  │ ✂️ Editor    │              │  Regenerate Button       │   │
│  │ 🎬 Video     │              │                          │   │
│  │ 📧 Email     │              │                          │   │
│  │ 🌐 Website   │              │                          │   │
│  │ ⚡ Custom    │              │                          │   │
│  │              │              │                          │   │
│  │ [+ New Chat] │              │                          │   │
│  │              │              │                          │   │
│  │ Chat History │              │                          │   │
│  │ - Today      │              │                          │   │
│  │ - Yesterday  │              │                          │   │
│  │ - Older      │              │                          │   │
│  └──────────────┘              └──────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT (App.js)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  • chats[]              - All chat conversations               │
│  • currentChatId        - Active chat ID                       │
│  • currentChat          - Active chat object                   │
│  • isLoading            - Loading state                        │
│  • streamingMessage     - Real-time streaming text             │
│                                                                 │
│  Functions:                                                     │
│  • handleNewChat()      - Create blank chat                    │
│  • handleToolSelect()   - Create chat with tool/model ✨NEW    │
│  • handleSendMessage()  - Send message to API                  │
│  • sendMessageToChat()  - Process message with model ✨UPDATED │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (localStorage.js)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Chat Object Structure: ✨UPDATED                               │
│  {                                                              │
│    id: "1234-5678-...",                                         │
│    title: "Chat Title",                                         │
│    createdAt: "2026-01-19T...",                                 │
│    updatedAt: "2026-01-19T...",                                 │
│    messages: [...],                                             │
│    toolId: "code",              ◄── NEW: Tool category          │
│    model: "anthropic/claude..."  ◄── NEW: AI model to use       │
│  }                                                              │
│                                                                 │
│  Functions:                                                     │
│  • createNewChat(title, toolId, model) ✨UPDATED                │
│  • addMessageToChat()                                           │
│  • getChatById()                                                │
│  • getAllChats()                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER (api.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OpenRouter Integration: ✨UPDATED                              │
│                                                                 │
│  sendMessageStreaming(message, history, callbacks, model)       │
│                                          ▲                      │
│                                          │                      │
│                                   Dynamic Model! ✨NEW           │
│                                                                 │
│  Supported Models:                                              │
│  • mistralai/mixtral-8x7b-instruct      (Free)                 │
│  • anthropic/claude-3.5-sonnet          (Paid)                 │
│  • openai/gpt-4-turbo-preview           (Paid)                 │
│  • openai/gpt-4-vision-preview          (Paid)                 │
│  • meta-llama/llama-3-8b-instruct       (Free)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OPENROUTER API                               │
│              https://openrouter.ai/api/v1/                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow: Tool Selection → Chat Creation

```
┌──────────────────────────────────────────────────────────────────┐
│                    USER CLICKS TOOL CATEGORY                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Sidebar.js         │
                    │  onClick handler    │
                    └─────────────────────┘
                              │
                              │ Calls onToolSelect(tool)
                              │
                              ▼
                    ┌─────────────────────┐
                    │  App.js             │
                    │  handleToolSelect() │
                    └─────────────────────┘
                              │
                              │ Extract: tool.id, tool.model
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │  localStorage.js            │
                    │  createNewChat(             │
                    │    null,                    │
                    │    toolId: "code",          │
                    │    model: "claude-sonnet"   │
                    │  )                          │
                    └─────────────────────────────┘
                              │
                              │ Create new chat object
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │  Chat Object Created:       │
                    │  {                          │
                    │    id: "new-uuid",          │
                    │    title: null,             │
                    │    messages: [],            │
                    │    toolId: "code",          │
                    │    model: "claude-sonnet"   │
                    │  }                          │
                    └─────────────────────────────┘
                              │
                              │ Save to localStorage
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Update State       │
                    │  - setChats()       │
                    │  - setCurrentChatId │
                    │  - setCurrentChat   │
                    └─────────────────────┘
                              │
                              │
                              ▼
                    ┌─────────────────────┐
                    │  UI Updates         │
                    │  - New chat shown   │
                    │  - Empty message UI │
                    │  - Ready for input  │
                    └─────────────────────┘
```

---

## 💬 Message Flow: User Types → AI Response

```
┌──────────────────────────────────────────────────────────────────┐
│                    USER TYPES MESSAGE & HITS SEND                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  ChatWindow.js      │
                    │  onSendMessage()    │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  App.js             │
                    │  handleSendMessage()│
                    └─────────────────────┘
                              │
                              │ If no chat: create new
                              │ If chat exists: use existing
                              │
                              ▼
                    ┌─────────────────────┐
                    │  sendMessageToChat()│
                    └─────────────────────┘
                              │
                              │ 1. Add user message to chat
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │  localStorage.js            │
                    │  addMessageToChat()         │
                    │  { role: "user",            │
                    │    content: "..." }         │
                    └─────────────────────────────┘
                              │
                              │ 2. Get chat's model ✨NEW
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │  const chat =               │
                    │    getChatById(chatId)      │
                    │                             │
                    │  const modelToUse =         │
                    │    chat.model ||            │
                    │    "mixtral-default"        │
                    └─────────────────────────────┘
                              │
                              │ 3. Call API with dynamic model
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │  api.js                     │
                    │  sendMessageStreaming(      │
                    │    message,                 │
                    │    history,                 │
                    │    onChunk,                 │
                    │    onComplete,              │
                    │    onError,                 │
                    │    modelToUse  ◄── ✨NEW    │
                    │  )                          │
                    └─────────────────────────────┘
                              │
                              │ 4. Stream to OpenRouter
                              │
                              ▼
        ┌─────────────────────────────────────────────────┐
        │           OpenRouter API                        │
        │  POST /v1/chat/completions                      │
        │  {                                              │
        │    model: "anthropic/claude-3.5-sonnet",        │
        │    messages: [...history, userMessage],         │
        │    stream: true                                 │
        │  }                                              │
        └─────────────────────────────────────────────────┘
                              │
                              │ 5. Streaming response
                              │
                              ▼
                    ┌─────────────────────┐
                    │  onChunk callback   │
                    │  - Update UI        │
                    │  - Show typing...   │
                    └─────────────────────┘
                              │
                              │ 6. Complete response
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │  onComplete callback        │
                    │  - Add AI message to chat   │
                    │  - Save to localStorage     │
                    │  - Update UI                │
                    └─────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Chat Updated       │
                    │  User can reply     │
                    └─────────────────────┘
```

---

## 🎯 Tool Category Structure

```
TOOL_CATEGORIES Array:
│
├── BASE_TOOL_CATEGORIES
│   │
│   ├── 📝 Text Generator
│   │   ├── id: 'text'
│   │   ├── icon: '📝'
│   │   ├── color: '#4ade80'
│   │   └── model: 'mistralai/mixtral-8x7b-instruct' ✨
│   │
│   ├── 🎨 Image Generator
│   │   ├── id: 'image'
│   │   ├── badge: 'BETA'
│   │   └── model: 'openai/gpt-4-vision-preview' ✨
│   │
│   ├── 💻 Code Generator
│   │   ├── id: 'code'
│   │   └── model: 'anthropic/claude-3.5-sonnet' ✨
│   │
│   ├── ✂️ Image Editor
│   ├── 🎬 Video Generator
│   ├── 📧 Email Generator
│   └── 🌐 Website Generator
│
└── CUSTOM_CATEGORIES ✨ NEW
    │
    └── ⚡ Custom Tool
        ├── id: '696db28e-f5c8-8322-a352-a66a085cc5eb'
        ├── icon: '⚡'
        ├── badge: 'NEW'
        ├── color: '#3b82f6'
        └── model: 'anthropic/claude-3.5-sonnet' ✨

Final Array = [...BASE, ...CUSTOM]
```

---

## 🗄️ Data Structure Changes

### Before Implementation:

```javascript
// Chat Object (Old)
{
  id: "chat-123",
  title: "My Chat",
  createdAt: "2026-01-19...",
  updatedAt: "2026-01-19...",
  messages: [...]
  // ❌ No tool metadata
  // ❌ No model info
}
```

### After Implementation:

```javascript
// Chat Object (New) ✨
{
  id: "chat-123",
  title: "My Chat",
  createdAt: "2026-01-19...",
  updatedAt: "2026-01-19...",
  messages: [...],
  toolId: "code",                        // ✅ Tool category
  model: "anthropic/claude-3.5-sonnet"   // ✅ AI model
}
```

---

## 🔀 Model Selection Logic

```
┌─────────────────────────────────────────────────────────────┐
│              WHEN USER SENDS MESSAGE                        │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Get chat from storage │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Does chat have model? │
            └───────────────────────┘
                    │       │
            YES ────┘       └──── NO
            │                      │
            ▼                      ▼
    ┌──────────────┐      ┌──────────────────┐
    │ Use chat     │      │ Use DEFAULT_MODEL│
    │ .model       │      │ (Mixtral)        │
    └──────────────┘      └──────────────────┘
            │                      │
            └──────────┬───────────┘
                       │
                       ▼
            ┌───────────────────────┐
            │  Send to OpenRouter   │
            │  with selected model  │
            └───────────────────────┘
```

---

## 📦 Component Interaction Map

```
┌────────────────────────────────────────────────────────────────┐
│                          App.js                                │
│  (Main Controller)                                             │
│                                                                │
│  State:                          Functions:                   │
│  • chats                         • handleNewChat()            │
│  • currentChatId                 • handleToolSelect() ✨NEW   │
│  • currentChat                   • handleSendMessage()        │
│  • isLoading                     • sendMessageToChat() ✨UPD  │
│                                  • handleSelectChat()         │
└────────────────────────────────────────────────────────────────┘
         │                                    │
         │ Props                              │ Props
         ▼                                    ▼
┌──────────────────────┐           ┌────────────────────────┐
│   Sidebar.js         │           │   ChatWindow.js        │
│                      │           │                        │
│ • Tool Categories ✨ │           │ • Message List         │
│ • Chat History       │           │ • Input Field          │
│ • New Chat Button    │           │ • Send Button          │
│ • Search             │           │ • Regenerate           │
│ • Theme Toggle       │           │                        │
│                      │           │                        │
│ Callbacks:           │           │ Callbacks:             │
│ • onToolSelect ✨    │           │ • onSendMessage        │
│ • onNewChat          │           │ • onRegenerate         │
│ • onSelectChat       │           │ • onEditMessage        │
│ • onDeleteChat       │           │                        │
└──────────────────────┘           └────────────────────────┘
```

---

## 🚦 Feature Flags

```
Features Status:
├── ✅ Dynamic TOOL_CATEGORIES
├── ✅ Custom category support (CUSTOM_CATEGORIES)
├── ✅ Chat-wise tool selection (new chat per tool)
├── ✅ Dynamic model selection per chat
├── ✅ Model stored in chat metadata
├── ✅ API supports dynamic models
├── ✅ Backward compatibility (old chats work)
├── ✅ Tool category click creates new chat
├── ✅ Chat history preserved
└── ✅ Multi-model support via OpenRouter

Backward Compatibility:
├── Old chats without toolId → Still work
├── Old chats without model → Use DEFAULT_MODEL
└── No breaking changes to existing data
```

---

## 🎨 UI Component Hierarchy

```
App
│
├── Sidebar
│   ├── Logo Section
│   ├── New Chat Button
│   ├── Tool Categories ✨ (Clickable → New Chat)
│   │   ├── Text Generator (Mixtral)
│   │   ├── Image Generator (GPT-4V)
│   │   ├── Code Generator (Claude)
│   │   ├── Image Editor (GPT-4V)
│   │   ├── Video Generator (Mixtral)
│   │   ├── Email Generator (Claude)
│   │   ├── Website Generator (Claude)
│   │   └── Custom Tool ✨ (Claude)
│   │
│   ├── Search Bar
│   ├── Chat History
│   │   ├── Today
│   │   ├── Yesterday
│   │   └── Previous 7 Days
│   │
│   └── Footer
│       ├── Settings
│       ├── Theme Toggle (Dark/Light)
│       └── User Profile
│
└── ChatWindow
    ├── Empty State (when no chat)
    ├── Message List
    │   ├── User Messages
    │   └── AI Messages (with model badge ✨)
    │
    ├── Streaming Indicator
    └── Input Section
        ├── Text Input
        └── Send Button
```

---

## 📊 Performance Considerations

```
Optimization Points:

1. localStorage
   ├── Stores entire chat history locally
   ├── Instant load on page refresh
   └── No server needed for chat persistence

2. Streaming
   ├── Real-time response display
   ├── Chunks processed immediately
   └── Better UX than waiting for full response

3. Model Selection
   ├── Per-chat model (no global state conflict)
   ├── Each chat remembers its model
   └── Can run multiple models simultaneously

4. Component Re-renders
   ├── State updates batched in React
   ├── Only affected components re-render
   └── Efficient virtual DOM diffing
```

---

## 🔒 Security Notes

```
Security Measures:

1. API Key
   ├── Stored in .env (not committed)
   ├── Accessed via process.env
   └── Never exposed to client logs

2. OpenRouter Integration
   ├── All requests authenticated
   ├── HTTPS only
   └── X-Title header for tracking

3. Data Privacy
   ├── All chats stored locally (localStorage)
   ├── No cloud sync (unless you add it)
   └── User data never sent to third parties

4. Input Validation
   ├── Message length checks
   ├── API error handling
   └── Graceful fallbacks
```

---

## 🎯 Testing Checklist

```
Manual Testing:

□ Tool Category Selection
  ├── □ Click each category
  ├── □ Verify new chat created
  ├── □ Check correct model assigned
  └── □ Test message sending

□ Model Switching
  ├── □ Create chat with Mixtral (Text)
  ├── □ Create chat with Claude (Code)
  ├── □ Verify different responses
  └── □ Check localStorage has correct model

□ Chat Management
  ├── □ Create multiple chats
  ├── □ Switch between chats
  ├── □ Delete chat
  └── □ Search chats

□ Custom Category
  ├── □ Verify custom slug appears
  ├── □ Click and create chat
  ├── □ Send test message
  └── □ Verify Claude model used

□ Edge Cases
  ├── □ No API key scenario
  ├── □ API error handling
  ├── □ Empty chat list
  ├── □ Very long messages
  └── □ Rapid clicking

□ Mobile Responsive
  ├── □ Sidebar toggle
  ├── □ Tool categories visible
  ├── □ Chat scrolling
  └── □ Input works
```

---

**Created:** January 19, 2026  
**Version:** 1.0  
**Framework:** React + OpenRouter
