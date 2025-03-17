
// Gemini AI API integration

// Gemini API key
const API_KEY = 'AIzaSyAkvVDMvovPaUMyrZMo2IL4JXUaFdKjYnI';

// Helper function to make requests to Gemini API
export const generateTextWithGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(data.error.message || 'Error generating content');
    }
    
    // Extract the text from the response (different structure in v1)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Function to enhance resume based on job description
export const enhanceResumeWithAI = async (
  resumeText: string,
  jobDescription: string
): Promise<string[]> => {
  try {
    const prompt = `
    As an expert resume writer, analyze this resume and job description to provide specific, actionable improvements to make the resume more ATS-friendly and targeted for this position.

    RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    Please provide 5 specific, actionable suggestions to improve this resume for the job description. Focus on:
    1. Keyword optimization for ATS
    2. Skills that should be highlighted
    3. Achievements that could be better quantified
    4. Sections that should be reorganized
    5. Content that should be removed or added

    Format your response as a numbered list of 5 suggestions, with each suggestion being a single paragraph. Do not include any introductory or conclusive text.
    `;

    const aiResponse = await generateTextWithGemini(prompt);
    
    // Parse the numbered list into separate suggestions
    const suggestions = aiResponse
      .split(/\d\./)
      .map(suggestion => suggestion.trim())
      .filter(suggestion => suggestion.length > 0);
    
    return suggestions;
  } catch (error) {
    console.error('Error enhancing resume with AI:', error);
    throw error;
  }
};

// Function to get a summary of resume strengths and weaknesses
export const analyzeResumeWithAI = async (resumeText: string): Promise<string> => {
  try {
    const prompt = `
    Analyze this resume and provide a brief summary of its strengths and weaknesses from an ATS perspective:
    
    ${resumeText}
    
    Please provide a concise paragraph (150 words max) focusing on ATS compatibility, keyword optimization, formatting, and content quality.
    `;

    return await generateTextWithGemini(prompt);
  } catch (error) {
    console.error('Error analyzing resume with AI:', error);
    throw error;
  }
};
