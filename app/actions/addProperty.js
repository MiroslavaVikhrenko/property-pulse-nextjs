'use server';
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache"; // once we submit => it'll update the cache and update the listings
import {redirect} from 'next/navigation';
import cloudinary from "@/config/cloudinary";

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
    // const images = formData
    //     .getAll('images')
    //     .filter((image) => image.name !== '')
    //     .map((image) => image.name);
    //console.log(images);

    // After connecting Cloudinary:
    const images = formData
        .getAll('images')
        .filter((image) => image.name !== '')
        ;

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
        //images, // after connecting to Cloudinary
    };
    //console.log(propertyData);

    // Cloudinary (empty array of image URLs)
    const imageUrls = [];

    // Loop over all image files, convert them to base64
    // images => image objects uploaded from the form
    for (const imageFile of images){
        const imageBuffer = await imageFile.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        // Convert to base64 (that's how we need to send it with the request)
        const imageBase64 = imageData.toString('base64'); // Now we can make a request

        // Make request to Cloudinary (uploader object, upload() method)
        // 'folder' is optional object that we can pass to upload() 
        const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageBase64}`, {
            folder: 'propertypulse'
        });
        // Add each image to the array 
        // secure_url property = cloudinary URL that we want to add to array and ultimately add to db
        imageUrls.push(result.secure_url);
    }

    // In order to add image URLs to the db
    propertyData.images = imageUrls;

    // Use Property model to create a new property
    const newProperty = new Property(propertyData);
    await newProperty.save();

    // Revalidate path
    revalidatePath('/', 'layout');

    // Redirect to the new property page
    redirect(`/properties/${newProperty._id}`);
}

export default addProperty;