'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
  from_profile: {
    id: string; // Added id for from_profile
    full_name: string;
    avatar_url: string;
  };
  to_profile: {
    id: string; // Added id for to_profile
    full_name: string;
    avatar_url: string;
  };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({ to_id: '', subject: '', content: '' });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    // Fetch messages via the API route we just created
    const response = await fetch('/api/messages');
    const data = await response.json();

    if (response.ok && data) {
      setMessages(data);
    } else {
      console.error('Failed to fetch messages:', data.error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.content.trim()) return;

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });
    const data = await response.json();

    if (response.ok && data) {
      setNewMessage({ to_id: '', subject: '', content: '' });
      fetchMessages();
    } else {
      console.error('Failed to send message:', data.error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center text-primary-300">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 bg-glass-heavy rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Conversations</h2>
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-glass-border transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-glass-border' : ''
                } ${!message.read ? 'border-l-4 border-primary-500' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-white text-sm">
                    {message.from_profile?.full_name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-primary-300">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-primary-200 text-sm truncate">
                  {message.subject || message.content.substring(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message View/Compose */}
        <div className="lg:col-span-2 bg-glass-heavy rounded-2xl p-6">
          {selectedMessage ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {selectedMessage.subject || 'No Subject'}
                </h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-primary-300 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="mb-4 text-sm text-primary-300">
                From: {selectedMessage.from_profile?.full_name || 'Unknown User'} | 
                Date: {new Date(selectedMessage.created_at).toLocaleString()}
              </div>
              <div className="bg-glass-light rounded-lg p-4 min-h-[200px]">
                <p className="text-white whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Compose New Message</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject (optional)"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full p-3 rounded-lg bg-glass-border text-white placeholder-primary-300"
                />
                <textarea
                  placeholder="Type your message here..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  rows={6}
                  className="w-full p-3 rounded-lg bg-glass-border text-white placeholder-primary-300"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.content.trim()}
                  className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-lg hover:from-primary-500 hover:to-primary-400 disabled:opacity-50"
                >
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
