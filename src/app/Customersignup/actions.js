"use server";

import { createCustomer } from "@/lib/db/Users";
import { redirect } from "next/navigation";

export async function handleRegister(prevState, formData) {
  const fullName = formData.get("fullName") || "";
  const Cnic = formData.get("Cnic");
  const Phonenumber = formData.get("Phonenumber");
  const Email = formData.get("Email");
  const Password = formData.get("Password");
  const ConfirmPassword = formData.get("ConfirmPassword");

  if (String(Password).trim() !== String(ConfirmPassword).trim()) {
    return {
      error: "Passwords do not match"
    };
  }

  const parts = fullName.trim().split(/\s+/);
  const Fname = parts[0] || "";
  const Lname = parts.slice(1).join(" ") || "";

  try {
    await createCustomer({
      Fname,
      Lname,
      Cnic,
      Phonenumber,
      Email,
      Password,
    });
  } catch (error) {
    console.error("MySQL Error during customer registration:", error);
    return {
      error: "Registration failed"
    };
  }

  redirect("/Customerlogin");
}