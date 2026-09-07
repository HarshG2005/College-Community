## 2024-05-18 - [Type DoS via express-validator Array Bypass]
**Vulnerability:** Type DoS vulnerability in `/api/auth/register` and `/api/auth/login` endpoints caused by calling `.toLowerCase()` on uncast user input (`req.body.email`).
**Learning:** `express-validator`'s `isEmail()` validator can be bypassed by an array payload (e.g., `["test@example.com"]`). Since it doesn't automatically coerce types to String (unless `matchedData` is used), `req.body.email` remains an array, which causes a server crash (DoS) when `.toLowerCase()` is called.
**Prevention:** Always explicitly cast `req.body` and `req.query` inputs to Strings (e.g., `String(input)`) before applying String methods, even if validated by `express-validator`.
