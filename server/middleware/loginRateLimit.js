/**
 * Rate limiter for Login attempts: 30 per 15 minutes per IP.
 */
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 30;

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

export function loginRateLimit(req, res, next) {
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
            message: `Too many login attempts. Please try again in ${waitSeconds} seconds.`
        });
    }

    pruneAttempts(data.attempts, now);

    if (data.attempts.length >= MAX_ATTEMPTS) {
        data.blockedUntil = now + WINDOW_MS;
        return res.status(429).json({
            message: `Too many login attempts. Please try again in 15 minutes.`
        });
    }

    data.attempts.push(now);
    next();
}
