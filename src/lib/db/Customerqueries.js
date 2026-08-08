import db from './index';
import { createClient } from '@/lib/supabase/server';


// Get all customers
export async function getallCustomers() {
  const { data, error } = await db
    .from('customers')
    .select(`
      *,
      users (*)
    `);

  if (error) {
    throw error;
  }

  return data;
}


// Get customer by ID
export async function getCustomerById(id) {
  const { data, error } = await db
    .from('customers')
    .select(`
      *,
      users (*)
    `)
    .eq('user_id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data || null;
}


// Login customer
export async function getCustomerbycredentials(email, password) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError || !user) {
    return null;
  }

  const { data, error } = await db
    .from('users')
    .select(`
      *,
      customers (*)
    `)
    .eq('auth_user_id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


// Create customer
export async function createCustomer({
  Fname,
  Lname,
  Cnic,
  Phonenumber,
  Email,
  Password
}) {
  const supabase = await createClient();

  // Create authentication account
  const {
    data: { user },
    error: authError
  } = await supabase.auth.signUp({
    email: Email,
    password: Password
  });

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error('Failed to create authentication account.');
  }


  // Create application user
  const { data: appUser, error: userError } = await db
    .from('users')
    .insert({
      auth_user_id: user.id,
      fname: Fname,
      lname: Lname,
      cnic: Cnic,
      phonenumber: Phonenumber,
      email: Email,
      role_id: 1
    })
    .select('id')
    .single();

  if (userError) {
    throw userError;
  }


  // Create customer profile
  const { error: customerError } = await db
    .from('customers')
    .insert({
      user_id: appUser.id,
      balance: 0,
      kyc_status: 'pending'
    });

  if (customerError) {
    throw customerError;
  }


  return appUser.id;
}



export async function gettotalinvestments() {
  try {
    const { data, error } = await db
      .from('customers')
      .select('balance');

    if (error) {
      throw error;
    }

    const total = data.reduce(
      (sum, customer) => sum + Number(customer.balance || 0),
      0
    );

    return total;

  } catch (error) {
    console.error('Error calculating total investments:', error);
    throw error;
  }
}