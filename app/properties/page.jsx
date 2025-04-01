import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import connectDB from '@/config/database';
import Property from '@/models/Property';

// searchParams for pagination => to be able to go to /properties?page=1 or 2, 3...
// De-structure searchParams and set default 1 for page
const PropertiesPage = async ({searchParams: {page = 1, pageSize = 2}}) => {
    await connectDB();

    const skip = (page - 1) * pageSize;

    const total = await Property.countDocuments({});
    // find({}) - passing empty object as not specifying filter, lean() - optimize query performance
    // by returning plain JS objects instead of mongoose documents (read only)
    const properties = await Property.find({}).skip(skip).limit(pageSize);
    return (
        <section className='px-4 py-6'>
            <div className='container-xl lg:container m-auto px-4 py-6'>
                {properties.length === 0 ? (<p>No properties found</p>) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {
                            properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))
                        }
                    </div>
                )}
                <Pagination />
            </div>
        </section>
    );
};
 
export default PropertiesPage;