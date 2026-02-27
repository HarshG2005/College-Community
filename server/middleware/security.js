// 🛡️ Sentinel: Security Middleware
// Prevents NoSQL Injection and Prototype Pollution by sanitizing request data.

function sanitize(obj) {
    if (obj instanceof Date) return obj;
    // Handle Primitives
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Handle Arrays
    if (Array.isArray(obj)) {
        return obj.map(item => sanitize(item));
    }

    // Handle Objects
    const cleaned = {};
    for (const key in obj) {
        // Block Prototype Pollution
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue;
        }

        // Block NoSQL Injection (keys starting with $)
        if (key.startsWith('$')) {
            continue;
        }

        // Recursively sanitize value
        cleaned[key] = sanitize(obj[key]);
    }
    return cleaned;
}

export function securityMiddleware(req, res, next) {
    // We must handle cases where req.body might not be an object (e.g. text/plain)
    if (req.body && typeof req.body === 'object') {
        req.body = sanitize(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        req.query = sanitize(req.query);
    }
    if (req.params && typeof req.params === 'object') {
        req.params = sanitize(req.params);
    }
    next();
}
