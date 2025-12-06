import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StaffNav from '@/components/staff/StaffNav'; // Client component for navigation

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If no user, redirect to login page (middleware should ideally catch this first)
    return redirect('/staff/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || (profile.role !== 'staff' && profile.role !== 'admin')) {
    // If user is not staff or admin, redirect to member dashboard
    return redirect('/dashboard');
  }

  // User is authenticated and authorized as staff/admin
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <StaffNav />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
