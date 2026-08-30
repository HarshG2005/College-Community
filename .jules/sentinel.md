## 2024-05-18 - Type DoS via uncast req.body fields in auth routes
**Vulnerability:** Calling `.toLowerCase()` directly on `req.body.email` in `/register` and `/login` routes allowed an attacker to send a non-string payload (e.g., an object or array), causing a `TypeError` and potentially crashing the server (Type DoS).
**Learning:** `req.body` parameters provided by Express are not guaranteed to be strings unless strictly validated and cast.
**Prevention:** Always cast `req.body` and `req.query` variables to string (e.g., `String(email)`) before calling string-specific methods or passing them into database queries to prevent crashes and NoSQL injection objects.
