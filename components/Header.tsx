import React from 'react';
import { LeafIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-steel-dark via-surface-card to-steel-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LeafIcon className="h-8 w-8 text-cyan-glow animate-pulse-glow" />
            <span className="ml-3 text-2xl font-bold text-text-primary tracking-tight">EcoWise AI</span>
          </div>
          <div className="text-sm font-medium text-text-secondary">
            Your Personal Energy & Sustainability Assistant
          </div>
        </div>
      </div>
    </header>
  );
};