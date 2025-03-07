import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

// Whenever GET or POST request is made to api/auth, this is going to take over 
export {handler as GET, handler as POST};