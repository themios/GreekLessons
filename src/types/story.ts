export interface StoryRequest {
  topic: string;
  length: 'short' | 'medium' | 'long';
  gradeLevel: string;
}

export interface StoryPair {
  greek: string;
  english: string;
  id: number;
}

export interface GeneratedStory {
  englishStory: string;
  greekStory: string;
  pairs: StoryPair[];
  topic: string;
  gradeLevel: string;
  length: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}