export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/'],
        },
        sitemap: 'https://election-aiwatcher-th.vercel.app/sitemap.xml',
    }
}
