import fs from 'fs/promises';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'news-db.json');

// Lock mechanism to prevent race conditions
let isWriting = false;
const writeQueue = [];

// Initialize DB synchronously on startup (only once)
if (!existsSync(DB_PATH)) {
    const initialData = {
        'pp': [], 'pt': [], 'utn': [], 'bjt': [], 'dem': [], 'general': []
    };
    writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

// Load DB with migration support
function loadDB() {
    try {
        const raw = readFileSync(DB_PATH, 'utf8');
        const data = JSON.parse(raw);

        // Migration: If it's an array (old format), convert to object
        if (Array.isArray(data)) {
            return {
                'pp': [], 'pt': [], 'utn': [], 'bjt': [], 'dem': [], 'general': data
            };
        }
        return data;
    } catch (err) {
        console.error("DB Load Error:", err.message);
        return { 'pp': [], 'pt': [], 'utn': [], 'bjt': [], 'dem': [], 'general': [] };
    }
}

// Process write queue to prevent race conditions
async function processWriteQueue() {
    if (isWriting || writeQueue.length === 0) return;

    isWriting = true;
    const { db, resolve, reject } = writeQueue.shift();

    try {
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        resolve();
    } catch (err) {
        console.error("DB Write Error:", err.message);
        reject(err);
    } finally {
        isWriting = false;
        processWriteQueue(); // Process next in queue
    }
}

// Async write with queue
function writeDBAsync(db) {
    return new Promise((resolve, reject) => {
        writeQueue.push({ db, resolve, reject });
        processWriteQueue();
    });
}

export function getReadNews() {
    const db = loadDB();
    const allNews = new Set();
    Object.values(db).forEach(list => {
        if (Array.isArray(list)) {
            list.forEach(item => allNews.add(item));
        }
    });
    return allNews;
}

export async function markNewsAsRead(newsKey, partyId = null) {
    try {
        const db = loadDB();
        const targetCategory = partyId || 'general';

        if (!db[targetCategory]) {
            db[targetCategory] = [];
        }

        // Prevent duplicates
        if (!db[targetCategory].includes(newsKey)) {
            db[targetCategory].push(newsKey);

            // Auto-cleanup: Keep only last 500 items per category
            if (db[targetCategory].length > 500) {
                db[targetCategory] = db[targetCategory].slice(-500);
            }

            await writeDBAsync(db);
        }
    } catch (err) {
        console.error("DB Mark Read Error:", err.message);
    }
}

// Utility: Get news count
export function getNewsCount() {
    const db = loadDB();
    return Object.entries(db).reduce((acc, [key, list]) => {
        acc[key] = Array.isArray(list) ? list.length : 0;
        return acc;
    }, {});
}
