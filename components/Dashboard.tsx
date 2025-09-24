import React from 'react';
import { UsageChart } from './UsageChart';
import type { UsageData } from '../types';
import { BoltIcon, CarbonIcon, SavingsIcon } from './IconComponents';
import { WeeklyChallenge } from './WeeklyChallenge';

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}> = ({ icon, title, value, change, changeType }) => {
  const changeColor = changeType === 'decrease' ? 'text-green-400' : 'text-red-400';
  const changeSymbol = changeType === 'decrease' ? '↓' : '↑';

  return (
    <div 
      className="group relative bg-surface-card rounded-xl shadow-card p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-cyan-glow"
      style={{
        background: 'radial-gradient(circle at 100% 100%, #2D3748, #1A202C)',
      }}
    >
        {/* Glare Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(0,245,255,0.1)_0%,_rgba(0,245,255,0)_50%)] transform scale-0 group-hover:scale-150 transition-transform duration-500"></div>

      <div className="flex items-center z-10">
        <div className="p-3 bg-steel-dark rounded-full">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
      <p className={`text-sm font-medium mt-4 z-10 ${changeColor}`}>
        {changeSymbol} {change} vs last month
      </p>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const monthlyUsage: UsageData[] = [
    { name: 'Jan', usage: 400, carbon: 150 },
    { name: 'Feb', usage: 350, carbon: 130 },
    { name: 'Mar', usage: 380, carbon: 140 },
    { name: 'Apr', usage: 320, carbon: 120 },
    { name: 'May', usage: 280, carbon: 105 },
    { name: 'Jun', usage: 250, carbon: 95 },
  ];

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-text-primary">Your Energy Dashboard</h1>
        <WeeklyChallenge />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<BoltIcon className="w-6 h-6 text-cyan-glow" />} 
          title="Electricity Usage" 
          value="250 kWh"
          change="10.5%"
          changeType="decrease"
        />
        <StatCard 
          icon={<CarbonIcon className="w-6 h-6 text-cyan-glow" />} 
          title="Carbon Footprint" 
          value="95 kg CO₂"
          change="12.2%"
          changeType="decrease"
        />
        <StatCard 
          icon={<SavingsIcon className="w-6 h-6 text-yellow-300" />} 
          title="Est. Savings" 
          value="$18.50"
          change="15.0%"
          changeType="decrease"
        />
      </div>
      <div className="bg-surface-card rounded-xl shadow-card p-4 md:p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Usage Trend</h3>
        <UsageChart data={monthlyUsage} />
      </div>
    </div>
  );
};