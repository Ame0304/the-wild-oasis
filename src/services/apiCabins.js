import { format } from "date-fns";
import supabase, { supabaseUrl } from "./supabase";
import { formatDate } from "../utils/helpers";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded.");
  }

  return data;
}

export async function getAvailableCabins(startDate, endDate, guestCount) {
  console.log(startDate, endDate, guestCount);
  // Get cabins with overlapping bookings
  const { data: bookedCabins, error: bookingError } = await supabase
    .from("bookings")
    .select("cabinId")
    .lte("startDate", endDate) // booking starts before or on the requested end date
    .gte("endDate", startDate); // booking ends after or on the requested start date

  if (bookingError) {
    console.error("Error fetching bookings", bookingError);
    return [];
  }

  // Get the array of booked cabin IDs
  const bookedCabinIds = bookedCabins.map((booking) => booking.cabinId);

  // Then get available cabins
  const { data, error: cabinError } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity")
    .gte("maxCapacity", guestCount)
    .not("id", "in", `(${bookedCabinIds.join(",")})`);

  if (cabinError) {
    console.error("Error fetching cabins", cabinError);
    return [];
  }

  const availableCabins = data.map((cabin) => ({
    value: cabin.id,
    label: `${cabin.name} - ${cabin.maxCapacity} guests`,
  }));
  console.log(availableCabins);

  return availableCabins;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. create or edit a cabin
  let query = supabase.from("cabins");

  // a} create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // b) edit
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created.");
  }

  // 2. if successful, upload the image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. delete the cabin if there was an error uploading the image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created."
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted.");
  }

  return;
}
