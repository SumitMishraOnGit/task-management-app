// Frontend/src/utils/geminiApi.js

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

// Rate limiting: DISABLED for development
let requestCount = 0;
let lastResetTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 999; // Effectively unlimited

const checkRateLimit = () => {
  // Rate limiting disabled for development
  return true;
};

// Enhancement modes with different prompts
const ENHANCE_MODES = {
  brief: {
    label: 'Brief',
    description: '2-3 sentences',
    prompt: (title, desc) => `Write a brief, concise task description (2-3 sentences max) for this task. Be direct and actionable.
Task: "${title}"
${desc ? `Current notes: "${desc}"` : ''}
Respond with only the description, no extra text.`
  },
  detailed: {
    label: 'Detailed',
    description: 'Full breakdown',
    prompt: (title, desc) => `Write a detailed task description with clear steps and context for this task. Include what needs to be done and any important considerations.
Task: "${title}"
${desc ? `Current notes: "${desc}"` : ''}
Respond with only the description, no extra text.`
  },
  steps: {
    label: 'Steps',
    description: 'Numbered steps',
    prompt: (title, desc) => `Break down this task into clear, numbered action steps (3-5 steps). Make each step specific and actionable.
Task: "${title}"
${desc ? `Context: "${desc}"` : ''}
Respond with only the numbered steps, no extra text.`
  },
  professional: {
    label: 'Professional',
    description: 'Formal tone',
    prompt: (title, desc) => `Write a professional, formal task description suitable for a work environment. Be clear and concise.
Task: "${title}"
${desc ? `Notes: "${desc}"` : ''}
Respond with only the description, no extra text.`
  }
};

export const getEnhanceModes = () => {
  return Object.entries(ENHANCE_MODES).map(([key, value]) => ({
    key,
    label: value.label,
    description: value.description
  }));
};

export const enhanceDescriptionWithGemini = async (title, currentDescription, mode = 'brief') => {
  // Check if API key exists
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Check rate limit
  checkRateLimit();

  const modeConfig = ENHANCE_MODES[mode] || ENHANCE_MODES.brief;
  const prompt = modeConfig.prompt(title, currentDescription);

  try {
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 500, // Limit tokens to save quota
        temperature: 0.7
      }
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 429) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      throw new Error(error.error?.message || 'API request failed');
    }

    const result = await response.json();

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text.trim();
    } else {
      console.error('Unexpected API response:', result);
      throw new Error('Failed to parse API response.');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

// Get remaining requests info
export const getRateLimitInfo = () => {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    return { remaining: MAX_REQUESTS_PER_MINUTE, resetIn: 0 };
  }
  return {
    remaining: MAX_REQUESTS_PER_MINUTE - requestCount,
    resetIn: Math.ceil((60000 - (now - lastResetTime)) / 1000)
  };
};