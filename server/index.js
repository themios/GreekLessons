import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN
    : '*', // Allow all origins in development
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Check if Google API key is configured
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY environment variable is not set!');
  console.error('📝 Please set your Google API key in the .env file:');
  console.error('   GOOGLE_API_KEY="your-actual-api-key-here"');
  console.error('🔗 Get your API key at: https://makersuite.google.com/app/apikey');
}

// Generate story endpoint
app.post('/api/generate-story', async (req, res) => {
  // Check if API key is configured
  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Google API key is not configured. Please set the GOOGLE_API_KEY environment variable with your API key from https://makersuite.google.com/app/apikey'
    });
  }

  try {
    const { topic, length, gradeLevel } = req.body;

    // Input validation
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Topic is required and must be a string.' });
    }
    if (topic.length > 200) {
      return res.status(400).json({ success: false, error: 'Topic is too long. Maximum 200 characters.' });
    }
    const validLengths = ['short', 'medium', 'long'];
    if (!length || !validLengths.includes(length)) {
      return res.status(400).json({ success: false, error: 'Invalid length specified.' });
    }
    const validGradeLevels = ['preschool', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th'];
     if (!gradeLevel || !validGradeLevels.includes(gradeLevel)) {
      return res.status(400).json({ success: false, error: 'Invalid grade level specified.' });
    }
    
    // Sanitize topic
    const sanitizedTopic = topic.trim();

    // Determine sentence count based on length
    const sentenceCounts = {
      short: '5-7',
      medium: '8-12',
      long: '13-18'
    };
    const sentenceCount = sentenceCounts[length] || '8-12';
    
    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    // Construct the prompt for generating a bilingual story in JSON format
    const prompt = `
      You are a bilingual children's story writer. Your task is to generate a story in English
      and then provide a sentence-by-sentence translation in modern Greek.

      **Instructions:**
      1.  **Topic:** "${sanitizedTopic}"
      2.  **Reading Level:** ${gradeLevel} grade
      3.  **Length:** Approximately ${sentenceCount} sentences
      4.  **Tone:** Simple vocabulary, friendly, engaging, and educational.
      5.  **Output Format:** Respond with a single, valid JSON object. Do not include any text
          or explanations outside of the JSON object. The JSON object must have a single key, "story",
          which is an array of objects. Each object in the array represents a sentence and must have
          two keys: "english" and "greek".

      **Example Response:**
      {
        "story": [
          {
            "english": "Once upon a time, there was a little bear.",
            "greek": "Μια φορά κι έναν καιρό, ήταν ένα μικρό αρκουδάκι."
          },
          {
            "english": "He loved to eat honey.",
            "greek": "Του άρεσε πολύ να τρώει μέλι."
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const storyData = JSON.parse(responseText);

    if (!storyData.story || !Array.isArray(storyData.story)) {
      throw new Error('Invalid story format received from AI.');
    }

    // Process the structured data
    const pairs = storyData.story.map((pair, index) => ({
      id: index + 1,
      english: pair.english.trim(),
      greek: pair.greek.trim()
    }));

    const englishStory = pairs.map(p => p.english).join(' ');
    const greekStory = pairs.map(p => p.greek).join(' ');

    const generatedStory = {
      englishStory,
      greekStory,
      pairs,
      topic,
      gradeLevel,
      length
    };

    res.json({
      success: true,
      data: generatedStory
    });

  } catch (error) {
    console.error('Error generating story:', error);
    
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to parse the story from the AI. The format was invalid.'
      });
    }

    // Handle specific Google API authentication errors
    if (error.status === 401 || error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'Invalid Google API key. Please check your GOOGLE_API_KEY environment variable and ensure it contains a valid API key from https://makersuite.google.com/app/apikey'
      });
    }
    
    res.status(500).json({
      success: false,
      error: `Failed to generate story: ${error.message || 'Unknown error occurred'}`
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Greek Story Generator API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Greek Story Generator API running on port ${PORT}`);
  console.log(`📚 Ready to generate bilingual stories with Google Gemini!`);
  console.log(`⚠️  Using Google API Key: ${process.env.GOOGLE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});