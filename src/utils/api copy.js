/**
 * OpenRouter LLM Integration (Frontend Safe)
 * Uses Open-Source / Free models via OpenRouter
 */

const RAW_KEY = process.env.REACT_APP_OPENROUTER_KEY || "";

const OPENROUTER_KEY = RAW_KEY
  .replace(/"/g, "")   // remove quotes
  .replace(/\s+/g, "") // remove spaces, \n, \r
  .trim();


// Default model (can be overridden)
const DEFAULT_MODEL = "mistralai/mixtral-8x7b-instruct";

// OpenRouter endpoint
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Retry helper
 */
const sendWithRetry = async (fn, retries = 2, delay = 1000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

/**
 * Streaming Chat
 */
export const sendMessageStreaming = async (
  message,
  conversationHistory = [],
  onChunk,
  onComplete,
  onError,
  model = DEFAULT_MODEL,
  modalities = null
) => {
  try {
    const fetchFn = async () => {
      const requestBody = {
        model: model,
        messages: [
          ...conversationHistory.map(m => ({
            role: m.role,
            content: m.content
          })),
          { role: "user", content: message }
        ],
        stream: true,
      };

      // Only add modalities for image-capable models
      if (modalities && model.includes('gemini')) {
        requestBody.modalities = modalities;
        requestBody.image_config = {
          aspect_ratio: '16:9',
          image_size: '4K',
        };
      }

      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "SoozAI"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "OpenRouter error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let generatedImages = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.replace("data:", "").trim();
          if (data === "[DONE]") break;

          try {
            const json = JSON.parse(data);
            const choice = json.choices?.[0];
            
            if (choice?.delta) {
              // Handle text content
              const textContent = choice.delta.content;
              if (textContent) {
                fullText += textContent;
                if (onChunk) onChunk(textContent, fullText, generatedImages);
              }

              // Handle generated images (for image generation models)
              const images = choice.delta.images;
              if (images && Array.isArray(images)) {
                generatedImages.push(...images);
                if (onChunk) onChunk("", fullText, generatedImages);
              }
            }

            // Also check for images in the message (some models might put them there)
            if (choice?.message?.images && Array.isArray(choice.message.images)) {
              generatedImages.push(...choice.message.images);
              if (onChunk) onChunk("", fullText, generatedImages);
            }

          } catch (e) {
            console.warn("Failed to parse JSON chunk:", e);
          }
        }
      }

      if (onComplete) onComplete(fullText, generatedImages);
      return { text: fullText, images: generatedImages };
    };

    return await sendWithRetry(fetchFn, 2);
  } catch (err) {
    if (onError) onError(err);
    throw err;
  }
};


/**
 * Non-Streaming
 */
export const sendMessageSimple = async (message, conversationHistory = [], model = DEFAULT_MODEL) => {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "SoozAI"
    },
    body: JSON.stringify({
      model: model, // Use dynamic model
      messages: [
        ...conversationHistory.map(m => ({
          role: m.role,
          content: m.content
        })),
        { role: "user", content: message }
      ]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
};

/**
 * Generate Chat Title (Improved - ChatGPT style)
 */
export const generateChatTitle = async (firstMessage) => {
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "SoozAI"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL, // Use default model for title generation
        messages: [
          { 
            role: "system", 
            content: "You are a title generator. Generate a short, concise, and descriptive title (3-5 words maximum) for the following conversation. Do not use quotes or punctuation. Just return the title text only."
          },
          { 
            role: "user", 
            content: `Generate a title for this message: "${firstMessage}"` 
          }
        ],
        max_tokens: 30,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      throw new Error("Failed to generate title");
    }

    const data = await res.json();
    let title = data.choices[0].message.content.trim();
    
    // Clean up the title - remove quotes, extra punctuation
    title = title.replace(/^["']|["']$/g, '').replace(/[.!?]+$/, '').trim();
    
    // If title is too long, truncate it
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    return title || "New Chat";
  } catch (error) {
    console.error("Title generation error:", error);
    // Fallback: use first few words of the message
    const words = firstMessage.trim().split(/\s+/).slice(0, 5).join(' ');
    return words.length > 50 ? words.substring(0, 47) + '...' : words;
  }
};

/**
 * API key check
 */



export const checkAPIKey = () =>
  typeof OPENROUTER_KEY === "string" &&
  OPENROUTER_KEY.length > 10;