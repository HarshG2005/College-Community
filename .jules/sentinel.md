
## 2026-06-05 - Prevent NoSQL Injection and Type DoS in req.body
**Vulnerability:** Controller routes (like studyPlannerController) implicitly trust `req.body` values, expecting them to be strings. An attacker could send object payloads like `{"$ne": 1}` to bypass NoSQL queries, or arrays/objects to trigger server crashes via unexpected types (Type DoS).
**Learning:** This codebase lacks global security middleware that coerces or sanitizes input data. Express inherently leaves `req.body` and `req.query` variables as their passed-in types, rather than string casting like `req.params`.
**Prevention:** Always explicitly coerce `req.body` and `req.query` inputs to strings in route handlers (e.g., `const value = req.body.field !== undefined ? String(req.body.field) : undefined;`) before saving to the DB or using them in logic.
