# 🗳️ Election Day Mode - Implementation Plan

> **สถานะ:** 📋 วางแผนไว้ก่อน (ยังไม่ได้ทำ)  
> **วันที่สร้าง:** 16 มกราคม 2569  
> **วันเลือกตั้ง:** 8 กุมภาพันธ์ 2569  

---

## 🎯 วัตถุประสงค์

สร้างระบบที่สามารถ **สลับโหมดอัตโนมัติ** จาก "AI Prediction Mode" ไปเป็น "Live Election Results Mode" เมื่อถึงวันเลือกตั้ง

---

## 📊 เปรียบเทียบ 2 โหมด

| ส่วน | 🔮 Prediction Mode (ตอนนี้) | 🗳️ Live Election Mode |
|------|---------------------------|------------------------|
| **Header** | "ดัชนีความนิยมปัจจุบัน" | "ผลการนับคะแนนสด" |
| **แหล่งข้อมูล** | RSS, Pantip, YouTube | ECT API / สำนักข่าว |
| **การคำนวณ** | AI Sentiment + NIDA Poll | ผลคะแนนจริง |
| **Chart** | Bar + Line (AI vs Poll) | Progressive Bar (นับได้กี่%) |
| **Card Data** | Projected Seats/Votes | Actual Votes Counted |
| **Refresh Rate** | ทุก 3 วินาที | ทุก 10-30 วินาที |
| **Countdown** | แสดง | **ซ่อน** (แสดง % นับแล้ว) |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    app/page.js (Main UI)                    │
│                                                             │
│   ┌─────────────┐    OR    ┌──────────────────────────┐    │
│   │ Prediction  │◄────────►│  Live Election Mode      │    │
│   │ Components  │          │  Components              │    │
│   └──────┬──────┘          └────────────┬─────────────┘    │
│          │                              │                   │
└──────────┼──────────────────────────────┼───────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────┐          ┌──────────────────────────┐
│ lib/ai-engine.js │          │ lib/election-results.js  │
│ (AI Sentiment)   │          │ (Live Data Fetcher) [NEW]│
└──────────────────┘          └──────────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────┐          ┌──────────────────────────┐
│ RSS/Pantip/YT    │          │ ECT API / News Scraper   │
│ (Prediction)     │          │ (Live Results)           │
└──────────────────┘          └──────────────────────────┘
```

---

## 📁 ไฟล์ที่ต้องสร้างใหม่

| ไฟล์ | รายละเอียด |
|------|------------|
| `lib/election-results.js` | Fetcher สำหรับดึงผลคะแนนจริง |
| `lib/mode-manager.js` | Logic ตรวจสอบวันที่และจัดการการสลับโหมด |
| `app/components/LiveResultsCard.js` | Card แสดงผลคะแนนจริง |
| `app/components/LiveResultsChart.js` | Chart แบบ Progressive |
| `app/components/VoteCounter.js` | แสดงจำนวนคะแนนที่นับได้ |

---

## 📁 ไฟล์ที่ต้องแก้ไข

| ไฟล์ | การแก้ไข |
|------|----------|
| `app/page.js` | เพิ่ม Mode switching logic, render component ตาม mode |
| `app/api/data/route.js` | เพิ่ม endpoint `/api/live-results` |
| `lib/ai-engine.js` | เพิ่ม `getMode()` function |
| `.env.local` | เพิ่ม `ELECTION_MODE=auto|prediction|live` |

---

## 🔄 Mode Switching Logic

```javascript
// lib/mode-manager.js (Concept)

const ELECTION_DATE = new Date('2026-02-08T08:00:00+07:00');
const ELECTION_END = new Date('2026-02-08T17:00:00+07:00');

export function getCurrentMode() {
    const now = new Date();
    const envMode = process.env.ELECTION_MODE || 'auto';
    
    // Manual override
    if (envMode === 'prediction') return 'prediction';
    if (envMode === 'live') return 'live';
    
    // Auto mode
    if (now >= ELECTION_DATE && now <= ELECTION_END) {
        return 'live'; // วันเลือกตั้ง: โหมดนับคะแนนสด
    }
    
    return 'prediction'; // ก่อนเลือกตั้ง: โหมดคาดการณ์
}
```

---

## 📡 แหล่งข้อมูลผลคะแนน (ต้องหา)

### ทางเลือกที่ 1: ECT (กกต.) Official
- **URL:** https://www.ect.go.th
- **ปัญหา:** ไม่มี Public API, ต้อง scrape
- **ความน่าเชื่อถือ:** ⭐⭐⭐⭐⭐

### ทางเลือกที่ 2: สำนักข่าว
- Thai PBS, Nation, Khaosod มักมี Live Data
- อาจมี JSON endpoint ที่ซ่อนอยู่
- **ความน่าเชื่อถือ:** ⭐⭐⭐⭐

### ทางเลือกที่ 3: Wikipedia/Wikidata
- มีข้อมูล Election results แต่ช้ากว่า
- **ความน่าเชื่อถือ:** ⭐⭐⭐

---

## ⚖️ ข้อควรระวังทางกฎหมาย

> ⚠️ **สำคัญ:** ในวันเลือกตั้ง มีช่วงเวลาที่ห้ามเผยแพร่ Exit Poll

| ช่วงเวลา | สถานะ |
|----------|--------|
| ก่อน 17:00 น. | ❌ ห้ามเผยแพร่ผลคาดการณ์ |
| หลัง 17:00 น. | ✅ เผยแพร่ได้ |

**แนะนำ:** ตั้งให้ Live Mode เริ่มทำงานหลัง 17:00 น.

---

## 📋 Checklist การทำงาน

- [ ] สร้าง `lib/mode-manager.js`
- [ ] สร้าง `lib/election-results.js`
- [ ] สร้าง API endpoint `/api/live-results`
- [ ] สร้าง `LiveResultsCard` component
- [ ] สร้าง `LiveResultsChart` component
- [ ] แก้ไข `page.js` ให้ render ตาม mode
- [ ] เพิ่ม ENV variable `ELECTION_MODE`
- [ ] ทดสอบ Mode switching
- [ ] หาแหล่งข้อมูลผลคะแนนจริง
- [ ] Deploy และทดสอบ Production

---

## 📅 Timeline แนะนำ

| วันที่ | งาน |
|--------|-----|
| 20 ม.ค. | สร้าง Mode Manager และ Basic UI |
| 25 ม.ค. | หาและทดสอบ Data Source |
| 1 ก.พ. | Integration Testing |
| 5 ก.พ. | Final Testing & Deploy |
| **8 ก.พ.** | **🗳️ Election Day!** |

---

## 💡 หมายเหตุ

แผนนี้เป็น **Draft** สามารถปรับเปลี่ยนได้ตามความเหมาะสม

**สร้างโดย:** An An (AI Assistant)  
**อนุมัติโดย:** รอ Papa Review ✅
