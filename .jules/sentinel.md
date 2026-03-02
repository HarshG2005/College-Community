## 2024-05-18 - Missing string casting on query parameters
**Vulnerability:** Many routes expect string payloads from `req.query` (e.g., `req.query.category.toLowerCase()`) or use them in Regex.
**Learning:** This exposes the app to NoSQL injections (e.g., `?category[$ne]=val`) and DoS via `TypeError` if an array or object is passed.
**Prevention:** Always explicitly cast `req.query` and `req.params` variables to `String` when expecting a string payload.
