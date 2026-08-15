## 2024-05-18 - Express Route Input Casting and Sanitization

**Vulnerability:**
Multiple Express routes (`auth.js`, `events.js`, `notices.js`, `placements.js`, `materials.js`) were vulnerable to Type Denial of Service (DoS), Regular Expression Denial of Service (ReDoS), and NoSQL Injection via object payloads. This occurred because `req.query` and `req.body` parameters were used directly with string methods (like `.toLowerCase()` or `new RegExp()`) or NoSQL operators (like `$text: { $search: query }`) without first being explicitly cast to strings.

**Learning:**
In Express applications, while `req.params` are guaranteed to be strings, `req.query` and `req.body` can be parsed as objects or arrays. Calling string-specific methods on these without validation/casting will throw synchronous errors (Type DoS) crashing the server instance or allowing malicious MongoDB queries via object injection (NoSQLi).

**Prevention:**
Always explicitly cast `req.query` and `req.body` parameters to strings (e.g., `String(param)`) before performing string operations or using them in database queries. When utilizing user input inside Mongoose regex queries, explicitly cast to string and escape regex special characters (e.g., `String(param).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) to prevent ReDoS.
