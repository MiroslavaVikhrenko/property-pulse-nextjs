const SubmitMessageButton = () => {
    return ( 
        <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
            type="submit"
        >
            <FaPaperPlane className='mr-2' /> Send Message
        </button>
     );
}
 
export default SubmitMessageButton;