## 2024-08-10 - Uncast Query Parameters Causing DoS and NoSQLi
**Vulnerability:** Widespread Type DoS, ReDoS, and NoSQL injection vulnerabilities across Express routes due to uncast `req.query` and `req.body` parameters being passed to `.toLowerCase()`, `new RegExp()`, or MongoDB queries.
**Learning:** In the absence of global validation/sanitization middleware (like `express-validator` applied to all queries), Express parses query arrays/objects as-is. Calling string methods on these directly crashes the app, and passing them to MongoDB can cause NoSQL injection or ReDoS.
**Prevention:** Always explicitly cast user input to `String` before invoking string methods or passing to RegExp constructors, and properly escape regex inputs.

## 2024-08-10 - Unescaped RegEx Input Leading to ReDoS
**Vulnerability:** Constructing `new RegExp(user_input)` without escaping special characters allows ReDoS (Regular Expression Denial of Service) by passing complex overlapping wildcards (e.g., `(((a+)+)+)+$`), as well as application crashes via incomplete syntax (e.g., passing a single `(`).
**Learning:** `new RegExp()` compiles user strings blindly. It is crucial to always sanitize user input, even if the primary intent is simply for partial text matching in a database query.
**Prevention:** Always escape regex operators when creating `RegExp` objects from user input using a utility regex replace like `.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.
