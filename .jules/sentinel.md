
## 2024-05-18 - [Type DoS via express-validator bypass]
**Vulnerability:** Type DoS attacks can occur in routes using `express-validator` (e.g., `isEmail()`) if user input fields (like `req.body.email`) are accessed as arrays rather than primitive types. The validator allows an array if the first element passes validation, leading to crashes when string methods like `.toLowerCase()` are directly called on the array later.
**Learning:** `express-validator` does not automatically coerce validated fields to strings unless `matchedData(req)` is explicitly used. Relying solely on `req.body` after validation without explicit type casting is a security risk.
**Prevention:** Always explicitly cast validated inputs from `req.body` or `req.query` to `String` (e.g., `String(email).toLowerCase()`) before performing string-specific operations, or use `matchedData(req)` to fetch strictly validated and coerced data.
