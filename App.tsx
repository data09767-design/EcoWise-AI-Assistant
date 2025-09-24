import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Chatbot } from './components/Chatbot';
import { RecommendationCard } from './components/RecommendationCard';
import { getEnergySavingTips } from './services/geminiService';
import type { Tip } from './types';
import { LightbulbIcon } from './components/IconComponents';
import { ApplianceAnalyzer } from './components/ApplianceAnalyzer';

const App: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setIsLoadingTips(true);
        setError(null);
        const fetchedTips = await getEnergySavingTips();
        setTips(fetchedTips);
      } catch (err) {
        setError('Failed to load energy-saving tips. Please try again later.');
        console.error(err);
         // Set some fallback tips on error
        setTips([
            { tip: "Unplug electronics", description: "Many electronics use power even when turned off. Unplug them or use a power strip to save energy." },
            { tip: "Switch to LED bulbs", description: "LED bulbs use up to 80% less energy and last much longer than traditional incandescent bulbs." },
            { tip: "Adjust your thermostat", description: "Set your thermostat a few degrees lower in the winter and higher in the summer to significantly reduce heating and cooling costs." }
        ]);
      } finally {
        setIsLoadingTips(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
            <Dashboard />
            <ApplianceAnalyzer />
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
                <LightbulbIcon className="w-6 h-6 mr-3 text-cyan-glow" />
                AI-Powered Energy Saving Tips
              </h2>
              {isLoadingTips ? (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-surface-card rounded-lg shadow-card p-4 animate-pulse">
                            <div className="h-4 bg-steel rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-steel rounded w-full"></div>
                            <div className="h-3 bg-steel rounded w-5/6 mt-1"></div>
                        </div>
                    ))}
                 </div>
              ) : error ? (
                <div className="text-center py-4 px-3 bg-red-900/50 text-red-300 rounded-lg">
                    <p>{error}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tips.map((tip, index) => (
                    <RecommendationCard key={index} title={tip.tip} description={tip.description} />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Chatbot sidebar */}
          <div className="lg:col-span-1">
            <Chatbot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;