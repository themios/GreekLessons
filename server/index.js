import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
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

// Helper function to split text into sentences
const splitIntoSentences = (text) => {
  return text
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
};

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
    
    // Determine sentence count based on length
    const sentenceCounts = {
      short: '5-7',
      medium: '8-12',
      long: '13-18'
    };
    
    const sentenceCount = sentenceCounts[length] || '8-12';
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Generate English story
    const storyPrompt = `Write a children's story for a ${gradeLevel} grade reading level. 
    Topic: "${topic}". 
    Length: approximately ${sentenceCount} sentences. 
    Use simple vocabulary, friendly tone, and age-appropriate content. 
    Make it engaging and educational. 
    End each sentence with proper punctuation (. ! or ?).
    
    Please write only the story, no additional text or explanations.`;

    const storyResult = await model.generateContent(storyPrompt);
    const englishStory = storyResult.response.text().trim();
    
    // Translate to Greek
    const translationPrompt = `Translate the following English children's story to modern Greek. 
    Maintain the same sentence structure and meaning for each sentence. 
    Use simple, clear Greek that would be appropriate for language learners.
    Translate sentence by sentence to maintain alignment.
    
    Please provide only the Greek translation, no additional text or explanations.

    Story to translate:
    ${englishStory}`;

    const translationResult = await model.generateContent(translationPrompt);
    const greekStory = translationResult.response.text().trim();
    
    // Split into sentences and create pairs
    const englishSentences = splitIntoSentences(englishStory);
    const greekSentences = splitIntoSentences(greekStory);
    
    // Ensure we have matching sentence counts
    const minLength = Math.min(englishSentences.length, greekSentences.length);
    
    const pairs = [];
    for (let i = 0; i < minLength; i++) {
      pairs.push({
        id: i + 1,
        english: englishSentences[i],
        greek: greekSentences[i]
      });
    }

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