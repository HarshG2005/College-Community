/**
 * Security Middleware to prevent NoSQL Injection and DoS attacks.
 *
 * 1. Sanitizes inputs against NoSQL Injection by removing keys starting with '$'.
 * 2. Normalizes req.query values to strings (except arrays) to prevent DoS via Type Errors.
 */

// Recursively remove keys starting with $
const sanitize = (obj) => {
    if (obj instanceof Array) {
        return obj.map(val => sanitize(val));
    } else if (obj instanceof Object && obj !== null) {
        for (const key in obj) {
            if (/^\$/.test(key)) {
                delete obj[key];
                continue;
            }
            obj[key] = sanitize(obj[key]);
        }
    }
    return obj;
};

// Convert objects to strings (recursively for arrays)
// This is applied to req.query to prevent Object.method() crashes
const stringifyObjects = (val) => {
    if (val instanceof Array) {
        return val.map(stringifyObjects);
    } else if (val instanceof Object && val !== null) {
        // e.g. { "$ne": null } -> "[object Object]" (after sanitize removes $ne it is {})
        return String(val);
    }
    return val;
};

export const securityMiddleware = (req, res, next) => {
    try {
        // 1. Sanitize NoSQL keys from body, query, and params
        if (req.body) req.body = sanitize(req.body);
        if (req.query) req.query = sanitize(req.query);
        if (req.params) req.params = sanitize(req.params);

        // 2. Normalize query params to prevent Type Errors (DoS)
        // Only for query, as body structure might be complex and valid
        if (req.query) {
            for (const key in req.query) {
                req.query[key] = stringifyObjects(req.query[key]);
            }
        }

        next();
    } catch (error) {
        console.error('Security middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
