## 2026-06-22 - Prevent Regex Injection (ReDoS) via req.query
**Vulnerability:** Passing unescaped `req.query` or `req.body` inputs directly to the `RegExp` constructor (e.g., `new RegExp(req.query.company)`) exposes the endpoint to Regular Expression Denial of Service (ReDoS).
**Learning:** Even simple search filters need regex escaping to prevent malicious characters from causing catastrophic backtracking or unintended regex evaluation.
**Prevention:** Always escape user input before using it in `new RegExp()` (e.g., `input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`), and explicitly cast it to a string (`String(input)`).
