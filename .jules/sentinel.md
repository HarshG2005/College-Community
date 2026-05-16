## 2026-05-16 - [NoSQL Injection via Express Request Queries]
**Vulnerability:** In Express+Mongoose apps, `req.query` can accept objects instead of strings (e.g., `?category[$ne]=All`). If passed directly to a Mongoose query without validation or casting, this leads to NoSQL injection and potential Type DoS.
**Learning:** Found widespread latent vulnerabilities across 4 core route files where `req.query` was used without type checks.
**Prevention:** Always explicitly cast user inputs from `req.query` and `req.body` to Strings (e.g. `String(param)`) BEFORE validation or database queries when strings are expected.
