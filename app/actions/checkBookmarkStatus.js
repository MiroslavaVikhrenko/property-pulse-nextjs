'use server';
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

async function checkBookmarkStatus(propertyId){
    await connectDB();
    
    // Get the user
    const sessionUser = await getSessionUser();
    
    // Check
    if (!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required');
    }
    
    // Get the user ID so we can de-structure it
    const {userId} = sessionUser;
    
    // Get user from db
    const user = await User.findById(userId);
    
    // Check to see if this is bookmarked, is this property already in their bookmarks array
    let isBookmarked = user.bookmarks.includes(propertyId); // boolean

    return {isBookmarked};
}

export default checkBookmarkStatus;