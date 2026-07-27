## 2024-05-24 - [CRITICAL] Prevent Type DoS in Route Parameters
**Vulnerability:** Calling string methods like `.toLowerCase()` on un-cast request body parameters (e.g., `req.body.email`) allows attackers to crash the server by passing arrays or objects in JSON payloads, even if some form of validation (like `express-validator`'s `isEmail`) is present (as validation can sometimes be bypassed or acts on the array).
**Learning:** `express-validator` doesn't automatically cast types in the raw `req.body` object unless `matchedData(req)` is specifically extracted and used.
**Prevention:** Always explicitly cast user input to a String (e.g., `String(req.body.email)`) before calling string methods on them, or safely extract validated data using `matchedData(req)`.
