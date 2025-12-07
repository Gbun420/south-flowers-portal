'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createOrder(strain_id: string, quantity_grams: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated.' };
  }

  // Fetch user profile to check monthly limit
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('monthly_limit_remaining')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: 'Could not fetch user profile to check limits.' };
  }

  // Fetch strain to check stock availability
  const { data: strain, error: strainError } = await supabase
    .from('strains')
    .select('stock_grams, name')
    .eq('id', strain_id)
    .single();

  if (strainError || !strain) {
    return { error: 'Strain not found.' };
  }

  // Validation checks
  if (quantity_grams <= 0) {
    return { error: 'Quantity must be a positive number.' };
  }
  if (quantity_grams > 7) {
    return { error: 'Quantity cannot exceed 7g per order.' };
  }
  if (quantity_grams > profile.monthly_limit_remaining) {
    return { error: `Quantity exceeds your remaining monthly allowance of ${profile.monthly_limit_remaining}g.` };
  }
  if (quantity_grams > strain.stock_grams) {
    return { error: `Only ${strain.stock_grams}g of ${strain.name} available in stock.` };
  }

  // Insert order with stock check
  const { error: orderError } = await supabase.from('orders').insert({
    user_id: user.id,
    strain_id: strain_id,
    quantity_grams: quantity_grams,
    status: 'pending',
  });

  if (orderError) {
    console.error('Error inserting order:', orderError.message);
    return { error: 'Failed to create order. Please try again.' };
  }

  // Use transaction to update stock and user limit atomically
  const { error: transactionError } = await supabase.rpc('create_order_transaction', {
    p_user_id: user.id,
    p_strain_id: strain_id,
    p_quantity_grams: quantity_grams,
  });

  if (transactionError) {
    console.error('Transaction error:', transactionError.message);
    return { error: transactionError.message || 'Failed to create order. Please try again.' };
  }

  revalidatePath('/dashboard'); // Revalidate dashboard to show updated limits and orders
  return { success: true };
}
