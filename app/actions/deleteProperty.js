'use server'; // this is a server action
import cloudinary from "@/config/cloudinary"; // we are going to delete images from Cloudinary as well
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {}

export default deleteProperty;