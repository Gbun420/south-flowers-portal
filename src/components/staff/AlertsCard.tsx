'use client';

import React from 'react';
import { AlertTriangle, Check } from 'lucide-react'; // Assuming Check icon exists

interface AlertsCardProps {
  lowStockCount: number;
}

const AlertsCard = ({ lowStockCount }: AlertsCardProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
      <h2 className="text-xl font-bold text-white mb-4">Alerts</h2>
      <div className="space-y-3">
        {lowStockCount > 0 ? (
          <div className="flex items-center p-3 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <span>{lowStockCount} items are running low on stock!</span>
          </div>
        ) : (
          <div className="flex items-center p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-500/50">
            <Check className="h-5 w-5 mr-3" /> {/* Assuming Check icon exists */}
            <span>No critical alerts. Everything is fine!</span>
          </div>
        )}
        {/* Add more alerts here, e.g., unread messages, expired memberships */}
      </div>
    </div>
  );
};

export default AlertsCard;