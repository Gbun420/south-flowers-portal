'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js'; // Import User for typing

interface StaffMessage {
  id: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
  from_profile: {
    id: string; // Added id for proper reply routing
    full_name: string;
    email: string;
  };
}

export default function StaffMessagesPage() {
  const [messages, setMessages] = useState<StaffMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<StaffMessage | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    // Get messages where staff is the recipient
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Should be handled by middleware, but good to check

    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        from_profile:profiles!messages_from_id_fkey(id, full_name, email) // Select id from profiles
      `)
      .or(`to_id.eq.${user.id}`) // Only fetch messages addressed to the current staff user
      .order('created_at', { ascending: false });

    if (!error && messages) {
      setMessages(messages);
    } else if (error) {
      console.error('Error fetching staff messages:', error.message);
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
    // Optimistically update UI
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, read: true } : msg));
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Should be handled by middleware

    const { error } = await supabase
      .from('messages')
      .insert([{ 
        from_id: user.id,
        to_id: selectedMessage.from_profile.id, // Target the sender of the original message
        subject: `Re: ${selectedMessage.subject || 'Message'}`,
        content: replyContent 
      }]);

    if (!error) {
      setReplyContent('');
      fetchMessages(); // Re-fetch to show new reply
    } else {
      console.error('Error sending reply:', error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Member Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 bg-glass-heavy rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Inbox</h2>
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-glass-border transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-glass-border' : ''
                } ${!message.read ? 'border-l-4 border-amber-500' : ''}`}
                onClick={() => {
                  setSelectedMessage(message);
                  markAsRead(message.id);
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-white text-sm">
                    {message.from_profile?.full_name || 'Unknown Member'}
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

        {/* Message View & Reply */}
        <div className="lg:col-span-2 bg-glass-heavy rounded-2xl p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedMessage.subject || 'No Subject'}
                </h3>
                <div className="text-sm text-primary-300 mb-4">
                  From: {selectedMessage.from_profile?.full_name} | 
                  Date: {new Date(selectedMessage.created_at).toLocaleString()}
                </div>
                <div className="bg-glass-light rounded-lg p-4 min-h-[150px]">
                  <p className="text-white whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Reply</h4>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                  className="w-full p-3 rounded-lg bg-glass-border text-white placeholder-primary-300"
                />
                <button
                  onClick={sendReply}
                  disabled={!replyContent.trim()}
                  className="mt-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-2 rounded-lg hover:from-amber-500 hover:to-amber-400 disabled:opacity-50"
                >
                  Send Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-primary-300 py-12">
              Select a message to view and reply
            </div>
          )}
        </div>
      </div>
    </div>
  );
}