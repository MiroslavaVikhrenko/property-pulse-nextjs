'use client'; // because we're going to use event handlers and hooks
import { useState, useEffect } from 'react'; 
// when component loads we want to check the status
import bookmarkProperty from "@/app/actions/bookmarkProperty";
import checkBookmarkStatus from '@/app/actions/checkBookmarkStatus';
import { toast } from "react-toastify"; // to use toast notifications
import { FaBookmark } from "react-icons/fa";
import { useSession } from "next-auth/react";  // useSession hook

const BookmarkButton = ({property}) => {
    // Initialize
    const {data:session} = useSession();
    // Get user ID
    const userId = session?.user?.id;

    // Add states
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Return if not logged in
        if (!userId) {
            setLoading(false);
            return;
        }

        // Call checkBookmarkStatus
        checkBookmarkStatus(property._id).then((res) => {
            // Check for error
            if(res.error) toast.error(res.error);
            // Check for isBookmarked
            if(res.isBookmarked) setIsBookmarked(res.isBookmarked);
            // Set loading to false
            setLoading(false);
        });
    }, [property._id, userId, checkBookmarkStatus]);

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
            setIsBookmarked(res.isBookmarked); // isBookmarked from action
            // If no error 
            toast.success(res.message); // message from action
        })
    };

    // Check to see if it's loading
    if(loading) {
        return <p className="text-center">Loading...</p>
    }

    return isBookmarked ? (
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
        onClick={handleClick}>
            <FaBookmark className='mr-2'/> Remove Bookmark
        </button>
    ):(
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
        onClick={handleClick}>
            <FaBookmark className='mr-2'/> Bookmark Property
        </button>
    );
};
 
export default BookmarkButton;