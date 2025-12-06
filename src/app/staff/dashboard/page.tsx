import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
// import StaffDashboardClient from '@/components/staff/StaffDashboardClient'; // Temporarily commented out

export default async function StaffDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/staff/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || (profile.role !== 'staff' && profile.role !== 'admin')) {
    return redirect('/dashboard');
  }

  // Temporary placeholder until StaffDashboardClient is created
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border">
          <h1 className="text-3xl font-bold text-white mb-4">Staff Dashboard</h1>
          <p className="text-primary-300">Staff dashboard coming soon with 2026 design system</p>
        </div>
      </div>
    </div>
  );
}
