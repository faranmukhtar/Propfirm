import db from "./index";

export async function numtraders() {
  const num = `SELECT COUNT(Traderid) FROM traders`;
}

export async function getTraderById(id) {
  const { data, error } = await db
    .from("traders")
    .select(
      `
      *,
      users (*)
    `,
    )
    .eq("user_id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data || null;
}
