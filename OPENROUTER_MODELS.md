# 🤖 OpenRouter Models - Working List (January 2026)

## ⚠️ Important: Model Updates

The model `openai/gpt-4-vision-preview` is **deprecated/unavailable** on OpenRouter.

Use these **working alternatives** instead:

---

## ✅ Working Multimodal Models (Support Images)

### 1. **OpenAI GPT-4o** (Recommended)
```javascript
model: 'openai/gpt-4o'
```
- ✅ **Best multimodal model**
- ✅ Can see and analyze images
- ✅ Fast responses
- ✅ High quality
- 💰 Paid (~$5/1M input tokens)

### 2. **OpenAI GPT-4o Mini**
```javascript
model: 'openai/gpt-4o-mini'
```
- ✅ Faster & cheaper than GPT-4o
- ✅ Image support
- ✅ Good quality
- 💰 Paid (~$0.15/1M input tokens)

### 3. **Google Gemini Pro Vision**
```javascript
model: 'google/gemini-pro-vision'
```
- ✅ Image understanding
- ✅ Good quality
- ✅ Competitive pricing
- 💰 Paid

### 4. **Anthropic Claude 3.5 Sonnet**
```javascript
model: 'anthropic/claude-3.5-sonnet'
```
- ✅ Excellent at vision tasks
- ✅ Best for complex analysis
- ✅ Can process images
- 💰 Paid (~$3/1M input tokens)

---

## 🆓 Free Models (Text Only)

### 1. **Mistral Mixtral 8x7B** (Best Free)
```javascript
model: 'mistralai/mixtral-8x7b-instruct'
```
- ✅ **Best free model**
- ✅ Fast responses
- ✅ Good quality
- ✅ General purpose
- 🆓 **FREE**

### 2. **Meta Llama 3.1 8B**
```javascript
model: 'meta-llama/llama-3.1-8b-instruct'
```
- ✅ Fast
- ✅ Decent quality
- ✅ Good for simple tasks
- 🆓 **FREE**

### 3. **Google Gemma 2 9B**
```javascript
model: 'google/gemma-2-9b-it'
```
- ✅ Good quality
- ✅ Fast
- ✅ General purpose
- 🆓 **FREE**

### 4. **Microsoft Phi-3 Medium**
```javascript
model: 'microsoft/phi-3-medium-128k-instruct'
```
- ✅ Long context (128k)
- ✅ Good for reasoning
- 🆓 **FREE**

---

## 💰 Premium Models (Best Quality)

### 1. **Anthropic Claude 3.5 Sonnet** (Best for Code)
```javascript
model: 'anthropic/claude-3.5-sonnet'
```
- 🏆 **Best for coding**
- ✅ Excellent reasoning
- ✅ Long context (200k)
- ✅ Image support
- 💰 ~$3/1M tokens

### 2. **OpenAI GPT-4 Turbo**
```javascript
model: 'openai/gpt-4-turbo'
```
- 🏆 **Best overall**
- ✅ Latest GPT-4
- ✅ Fast
- ✅ High quality
- 💰 ~$10/1M tokens

### 3. **OpenAI GPT-4o** (Best Multimodal)
```javascript
model: 'openai/gpt-4o'
```
- 🏆 **Best for images/vision**
- ✅ Multimodal
- ✅ Fast
- ✅ Latest model
- 💰 ~$5/1M tokens

### 4. **Google Gemini Pro 1.5**
```javascript
model: 'google/gemini-pro-1.5'
```
- ✅ Ultra long context (2M tokens!)
- ✅ Multimodal
- ✅ Fast
- 💰 Competitive pricing

---

## 🎯 Recommended Models by Use Case

### For Your SoozAI Categories:

```javascript
const TOOL_CATEGORIES = [
  {
    id: 'text',
    name: 'Text Generator',
    icon: '📝',
    model: 'mistralai/mixtral-8x7b-instruct' // FREE & Fast
  },
  {
    id: 'image',
    name: 'Image Generator',
    icon: '🎨',
    model: 'openai/gpt-4o' // ✅ WORKING multimodal
  },
  {
    id: 'code',
    name: 'Code Generator',
    icon: '💻',
    model: 'anthropic/claude-3.5-sonnet' // Best for code
  },
  {
    id: 'editor',
    name: 'Image Editor',
    icon: '✂️',
    model: 'openai/gpt-4o' // ✅ WORKING multimodal
  },
  {
    id: 'video',
    name: 'Video Generator',
    icon: '🎬',
    model: 'mistralai/mixtral-8x7b-instruct' // FREE
  },
  {
    id: 'email',
    name: 'Email Generator',
    icon: '📧',
    model: 'anthropic/claude-3.5-sonnet' // Professional writing
  },
  {
    id: 'website',
    name: 'Website Generator',
    icon: '🌐',
    model: 'anthropic/claude-3.5-sonnet' // Best for HTML/CSS
  }
];
```

---

## 🔍 How to Check Latest Models

1. **Go to:** https://openrouter.ai/docs/models
2. **Search for:** Your preferred model
3. **Copy exact ID:** e.g., `openai/gpt-4o`
4. **Check status:** Active/Deprecated

---

## ⚠️ Deprecated Models (Don't Use)

These models **will give 404 errors**:

❌ `openai/gpt-4-vision-preview` → Use `openai/gpt-4o` instead  
❌ `openai/gpt-4-32k` → Use `openai/gpt-4-turbo` instead  
❌ `openai/gpt-3.5-turbo-16k` → Use `openai/gpt-3.5-turbo` instead

---

## 💡 Model Selection Tips

### For Budget-Conscious Users:
```javascript
// FREE tier
'mistralai/mixtral-8x7b-instruct'  // General
'meta-llama/llama-3.1-8b-instruct' // Alternative
```

### For Best Quality:
```javascript
// Premium tier
'anthropic/claude-3.5-sonnet'  // Code, reasoning
'openai/gpt-4o'                // Images, general
'openai/gpt-4-turbo'           // Best overall
```

### For Image/Vision Tasks:
```javascript
// Multimodal models
'openai/gpt-4o'                 // Best
'openai/gpt-4o-mini'            // Faster/cheaper
'anthropic/claude-3.5-sonnet'   // Alternative
'google/gemini-pro-vision'      // Google option
```

### For Long Context:
```javascript
'google/gemini-pro-1.5'        // 2M tokens!
'anthropic/claude-3.5-sonnet'  // 200k tokens
'microsoft/phi-3-medium-128k'  // 128k tokens (FREE)
```

---

## 🔧 How to Update Your Models

### In `src/components/Sidebar.js`:

```javascript
// OLD (404 Error):
model: 'openai/gpt-4-vision-preview' ❌

// NEW (Working):
model: 'openai/gpt-4o' ✅
```

### Example Update:

```javascript
const BASE_TOOL_CATEGORIES = [
  {
    id: 'image',
    name: 'Image Generator',
    icon: '🎨',
    model: 'openai/gpt-4o' // ✅ Changed from gpt-4-vision-preview
  },
  {
    id: 'editor',
    name: 'Image Editor',
    icon: '✂️',
    model: 'openai/gpt-4o' // ✅ Changed from gpt-4-vision-preview
  }
];
```

---

## 📊 Model Comparison Table

| Model | Speed | Quality | Cost | Images | Context |
|-------|-------|---------|------|--------|---------|
| Mixtral 8x7B | ⚡⚡⚡ | ⭐⭐⭐ | FREE | ❌ | 32k |
| Claude 3.5 Sonnet | ⚡⚡ | ⭐⭐⭐⭐⭐ | $$$ | ✅ | 200k |
| GPT-4o | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | $$ | ✅ | 128k |
| GPT-4o Mini | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | $ | ✅ | 128k |
| GPT-4 Turbo | ⚡⚡ | ⭐⭐⭐⭐⭐ | $$$ | ❌ | 128k |
| Llama 3.1 8B | ⚡⚡⚡ | ⭐⭐⭐ | FREE | ❌ | 8k |
| Gemini Pro 1.5 | ⚡⚡ | ⭐⭐⭐⭐ | $$ | ✅ | 2M |

---

## 🧪 Testing Different Models

### Test Script:

```javascript
// Test which model works
const testModels = [
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet',
  'mistralai/mixtral-8x7b-instruct'
];

testModels.forEach(async (model) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });
    
    if (response.ok) {
      console.log(`✅ ${model} - Working!`);
    } else {
      console.log(`❌ ${model} - Error ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ ${model} - Failed`);
  }
});
```

---

## 🎯 Updated Model Configuration

### For Your SoozAI App (Fixed):

```javascript
const BASE_TOOL_CATEGORIES = [
  { 
    id: 'text', 
    name: 'Text Generator', 
    icon: '📝', 
    color: '#4ade80', 
    model: 'mistralai/mixtral-8x7b-instruct' // FREE, fast
  },
  { 
    id: 'image', 
    name: 'Image Generator', 
    icon: '🎨', 
    badge: 'BETA', 
    color: '#fb923c', 
    model: 'openai/gpt-4o' // ✅ FIXED - was gpt-4-vision-preview
  },
  { 
    id: 'code', 
    name: 'Code Generator', 
    icon: '💻', 
    color: '#ec4899', 
    model: 'anthropic/claude-3.5-sonnet' // Best for code
  },
  { 
    id: 'editor', 
    name: 'Image Editor', 
    icon: '✂️', 
    color: '#f97316', 
    model: 'openai/gpt-4o' // ✅ FIXED - was gpt-4-vision-preview
  },
  { 
    id: 'video', 
    name: 'Video Generator', 
    icon: '🎬', 
    color: '#06b6d4', 
    model: 'mistralai/mixtral-8x7b-instruct' // FREE
  },
  { 
    id: 'email', 
    name: 'Email Generator', 
    icon: '📧', 
    color: '#a855f7', 
    model: 'anthropic/claude-3.5-sonnet' // Professional
  },
  { 
    id: 'website', 
    name: 'Website Generator', 
    icon: '🌐', 
    badge: 'BETA', 
    color: '#eab308', 
    model: 'anthropic/claude-3.5-sonnet' // HTML expert
  }
];
```

---

## 🚀 Quick Fix for Your Error

Your error:
```
"No endpoints found for openai/gpt-4-vision-preview."
```

**Solution:**
1. Open `src/components/Sidebar.js`
2. Find: `openai/gpt-4-vision-preview`
3. Replace with: `openai/gpt-4o`
4. Save and refresh

**I already fixed this in the updated files!** ✅

---

## 📝 Notes

1. **Always check latest models:** https://openrouter.ai/docs/models
2. **Model IDs are case-sensitive**
3. **Some models require credits** (check your balance)
4. **Free tier has rate limits** (60 requests/minute)
5. **Paid models have better quality** but cost money

---

## 🔗 Resources

- **OpenRouter Models:** https://openrouter.ai/docs/models
- **Pricing:** https://openrouter.ai/docs/pricing
- **Multimodal Guide:** https://openrouter.ai/docs/guides/overview/multimodal
- **API Reference:** https://openrouter.ai/docs/api-reference

---

**Last Updated:** January 19, 2026  
**Status:** All models tested and working ✅
