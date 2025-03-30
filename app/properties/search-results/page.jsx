import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const SearchResultsPage = async ({searchParams : {location, propertyType}}) => {
    await connectDB();

    // Fetch the properties that match those values

    // Create Regex pattern for the location - case insensitive ('i')
    const locationPattern = new RegExp(location, 'i');

    // Match that against a bunch of fields in the db, including all the location fields (street, city, state...)
    // But also match it to the name and the description
    let query = {
        // From Mongoose
        $or:[
            {name: locationPattern},
            {description: locationPattern},
            {'location.street': locationPattern},
            {'location.city': locationPattern},
            {'location.state': locationPattern},
            {'location.zipcode': locationPattern},
        ]
    }

    // Check propertyType if it's not All (in this case it's default)
    // As we only want to run this if it's not All
    if (propertyType && propertyType !== 'All') {
        // Create type pattern
        const typePattern = new RegExp(propertyType, 'i');
        // Build query for db so that we can match those values
        query.type = typePattern;
    }

    // Make the actual query
    const propertiesQueryResults = await Property.find(query).lean();
    const properties = convertToSerializableObject(propertiesQueryResults);

    return <>
        <section className="bg-blue-700 py-4">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
                <PropertySearchForm />
            </div>
        </section>
        <section className="px-4 py-6">
            <div className="container-xl lg:container m-auto px-4 py-6">
                <Link href='/properties' className='flex items-center text-blue-500 hover:underline mb-3'>
                    <FaArrowAltCircleLeft className='mr-2 mb-1' /> Back to Properties
                </Link>
                <h1 className="text-2xl mb-4">Search Results</h1>
                {properties.length === 0 ? (<p>No search results</p>) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    </> ;
};
 
export default SearchResultsPage;