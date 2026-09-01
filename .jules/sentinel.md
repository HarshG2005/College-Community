
## 2025-03-09 - [express-validator Type DoS Bypass]
**Vulnerability:** Type Denial of Service (DoS) vulnerability via `express-validator`. The `isEmail()` validator accepts an array if the first element is a valid email, passing the uncast array to the route handler. Calling string methods like `.toLowerCase()` directly on `req.body.email` crashes the server with a `TypeError`.
**Learning:** `express-validator` does not automatically coerce validated fields to their expected primitive type (like strings) unless `matchedData()` is strictly used. Validation bypass with arrays is a dangerous side-effect when using methods expecting primitives.
**Prevention:** Always explicitly cast validated fields from `req.body` and `req.query` (e.g., `String(req.body.email)`) before calling string methods or passing them to databases to prevent both Type DoS and NoSQL injection.
