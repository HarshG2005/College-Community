## 2024-05-24 - [NoSQL Injection via Uncast Params]
**Vulnerability:** NoSQL injection vulnerabilities exist across multiple API routes (e.g. materials, messages, skillTests) because `req.query` and `req.params` parameters were used directly in Mongoose queries without explicit type casting.
**Learning:** This codebase lacks global security middleware (like input sanitization or explicit parameter string casting), meaning all parameters parsed by Express might be malicious objects (e.g., `?search[$ne]=test`).
**Prevention:** Always explicitly cast `req.query` and `req.params` parameters to strings (e.g., `String(req.query.search)`) before using them in database queries to prevent object-based NoSQL injection attacks.
