import axios from 'axios';
import { StoryRequest, GeneratedStory, ApiResponse } from '../types/story';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const generateStory = async (request: StoryRequest): Promise<ApiResponse<GeneratedStory>> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-story`, request);
    return response.data;
  } catch (error) {
    console.error('Error generating story:', error);
    return {
      success: false,
      error: 'Failed to generate story. Please try again.',
    };
  }
};

export const speakText = (text: string, language: 'en-US' | 'el-GR') => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};