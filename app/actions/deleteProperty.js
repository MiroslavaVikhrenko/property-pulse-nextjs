'use server'; // this is a server action
import cloudinary from "@/config/cloudinary"; // we are going to delete images from Cloudinary as well
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {
    // Check ownership to make sure that only the user who owns it can delete it
    const sessionUser = await getSessionUser();

    // Check for the session
    if (!sessionUser || !session.userId){
        throw new Error('User ID is required');
    }

    // Destructure user ID from session
    const {userId} = sessionUser;

    // Fetch the property from db to see if it's owned by logged in user
    const property = await Property.findById(propertyId);

    // Add check
    if(!property) throw new Error('Property Not Found');

    // Verify the ownership
    if(property.owner.toString() !== userId) {
        throw new Error('Unauthorized'); // show error page
    }

    // Delete images from Cloudinary
    // 1. Extract public ID from image URLs (ID is at the end of image URL) => split() method
    // First go through all of the images in the array => we want an array of IDs
    const publicIds = property.images.map((imageUrl) =>{
        // Split by '/'
        const parts = imageUrl.split('/');
        // We want the last element of the array (id.jpg) (-1), but we need to get rid of '.jpg' => split on '.' and then take the 1st part (0)
        return parts.at(-1).split('.').at(0); // this gives us the id
    }); 

    // 2. Delete images from Cloudinary
    if (publicIds.length > 0) {
        for (let publicId of publicIds) {
            await cloudinary.uploader.destroy('propertypulse/' + publicId);
        }
    }

    // Proceed with deletion
    await property.deleteOne();

    // Revalidate the path
    revalidatePath('/', 'layout');
}

export default deleteProperty;