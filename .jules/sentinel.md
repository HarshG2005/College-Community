## 2024-10-02 - Uncast Query Parameters Causing Type DoS, ReDoS, and NoSQL Injection
**Vulnerability:** Express `req.query` parameters are treated as parsed objects or arrays by default, which can cause Type DoS if string methods like `.toLowerCase()` are called on them, ReDoS if unescaped and passed to `RegExp`, or NoSQL injection if passed to database queries.
**Learning:** Never assume `req.query` or `req.body` parameters are strings in Express. They can be injected as arrays or objects by malicious users (e.g., `?category[]=test`).
**Prevention:** Always explicitly cast user-supplied `req.query` and `req.body` parameters to strings using `String(param)` and escape regex meta-characters if passing them to `new RegExp()`.
