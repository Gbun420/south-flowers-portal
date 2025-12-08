import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import StrainCard from '@/components/StrainCard';
import OrderHistory from '@/components/OrderHistory';

interface Profile {
  full_name: string;
  membership_expiry: string;
  monthly_limit_remaining: number;
}

interface Strain {
  id: string;
  name: string;
  type: string;
  thc_percent: number;
  cbd_percent: number;
  stock_grams: number;
  description: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Try to get profile, create if missing
  let profile = null;
  let profileError = null;

  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('full_name, membership_expiry, monthly_limit_remaining')
    .eq('id', user.id)
    .single();

  if (fetchError && fetchError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    console.log('Profile not found, creating new profile for user:', user.id);
    const profileData = {
      id: user.id,
      email: user.email || '',
      role: 'member',
      monthly_limit_remaining: 30,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown'
    };

    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileData);

    if (insertError) {
      console.error('Profile creation error:', insertError);
      return <p className="text-red-500">Error creating user profile.</p>;
    }

    // Fetch the newly created profile
    const { data: newProfile, error: newProfileError } = await supabase
      .from('profiles')
      .select('full_name, membership_expiry, monthly_limit_remaining')
      .eq('id', user.id)
      .single();

    if (newProfileError || !newProfile) {
      console.error('Error fetching new profile:', newProfileError?.message);
      return <p className="text-red-500">Error loading user profile.</p>;
    }
    profile = newProfile;
  } else if (fetchError) {
    console.error('Error fetching profile:', fetchError?.message);
    return <p className="text-red-500">Error loading user profile.</p>;
  } else {
    profile = existingProfile;
  }

  if (!profile) {
    console.error('No profile found after all attempts');
    return <p className="text-red-500">Error loading user profile.</p>;
  }

  const { data: strains, error: strainsError } = await supabase
    .from('strains')
    .select('*')
    .eq('is_visible', true);

  if (strainsError) {
    console.error('Error fetching strains:', strainsError.message);
    return <p className="text-red-500">Error loading strains.</p>;
  }

  // Fetch recent orders for the user
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      quantity_grams,
      status,
      created_at,
      strains (name, type)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Modern Glass Navbar */}
      <nav className="relative backdrop-blur-xl bg-glass-bg border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-80" />
                <div className="relative w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/25 transition-transform duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">SF</span>
                </div>
              </div>
              <div>
                <span className="text-white font-bold text-2xl">South Flowers</span>
                <div className="text-primary-300 text-sm font-medium">Premium Cannabis Club</div>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Hero Welcome Section */}
        <div className="mb-10 animate-fade-in">
          <div className="relative backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 overflow-hidden">
            {/* Soft UI inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-glass-light via-transparent to-glass-blur opacity-60" />
            
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Welcome back,{' '}
                  <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                    {profile.full_name ?? user?.email}
                  </span>
                </h1>
                <p className="text-primary-200 text-lg">
                  Member since {new Date().getFullYear()} • Membership expires{' '}
                  {profile.membership_expiry ? new Date(profile.membership_expiry).toLocaleDateString() : 'N/A'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-semantic-success animate-pulse-slow" />
                  <span className="text-primary-300 text-sm">Account Active</span>
                </div>
              </div>
              
              {/* Enhanced Allowance Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-80" />
                <div className="relative bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 shadow-xl shadow-primary-900/25 transition-transform duration-300 group-hover:scale-105 md:min-w-[320px]">
                  <div className="text-white space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium opacity-90">Monthly Allowance</div>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold">g</span>
                      </div>
                    </div>
                    <div className="text-4xl font-bold">
                      {profile.monthly_limit_remaining}
                      <span className="text-2xl font-normal opacity-70"> / 50g</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs opacity-80">
                        <span>Used</span>
                        <span>{50 - Number(profile.monthly_limit_remaining)}g</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-white to-primary-200 rounded-full h-3 transition-all duration-700 ease-out relative overflow-hidden"
                          style={{ width: `${Math.min(100, (Number(profile.monthly_limit_remaining) / 50) * 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        {orders && orders.length > 0 && (
          <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Recent Orders</h2>
                <p className="text-primary-300">Your latest reservations</p>
              </div>
            </div>
            <OrderHistory orders={orders} />
          </div>
        )}

        {/* Enhanced Strains Section */}
        <div className="backdrop-blur-xl bg-glass-bg rounded-3xl p-8 border border-glass-border shadow-2xl shadow-primary-900/20 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Available Strains</h2>
              <p className="text-primary-300">Premium selections for our members</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-semantic-success animate-pulse" />
              <span className="text-primary-300 text-sm">Live inventory</span>
            </div>
          </div>

          {strains.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-glass-heavy rounded-full animate-pulse-slow" />
                <div className="relative w-12 h-12 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center">
                  <span className="text-primary-400 text-xl">🌿</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No strains available</h3>
              <p className="text-primary-300">Please check back later for new arrivals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strains.map((strain, index) => (
                <div key={strain.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <StrainCard strain={strain} monthlyLimitRemaining={profile.monthly_limit_remaining} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}