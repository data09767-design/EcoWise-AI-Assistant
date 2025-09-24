import React from 'react';
import { CheckCircleIcon } from './IconComponents';

interface RecommendationCardProps {
  title: string;
  description: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, description }) => {
  return (
    <div className="bg-surface-card rounded-xl shadow-card border border-steel p-6 flex flex-col h-full transition-all duration-300 hover:shadow-cyan-glow hover:-translate-y-1 hover:border-cyan-glow/50">
      <div className="flex items-start">
        <CheckCircleIcon className="w-6 h-6 text-cyan-glow flex-shrink-0 mt-1" />
        <div className="ml-4">
            <h4 className="text-md font-semibold text-text-primary">{title}</h4>
            <p className="text-sm text-text-secondary mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};