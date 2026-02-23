/**
 * Security Middleware
 * - Sanitize req.body, req.query, req.params to prevent NoSQL Injection
 * - Add basic security headers
 * - Prevent DoS by handling query parameter pollution
 */
export const securityMiddleware = (req, res, next) => {
    // 1. Basic Security Headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.removeHeader('X-Powered-By');

    // 2. NoSQL Injection Sanitization
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                if (key.startsWith('$')) {
                    delete obj[key];
                } else {
                    sanitize(obj[key]);
                }
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    // 3. Prevent DoS via Object Injection in Query Params
    if (req.query) {
        for (const key in req.query) {
            const val = req.query[key];
            // console.log(`Checking key: ${key}, val:`, val, `type:`, typeof val, `isArray:`, Array.isArray(val));
            if (val && typeof val === 'object' && !Array.isArray(val)) {
                // console.log(`Flattening ${key} to string`);
                req.query[key] = String(val);
            }
        }
    }

    next();
};
