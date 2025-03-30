import connectDB from "@/config/database";
import Message from "@/models/Message";
import '@/models/Property'; // Needed as we're going to use populate() method where we populate properties
import { convertToSerializableObject } from "@/utils/convertToObject";
import { getSessionUser } from "@/utils/getSessionUser";

const MessagesPage = async () => {
    connectDB();

    // Get session user
    const sessionUser = await getSessionUser();

    // Get the Id from session user
    const {userId} = sessionUser;

    // Get read and un-read messages - where recipient = userId 
    // The user checking the messages is the recipient
    // sort in ASC order => sort({createdAt: -1})
    const readMessages = await Message.find({recipient: userId, read: true})
        .sort({createdAt: -1})
        .populate('sender', 'username')
        .populate('property', 'name')
        .lean();

    const unreadMessages = await Message.find({recipient: userId, read: false})
        .sort({createdAt: -1})
        .populate('sender', 'username')
        .populate('property', 'name')
        .lean();

    // Create array of messages that includes both read and unread messages
    // Convert to serializable object on those
    const messages = [...unreadMessages, ...readMessages].map((messageDoc) =>{
        const message = convertToSerializableObject(messageDoc);
        message.sender = convertToSerializableObject(messageDoc.sender);
        message.property = convertToSerializableObject(messageDoc.property);
        return message;
    });

    // Show messages displayed on the screen

    return <section className='bg-blue-50'>
        <div className="container m-auto py-24 max-w-6xl">
            <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                <h1 className="text-3xl font-bold mb-4">Your Messages</h1>

                <div className="space-y-4">
                    {messages.length === 0 ? (<p>You have no messages</p>) : (
                        messages.map((message) => (
                            <h3 key={message._id}>{message.name}</h3>
                        ))
                    )}
                </div>
            </div>
        </div>
    </section>;
};
 
export default MessagesPage;