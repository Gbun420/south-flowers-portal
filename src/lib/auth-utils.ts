import { createClient } from '@/lib/supabase/server';

export async function createOrUpdateProfile(user: any) {
  const supabase = await createClient();
  
  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', fetchError);
      return { success: false, error: fetchError };
    }

    // If profile exists, return it
    if (existingProfile) {
      return { success: true, profile: existingProfile };
    }

    // Create new profile with proper data
    const profileData = {
      id: user.id,
      email: user.email || '',
      role: 'member',
      monthly_limit_remaining: 30,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown'
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return { success: false, error: insertError };
    }

    return { success: true, profile: newProfile };

  } catch (error) {
    console.error('Unexpected error in createOrUpdateProfile:', error);
    return { success: false, error };
  }
}

export async function getUserRole(userId: string) {
  const supabase = await createClient();
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }

    return profile?.role || null;
  } catch (error) {
    console.error('Unexpected error getting user role:', error);
    return null;
  }
}

export async function hasRole(userId: string, requiredRoles: string[]) {
  const userRole = await getUserRole(userId);
  return userRole ? requiredRoles.includes(userRole) : false;
}

export async function isStaffOrAdmin(userId: string) {
  return await hasRole(userId, ['staff', 'admin', 'master_admin']);
}

export async function isAdmin(userId: string) {
  return await hasRole(userId, ['admin', 'master_admin']);
}

export async function isMasterAdmin(userId: string) {
  return await hasRole(userId, ['master_admin']);
}