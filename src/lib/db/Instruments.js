import db from "./index";

export async function addinstrument(params) {}

export async function getallinstruments() {
  try {
    const { data, error } = await db.from("instruments").select(`*`);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching instruments: ", error);
    throw error;
  }
}

export async function getinstrumentbysymbol(SYM) {
  try {
    const { data, error } = await db
      .from("instruments")
      .select("*")
      .eq("symbol", SYM)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Instrument is not approved yet:", error);
    throw error;
  }
}



export async function getinstrumentbyid(id) {
  try {
    const { data, error } = await db
      .from("instruments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Instrument is not approved yet:", error);
    throw error;
  }
}
