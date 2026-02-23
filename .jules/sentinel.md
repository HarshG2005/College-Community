## 2026-02-23 - [HIGH] NoSQL Injection & DoS Vulnerability via Query Params
**Vulnerability:** The application was vulnerable to NoSQL injection (via `$` keys) and Denial of Service (DoS) attacks because query parameters were not sanitized or type-checked. Specifically, passing an object (e.g., `?category[$ne]=null`) to an endpoint expecting a string could trigger a `TypeError` (crashing the handler) or manipulate the database query logic.
**Learning:** `req.query` in Express (with `extended: true`) allows nested objects, which can be weaponized against MongoDB if passed directly to `find()` or string methods like `toLowerCase()`.
**Prevention:** Implemented a global `securityMiddleware` that:
1.  Recursively removes keys starting with `$` from `req.body`, `req.query`, and `req.params`.
2.  Flattens object-based query parameters to strings (e.g., converts `{}` to `"[object Object]"`) to prevent TypeErrors in controller logic expecting strings.
3.  Adds security headers (`Strict-Transport-Security`, `X-Frame-Options`, etc.) for defense-in-depth.
