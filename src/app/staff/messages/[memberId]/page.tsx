'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

// Define Message type based on your Supabase `messages` table schema
interface Message {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
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

// Server Action for sending messages (reused from dashboard/messages/page.tsx, but needs to be in a server action file)
async function sendMessageAction(content: string, recipient_id: string | null) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated.' };
  }

  const { error } = await supabase.from('messages').insert({
    sender_id: user.id,
    recipient_id: recipient_id,
    content: content,
  });

  if (error) {
    console.error('Error sending message:', error.message);
    return { error: 'Failed to send message.' };
  }
  return { success: true };
}

export default function StaffMemberChatPage({ params }: { params: { memberId: string } }) {
  const { memberId } = params;
  const supabase = createClient();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [staffProfile, setStaffProfile] = useState<Profile | null>(null);
  const [targetMemberProfile, setTargetMemberProfile] = useState<Profile | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadChatData() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push('/staff/login'); // Redirect staff to staff login
        return;
      }
      setCurrentUserId(user.id);

      // Fetch staff profile
      const { data: staffProfileData, error: staffProfileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();
      if (staffProfileError || !staffProfileData || (staffProfileData.role !== 'staff' && staffProfileData.role !== 'admin')) {
        router.push('/dashboard'); // Unauthorized staff
        return;
      }
      setStaffProfile(staffProfileData);

      // Fetch target member profile
      const { data: memberProfileData, error: memberProfileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('id', memberId)
        .single();
      if (memberProfileError || !memberProfileData) {
        console.error('Error fetching member profile:', memberProfileError?.message);
        router.push('/staff/members'); // Go back to member list if target not found
        return;
      }
      setTargetMemberProfile(memberProfileData);

      // Fetch initial messages between staff and this member
      const { data: initialMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${memberId}),and(sender_id.eq.${memberId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching initial messages:', messagesError.message);
      } else {
        setMessages(initialMessages as Message[]);
      }
    }

    loadChatData();
  }, [router, supabase, memberId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!currentUserId || !memberId) return;

    // Real-time subscription to messages relevant to this conversation
    const channel = supabase
      .channel(`staff_chat_${memberId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add messages relevant to this specific staff-member conversation
          const isRelevant =
            (newMessage.sender_id === currentUserId && newMessage.recipient_id === memberId) ||
            (newMessage.sender_id === memberId && newMessage.recipient_id === currentUserId);

          if (isRelevant) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserId, memberId]);


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || !memberId) return;

    const { error } = await sendMessageAction(newMessage, memberId);

    if (error) {
      alert(error); // Basic error handling
    } else {
      setNewMessage('');
    }
  };

  if (!staffProfile || !targetMemberProfile) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
        <header className="p-4 border-b border-gray-700 bg-gray-800 flex items-center">
            <Link href="/staff/members" className="text-amber-400 hover:underline mr-4">
                &larr; Back to Members
            </Link>
            <h2 className="text-xl font-bold">Chat with {targetMemberProfile.full_name}</h2>
        </header>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
            <div className="flex-grow"></div> {/* Pushes messages to bottom */}
            {messages.map((msg) => (
                <ChatMessage
                    key={msg.id}
                    message={msg}
                    currentUserId={currentUserId!}
                    senderProfile={
                        msg.sender_id === currentUserId ? staffProfile :
                        msg.sender_id === memberId ? targetMemberProfile :
                        undefined
                    }
                />
            ))}
            <div ref={chatEndRef} /> {/* Scroll target */}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800 flex">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${targetMemberProfile.full_name}...`}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 mr-2"
            />
            <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
            >
                Send
            </button>
        </form>
    </div>
  );
}
