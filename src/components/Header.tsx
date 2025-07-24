import React from 'react';
import { BookOpen, Star } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-greek-blue via-greek-ocean to-greek-blue text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <BookOpen className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Greek Story Generator</h1>
          </div>
          <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Learn Greek through engaging bilingual stories tailored to your reading level
          </p>
          <div className="flex items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              <span>Age-appropriate content</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              <span>Bilingual learning</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              <span>Audio support</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Greek Pattern Border */}
      <div className="mt-8 h-2 bg-gradient-to-r from-transparent via-greek-gold to-transparent opacity-60"></div>
    </header>
  );
};

export default Header;