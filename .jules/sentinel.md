
## 2026-10-28 - [Type DoS and NoSQL Injection via express-validator Bypass]
**Vulnerability:** A Type Denial of Service (DoS) and potential NoSQL injection in `server/routes/auth.js` and `server/controllers/studyPlannerController.js` where user input was not cast to a string before string methods were called or before Mongoose DB queries.
**Learning:** `express-validator` validators like `isEmail()` can be bypassed or fail to type-cast properly (e.g. allowing an array where the first element is a valid email). If the validated field is not retrieved via `matchedData(req)` and is accessed directly from `req.body`, calling methods like `.toLowerCase()` on it will throw a `TypeError` (e.g. if an array is passed) which can crash the application.
**Prevention:** Always explicitly cast user input to strings (e.g., `String(email).toLowerCase()`) before performing string operations or before using them as direct query parameters in DB calls, even if `express-validator` is used.
