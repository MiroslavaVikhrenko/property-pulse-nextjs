/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // array of objects of remote domains that we want to get images from
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // google account image comes from here
                pathname: '**'
            },
        ],
    },
};

export default nextConfig;
