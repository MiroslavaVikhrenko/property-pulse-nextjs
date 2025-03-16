'use server';
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

async function updateProperty(propertyId, formData) {
    // Connect to db
    await connectDB();
    
    const sessionUser = await getSessionUser();
    
    // Check for it
    if(!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required') // It will show a custom Error page
    }
    
    // Get user Id from sessionUser (getSessionUser() returns user Id)
    const {userId} = sessionUser;

    // Fetch property
    const existingProperty = await Property.findById(propertyId);

    // Verify ownership
    if(existingProperty.owner.toString() !== userId) {
        throw new Error('Current user does not own this property');
    }

    // Get together property data
    const propertyData = {
        owner: userId, 

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
        amenities: formData.getAll('amenities'),
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
        
    };

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(propertyId, propertyData);

    // Revalidate path
    revalidatePath('/', 'layout');

    // Redirect to the updated property actual page
    redirect(`/properties/${updatedProperty._id}`);
}

export default updateProperty;