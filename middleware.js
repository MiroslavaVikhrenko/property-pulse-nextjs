export {default} from "next-auth/middleware"; // with just this line restrictions are applied to all routes

export const config = {
    // specify in array what exactly we want to protect
    matcher: [
        '/properties/add',
        '/profile',
        '/properties/saved',
        '/messages'
    ],
};