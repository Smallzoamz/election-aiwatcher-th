/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better debugging
    reactStrictMode: true,

    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.google.com',
                pathname: '/s2/favicons/**',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
            {
                protocol: 'https',
                hostname: '*.or.th',
            },
            {
                protocol: 'https',
                hostname: '*.com',
            },
            {
                protocol: 'https',
                hostname: '*.org',
            },
        ],
        // Optimize images
        formats: ['image/avif', 'image/webp'],
        // Cache images for 1 day
        minimumCacheTTL: 86400,
    },

    // Compiler optimizations
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Experimental features for performance
    experimental: {
        // Optimize package imports (tree-shaking)
        optimizePackageImports: ['lucide-react', 'recharts'],
    },

    // Headers for caching
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=2, stale-while-revalidate=5',
                    },
                ],
            },
            {
                source: '/:all*(svg|jpg|png|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    // Power/device hints
    poweredByHeader: false,

    // Compress responses
    compress: true,
};

export default nextConfig;
