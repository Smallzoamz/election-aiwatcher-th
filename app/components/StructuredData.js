// SEO Structured Data (JSON-LD) for Google Rich Results
export default function StructuredData() {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "TH Election AI Watch",
        "alternateName": "ระบบวิเคราะห์การเลือกตั้งด้วย AI",
        "url": "https://election-aiwatcher-th.vercel.app",
        "description": "ระบบวิเคราะห์ความนิยมพรรคการเมืองไทยด้วย AI ติดตามแนวโน้มแบบ Real-time จากข่าวสารล่าสุด",
        "applicationCategory": "NewsApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript",
        "inLanguage": "th",
        "isAccessibleForFree": true,
        "author": {
            "@type": "Organization",
            "name": "Bonchon-Studio",
            "logo": "https://election-aiwatcher-th.vercel.app/og-image.png"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Bonchon-Studio",
            "logo": {
                "@type": "ImageObject",
                "url": "https://election-aiwatcher-th.vercel.app/og-image.png"
            }
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "THB"
        },
        "potentialAction": {
            "@type": "ViewAction",
            "target": "https://election-aiwatcher-th.vercel.app"
        }
    };

    const newsArticleSchema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": "Election AI Watch: วิเคราะห์ความนิยมพรรคการเมืองไทยแบบรายวัน",
        "description": "ติดตามดัชนีความนิยมพรรคการเมืองไทยจากข่าวสารและโซเชียลมีเดีย วิเคราะห์ด้วย AI รุ่นใหม่ล่าสุด",
        "image": "https://election-aiwatcher-th.vercel.app/og-image.png",
        "datePublished": "2026-01-16T12:00:00Z",
        "dateModified": new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "Bonchon-Studio",
            "@type": "WebPage",
            "@id": "https://election-aiwatcher-th.vercel.app"
        },
        "about": {
            "@type": "Event",
            "name": "การเลือกตั้งทั่วไป พ.ศ. 2569",
            "startDate": "2026-02-08",
            "location": {
                "@type": "Country",
                "name": "Thailand"
            }
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "หน้าหลัก",
                "item": "https://election-aiwatcher-th.vercel.app"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "วิธีการคำนวณ",
                "item": "https://election-aiwatcher-th.vercel.app/methodology"
            }
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "ระบบ AI Watch คำนวณคะแนนอย่างไร?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ระบบใช้สูตร Quad-Weighted Hybrid Score (QWHS) โดยถ่วงน้ำหนักจาก นิด้าโพล, กระแสข่าวสาร, โซเชียลมีเดีย (Reddit, Pantip) และความสนใจใน Wikipedia"
                }
            },
            {
                "@type": "Question",
                "name": "ข้อมูลมีความแม่นยำแค่ไหน?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "เป็นการประมาณการเชิงสถิติด้วย AI เพื่อการวิจัยเท่านั้น ข้อมูลมีความคลาดเคลื่อน (Margin of Error) ประมาณ 3-5% และไม่ใช่ผลการเลือกตั้งจริง"
                }
            }
        ]
    };

    const datasetSchema = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "ดัชนีความนิยมพรรคการเมืองไทย 2569 (AI Projections)",
        "description": "ชุดข้อมูลโครงการประมาณการที่นั่ง ส.ส. และคะแนนนิยมรายวัน วิเคราะห์จากฐานข้อมูลข่าวสารและโพลสาธารณะ",
        "url": "https://election-aiwatcher-th.vercel.app",
        "keywords": ["การเมืองไทย", "เลือกตั้ง 2569", "ผลโพล", "AI Predictions"],
        "license": "https://creativecommons.org/licenses/by-nc/4.0/",
        "isAccessibleForFree": true,
        "creator": {
            "@type": "Organization",
            "name": "Bonchon-Studio"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
            />
        </>
    );
}
