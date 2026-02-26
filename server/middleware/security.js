/**
 * Security Middleware
 * Prevents NoSQL injection by removing keys starting with '$'.
 * Prevents Prototype Pollution by blocking '__proto__', 'constructor', 'prototype'.
 */

const sanitizeData = (data) => {
    if (data === null || data === undefined) return data;

    if (typeof data === 'object') {
        if (Array.isArray(data)) {
            return data.map(item => sanitizeData(item));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            // Block NoSQL operators ($) and Prototype Pollution keys
            if (key.startsWith('$') ||
                key === '__proto__' ||
                key === 'constructor' ||
                key === 'prototype') {
                continue;
            }
            sanitized[key] = sanitizeData(value);
        }
        return sanitized;
    }

    return data;
};

export const securityMiddleware = (req, res, next) => {
    req.body = sanitizeData(req.body);
    req.query = sanitizeData(req.query);
    req.params = sanitizeData(req.params);
    next();
};

export { sanitizeData }; // Export for testing
