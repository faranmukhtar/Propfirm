
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function handlelogin(prevState, formData) {
  const email = formData.get("Email");
  const password = formData.get("Password");

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toString(),
    password: password.toString(),
  });

  if (error) {
    console.error("Login error:", error);

    return {
      error: "Incorrect email or password.",
    };
  }

  if (!data.user) {
    return {
      error: "Unable to sign in.",
    };
  }

  // Supabase has now created the authenticated session.
  redirect("/customerdashboard");
}
