
## 2024-05-29 - [Fix ReDoS and Type DoS in multiple routes]
**Vulnerability:** User inputs (`req.query` params) were being passed directly to `new RegExp()` without escaping, causing ReDoS vulnerabilities. They were also calling `.toLowerCase()` without type casting, causing Type DoS if an object/array is passed.
**Learning:** `req.query` params are not strictly strings in Express. They can be objects or arrays. Therefore string methods or `new RegExp` can fail or be exploited.
**Prevention:** Always explicitly cast `req.query` params to string (`String(param)`) and use `.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` before passing user input to `new RegExp()`.
