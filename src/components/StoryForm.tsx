import React, { useState } from 'react';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { StoryRequest } from '../types/story';

interface StoryFormProps {
  onSubmit: (request: StoryRequest) => void;
  isLoading: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [gradeLevel, setGradeLevel] = useState('3rd');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit({ topic: topic.trim(), length, gradeLevel });
    }
  };

  const mythologyTopics = [
    'Perseus and Medusa',
    'Pandora\'s Box',
    'The Tortoise and the Hare',
    'A Day in Ancient Athens',
    'The Golden Fleece',
    'Odysseus\' Adventure',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-greek-blue">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-greek-blue mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Create Your Greek Story</h2>
        </div>
        <p className="text-gray-600">Generate a bilingual story to enhance your Greek learning journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
            Story Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., A cat in Ancient Athens, The brave little olive tree..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-greek-blue focus:outline-none transition-colors duration-200"
            required
          />
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {mythologyTopics.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setTopic(suggestion)}
                  className="px-3 py-1 text-xs bg-greek-blue/10 text-greek-blue rounded-full hover:bg-greek-blue/20 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="length" className="block text-sm font-semibold text-gray-700 mb-2">
              Story Length
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value as 'short' | 'medium' | 'long')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-greek-blue focus:outline-none transition-colors duration-200"
            >
              <option value="short">Short (5-7 sentences)</option>
              <option value="medium">Medium (8-12 sentences)</option>
              <option value="long">Long (13-18 sentences)</option>
            </select>
          </div>

          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-semibold text-gray-700 mb-2">
              Grade Level
            </label>
            <select
              id="gradeLevel"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-greek-blue focus:outline-none transition-colors duration-200"
            >
              <option value="1st">1st Grade</option>
              <option value="2nd">2nd Grade</option>
              <option value="3rd">3rd Grade</option>
              <option value="4th">4th Grade</option>
              <option value="5th">5th Grade</option>
              <option value="6th">6th Grade</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-gradient-to-r from-greek-blue to-greek-ocean text-white font-semibold py-4 px-6 rounded-lg hover:from-greek-blue/90 hover:to-greek-ocean/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Story...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Story
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StoryForm;