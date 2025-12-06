'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex items-center gap-3">
      <button className="group flex items-center gap-2 rounded-xl border border-glass-border bg-glass-bg backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary-200 transition-all duration-300 hover:border-glass-heavy hover:bg-glass-heavy hover:text-white">
        <User className="w-4 h-4" />
        <span>Profile</span>
      </button>
      
      <button 
        className="group flex items-center gap-2 rounded-xl border border-semantic-error/20 bg-semantic-error/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-semantic-error transition-all duration-300 hover:border-semantic-error/40 hover:bg-semantic-error/20 hover:shadow-lg hover:shadow-semantic-error/25"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        <span>Logout</span>
      </button>
    </div>
  );
}
