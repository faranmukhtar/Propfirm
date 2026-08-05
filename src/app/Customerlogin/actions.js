"use server";

import { getCustomerbycredentials } from "@/lib/db/Customerqueries";
import { redirect } from "next/navigation";

export async function handlelogin(prevState, formData) {

    const email = formData.get("Email");
    const password = formData.get("Password");

    const customer = await getCustomerbycredentials(email, password);

    if (!customer) {
        return {
            error: "Incorrect email or password"
        };
    }

    redirect("/Customerdashboard");
}