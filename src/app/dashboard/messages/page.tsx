'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

// Define Message type based on your Supabase `messages` table schema
interface Message {
  id: string;
  sender_id: string;
  recipient_id: string | null; // Null if for general staff support
  content: string;
  is_read: boolean;
  created_at: string;
  // Potentially include sender's full_name if joined with profiles table for display
}

// Define Profile type for sender/recipient display
interface Profile {
  id: string;
  full_name: string;
  role: string;
}

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
  senderProfile: Profile | undefined;
}

function ChatMessage({ message, currentUserId, senderProfile }: ChatMessageProps) {
  const isOutgoing = message.sender_id === currentUserId;
  const messageClass = isOutgoing
    ? 'bg-blue-600 self-end rounded-bl-xl'
    : 'bg-gray-700 self-start rounded-br-xl';

  const senderName = senderProfile?.full_name || 'Unknown';

  return (
    <div className={`flex flex-col mb-2 max-w-[70%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
      {!isOutgoing && (
        <span className="text-xs text-gray-400 mb-1">{senderName}</span>
      )}
      <div className={`p-3 rounded-xl ${messageClass}`}>
        <p className="text-sm">{message.content}</p>
        <span className="text-xs text-gray-300 mt-1 block">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

// Server Action for sending messages
async function sendMessageAction(content: string, recipient_id: string | null = null) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated.' };
  }

  const { error } = await supabase.from('messages').insert({
    sender_id: user.id,
    recipient_id: recipient_id, // Null for staff group, specific ID for direct
    content: content,
  });

  if (error) {
    console.error('Error sending message:', error.message);
    return { error: 'Failed to send message.' };
  }
  return { success: true };
}


export default function MessagesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [staffProfiles, setStaffProfiles] = useState<Profile[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUserAndMessages() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }
      setCurrentUserId(user.id);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Error fetching user profile:', profileError?.message);
        return;
      }
      setUserProfile(profileData);

      // Fetch initial messages
      // For members: fetch messages where recipient_id is null (staff group) or sender_id/recipient_id is current user
      // For staff: fetch all messages for now, will refine conversation list later
      let query = supabase.from('messages').select('*');
      if (profileData.role === 'member') {
          query = query.or(`sender_id.eq.${user.id},recipient_id.is.null`)
      }
      const { data: initialMessages, error: messagesError } = await query.order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching initial messages:', messagesError.message);
      } else {
        setMessages(initialMessages as Message[]);
      }

      // Fetch staff profiles for display
      const { data: staffData, error: staffError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', 'staff');
      
      if (staffError) {
        console.error('Error fetching staff profiles:', staffError.message);
      } else {
        setStaffProfiles(staffData as Profile[]);
      }
    }

    loadUserAndMessages();
  }, [router, supabase]);

  useEffect(() => {
    // Scroll to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!currentUserId) return;

    // Real-time subscription to messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add messages relevant to the current user (either sent by them, to them, or to staff group)
          if (newMessage.sender_id === currentUserId || newMessage.recipient_id === currentUserId || newMessage.recipient_id === null) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserId]);


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    // Determine recipient: null for member to staff group, specific ID for staff to member
    const recipient = userProfile?.role === 'member' ? null : 'staff_group_id_placeholder'; // TODO: Refine staff messaging logic

    const { error } = await sendMessageAction(newMessage, recipient);

    if (error) {
      alert(error); // Basic error handling
    } else {
      setNewMessage('');
    }
  };
  
  // Helper to get sender profile for displaying names in chat
  const getSenderProfile = (senderId: string) => {
    if (senderId === currentUserId) return userProfile || undefined;
    const staff = staffProfiles.find(p => p.id === senderId);
    if (staff) return staff;
    // Potentially fetch other member profiles if staff and showing member-to-member chat
    return undefined;
  };

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">Loading chat...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#121212] text-[#e5e5e5]">
      {/* Conversations List (Simplified for Member, to be enhanced for Staff) */}
      <div className="w-1/4 border-r border-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        {userProfile.role === 'member' ? (
          <div className="p-3 bg-[#1e1e1e] rounded-md cursor-pointer">
            Staff Support
          </div>
        ) : (
          <div className="text-gray-400">
            {/* TODO: Implement dynamic conversation listing for staff */}
            <p>Staff: Active conversations will appear here.</p>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b border-gray-800 bg-[#1e1e1e]">
          <h2 className="text-xl font-bold">{userProfile.role === 'member' ? 'Staff Support' : 'Selected Conversation'}</h2>
        </header>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
          <div ref={chatEndRef} /> {/* Scroll target */}
          {[...messages].reverse().map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              currentUserId={currentUserId!}
              senderProfile={getSenderProfile(msg.sender_id)}
            />
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 bg-[#1e1e1e] flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-gold-accent focus:border-gold-accent mr-2"
          />
          <button
            type="submit"
            className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#c0a030] transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
