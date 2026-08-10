import db from "./index";

export async function addinstrument(cname, symbol, approved = false) {
  try {
    const cleanSymbol = symbol.trim().toUpperCase();

    // Check if instrument already exists
    const { data: existingInstrument, error: existingError } = await db
      .from("instruments")
      .select("*")
      .eq("symbol", cleanSymbol)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    // Already exists
    if (existingInstrument) {
      if (existingInstrument.approved) {
        throw new Error(
          `${cleanSymbol} is already approved and available to traders.`
        );
      }

      throw new Error(
        `${cleanSymbol} has already been requested and is waiting for approval.`
      );
    }

    // Doesn't exist, create request
    const { data, error } = await db
      .from("instruments")
      .insert({
        company_name: cname.trim(),
        symbol: cleanSymbol,
        approved
      })
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding instrument:", error);
    throw error;
  }
}

export async function getallapprovedinstruments() {
  try {
    const { data, error } = await db
      .from("instruments")
      .select(`*`)
      .eq("approved", true);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching instruments: ", error);
    throw error;
  }
}


export async function getallrequestedinstruments() {
  try {
    const { data, error } = await db
      .from("instruments")
      .select(`*`)
      .eq("approved", false);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching instruments: ", error);
    throw error;
  }
}


export async function approveinstrument(id) {
  try {
    const { data, error } = await db
      .from("instruments")
      .update({ approved: true })
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error approving instrument:", error);
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



export async function getnumapproved() {
  try {
    const { count, error } = await db
      .from("instruments")
      .select("id", { count: "exact", head: true })
      .eq("approved", true);

    if (error) {
      throw error;
    }

    return count;
  } catch (error) {
    console.error("Instrument is not approved yet:", error);
    throw error;
  }
}



export async function getnumrequested() {
  try {
    const { count, error } = await db
      .from("instruments")
      .select("id", { count: "exact", head: false })
      .eq("approved", false);

    if (error) {
      throw error;
    }

    return count;
  } catch (error) {
    console.error("Instrument is not approved yet:", error);
    throw error;
  }
}


export async function deleteinstrument(id) {
  try {
    const { data, error } = await db
      .from("instruments")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error deleting instrument:", error);
    throw error;
  }
}