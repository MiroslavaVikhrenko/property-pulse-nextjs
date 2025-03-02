import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";

const PropertyPage = async ({ params }) => {
    await connectDB();
    const property = await Property.findById(params.id).lean();
    return (
        <>
        <PropertyHeaderImage image={property.images[0]}/>
        <section>
        <div className="container m-auto py-6 px-6">
        <Link
          href="/properties"
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          <FaArrowLeft className='mr-2'/> Back to Properties
        </Link>
        </div>
        </section>
        <section>{property.name}</section>
        </>
);
};
 
export default PropertyPage;