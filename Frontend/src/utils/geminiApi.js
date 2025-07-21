export const enhanceDescriptionWithGemini = async (title, currentDescription) => {
  const prompt = `Expand and refine the following task title into a more detailed description. Keep it concise but informative.
  Task Title: "${title}"
  ${currentDescription ? `Current Description: "${currentDescription}"` : ''}
  `;

  try {
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(payload)
           });
    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error('Gemini API response structure unexpected:', result);
      throw new Error('Failed to parse Gemini API response.');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('An error occurred while generating the description.');
  }
};