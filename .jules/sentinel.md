
## 2024-08-07 - [Preventing NoSQL and ReDoS via req.query manipulation]
**Vulnerability:** Attackers can pass objects (e.g. `?search[$ne]=123`) or malicious Regex arrays/strings to Express query string parameters which are then fed into Mongoose queries or `new RegExp(user_input)`. This can cause NoSQL injection or Regex DoS (Application Crashes).
**Learning:** `req.query` and `req.body` are not strictly strings. If passed directly to database methods (like Mongoose schemas) or methods like `toLowerCase()` and `new RegExp`, the application is vulnerable. In this repo, multiple endpoints in `server/routes` are affected.
**Prevention:** Always manually cast `req.query` and `req.body` values to `String(val)` and escape Regex correctly (`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) when directly using them as search inputs in endpoints.
