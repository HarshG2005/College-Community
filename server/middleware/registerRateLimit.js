/**
 * Rate limiter for Register attempts: 5 per 60 minutes per IP.
 */
const WINDOW_MS = 60 * 60 * 1000; // 60 minutes
const MAX_ATTEMPTS = 5;

// key -> { attempts: number[], blockedUntil: number }
const store = new Map();

function getKey(req) {
    return `ip:${req.ip || req.connection?.remoteAddress || 'unknown'}`;
}

function pruneAttempts(attempts, now) {
    const cutoff = now - WINDOW_MS;
    while (attempts.length && attempts[0] < cutoff) attempts.shift();
}

// Cleanup task to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of store.entries()) {
        if (data.blockedUntil > now) continue;

        pruneAttempts(data.attempts, now);

        if (data.attempts.length === 0) {
            store.delete(key);
        }
    }
}, WINDOW_MS).unref(); // unref so it doesn't prevent the process from exiting

export function registerRateLimit(req, res, next) {
    const key = getKey(req);
    const now = Date.now();

    let data = store.get(key);
    if (!data) {
        data = { attempts: [], blockedUntil: 0 };
        store.set(key, data);
    }

    if (data.blockedUntil > now) {
        const waitSeconds = Math.ceil((data.blockedUntil - now) / 1000);
        return res.status(429).json({
            message: `Too many registration attempts. Please try again in ${waitSeconds} seconds.`
        });
    }

    pruneAttempts(data.attempts, now);

    if (data.attempts.length >= MAX_ATTEMPTS) {
        data.blockedUntil = now + WINDOW_MS;
        return res.status(429).json({
            message: `Too many registration attempts. Please try again in 60 minutes.`
        });
    }

    data.attempts.push(now);
    next();
}
