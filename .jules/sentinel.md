## 2024-05-09 - [Fix NoSQL Injection and ReDoS in placements route]
**Vulnerability:** Unescaped `RegExp` usage and missing input type coercion allowed ReDoS, NoSQL Injection, and Type DoS in `server/routes/placements.js`.
**Learning:** `req.query` objects can contain arrays or objects in Express. When these are passed directly to `new RegExp` or have string methods like `.toLowerCase()` called on them, it leads to crashes (Type DoS) or NoSQL injections.
**Prevention:** Always explicitly cast `req.query` and `req.body` parameters to `String` and escape them before using in `RegExp`.
