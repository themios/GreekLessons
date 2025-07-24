import React, { useState } from 'react';
import Header from './components/Header';
import StoryForm from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateStory } from './utils/api';
import { StoryRequest, GeneratedStory } from './types/story';

function App() {
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStory = async (request: StoryRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateStory(request);
      
      if (response.success && response.data) {
        setStory(response.data);
      } else {
        setError(response.error || 'Failed to generate story');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewStory = () => {
    setStory(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-greek-marble via-white to-greek-blue/5">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : story ? (
          <StoryDisplay story={story} onNewStory={handleNewStory} />
        ) : (
          <StoryForm onSubmit={handleGenerateStory} isLoading={isLoading} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="opacity-80">
            Greek Story Generator - Connecting cultures through language learning
          </p>
          <div className="mt-4 text-sm opacity-60">
            Powered by AI • Designed for young learners • Port 4100
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;