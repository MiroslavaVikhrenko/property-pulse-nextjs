'use client'; // because we're going to use event handlers and hooks
import bookmarkProperty from "@/app/actions/bookmarkProperty";
import { toast } from "react-toastify"; // to use toast notifications
import { FaBookmark } from "react-icons/fa";

const BookmarkButton = ({property}) => {
    return (
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
            <FaBookmark className='mr-2'/> Bookmark Property
        </button>
    );
};
 
export default BookmarkButton;