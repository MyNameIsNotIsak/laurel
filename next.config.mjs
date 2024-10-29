/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.futlaurel.com'], // Ensure this domain is included
    },
    basePath: '/laurel',
    assetPrefix: '/laurel/',
    // ... other configurations ...
};

export default nextConfig;
