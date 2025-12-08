'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Import client-side supabase

export default function StaffNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to main login page after logout
  };

  const navItems = [
    { href: '/staff/dashboard', label: 'Dashboard' },
    { href: '/staff/orders', label: 'Orders' },
    { href: '/staff/inventory', label: 'Inventory' },
    { href: '/staff/members', label: 'Members' },
    { href: '/staff/messages', label: 'Messages' },
  ];

  return (
    <nav className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-8">Staff Portal</h2>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded-md transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-amber-600 text-black'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleLogout}
        className="block w-full py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors mt-8"
      >
        Logout
      </button>
    </nav>
  );
}
