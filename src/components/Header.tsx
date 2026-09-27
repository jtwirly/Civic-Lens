import React from 'react';

interface HeaderProps {
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a 
          href="#home" 
          onClick={(e) => {
            e.preventDefault();
            if (onHomeClick) onHomeClick();
          }}
          className="text-2xl font-serif font-semibold tracking-tight text-stone-900 flex items-center gap-2"
        >
          <span className="text-amber-800 font-serif italic">Civic</span>
          <span className="font-serif">Lens</span>
        </a>
      </div>
    </header>
  );
};
