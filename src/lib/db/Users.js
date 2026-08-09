import { createClient as createServerClient } from "@/lib/supabase/server";
// Import the standard supabase client to use the admin key
import { createClient as createAdminClient } from "@supabase/supabase-js"; 
import db from "./index";

export async function createCustomer({
  Fname,
  Lname,
  Cnic,
  Phonenumber,
  Email,
  Password,
}) {
  const supabase = await createServerClient();
  
  // Initialize admin client specifically for rollbacks
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Make sure this is in your .env.local
  );

  // 1. Create authentication account
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signUp({
    email: Email,
    password: Password,
  });

  if (authError) throw authError;
  if (!user) throw new Error("Failed to create authentication account.");

  try {
    // 2. Create application user
    const { data: appUser, error: userError } = await db
      .from("users")
      .insert({
        auth_user_id: user.id,
        fname: Fname,
        lname: Lname,
        cnic: Cnic,
        email: Email,
        phonenumber: Phonenumber,
        role_id: 1,
      })
      .select("id")
      .single();

    if (userError) throw userError;

    // 3. Create customer profile
    const { error: customerError } = await db.from("customers").insert({
      user_id: appUser.id,
      balance: 0,
      kyc_status: "pending",
    });

    if (customerError) throw customerError;

    return appUser.id;

  } catch (error) {
    console.error("Database insert failed, rolling back Auth user...", error);
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    throw error; 
  }
}

export async function getuserbyid(id) {
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("auth_user_id", id)
    .single();

  if (error) {
    console.error("Error getting user:", error);
    throw error;
  }

  return data;
}