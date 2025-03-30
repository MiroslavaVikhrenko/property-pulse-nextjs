import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";

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

    return <div>search results</div> ;
};
 
export default SearchResultsPage;