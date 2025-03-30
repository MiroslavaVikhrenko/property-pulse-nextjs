'use server';
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

async function addMessage(formData) {

    // Connect to db
    await connectDB();

    const sessionUser = await getSessionUser();

    // Check for it
    if(!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required') // It will show a custom Error page
    }

    // Get user Id from sessionUser (getSessionUser() returns user Id)
    const {userId} = sessionUser;

    // Get the resipient
    const recipient = formData.get('recipient');

    // Check the recipient - we don't want users to send to their own properties
    if (userId === recipient) {
        return {error: 'You can not send a message to yourself'}
    }

    // Create a new Message object
    const newMessage = new Message({
        sender: userId,
        recipient,
        property: formData.get('property'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        body: formData.get('body')
    });

    await newMessage.save();

    return {submitted: true};
}

export default addMessage;