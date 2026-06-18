## 2026-06-18 - [ReDoS and Type DoS in placements API]
**Vulnerability:** `req.query` parameters in `/api/placements` route were not explicitly cast to strings before calling string methods or being passed into `new RegExp()`, and regex inputs were not escaped.
**Learning:** In express, `req.query` parameters can be objects or arrays depending on the querystring. When this happens, string methods like `.toLowerCase()` fail resulting in Type DoS, and passing unescaped objects to regex constructors can result in NoSQL Injection or ReDoS.
**Prevention:** Explicitly cast all `req.query` values to strings and escape any inputs used within a `RegExp` constructor.
