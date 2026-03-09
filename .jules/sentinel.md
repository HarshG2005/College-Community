## 2024-05-24 - DoS risk from dynamic regex creation in query
**Vulnerability:** User input from `req.query.company` was directly passed to `new RegExp(company, 'i')` in Mongoose queries without sanitization. This allows an attacker to inject a complex or maliciously crafted regular expression that can cause a Regex Denial of Service (ReDoS) or expose data via timing attacks when evaluated against large collections.
**Learning:** Even though NoSQL injection might be mitigated by type casting or driver behavior, unescaped regex strings can still bring down the server by consuming excessive CPU when searching.
**Prevention:** Always escape user input using a regex escaping function (e.g., `input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) before passing it to `new RegExp()`.
