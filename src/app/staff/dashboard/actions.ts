'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isStaffOrAdmin } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

// 1. Order View Actions
export async function updateOrderStatus(orderId: string, newStatus: 'ready' | 'completed' | 'cancelled') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isStaffOrAdmin(user.id))) {
    return { error: 'Unauthorized access.' };
  }

  // Get order details to retrieve quantity and user_id for potential refund
  const { data: order, error: orderFetchError } = await supabase
    .from('orders')
    .select('user_id, quantity_grams')
    .eq('id', orderId)
    .single();

  if (orderFetchError || !order) {
    console.error('Error fetching order for status update:', orderFetchError?.message);
    return { error: 'Failed to fetch order details.' };
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error.message);
    return { error: 'Failed to update order status.' };
  }

  // If order is cancelled, refund grams to member's monthly limit
  if (newStatus === 'cancelled') {
    // Fetch user's current monthly_limit_remaining
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('monthly_limit_remaining')
      .eq('id', order.user_id)
      .single();

    if (profileFetchError || !profile) {
      console.error('Error fetching profile for refund:', profileFetchError?.message);
      // Log error but proceed, as order status was updated
      return { error: 'Order cancelled, but failed to refund member limit. Contact support.' };
    }

    const newLimit = profile.monthly_limit_remaining + order.quantity_grams;

    const { error: refundError } = await supabase
      .from('profiles')
      .update({ monthly_limit_remaining: newLimit })
      .eq('id', order.user_id);

    if (refundError) {
      console.error('Error refunding monthly limit:', refundError.message);
      return { error: 'Order cancelled, but failed to refund member limit. Contact support.' };
    }
  }

  revalidatePath('/staff/orders'); // Revalidate staff orders page
  revalidatePath('/dashboard'); // Also revalidate member dashboard if their limit changed

  return { success: true };
}

// 2. Inventory View Actions
export async function updateStrain(
  strainId: string,
  updates: { 
    stock_grams?: number; 
    thc_percent?: number; 
    price_per_gram?: number; 
    is_visible?: boolean;
    name?: string;
    type?: 'indica' | 'sativa' | 'hybrid';
    cbd_percent?: number;
    description?: string;
    image_url?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isStaffOrAdmin(user.id))) {
    return { error: 'Unauthorized access.' };
  }

  const { error } = await supabase
    .from('strains')
    .update(updates)
    .eq('id', strainId);

  if (error) {
    console.error('Error updating strain:', error.message);
    return { error: 'Failed to update strain details.' };
  }

  revalidatePath('/staff/dashboard');
  revalidatePath('/dashboard'); // Revalidate member dashboard as well if strain visibility/stock changes
  return { success: true };
}

export async function createStrain(
  name: string,
  type: 'indica' | 'sativa' | 'hybrid',
  thc_percent: number,
  cbd_percent: number,
  stock_grams: number,
  price_per_gram: number,
  description?: string,
  image_url?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isStaffOrAdmin(user.id))) {
    return { error: 'Unauthorized access.' };
  }

  const { error } = await supabase.from('strains').insert({
    name,
    type,
    thc_percent,
    cbd_percent,
    stock_grams,
    price_per_gram,
    description,
    image_url,
  });

  if (error) {
    console.error('Error creating strain:', error.message);
    return { error: 'Failed to create new strain.' };
  }

  revalidatePath('/staff/inventory');
  revalidatePath('/dashboard'); // New strain might be visible on member dashboard
  return { success: true };
}


// 3. Member Lookup Actions

export async function searchMembers(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isStaffOrAdmin(user.id))) {
    return { error: 'Unauthorized access.' };
  }

  if (!query) {
    return { error: 'Search query cannot be empty.', members: [] };
  }

  // Search profiles by full_name or residence_id_number
  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, residence_id_number')
    .or(`full_name.ilike.%${query}%,residence_id_number.ilike.%${query}%`)
    .limit(10); // Limit results for performance

  if (error) {
    console.error('Error searching members:', error.message);
    return { error: 'Failed to search members.', members: [] };
  }

  return { members };
}

export async function createMember(
  email: string,
  fullName: string,
  residenceIdNumber?: string,
  monthlyLimit: number = 30,
  membershipExpiry?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isStaffOrAdmin(user.id))) {
    return { error: 'Unauthorized access.' };
  }

  // First, create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true, // Auto-confirm to skip email verification
    user_metadata: {
      full_name: fullName,
    },
  });

  if (authError) {
    console.error('Error creating auth user:', authError.message);
    return { error: 'Failed to create user account.' };
  }

  if (!authData.user) {
    return { error: 'Failed to create user account.' };
  }

  // Use service client for admin operations
  const serviceSupabase = createServiceClient();

  // Then, create the profile
  const { error: profileError } = await serviceSupabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      residence_id_number: residenceIdNumber,
      monthly_limit_remaining: monthlyLimit,
      membership_expiry: membershipExpiry ? new Date(membershipExpiry).toISOString() : null,
      role: 'member',
    });

  if (profileError) {
    console.error('Error creating profile:', profileError.message);
    // Clean up auth user if profile creation fails
    await serviceSupabase.auth.admin.deleteUser(authData.user.id);
    return { error: 'Failed to create member profile.' };
  }

  revalidatePath('/staff/dashboard');
  revalidatePath('/staff/members');
  return { success: true };
}

export async function deleteStrain(strainId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isStaffOrAdmin(user.id))) {
    return { error: 'Unauthorized access.' };
  }

  const { error } = await supabase
    .from('strains')
    .delete()
    .eq('id', strainId);

  if (error) {
    console.error('Error deleting strain:', error.message);
    return { error: 'Failed to delete strain.' };
  }

  revalidatePath('/staff/inventory');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getMemberProfileAndOrders(memberId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isStaffOrAdmin(user.id))) {
    return { error: 'Unauthorized access.' };
  }

  // Fetch profile by ID
  const { data: memberProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, residence_id_number, membership_expiry, monthly_limit_remaining, created_at')
    .eq('id', memberId)
    .single();

  if (profileError || !memberProfile) {
    return { error: 'Member not found or error fetching profile.' };
  }

  // Fetch purchase history for the member (last 5 orders)
  const { data: purchaseHistory, error: historyError } = await supabase
    .from('orders')
    .select(`
      *,
      strains (name, type, thc_percent)
    `)
    .eq('user_id', memberProfile.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (historyError) {
    console.error('Error fetching purchase history:', historyError.message);
    return { error: 'Failed to fetch purchase history.' };
  }

  return { member: memberProfile, history: purchaseHistory };
}