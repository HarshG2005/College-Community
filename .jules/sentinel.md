## 2026-11-11 - [Fix ReDoS and NoSQL Injection in Placements]
**Vulnerability:** Unsanitized user inputs in `req.query` for the `/api/placements` endpoint caused a Regular Expression Denial of Service (ReDoS) vulnerability (due to an unescaped regex parameter) and possible Type DoS/NoSQL injection (via an uncast query object passed to `.toLowerCase()` and ``).
**Learning:** Even strictly internal or 'secondary' endpoints must sanitize query parameters before feeding them to database queries or native string methods, as attackers can bypass validation arrays via Object wrappers.
## 2024-05-24 - [Fix ReDoS and NoSQL Injection in Placements]
**Vulnerability:** Unsanitized user inputs in `req.query` for the `/api/placements` endpoint caused a Regular Expression Denial of Service (ReDoS) vulnerability (due to an unescaped regex parameter) and possible Type DoS/NoSQL injection (via an uncast query object passed to `.toLowerCase()` and `$text`).
**Learning:** Even strictly internal or 'secondary' endpoints must sanitize query parameters before feeding them to database queries or native string methods, as attackers can bypass validation arrays via Object wrappers.
**Prevention:** Universally cast inputs to expected types (e.g., `String(param)`) and apply RegExp character escaping (e.g., `.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) prior to processing them.
