// lib/gemini-client.js
// Gemini 2.0 Flash Integration for Ambiguous News Analysis

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Rate limiting to stay within Free Tier
let lastCallTime = 0;
const MIN_INTERVAL_MS = 4000; // 15 RPM = 4 seconds minimum between calls
let callCount = 0;
let callCountResetTime = Date.now();

// Reset call count every minute
function checkRateLimit() {
    const now = Date.now();
    if (now - callCountResetTime > 60000) {
        callCount = 0;
        callCountResetTime = now;
    }
    return callCount < 15; // Free tier limit: 15 RPM
}

/**
 * Analyze a news headline using Gemini 2.0 Flash
 * @param {string} headline - The news headline to analyze
 * @returns {Promise<{sentiment: string, score: number, reason: string, isGemini: boolean}>}
 */
export async function analyzeWithGemini(headline) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ GEMINI_API_KEY not configured. Skipping Gemini analysis.');
        return null;
    }

    // Check rate limit
    if (!checkRateLimit()) {
        console.warn('⚠️ Gemini rate limit reached. Using fallback.');
        return null;
    }

    // Enforce minimum interval
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    if (timeSinceLastCall < MIN_INTERVAL_MS) {
        await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL_MS - timeSinceLastCall));
    }

    try {
        const prompt = `วิเคราะห์หัวข้อข่าวการเมืองไทยนี้:
"${headline}"

ตอบเป็น JSON เท่านั้น ในรูปแบบ:
{"sentiment": "pos|neg|neu", "score": -1.0 ถึง 1.0, "reason": "เหตุผลสั้นๆ", "party": "ชื่อพรรคที่เกี่ยวข้องหรือ null"}

ตัวอย่าง: {"sentiment": "neg", "score": -0.7, "reason": "มีการกล่าวหาทุจริต", "party": "เพื่อไทย"}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 150,
                }
            })
        });

        lastCallTime = Date.now();
        callCount++;

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', response.status, errorText);
            return null;
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            console.warn('⚠️ Empty response from Gemini');
            return null;
        }

        // Parse JSON from response (handle markdown code blocks)
        let jsonStr = textResponse;
        if (textResponse.includes('```')) {
            const match = textResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (match) jsonStr = match[1];
        }

        const parsed = JSON.parse(jsonStr.trim());

        console.log('🤖 Gemini Analysis:', parsed);

        return {
            sentiment: parsed.sentiment || 'neu',
            score: parseFloat(parsed.score) || 0,
            reason: parsed.reason || 'Gemini วิเคราะห์',
            party: parsed.party || null,
            isGemini: true
        };

    } catch (error) {
        console.error('Gemini analysis failed:', error.message);
        return null;
    }
}

/**
 * Calculate ambiguity score for a headline
 * High score = needs Gemini verification
 * @param {string} headline 
 * @param {number} ruleBasedScore - Score from rule-based analysis (-1 to 1)
 * @param {number} positiveCount - Number of positive keywords found
 * @param {number} negativeCount - Number of negative keywords found
 * @returns {number} Ambiguity score 0-1
 */
export function calculateAmbiguityScore(headline, ruleBasedScore, positiveCount, negativeCount) {
    let ambiguity = 0;

    // 1. Mixed signals: both positive and negative keywords present
    if (positiveCount > 0 && negativeCount > 0) {
        ambiguity += 0.4;
    }

    // 2. Low confidence: score is near zero
    if (Math.abs(ruleBasedScore) < 0.3) {
        ambiguity += 0.3;
    }

    // 3. Sarcasm indicators (Thai)
    const sarcasmWords = ['น่ะ', 'หรอก', 'เหรอ', 'จริงหรือ', 'แหม', 'โอ้โห', 'ว้าว'];
    const hasSarcasm = sarcasmWords.some(word => headline.includes(word));
    if (hasSarcasm) {
        ambiguity += 0.3;
    }

    // 4. Question marks often indicate uncertainty or controversy
    if (headline.includes('?') || headline.includes('หรือไม่')) {
        ambiguity += 0.2;
    }

    // 5. Quotation marks may indicate disputed claims
    if (headline.includes('"') || headline.includes("'") || headline.includes('"')) {
        ambiguity += 0.1;
    }

    return Math.min(1, ambiguity);
}

// Export for testing
export function getGeminiStats() {
    return {
        callCount,
        lastCallTime: new Date(lastCallTime).toISOString(),
        remainingCalls: 15 - callCount
    };
}
