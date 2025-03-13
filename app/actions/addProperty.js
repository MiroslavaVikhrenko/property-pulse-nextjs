'use server';
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache"; // once we submit => it'll update the cache and update the listings
import {redirect} from 'next/navigation';

async function addProperty(formData) {

    // Connect to db
    await connectDB();

    const sessionUser = await getSessionUser();

    // Check for it
    if(!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required') // It will show a custom Error page
    }

    // Get user Id from sessionUser (getSessionUser() returns user Id)
    const {userId} = sessionUser;

    // Access all values from amenities and images => we use exact field names from PropertyAddForm component
    const amenities = formData.getAll('amenities')
    // Images are different as getAll() would give us image objects, not just the name
    // But we want juat an array of image names
    // So we can use combination of filter() and map() for that
    // filter() => filter out any empty names 
    // map() => re-format it to just an array of image names

    //ultimately these images are going to come from Cloudinary 
    const images = formData
        .getAll('images')
        .filter((image) => image.name !== '')
        .map((image) => image.name);
    //console.log(images);

    const propertyData = {
        owner: userId, // this way it's connected to an actual user and now we know who is submitting a new property

        // get() as it's a single value
        type: formData.get('type'),
        name: formData.get('name'),
        description: formData.get('description'),
        location: {
            street: formData.get('location.street'),
            city: formData.get('location.city'),
            state: formData.get('location.state'),
            zipcode: formData.get('location.zipcode'),
        },
        beds: formData.get('beds'),
        baths: formData.get('baths'),
        square_feet: formData.get('square_feet'),
        amenities,
        rates: {
            nightly: formData.get('rates.nightly'),
            weekly: formData.get('rates.weekly'),
            monthly: formData.get('rates.monthly')
        },
        seller_info: {
            name: formData.get('seller_info.name'),
            email: formData.get('seller_info.email'),
            phone: formData.get('seller_info.phone'),
        },
        images
    };
    //console.log(propertyData);

    // Use Property model to create a new property
    const newProperty = new Property(propertyData);
    await newProperty.save();

    // Revalidate path
    revalidatePath('/', 'layout');

    // Redirect to the new property page
    redirect(`/properties/${newProperty._id}`);
}

export default addProperty;