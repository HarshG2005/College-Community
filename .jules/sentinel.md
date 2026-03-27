## 2024-05-20 - Fix ReDoS and DoS vulnerabilities in routes

**Vulnerability:** Regular Expression Denial of Service (ReDoS) and Denial of Service (DoS) via `.toLowerCase()` failing on object input, as well as NoSQL injection vectors.
**Learning:** `req.query` and `req.params` parameters were used directly without type checking. `req.query.company` was passed to `new RegExp()` unescaped. Furthermore, methods like `.toLowerCase()` are invoked on `req.query.type`, which can throw if `type` is passed as an object (e.g. `?type[$ne]=xxx`), leading to an unhandled exception or 500 error if not correctly handled.
**Prevention:** Always explicitly cast `req.query` and `req.params` inputs to string using `String(req.query.param)`. When dynamically creating Regular Expressions from user input, use a robust string escaping method (e.g. `String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`).
