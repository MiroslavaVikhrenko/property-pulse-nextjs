// Component to switch between properties pages 
const Pagination = ({page, pageSize, totalItems}) => {
    return <section className='container mx-auto flex justify-center items-center my-8'>
        <a href="#" className="mr-2 px-2 py-1 border border-gray-300 rounded">
            Previous
        </a>

        <span className="mx-2">Page 1 of 4</span>

        <a href="#" className="ml-2 px-2 py-1 border border-gray-300 rounded">
            Next
        </a>
    </section>;
};
 
export default Pagination;