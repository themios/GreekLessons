import React from 'react';
import { Loader2, BookOpen } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-t-4 border-greek-gold">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <BookOpen className="w-16 h-16 text-greek-blue animate-pulse-soft" />
          <Loader2 className="w-8 h-8 text-greek-terracotta animate-spin absolute -top-2 -right-2" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Crafting Your Story</h3>
          <p className="text-gray-600">Generating engaging content and translating to Greek...</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-greek-blue rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-greek-terracotta rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-greek-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;