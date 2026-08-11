## 2024-05-24 - express-validator Array Bypass and Type DoS
**Vulnerability:** Type DoS vulnerability due to `.toLowerCase()` call on user input (`req.body.email`) in Express route.
**Learning:** `express-validator`'s `isEmail()` does not coerce validated fields to strings automatically (unless `matchedData` is used). An attacker can submit an array where the first element is a valid email, bypassing `isEmail()`. When the route handler calls `.toLowerCase()` directly on this array, it crashes the Node.js process.
**Prevention:** Always explicitly cast user input to strings (e.g., `String(email)`) before calling string methods like `.toLowerCase()`, even if they have been validated by `express-validator`'s `isEmail()`.
