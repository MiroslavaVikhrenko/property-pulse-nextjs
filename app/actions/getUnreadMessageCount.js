'use server';
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";


async function getUnreadMessageCount() {
    await connectDB();
    
    // Get the user
    const sessionUser = await getSessionUser();
    
    // Check
    if (!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required');
    }
    
    // Get the user ID so we can de-structure it
    const {userId} = sessionUser;
    
    // Get the count => pass condition to countDocuments(), return a count, not actual documents
    const count = await Message.countDocuments({
        // Condition
        recipient: userId,
        read: false
    });

    return {count};
}

export default getUnreadMessageCount;