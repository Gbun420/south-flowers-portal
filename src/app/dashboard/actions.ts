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

  // Insert order
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

  // Update monthly limit remaining for the user
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ monthly_limit_remaining: profile.monthly_limit_remaining - quantity_grams })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating monthly limit:', updateError.message);
    // Optionally, handle this error more gracefully, e.g., compensating transaction
    return { error: 'Order created, but failed to update monthly limit. Please contact support.' };
  }

  revalidatePath('/dashboard'); // Revalidate dashboard to show updated limits and orders
  return { success: true };
}
