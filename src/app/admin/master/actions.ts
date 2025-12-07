'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUsers() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function createUser(userData: {
  email: string;
  role: 'member' | 'staff' | 'admin';
  full_name: string;
  monthly_limit_remaining: number;
}) {
  const supabase = await createClient();
  
  try {
    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name
      }
    });

    if (authError) throw authError;

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user?.id,
        email: userData.email,
        role: userData.role,
        full_name: userData.full_name,
        monthly_limit_remaining: userData.monthly_limit_remaining
      });

    if (profileError) throw profileError;

    return { success: true };
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create user');
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw new Error('Failed to update user role');
  }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  
  try {
    // Delete from auth.users first
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // Profile will be deleted by cascade constraint
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function updateUserLimits(userId: string, newLimit: number) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ monthly_limit_remaining: newLimit })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to update user limits:', error);
    throw new Error('Failed to update user limits');
  }
}

export async function getUserStats() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      members: data?.filter(u => u.role === 'member').length || 0,
      staff: data?.filter(u => u.role === 'staff').length || 0,
      admins: data?.filter(u => u.role === 'admin').length || 0,
      master_admins: data?.filter(u => u.role === 'master_admin').length || 0,
    };

    return stats;
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    throw new Error('Failed to fetch user stats');
  }
}
