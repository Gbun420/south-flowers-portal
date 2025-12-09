'use client';

import React from 'react';
import { Package, MessageSquare, Users, AlertTriangle } from 'lucide-react';

export interface RecentActivity {
  id: string;
  type: 'order' | 'message' | 'member' | 'system';
  title: string;
  description: string;
  time: string;
  user?: string;
}

interface ActivityFeedCardProps {
  activities: RecentActivity[];
}

const ActivityFeedCard = ({ activities }: ActivityFeedCardProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`p-2 rounded-full ${
                activity.type === 'order' ? 'bg-amber-500/20 text-amber-300' :
                activity.type === 'message' ? 'bg-green-500/20 text-green-300' :
                activity.type === 'member' ? 'bg-blue-500/20 text-blue-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {activity.type === 'order' && <Package className="h-4 w-4" />}
                {activity.type === 'message' && <MessageSquare className="h-4 w-4" />}
                {activity.type === 'member' && <Users className="h-4 w-4" />}
                {activity.type === 'system' && <AlertTriangle className="h-4 w-4" />}
              </div>
              <div className="ml-3">
                <h3 className="text-white font-medium">{activity.title}</h3>
                <p className="text-gray-400 text-sm">{activity.description}</p>
                <p className="text-gray-500 text-xs mt-1">{activity.time} {activity.user && `by ${activity.user}`}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedCard;