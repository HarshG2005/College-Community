## 2024-04-29 - Missing Global Middleware Leading to NoSQL Injection & ReDoS

**Vulnerability:** Multiple GET endpoints (e.g., placements, events, notices, materials) directly use `req.query` parameters in Mongoose queries and `new RegExp()` without string casting or escaping. This allows NoSQL injection via object payloads (e.g., `?subject[$ne]=Math`) and Regex Denial of Service (ReDoS) via unescaped string patterns, leading to unauthorized data exposure and database exhaustion.
**Learning:** The application lacks a global security middleware to sanitize `req.query` and `req.params`. Mongoose's lack of default type checking for query objects means untrusted input is directly evaluated as query operators.
**Prevention:** Always explicitly cast `req.query` and `req.params` values to `String` and escape regex characters using a utility replace function before using them in Mongoose queries, unless properly validated via `express-validator`.
