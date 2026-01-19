# ⚡ QUICK START - 3 Minutes!

## Step 1: Get API Key (1 minute)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)

## Step 2: Configure (30 seconds)
Open `.env` file and paste your key:
```
REACT_APP_GEMINI_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Step 3: Install & Run (90 seconds)
```bash
npm install
npm start
```

## ✅ Success!
- App opens at: http://localhost:3000
- Click "NEW CHAT"
- Type a message
- Watch AI respond with streaming effect!

## 🎨 What You Get
- Dark SoozAI-style UI
- Tool categories sidebar
- Code syntax highlighting
- Message actions (Like, Copy, Regenerate)
- Chat history with dates
- Mobile responsive

## 🐛 Troubleshooting

### "API Key not configured"
- Check `.env` file has correct key
- No quotes around the key
- Restart app after editing `.env`

### "Failed to fetch"
- Check internet connection
- Verify API key is valid
- Try: https://makersuite.google.com/app/apikey

### Port 3000 in use
```bash
# Use different port
PORT=3001 npm start
```

## 💡 Pro Tips
- **Enter** = Send message
- **Shift+Enter** = New line
- **Search** = Find chats
- **Regenerate** = Get new response

## 🚀 That's It!
You're ready to chat with Gemini AI!

---

**Need Help?** Check README.md for full documentation.
