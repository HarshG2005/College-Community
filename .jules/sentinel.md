## 2024-05-24 - Fix ReDoS and Type DoS in placements API
**Vulnerability:** User input for company search was passed unescaped directly into `new RegExp()` leading to Regular Expression Denial of Service (ReDoS). Additionally, query parameters were passed directly to `toLowerCase()`, leading to Type DoS if an array or object was provided.
**Learning:** Always explicitly cast `req.query` and `req.body` parameters to strings in Express route handlers to prevent Type DoS and NoSQL injection, and escape strings before passing them to `new RegExp()`.
**Prevention:** Use `String(param)` to explicitly cast to strings, and use `.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` to escape user input before using it in dynamic regex generation.
