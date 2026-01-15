// Party Detail Data - Top Policies and Key Info
// Data source: รวบรวมจากเว็บไซต์พรรค, ไทยรัฐ, กรุงเทพธุรกิจ และสำนักข่าวต่างๆ (มกราคม 2569)

export const PARTY_DETAILS = {
    pp: {
        fullName: "พรรคประชาชน",
        shortName: "ปชน.",
        founded: "2567",
        leader: "ณัฐพงษ์ เรืองปัญญาวุฒิ",
        slogan: "ไทยไม่เทา ไทยเท่ากัน ไทยทันโลก",
        website: "https://peoplesparty.or.th",
        color: "#FF4136",
        ideology: ["เสรีนิยมก้าวหน้า", "ประชาธิปไตย"],
        topPolicies: [
            { category: "ความมั่นคง", title: "ยกเลิกเกณฑ์ทหาร", description: "เปลี่ยนเป็นระบบสมัครใจ 100% พร้อมยุบ กอ.รมน." },
            { category: "การเมือง", title: "แก้รัฐธรรมนูญ", description: "ร่างรัฐธรรมนูญฉบับประชาชน ยุติการสืบทอดอำนาจ" },
            { category: "สวัสดิการ", title: "สวัสดิการถ้วนหน้า", description: "สวัสดิการเกิดจนเกษียณ เบี้ยผู้สูงอายุ 1,500 บ./เดือน" },
            { category: "เศรษฐกิจ", title: "ปราบทุนเทา-นอมินี", description: "ปกป้องผู้ประกอบการไทยจากสินค้าทะลักตัดราคา" },
            { category: "กระจายอำนาจ", title: "เลือกตั้งผู้ว่าฯ", description: "เลือกตั้งผู้ว่าราชการจังหวัดทุกจังหวัด" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://peoplesparty.or.th" }
        ]
    },
    pt: {
        fullName: "พรรคเพื่อไทย",
        shortName: "พท.",
        founded: "2551",
        leader: "จุลพันธ์ อมรวิวัฒน์",
        slogan: "ยกเครื่องประเทศไทย คนไทยไร้จน",
        website: "https://ptp.or.th",
        color: "#DA2028",
        ideology: ["ประชานิยม", "เสรีนิยม"],
        topPolicies: [
            { category: "เศรษฐกิจ", title: "กระเป๋าเงินดิจิทัล 10,000", description: "แจกเงินดิจิทัลกระตุ้นเศรษฐกิจฐานราก" },
            { category: "เศรษฐกิจ", title: "ค่าแรง 600 บ./วัน", description: "ปรับค่าแรงขั้นต่ำภายในปี 2570" },
            { category: "เกษตร", title: "ประกันกำไรเกษตรกร 30%", description: "ประกันกำไรข้าว ยาง ข้าวโพด มันสำปะหลัง" },
            { category: "โครงสร้างพื้นฐาน", title: "รถไฟฟ้า 20 บ. ตลอดสาย", description: "พร้อมรถเมล์แอร์ 10 บาท" },
            { category: "สวัสดิการ", title: "คนไทยไร้จน", description: "ช่วยผู้สูงอายุ-คนพิการ เดือนละ 3,000 บาท" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://ptp.or.th" }
        ]
    },
    utn: {
        fullName: "พรรครวมไทยสร้างชาติ",
        shortName: "รทสช.",
        founded: "2564",
        leader: "พีระพันธุ์ สาลีรัฐวิภาค",
        slogan: "เด็ดขาดแก้วิกฤต พลิกโฉมประเทศไทย",
        website: "https://utn.or.th",
        color: "#007FFF",
        ideology: ["อนุรักษ์นิยม", "ชาตินิยม"],
        topPolicies: [
            { category: "พลังงาน", title: "น้ำมัน 30 บ./ลิตร", description: "ทุบราคาเบนซินและดีเซลให้เหลือ 30 บ." },
            { category: "พลังงาน", title: "ค่าไฟ 3.3 บ./หน่วย", description: "รื้อต้นทุนราคาก๊าซ + โซลาร์เสรี" },
            { category: "ความมั่นคง", title: "พิฆาตคนชั่ว", description: "ประกาศสงครามทุนเทา สแกมเมอร์ ข้าราชการทุจริต" },
            { category: "เกษตร", title: "ข้าว 15,000 บ./ตัน", description: "ดูแลราคาสินค้าเกษตร + ปุ๋ยรัฐ 500 บ./กระสอบ" },
            { category: "การศึกษา", title: "ยุติสอบเข้าเรียน", description: "เด็กอยากเรียนอะไรต้องได้เรียน + กยศ. ทำงานแทนหนี้" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://utn.or.th" }
        ]
    },
    bjt: {
        fullName: "พรรคภูมิใจไทย",
        shortName: "ภท.",
        founded: "2551",
        leader: "อนุทิน ชาญวีรกูล",
        slogan: "พูดแล้วทำพลัส 4 เดือน 4 ภารกิจ",
        website: "https://bhumjaithai.com",
        color: "#0B1F4F",
        ideology: ["กลาง", "ประชานิยม"],
        topPolicies: [
            { category: "เศรษฐกิจ", title: "คนละครึ่ง พลัส", description: "รัฐช่วยครึ่งหนึ่ง ลดค่าครองชีพประชาชน" },
            { category: "เศรษฐกิจ", title: "พักหนี้ 3 ปี", description: "หยุดพักชำระหนี้ไม่เกิน 1 ล้านบาท ปลอดดอกเบี้ย" },
            { category: "พลังงาน", title: "ค่าไฟต่ำกว่า 3 บ./หน่วย", description: "200 หน่วยแรก + โซลาร์เซลล์ครัวเรือน" },
            { category: "สวัสดิการ", title: "เพิ่มค่า อสม. 2,000 บ.", description: "พร้อมประกันชีวิต + พยาบาลอาสา 15,000 บ./เดือน" },
            { category: "ความมั่นคง", title: "กองทุนภัยพิบัติ", description: "รัฐจ่ายประกัน 1,000 บ. เกิดเหตุได้ 100,000 บ./ครัวเรือน" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://bhumjaithai.com" }
        ]
    },
    dem: {
        fullName: "พรรคประชาธิปัตย์",
        shortName: "ปชป.",
        founded: "2489",
        leader: "เฉลิมชัย ศรีอ่อน",
        slogan: "ไทยหายจน ประเทศไทยไม่ทน",
        website: "https://democrat.or.th",
        color: "#40C0F0",
        ideology: ["เสรีประชาธิปไตย", "อนุรักษ์นิยม"],
        topPolicies: [
            { category: "สวัสดิการ", title: "เงินมารดาและเด็ก 5,000 บ.", description: "มอบเงินช่วยเหลือเดือนละ 5,000 บ. เป็นเวลา 1 ปี" },
            { category: "สวัสดิการ", title: "เบี้ยผู้สูงอายุ 1,000 บ.", description: "เบี้ยถ้วนหน้า + เพิ่มรายได้ผู้พิการ" },
            { category: "เกษตร", title: "ประกันรายได้เกษตรกร", description: "สร้างรายได้มั่นคงให้เกษตรกรทุกกลุ่ม" },
            { category: "โครงสร้างพื้นฐาน", title: "ค่าโดยสารสูงสุด 30 บ.", description: "รถไฟฟ้า รถเมล์ สูงสุดไม่เกิน 30 บาท" },
            { category: "เศรษฐกิจ", title: "ยกเว้นภาษี 40,000 บ.แรก", description: "ลดภาระภาษีให้แรงงาน + ราชการในมือถือ" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://democrat.or.th" }
        ]
    },
    pprp: {
        fullName: "พรรคพลังประชารัฐ",
        shortName: "พปชร.",
        founded: "2561",
        leader: "พล.อ.ประวิตร วงษ์สุวรรณ",
        slogan: "มั่นคง ฟื้นฟู และดูแล",
        website: "https://pprp.or.th",
        color: "#1E3A8A",
        ideology: ["อนุรักษ์นิยม", "ชาตินิยม"],
        topPolicies: [
            { category: "สวัสดิการ", title: "บัตรประชารัฐ Extra", description: "เพิ่มวงเงินจาก 300 เป็น 700 บ./เดือน" },
            { category: "พลังงาน", title: "ไฟฟ้าประชารัฐ", description: "ส่งเสริมโซลาร์เซลล์ชุมชนลดค่าไฟ" },
            { category: "ความมั่นคง", title: "ใครโกง ใครเทา เอาให้หนัก", description: "ปราบคอร์รัปชันและทุนสีเทาเด็ดขาด" },
            { category: "เกษตร", title: "เกษตรกรมั่งคั่ง", description: "ปุ๋ยคนละครึ่ง + ขายได้ก่อนปลูก" },
            { category: "การศึกษา", title: "เรียนสั้น ทันยุค มีงานรอ", description: "พัฒนาทักษะตรงความต้องการตลาด" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://pprp.or.th" }
        ]
    },
    cpd: {
        fullName: "พรรคชาติไทยพัฒนา",
        shortName: "ชทพ.",
        founded: "2550",
        leader: "วราวุธ ศิลปอาชา",
        slogan: "WOW Thailand ประเทศยั่งยืนเพื่อคนทุกรุ่น",
        website: "https://chartthaipattana.or.th",
        color: "#15803D",
        ideology: ["กลาง", "ประชานิยม"],
        topPolicies: [
            { category: "การเมือง", title: "รธน. ฉบับประชาชน", description: "ผลักดันรัฐธรรมนูญแบบบรรหารโมเดล ปี 2540" },
            { category: "เกษตร", title: "เกษตรกรขายคาร์บอนเครดิต", description: "ส่งเสริมเกษตรยั่งยืนขายคาร์บอนเครดิตได้" },
            { category: "เกษตร", title: "แจกพันธุ์ข้าวฟรี 60 ล้านไร่", description: "พร้อมเงินทุนเพาะปลูกไร่ละ 1,000 บ." },
            { category: "พลังงาน", title: "ไฟฟ้าเกษตร 2 บ./หน่วย", description: "ขยายเขตไฟฟ้าเกษตร + พลังงานธรรมชาติ" },
            { category: "โครงสร้างพื้นฐาน", title: "น้ำสะอาดทุกหมู่บ้าน", description: "บาดาลขนาดใหญ่ทุกตำบล น้ำประปาดื่มได้" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://chartthaipattana.or.th" }
        ]
    },
    tst: {
        fullName: "พรรคไทยสร้างไทย",
        shortName: "ทสท.",
        founded: "2564",
        leader: "คุณหญิงสุดารัตน์ เกยุราพันธุ์",
        slogan: "คนไทยหายเหนื่อย ดูแลเกิดจนแก่",
        website: "https://thaisangthai.org",
        color: "#DC2626",
        ideology: ["กลาง", "ประชานิยม"],
        topPolicies: [
            { category: "สวัสดิการ", title: "เด็กเล็ก 2,000 บ./เดือน", description: "สนับสนุนเด็กตั้งแต่ในครรภ์ - 6 ขวบ" },
            { category: "การศึกษา", title: "เรียนฟรีถึง ป.ตรี", description: "รัฐรับผิดชอบค่าเล่าเรียน ลดระยะเวลาเรียน" },
            { category: "สวัสดิการ", title: "บำนาญ 3,000 บ./เดือน", description: "ดูแลผู้สูงอายุพร้อมโปรแกรม Up Skill" },
            { category: "เศรษฐกิจ", title: "กองทุนเครดิตประชาชน", description: "กู้ดอกเบี้ยต่ำ 1%/เดือน ไม่ต้องค้ำประกัน 10,000-100,000 บ." },
            { category: "ความมั่นคง", title: "การเมืองสีขาว ไม่โกง", description: "หยุดคอร์รัปชัน งบรั่วปีละ 5 แสนล้าน" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://thaisangthai.org" }
        ]
    },
    srt: {
        fullName: "พรรคเสรีรวมไทย",
        shortName: "สร.",
        founded: "2561",
        leader: "พล.ต.อ.เสรีพิศุทธ์ เตมียเวส",
        slogan: "6 หยุด เพื่อประเทศไทย",
        website: "https://srt.or.th",
        color: "#7C3AED",
        ideology: ["เสรีนิยม", "ปฏิรูป"],
        topPolicies: [
            { category: "ความมั่นคง", title: "ปฏิรูปตำรวจ", description: "แก้ พ.ร.บ.ตำรวจ แยกงานป้องกัน-ปราบปราม" },
            { category: "ความมั่นคง", title: "หยุดคอร์รัปชัน", description: "ปราบทุจริตเด็ดขาดทุกระดับ" },
            { category: "ความมั่นคง", title: "ปฏิรูปกองทัพ", description: "ยกเลิกเกณฑ์ทหาร ลดขนาดกองทัพ ยกเลิกศาลทหาร" },
            { category: "การศึกษา", title: "เรียนฟรี ป.ตรี", description: "ยกเลิกหนี้ กยศ. เรียนฟรีจนจบปริญญาตรี" },
            { category: "สวัสดิการ", title: "บำนาญ 3,000 บ./เดือน", description: "ผู้สูงอายุ 65+ ไม่มีรายได้ + เบี้ยผู้พิการ 3,000 บ." }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://srt.or.th" }
        ]
    },
    tkm: {
        fullName: "พรรคไทยก้าวใหม่",
        shortName: "ทกม.",
        founded: "2567",
        leader: "ดร.สุชัชวีร์ สุวรรณสวัสดิ์",
        slogan: "ก้าวใหม่ เพื่อคนไทย",
        website: "https://thaikaomai.com",
        color: "#0EA5E9",
        ideology: ["เทคโนแครต", "ปฏิรูป"],
        topPolicies: [
            { category: "โครงสร้างพื้นฐาน", title: "Smart City ทุกจังหวัด", description: "พัฒนาเมืองอัจฉริยะด้วยเทคโนโลยี" },
            { category: "การศึกษา", title: "ปฏิรูปการศึกษา", description: "หลักสูตรทันสมัย เน้นทักษะอนาคต" },
            { category: "เศรษฐกิจ", title: "ส่งเสริม Tech Startup", description: "สนับสนุน Startup และ Digital Economy" },
            { category: "สิ่งแวดล้อม", title: "แก้ PM2.5", description: "แก้ปัญหาฝุ่นละอองอย่างยั่งยืน" },
            { category: "โครงสร้างพื้นฐาน", title: "ขนส่งสาธารณะทั่วถึง", description: "พัฒนาระบบขนส่งสาธารณะทุกภูมิภาค" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://thaikaomai.com" }
        ]
    },
    okm: {
        fullName: "พรรคโอกาสใหม่",
        shortName: "อ.ม.",
        founded: "2567",
        leader: "รอการเปิดตัว",
        slogan: "สร้างโอกาสใหม่ ให้คนไทย",
        website: "https://okas-mai.com",
        color: "#EC4899",
        ideology: ["กลาง"],
        topPolicies: [
            { category: "เศรษฐกิจ", title: "สร้างโอกาสทางเศรษฐกิจ", description: "ส่งเสริมผู้ประกอบการรายย่อย" },
            { category: "สวัสดิการ", title: "สวัสดิการพื้นฐาน", description: "ดูแลคุณภาพชีวิตประชาชน" },
            { category: "การศึกษา", title: "การศึกษาเข้าถึงได้", description: "ลดความเหลื่อมล้ำทางการศึกษา" },
            { category: "เกษตร", title: "เกษตรก้าวหน้า", description: "ส่งเสริมเทคโนโลยีการเกษตร" },
            { category: "สาธารณสุข", title: "สุขภาพเพื่อทุกคน", description: "ยกระดับระบบสาธารณสุข" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://okas-mai.com" }
        ]
    },
    econ: {
        fullName: "พรรคเศรษฐกิจ",
        shortName: "ศก.",
        founded: "2566",
        leader: "พล.อ.รังษี กิติญาณทรัพย์",
        slogan: "เศรษฐกิจดี ประชาชนมีสุข",
        website: "https://economic-party.or.th",
        color: "#10B981",
        ideology: ["เสรีนิยมทางเศรษฐกิจ"],
        topPolicies: [
            { category: "เศรษฐกิจ", title: "กระตุ้นเศรษฐกิจ", description: "นโยบายเศรษฐกิจเชิงรุก" },
            { category: "เศรษฐกิจ", title: "ส่งเสริมการลงทุน", description: "ดึงดูดการลงทุนต่างประเทศ" },
            { category: "เศรษฐกิจ", title: "ลดภาษี", description: "ปรับโครงสร้างภาษีเพื่อการแข่งขัน" },
            { category: "เศรษฐกิจ", title: "พัฒนาแรงงาน", description: "ยกระดับทักษะแรงงานไทย" },
            { category: "โครงสร้างพื้นฐาน", title: "โครงสร้างพื้นฐาน", description: "พัฒนาโครงสร้างพื้นฐานเพื่อเศรษฐกิจ" }
        ],
        externalLinks: [
            { name: "เว็บไซต์พรรค", url: "https://economic-party.or.th" }
        ]
    }
};

// Category color mapping
export const CATEGORY_COLORS = {
    "เศรษฐกิจ": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "การศึกษา": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "สาธารณสุข": "bg-green-500/20 text-green-400 border-green-500/30",
    "การเมือง": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "กระจายอำนาจ": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "เกษตร": "bg-lime-500/20 text-lime-400 border-lime-500/30",
    "พลังงาน": "bg-red-500/20 text-red-400 border-red-500/30",
    "ท่องเที่ยว": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "ความมั่นคง": "bg-slate-500/20 text-slate-400 border-slate-500/30",
    "โครงสร้างพื้นฐาน": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "สวัสดิการ": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "สิ่งแวดล้อม": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
};
