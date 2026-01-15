import './globals.css'
import { Noto_Sans_Thai } from 'next/font/google'

const notoSansThai = Noto_Sans_Thai({
    subsets: ['thai', 'latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
})

export const metadata = {
    title: 'TH Election AI Watch | ระบบวิเคราะห์การเลือกตั้งด้วย AI',
    description: 'ระบบวิเคราะห์ความนิยมพรรคการเมืองไทยด้วย AI ติดตามแนวโน้มแบบ Real-time จากข่าวสารล่าสุด',
    keywords: ['เลือกตั้ง', 'การเมืองไทย', 'AI', 'วิเคราะห์', 'พรรคการเมือง'],
    authors: [{ name: 'Bonchon-Studio' }],
    openGraph: {
        title: 'TH Election AI Watch',
        description: 'ระบบวิเคราะห์ความนิยมพรรคการเมืองไทยด้วย AI',
        type: 'website',
        locale: 'th_TH',
        siteName: 'TH Election AI Watch',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TH Election AI Watch',
        description: 'ระบบวิเคราะห์ความนิยมพรรคการเมืองไทยด้วย AI',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="th">
            <body className={notoSansThai.className}>{children}</body>
        </html>
    )
}
