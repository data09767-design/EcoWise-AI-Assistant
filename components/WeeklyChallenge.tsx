import React, { useState, useEffect } from 'react';
import { getWeeklyChallenge } from '../services/geminiService';
import type { Challenge } from '../types';
import { TrophyIcon, SparklesIcon } from './IconComponents';

export const WeeklyChallenge: React.FC = () => {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const fetchChallenge = async () => {
        setIsLoading(true);
        setError(null);
        setIsCompleted(false);
        try {
            const newChallenge = await getWeeklyChallenge();
            setChallenge(newChallenge);
        } catch (err) {
            setError('Could not load a new challenge. Try again!');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenge();
    }, []);

    const handleComplete = () => {
        setIsCompleted(true);
        // Display confetti/celebration for a few seconds
        setTimeout(() => {
            fetchChallenge();
        }, 2500);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-steel rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                         <div className="h-4 bg-steel rounded w-3/4 animate-pulse"></div>
                         <div className="h-3 bg-steel rounded w-1/2 animate-pulse"></div>
                    </div>
                 </div>
            );
        }

        if (error) {
            return <p className="text-red-400">{error}</p>;
        }

        if (isCompleted) {
            return (
                <div className="text-center transition-all duration-500">
                    <SparklesIcon className="w-12 h-12 text-yellow-300 mx-auto animate-bounce"/>
                    <h4 className="text-xl font-bold text-cyan-glow mt-2">Challenge Complete!</h4>
                    <p className="text-text-secondary">Great job! Loading a new challenge...</p>
                </div>
            )
        }
        
        if (challenge) {
            return (
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div>
                        <TrophyIcon className="w-12 h-12 text-yellow-300"/>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-lg font-semibold text-text-primary">{challenge.title}</h4>
                        <p className="text-text-secondary mt-1">{challenge.description}</p>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                        <button onClick={handleComplete} className="px-4 py-2 text-sm font-semibold text-steel-dark bg-gradient-to-br from-cyan-glow to-cyan-dark rounded-full hover:shadow-cyan-glow transition-all">Mark as Complete</button>
                        <button onClick={fetchChallenge} className="px-4 py-2 text-sm font-semibold text-text-secondary bg-steel rounded-full hover:bg-steel-light transition-colors">New Challenge</button>
                    </div>
                </div>
            );
        }

        return null;
    };


    return (
        <div className="bg-surface-card rounded-xl shadow-card border border-steel p-6 transition-all duration-300">
           <h3 className="text-sm font-bold text-cyan-dark uppercase tracking-wider mb-4">Your Weekly Challenge</h3>
           {renderContent()}
        </div>
    );
};