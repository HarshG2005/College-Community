## 2024-07-16 - express-validator Array Bypass leading to Type DoS
**Vulnerability:** express-validator (specifically validators like `isEmail()`) can bypass validation for an array where the first element is a valid email, allowing arrays to slip through into route handlers.
**Learning:** If route handlers do not use `matchedData(req)` to retrieve validated, string-coerced data, arrays can be passed to string methods like `.toLowerCase()` leading to a TypeError (Type DoS) causing the server/process to crash.
**Prevention:** Always manually cast fields validated by express-validator to strings (e.g. `String(email)`) before calling string methods or passing to database queries unless `matchedData(req)` is utilized.
