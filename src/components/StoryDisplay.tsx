import React, { useState } from 'react';
import { Volume2, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { GeneratedStory } from '../types/story';
import { speakText } from '../utils/api';
import { generatePDF } from '../utils/pdf';

interface StoryDisplayProps {
  story: GeneratedStory;
  onNewStory: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, onNewStory }) => {
  const [showGreekFirst, setShowGreekFirst] = useState(true);
  const [showTranslations, setShowTranslations] = useState(true);

  const handleSpeakGreek = (text: string) => {
    speakText(text, 'el-GR');
  };

  const handleSpeakEnglish = (text: string) => {
    speakText(text, 'en-US');
  };

  const handleDownloadPDF = () => {
    generatePDF(story);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-greek-terracotta">
      {/* Header */}
      <div className="bg-gradient-to-r from-greek-blue to-greek-ocean text-white p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{story.topic}</h2>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>Grade: {story.gradeLevel}</span>
              <span>•</span>
              <span>Length: {story.length}</span>
              <span>•</span>
              <span>{story.pairs.length} sentences</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGreekFirst(!showGreekFirst)}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
              title={showGreekFirst ? "Show English first" : "Show Greek first"}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">
                {showGreekFirst ? 'Greek First' : 'English First'}
              </span>
            </button>
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
              title={showTranslations ? "Hide translations" : "Show translations"}
            >
              {showTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {showTranslations ? 'Hide' : 'Show'} Translation
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="p-6 space-y-6">
        {story.pairs.map((pair, index) => (
          <div
            key={pair.id}
            className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-greek-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                {/* Greek/English Text Based on Toggle */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <p className={`${showGreekFirst ? 'font-greek text-lg' : 'font-english text-base'} ${showGreekFirst ? 'text-greek-blue' : 'text-gray-600'} leading-relaxed`}>
                      {showGreekFirst ? pair.greek : pair.english}
                    </p>
                    <button
                      onClick={() => showGreekFirst ? handleSpeakGreek(pair.greek) : handleSpeakEnglish(pair.english)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-greek-blue hover:bg-white rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title={`Listen in ${showGreekFirst ? 'Greek' : 'English'}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {showTranslations && (
                    <div className="flex items-start justify-between gap-4 pt-2 border-t border-gray-200">
                      <p className={`${showGreekFirst ? 'font-english text-base' : 'font-greek text-lg'} ${showGreekFirst ? 'text-gray-600' : 'text-greek-blue'} leading-relaxed`}>
                        {showGreekFirst ? pair.english : pair.greek}
                      </p>
                      <button
                        onClick={() => showGreekFirst ? handleSpeakEnglish(pair.english) : handleSpeakGreek(pair.greek)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-greek-blue hover:bg-white rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title={`Listen in ${showGreekFirst ? 'English' : 'Greek'}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-greek-terracotta text-white rounded-lg hover:bg-greek-terracotta/90 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => speakText(story.pairs.map(p => showGreekFirst ? p.greek : p.english).join(' '), showGreekFirst ? 'el-GR' : 'en-US')}
              className="flex items-center gap-2 px-4 py-2 bg-greek-olive text-white rounded-lg hover:bg-greek-olive/90 transition-colors duration-200"
            >
              <Volume2 className="w-4 h-4" />
              Read Full Story
            </button>
          </div>
          <button
            onClick={onNewStory}
            className="px-6 py-2 bg-greek-blue text-white rounded-lg hover:bg-greek-blue/90 transition-colors duration-200 font-semibold"
          >
            Generate New Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;