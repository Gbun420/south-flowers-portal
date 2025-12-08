'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Package, MessageSquare, BarChart3 } from 'lucide-react';

const QuickActionsCard = () => {
  const quickActions = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Add New Member",
      description: "Register a new club member",
      action: "/staff/members", // Changed to base path, action will be handled within component
      color: "blue"
    },
    {
      icon: <Package className="h-5 w-5" />,
      title: "Process Orders",
      description: "Manage pending orders",
      action: "/staff/orders",
      color: "amber"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Send Broadcast",
      description: "Message all members",
      action: "/staff/messages", // Changed to base path
      color: "green"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Generate Report",
      description: "Create monthly analytics",
      action: "/staff/reports", // Placeholder route
      color: "purple"
    }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
      <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="space-y-4">
        {quickActions.map((action, index) => (
          <Link href={action.action} key={index} className="flex items-center p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
            <div className={`p-2 rounded-md bg-gradient-to-r ${
              action.color === 'blue' ? 'from-blue-500 to-blue-600' :
              action.color === 'amber' ? 'from-amber-500 to-amber-600' :
              action.color === 'green' ? 'from-green-500 to-green-600' :
              'from-purple-500 to-purple-600'
            }`}>
              {action.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-white font-medium">{action.title}</h3>
              <p className="text-gray-400 text-sm">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;