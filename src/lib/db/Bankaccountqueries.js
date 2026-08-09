import db from "./index";
import { createClient } from "@/lib/supabase/server";

export async function getaccountbyid(id) {
  try {
    const { data, error } = await db
      .from("bankaccounts")
      .select("*")
      .eq("user_id", id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching account: ", error);
    throw error;
  }
}
