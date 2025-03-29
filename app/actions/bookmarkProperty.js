'use server';
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function bookmarkProperty(propertyId) {
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
    let message; // because we want to send a message back based on if it's bookmarked or removed from bookmarks

    // Check
    if (isBookmarked) {
        // If already bookmarked, then remove using pull() method
        user.bookmarks.pull(propertyId);
        message = 'Bookmark Removed';
        isBookmarked = false;
    } else {
        // If not bookmarked, then add using push() method
        user.bookmarks.push(propertyId);
        message = 'Bookmark Added';
        isBookmarked = true;
    }

    // Save to db
    await user.save();

    // Revalidate path
    revalidatePath('/properties/saved', 'page');

    return {
        message,
        isBookmarked,
    };
}
export default bookmarkProperty;