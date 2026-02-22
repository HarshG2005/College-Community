export const mongoSanitize = (req, res, next) => {
    // 1. Sanitize req.body (remove $ keys recursively)
    if (req.body) {
        clean(req.body);
    }

    // 2. Sanitize req.params (remove $ keys recursively)
    if (req.params) {
        clean(req.params);
    }

    // 3. Sanitize req.query (cast to string AND remove $ keys)
    if (req.query) {
        clean(req.query);
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                // Cast to string to prevent DoS via .toLowerCase() on objects
                // and ensure strict type handling as per security guidelines.
                // This converts objects like { $ne: null } to "[object Object]"
                // and arrays like ['a', 'b'] to "a,b".
                req.query[key] = String(req.query[key]);
            }
        }
    }

    next();
};

function clean(obj) {
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (/^\$/.test(key)) {
                delete obj[key];
            } else {
                clean(obj[key]);
            }
        }
    }
}
