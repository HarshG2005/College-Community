
## 2024-06-25 - Prevent ReDoS and Type DoS in Placements Route
**Vulnerability:** Type DoS and ReDoS vulnerabilities in `server/routes/placements.js` caused by unescaped regular expressions and uncast array/object parameters passed via `req.query.company`, `req.query.type`, and `req.query.search`.
**Learning:** `req.query` inputs can be arrays or objects (e.g. `?company[length]=1`). Passing these uncast to string functions (`toLowerCase()`) causes a crash (Type DoS). Passing unescaped user input directly to `new RegExp()` allows attackers to provide catastrophic backtracking payloads (ReDoS).
**Prevention:** Always explicitly coerce variables (like `req.query` and `req.body` parameters) using `String()` and always apply `replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` to escape user input strings before feeding them into `new RegExp()`.
