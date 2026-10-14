
## 2024-05-24 - Uncast Request Parameters leading to Type DoS and NoSQL Injection
**Vulnerability:** Type DoS and NoSQL Injection.
**Learning:** `express-validator` does not strictly enforce type conversions or array unwrapping for all inputs unless explicitly configured. Thus, passing variables directly into `.toLowerCase()` or `new RegExp()` can crash the server (Type DoS) or be parsed into MongoDB queries bypassing constraints (NoSQL Injection).
**Prevention:** Always explicitly cast request properties (`req.query`, `req.body`) to primitive Strings (e.g. `String(req.query.search)`) before processing string methods or querying MongoDB models.
