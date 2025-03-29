'use client'; // because we're going to use event handlers and hooks
import bookmarkProperty from "@/app/actions/bookmarkProperty";
import { toast } from "react-toastify"; // to use toast notifications
import { FaBookmark } from "react-icons/fa";
import { useSession } from "next-auth/react";  // useSession hook

const BookmarkButton = ({property}) => {
    // Initialize
    const {data:session} = useSession();
    // Get user ID
    const userId = session?.user?.id;

    // If not logged in, they can't bookmark property
    const handleClick = async () => {
        // if not logged in
        if (!userId) {
            toast.error('You need to be signed in to bookmark a listing');
            return;
        }

        // Call bookmarkProperty action and pass a function with response
        bookmarkProperty(property._id).then((res) =>{
            // Check for error
            if(res.error) return toast.error(res.error);
            // If no error 
            toast.success(res.message); // message from action
        })
    };

    return (
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
        onClick={handleClick}>
            <FaBookmark className='mr-2'/> Bookmark Property
        </button>
    );
};
 
export default BookmarkButton;