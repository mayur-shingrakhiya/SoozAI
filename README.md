# SoozAI Chat Application 🚀

A production-ready, ChatGPT-like web application with **direct Gemini API integration** (no backend required!). Features a stunning dark UI inspired by SoozAI.

![Version](https://img.shields.io/badge/version-2.0.0-purple.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)

## ✨ Features

### 🎨 **SoozAI-Style Dark UI**

- Beautiful dark theme (#1a1b26 background)
- Purple accent colors (#4DA9B3)
- Tool categories sidebar (Text, Image, Code, etc.)
- Professional ChatGPT-inspired layout

### 🤖 **Direct Gemini API Integration**

- ✅ **No backend required!**
- Frontend calls Google Gemini API directly
- Streaming responses with typing effect
- Conversation context management

### 💬 **Advanced Chat Features**

- Multiple conversations
- Auto-generated smart titles
- Chat history with date grouping
- Message actions (Like, Dislike, Copy, Regenerate)
- LocalStorage persistence

### 💻 **Code Highlighting**

- Syntax highlighting for code blocks
- Copy code button
- Support for multiple languages
- Markdown rendering

### 📱 **Fully Responsive**

- Mobile-friendly sidebar
- Touch-optimized interface
- Works on all devices

## 🚀 Quick Start (3 Minutes!)

### Step 1: Extract Files

Extract the ZIP file to your computer

### Step 2: Get Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your API key

### Step 3: Add API Key

Open `.env` file and add your API key:

```env
REACT_APP_GEMINI_KEY=your_actual_api_key_here
```

### Step 4: Install & Run

```bash
npm install
npm start
```

**That's it!** 🎉 App opens at http://localhost:3000

---

## 📁 Project Structure

```
soozai-chat-app/
├── src/
│   ├── components/
│   │   ├── Sidebar.js          # Tool categories + chat history
│   │   ├── ChatWindow.js       # Main chat interface
│   │   ├── MessageBubble.js    # Message display with actions
│   │   └── Loader.js           # Loading animation
│   ├── utils/
│   │   ├── api.js              # Direct Gemini API calls
│   │   └── localStorage.js     # Storage management
│   ├── styles/
│   │   ├── Sidebar.css
│   │   ├── ChatWindow.css
│   │   ├── MessageBubble.css
│   │   └── Loader.css
│   ├── App.js                  # Main application
│   ├── App.css                 # Global dark theme
│   ├── index.js                # Entry point
│   └── index.css               # Root styles
├── public/
│   └── index.html
├── package.json
├── .env                        # Your API key here!
└── README.md
```

---

## 🎨 UI Features

### Tool Categories Sidebar

```
📝 Text Generator
🎨 Image Generator [BETA]
💻 Code Generator
✂️ Image Editor
🎬 Video Generator
📧 Email Generator
🌐 Website Generator [BETA]
```

### Dark Theme Colors

```css
Primary Background: #1a1b26
Sidebar: #16171d
Purple Accent: #4DA9B3
Card Background: #24283b
```

### Message Actions

- 👍 Like response
- 👎 Dislike response
- 📋 Copy to clipboard
- 🔄 Regenerate response

---

## 🔧 How It Works

### Direct API Integration

```javascript
// No backend! Frontend calls Gemini API directly
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }],
    }),
  }
);
```

### Streaming Support

```javascript
// Real-time streaming for typing effect
await sendMessageStreaming(
  message,
  conversationHistory,
  (chunk, fullText) => {
    // Update UI with each chunk
    setStreamingMessage(fullText);
  },
  (fullContent) => {
    // Save complete message
    saveMessage(fullContent);
  }
);
```

---

## 🛠️ Available Scripts

```bash
npm start         # Start development server
npm run build     # Create production build
npm test          # Run tests
```

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.12.0",
  "react-markdown": "^9.0.0",
  "react-syntax-highlighter": "^15.5.0"
}
```

---

## 🔑 API Configuration

### Environment Variables

**File: `.env`**

```env
# Your Gemini API Key (Required)
REACT_APP_GEMINI_KEY=your_gemini_api_key_here
```

### Get Your API Key

1. **Visit**: https://makersuite.google.com/app/apikey
2. **Sign in** with Google account
3. **Create** API key
4. **Copy** and paste into `.env`

### API Models

The app uses **gemini-1.5-flash** by default (fast & free).

To change model, edit `src/utils/api.js`:

```javascript
// Line 20 & 60
model: "gemini-1.5-flash"; // Fast (default)
model: "gemini-1.5-pro"; // Better quality
model: "gemini-2.0-flash-exp"; // Experimental
```

---

## 🎯 Key Features Explained

### 1. No Backend Required

- Direct API calls from frontend
- API key securely in environment variable
- No server setup needed

### 2. Streaming Responses

- Real-time text streaming
- Character-by-character display
- Typing cursor animation

### 3. Code Highlighting

- Automatic language detection
- Syntax highlighting
- Copy code button

### 4. Chat Management

- Create unlimited chats
- Auto-generate titles
- Group by date (Today, Yesterday, etc.)
- Delete with confirmation

### 5. LocalStorage

- Persistent chat history
- Survives page refresh
- No database needed

---

## 🐛 Troubleshooting

### Problem: "API Key not configured"

**Solution**:

1. Check `.env` file exists
2. Verify API key is correct (no quotes)
3. Restart the app (`npm start`)

### Problem: "Failed to fetch" error

**Solution**:

1. Check internet connection
2. Verify API key is valid
3. Check API quotas at Google AI Studio

### Problem: No streaming / instant responses

**Solution**: This is normal! The app works either way. Streaming may not work in all browsers.

### Problem: Cors error

**Solution**: This shouldn't happen with direct API calls, but if it does:

- Clear browser cache
- Try different browser
- Check API key permissions

---

## 🌐 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (Not supported)

---

## 📱 Mobile Support

Fully responsive design:

- Hamburger menu
- Touch-friendly interface
- Optimized layouts
- Mobile-first approach

---

## 🔒 Security

### API Key Protection

- ✅ Stored in `.env` file
- ✅ Not committed to GitHub
- ✅ Environment variable only

### Best Practices

1. Never share your `.env` file
2. Never commit API key to GitHub
3. Regenerate key if exposed
4. Use `.gitignore` properly

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# REACT_APP_GEMINI_KEY=your_key_here
```

### Netlify

```bash
# Build
npm run build

# Deploy build/ folder
# Add environment variable in Netlify dashboard
```

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://yourusername.github.io/app-name",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

## 💡 Tips & Tricks

### 1. Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line

### 2. Regenerate Responses

Click the "Regenerate" button on any AI message

### 3. Copy Messages

Click the copy icon to copy any message

### 4. Search Chats

Use the search bar to find specific conversations

### 5. Theme Toggle

Switch between Dark and Light modes (coming soon!)

---

## 🎨 Customization

### Change Colors

Edit `src/App.css`:

```css
:root {
  --accent-primary: #your-color; /* Change purple accent */
  --bg-primary: #your-color; /* Change background */
}
```

### Change AI Name

Edit `src/components/MessageBubble.js` (line 64):

```javascript
<span className="message-role">{isUser ? "You" : "Your AI Name"}</span>
```

### Add More Tools

Edit `src/components/Sidebar.js` (line 4):

```javascript
const TOOL_CATEGORIES = [
  { id: "your-tool", name: "Your Tool", icon: "🎯", color: "#ff0000" },
  // ... existing tools
];
```

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects!

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 💬 Support

- **Issues**: Open a GitHub issue
- **Questions**: Check documentation first
- **Bugs**: Provide detailed error messages

---

## 🎉 Enjoy!

You now have a fully functional, production-ready AI chat application!

**Version**: 2.0.0  
**Last Updated**: January 2026  
**Built with**: React + Google Gemini AI

---

**Made with ❤️ by a Senior Full-Stack AI Engineer**
