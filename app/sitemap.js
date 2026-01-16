export default function sitemap() {
    const baseUrl = 'https://election-aiwatcher-th.vercel.app';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${baseUrl}/methodology`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];
}
