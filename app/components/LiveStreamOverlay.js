'use client';

import { ExternalLink, Radio, Tv, Youtube, Globe } from 'lucide-react';

// ช่องถ่ายทอดสดทั้งหมด
const STREAMING_CHANNELS = [
    {
        name: 'กกต. Official',
        url: 'https://www.ect.go.th',
        icon: Globe,
        color: 'from-blue-600 to-blue-800',
        description: 'แหล่งข้อมูลหลัก กกต.',
        priority: true
    },
    {
        name: 'Thai PBS',
        url: 'https://www.youtube.com/@ThaiPBS',
        icon: Youtube,
        color: 'from-red-600 to-red-800',
        description: 'สื่อสาธารณะ ครบถ้วน'
    },
    {
        name: 'Nation TV',
        url: 'https://www.youtube.com/@NationTV22',
        icon: Youtube,
        color: 'from-orange-600 to-orange-800',
        description: 'รายงานเร็ว ทันเหตุการณ์'
    },
    {
        name: 'ช่อง 3 HD',
        url: 'https://www.youtube.com/@CH3Thailand',
        icon: Youtube,
        color: 'from-green-600 to-green-800',
        description: 'เข้าถึงง่าย ครอบคลุมกว้าง'
    },
    {
        name: 'ช่อง 7 HD',
        url: 'https://www.youtube.com/@CH7HD',
        icon: Youtube,
        color: 'from-amber-600 to-amber-800',
        description: 'ข่าวครบ ทั่วไทย'
    },
    {
        name: 'PPTV HD',
        url: 'https://www.youtube.com/@PPTVHD36',
        icon: Youtube,
        color: 'from-cyan-600 to-cyan-800',
        description: 'การเมืองจริงจัง'
    },
    {
        name: 'Workpoint',
        url: 'https://www.youtube.com/@workaborad',
        icon: Youtube,
        color: 'from-purple-600 to-purple-800',
        description: 'สไตล์ทันสมัย'
    },
    {
        name: 'The Standard',
        url: 'https://www.youtube.com/@TheStandardTH',
        icon: Youtube,
        color: 'from-slate-600 to-slate-800',
        description: 'เจาะลึก วิเคราะห์'
    },
    {
        name: 'Thairath',
        url: 'https://www.youtube.com/@ThairathOnline',
        icon: Youtube,
        color: 'from-red-700 to-red-900',
        description: 'เข้าถึงมวลชน'
    },
    {
        name: 'Matichon',
        url: 'https://www.youtube.com/@MatichonOnline',
        icon: Youtube,
        color: 'from-indigo-600 to-indigo-800',
        description: 'วิเคราะห์เชิงลึก'
    },
    {
        name: 'Khaosod',
        url: 'https://www.youtube.com/@kaborad',
        icon: Youtube,
        color: 'from-teal-600 to-teal-800',
        description: 'อัพเดทเร็ว ทันใจ'
    }
];

export default function LiveStreamOverlay() {
    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-auto">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    {/* Live Badge */}
                    <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/50 rounded-full px-4 py-2 mb-6 animate-pulse">
                        <Radio className="w-4 h-4 text-red-500" />
                        <span className="text-red-400 font-bold text-sm uppercase tracking-wider">ถ่ายทอดสด</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-amber-400 to-red-400">
                            📺 ติดตามถ่ายทอดสด
                        </span>
                        <br />
                        <span className="text-white">
                            ผลการนับคะแนนเลือกตั้ง
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
                        เลือกช่องทางที่ต้องการรับชม • อัพเดทผลคะแนนแบบเรียลไทม์
                    </p>

                    {/* Date/Time */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2">
                        <Tv className="w-4 h-4 text-cyan-400" />
                        <span className="text-slate-300 font-mono text-sm">8 กุมภาพันธ์ 2569 • 17:00 น. เป็นต้นไป</span>
                    </div>
                </div>

                {/* Channels Grid */}
                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {STREAMING_CHANNELS.map((channel, index) => {
                            const Icon = channel.icon;
                            return (
                                <a
                                    key={index}
                                    href={channel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group relative bg-gradient-to-br ${channel.color} rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${channel.priority ? 'ring-2 ring-amber-400/50 sm:col-span-2 lg:col-span-1' : ''}`}
                                >
                                    {/* Priority Badge */}
                                    {channel.priority && (
                                        <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                            แนะนำ
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-lg truncate">{channel.name}</h3>
                                            <p className="text-white/70 text-sm mt-1">{channel.description}</p>
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-white/50 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-10 text-center">
                    <p className="text-slate-500 text-sm max-w-xl mx-auto">
                        💡 เมื่อผลการนับคะแนนเริ่มประกาศ หน้านี้จะเปลี่ยนไปแสดงผลคะแนนอย่างเป็นทางการโดยอัตโนมัติ
                    </p>
                </div>
            </div>
        </div>
    );
}
