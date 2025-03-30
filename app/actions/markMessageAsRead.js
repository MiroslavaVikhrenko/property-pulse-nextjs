'use server';
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function markMessageAsRead(messageId){
    await connectDB();
    
    // Get the user
    const sessionUser = await getSessionUser();
    
    // Check
    if (!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required');
    }
    
    // Get the user ID so we can de-structure it
    const {userId} = sessionUser;
    
    // Get the message
    const message = await Message.findById(messageId);

    // Check message
    if(!message) throw new Error('Message not found');

    // Verify ownership of the message
    if(message.recipient.toString() !== userId){
        throw new Error('Unauthorized');
    }

    // Change status
    message.read = !message.read;

    // Re-validate the path
    revalidatePath('/messages', 'page');

    // Save
    await message.save();

    // Return true or false
    return message.read;
}

export default markMessageAsRead;