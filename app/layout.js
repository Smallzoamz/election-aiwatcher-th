import './globals.css'
import { Noto_Sans_Thai } from 'next/font/google'
import DisclaimerModal from './components/DisclaimerModal'
import StructuredData from './components/StructuredData'
import { ThemeProvider } from './components/ThemeProvider'

const notoSansThai = Noto_Sans_Thai({
    subsets: ['thai', 'latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
})

// Full SEO Metadata Configuration
export const metadata = {
    // === Basic Metadata ===
    title: {
        default: 'TH Election AI Watch | ระบบวิเคราะห์การเลือกตั้งด้วย AI',
        template: '%s | TH Election AI Watch',
    },
    description: 'ระบบวิเคราะห์ความนิยมพรรคการเมืองไทยด้วย AI ติดตามแนวโน้มแบบ Real-time จากข่าวสารล่าสุด วิเคราะห์อารมณ์สังคมจาก RSS, Pantip, YouTube',
    keywords: [
        'เลือกตั้ง 2569', 'การเมืองไทย', 'AI วิเคราะห์', 'พรรคการเมือง',
        'ผลเลือกตั้ง', 'โพล', 'sentiment analysis', 'election prediction',
        'พรรคประชาชน', 'พรรคเพื่อไทย', 'real-time analysis'
    ],
    authors: [{ name: 'Bonchon-Studio', url: 'https://bonchon-studio.com' }],
    creator: 'Bonchon-Studio',
    publisher: 'Bonchon-Studio',
    generator: 'Next.js',

    // === App Configuration ===
    applicationName: 'TH Election AI Watch',
    referrer: 'origin-when-cross-origin',
    category: 'politics',

    // === Canonical & Alternate ===
    metadataBase: new URL('https://th-election-ai.vercel.app'),
    alternates: {
        canonical: '/',
        languages: {
            'th-TH': '/',
        },
    },

    // === Manifest & Icons ===
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },

    // === Open Graph (Facebook, LINE, etc.) ===
    openGraph: {
        title: 'TH Election AI Watch - ระบบวิเคราะห์การเลือกตั้งด้วย AI',
        description: 'ติดตามดัชนีความนิยมพรรคการเมืองไทยแบบ Real-time วิเคราะห์ด้วย AI จากข่าวสารและโซเชียลมีเดีย',
        url: 'https://th-election-ai.vercel.app',
        siteName: 'TH Election AI Watch',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'TH Election AI Watch - ระบบวิเคราะห์การเลือกตั้งด้วย AI',
            },
        ],
        locale: 'th_TH',
        type: 'website',
    },

    // === Twitter Card ===
    twitter: {
        card: 'summary_large_image',
        title: 'TH Election AI Watch',
        description: 'ระบบวิเคราะห์ความนิยมพรรคการเมืองไทยด้วย AI แบบ Real-time',
        images: ['/og-image.png'],
        creator: '@BonchonStudio',
    },

    // === Robots & Verification ===
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // === Other SEO Tags ===
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },

    // === Verification (Add your IDs when available) ===
    // verification: {
    //     google: 'your-google-verification-code',
    //     yandex: 'your-yandex-verification-code',
    // },
}

// Viewport configuration (separated in Next.js 14+)
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
        { media: '(prefers-color-scheme: dark)', color: '#020617' },
    ],
    colorScheme: 'dark light',
}

export default function RootLayout({ children }) {
    return (
        <html lang="th" suppressHydrationWarning data-theme="dark">
            <head>
                {/* Preconnect to external resources for performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* DNS Prefetch for API domains */}
                <link rel="dns-prefetch" href="https://www.matichon.co.th" />
                <link rel="dns-prefetch" href="https://www.prachachat.net" />

                {/* Structured Data for Rich Results */}
                <StructuredData />
            </head>
            <body className={notoSansThai.className}>
                <ThemeProvider>
                    {children}
                    <DisclaimerModal />
                </ThemeProvider>
            </body>
        </html>
    )
}

