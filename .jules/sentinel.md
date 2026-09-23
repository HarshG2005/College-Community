
## 2024-05-24 - Patched missing string casts in req.query and req.body parameters across routes
**Vulnerability:** Type DoS & NoSQL Injection vulnerabilities were present in `events.js`, `notices.js`, `materials.js`, `messages.js` and `auth.js` where Express route parameters like `req.query` or `req.body` were used directly in Mongoose queries, `new Date()`, or with `.toLowerCase()` without being explicitly cast to strings.
**Learning:** Due to the absence of global string casting for request bodies and queries, these endpoints are vulnerable to Mongoose CastErrors or direct crashes if an object payload or array is passed, crashing the app or allowing NoSQL injection in cases where Mongoose doesn't catch it.
**Prevention:** Always explicitly coerce `req.query` and `req.body` parameters to `String()` prior to usage, particularly before Mongoose queries, string manipulations, or date initializations.
