'use client';
import { useEffect } from "react";
import { useFormState } from 'react-dom'; //useActionState for react 19 = useFormState for react 18 
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import addMessage from "@/app/actions/addMessage";
import { FaPaperPlane } from "react-icons/fa";

const PropertyContactForm = ({property}) => {
  // Get the session
  const {data: session} = useSession();

  // Create State (second parameter - initial state (empty object))
  // addMessage returns {submitted: true} (or false)
  const [state, formAction] = useFormState(addMessage, {});

  // useEffect to check that submitted because we want to show a toast as well 
  useEffect(() => {
    // Check for error
    if (state.error) toast.error(state.error);
    // If success
    if (state.submitted) toast.success('Message sent successfully');
  }, [state]);

  // Check if submitted is true => then we don't want to return the form
  if(state.submitted) {
    return (
      <p className="text-green-500 mb-4">
        Your message has been sent
      </p>
    );
  }


    return (
      session && (
        <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-6">Contact Property Manager</h3>
              <form action={formAction} >
                <input 
                  type="hidden" 
                  id="recipient" 
                  name="recipient" 
                  defaultValue={property._id} 
                />
                <input 
                  type="hidden" 
                  id="property" 
                  name="property" 
                  defaultValue={property.owner} 
                />
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="phone"
                  >
                    Phone:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="body"
                  >
                    Message:
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
                    id="body"
                    name="body"
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <div>
                  
                </div>
              </form>
            </div>

    ));
};
 
export default PropertyContactForm;