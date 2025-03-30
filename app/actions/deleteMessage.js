'use server'; // this is a server action
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteMessage(messageId) {
    // Check ownership to make sure that only the user who owns it can delete it
    const sessionUser = await getSessionUser();

    // Check for the session
    if (!sessionUser || !sessionUser.userId){
        throw new Error('User ID is required');
    }

    // Destructure user ID from session
    const {userId} = sessionUser;

    // Get the message
    const message = await Message.findById(messageId);

    // Verify ownership
    if(message.recipient.toString() !== userId){
        throw new Error('Unauthorized');
    }

    await message.deleteOne();

    // Revalidate the path
    revalidatePath('/', 'layout');
}

export default deleteMessage;