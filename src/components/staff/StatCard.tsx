'use client';

import React from 'react'; // Import React for React.ReactNode

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  trend: string;
  color: 'blue' | 'amber' | 'green' | 'emerald' | 'purple' | 'red';
}

const StatCard = ({ icon, title, value, trend, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    green: 'from-green-500 to-green-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
          color === 'amber' ? 'bg-amber-500/20 text-amber-300' :
          color === 'green' ? 'bg-green-500/20 text-green-300' :
          color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' :
          color === 'purple' ? 'bg-purple-500/20 text-purple-300' :
          'bg-red-500/20 text-red-300'
        }`}>
          {trend}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
};

export default StatCard;