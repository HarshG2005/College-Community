
## 2024-05-24 - Unsanitized Regex Usage in Express Queries
**Vulnerability:** User input from `req.query` was used directly in `new RegExp(company, 'i')` without escaping in Express routes.
**Learning:** This codebase pattern allows an attacker to inject arbitrary regex operators (`.*`, etc.) into MongoDB queries, causing Regular Expression Denial of Service (ReDoS) because the regex engine can take exponential time evaluating complex queries. Also, passing objects like `?company[$ne]=...` crashes `new RegExp` causing DoS, or allows NoSQL injection.
**Prevention:** Always explicitly cast user query parameters to strings (`String(val)`) and escape them using `String(val).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` before passing them to `new RegExp()` in Mongoose/MongoDB query constructors.
