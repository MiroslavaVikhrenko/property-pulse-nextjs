/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // array of objects of remote domains that we want to get images from
        remotePatterns: [
            // Add Google as a source (= as a remote pattern)
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // google account image comes from here
                pathname: '**'
            },
            // Add Cloudinary as a source (= as a remote pattern)
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com', // cloudinary domain where the images comes from
                pathname: '**'
            },
        ],
    },
};

export default nextConfig;
