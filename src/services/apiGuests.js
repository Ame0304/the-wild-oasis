import supabase from "./supabase";

export async function getGuests(searchTerm = "") {
  const { data, error } = await supabase
    .from("guests")
    .select("id,fullName")
    .ilike("fullName", `%${searchTerm}%`);

  if (error) {
    console.error("Guests cannot found:", error);
    return [];
  }

  const guests = data.map((guest) => ({
    value: guest.id,
    label: guest.fullName,
  }));

  return guests;
}
