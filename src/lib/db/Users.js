import { createClient } from "@/lib/supabase/server";
import db from "./index";



export async function createCustomer({
  Fname,
  Lname,
  Cnic,
  Phonenumber,
  Email,
  Password,
}) {
  const supabase = await createClient();

  // Create authentication account
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signUp({
    email: Email,
    password: Password,
  });

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("Failed to create authentication account.");
  }

  // Create application user
  const { data: appUser, error: userError } = await db
    .from("users")
    .insert({
      auth_user_id: user.id,
      fname: Fname,
      lname: Lname,
      cnic: Cnic,
      email: Email,
      phonenumber: Phonenumber,
      role_id: CUSTOMER_ROLE_ID,
    })
    .select("id")
    .single();

  if (userError) {
    throw userError;
  }

  // Create customer profile
  const { error: customerError } = await db.from("customers").insert({
    user_id: appUser.id,
    balance: 0,
    kyc_status: "pending",
  });

  if (customerError) {
    throw customerError;
  }

  return appUser.id;
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