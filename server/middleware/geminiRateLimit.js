/**
 * Rate limiter for Gemini / resume analyze: 5 RPM, 20 RPD per user (or IP if no user).
 */
const RPM = parseInt(process.env.GEMINI_RPM, 10) || 5;
const RPD = parseInt(process.env.GEMINI_RPD, 10) || 20;
const WINDOW_MS = 60 * 1000;   // 1 minute
const DAY_MS = 24 * 60 * 60 * 1000;

// key -> { minuteTimestamps: number[], dayCount: number, dayStart: number }
const store = new Map();

function getKey(req) {
    if (req.user?.id) return `user:${req.user.id}`;
    return `ip:${req.ip || req.connection?.remoteAddress || 'unknown'}`;
}

function pruneMinute(entries, now) {
    const cutoff = now - WINDOW_MS;
    while (entries.length && entries[0] < cutoff) entries.shift();
}

function isNewDay(dayStart) {
    const now = Date.now();
    return !dayStart || (now - dayStart) >= DAY_MS;
}

export function geminiRateLimit(req, res, next) {
    const key = getKey(req);
    const now = Date.now();

    let data = store.get(key);
    if (!data) {
        data = { minuteTimestamps: [], dayCount: 0, dayStart: now };
        store.set(key, data);
    }

    // Reset day counter if we're in a new day
    if (isNewDay(data.dayStart)) {
        data.dayCount = 0;
        data.dayStart = now;
    }

    pruneMinute(data.minuteTimestamps, now);

    // Check RPM: max 5 in the last minute
    if (data.minuteTimestamps.length >= RPM) {
        return res.status(429).json({
            message: `Rate limit exceeded: max ${RPM} resume analyses per minute. Try again later.`,
            retryAfter: Math.ceil((data.minuteTimestamps[0] + WINDOW_MS - now) / 1000)
        });
    }

    // Check RPD: max 20 per day
    if (data.dayCount >= RPD) {
        return res.status(429).json({
            message: `Daily limit reached: max ${RPD} resume analyses per day. Resets at midnight.`
        });
    }

    data.minuteTimestamps.push(now);
    data.dayCount += 1;
    next();
}
