## 2024-06-04 - [Fix NoSQL Injection & Type DoS in Express Routes]
**Vulnerability:** `req.query` parameters (`category`, `search`, `subject`, etc.) were directly passed into MongoDB queries and string methods (`.toLowerCase()`) without type casting.
**Learning:** In Express, `req.query` (and `req.body`) can be arrays or objects (e.g., `?category[$ne]=admin`). Passing an object to a string method causes a crash (Type DoS), and passing it to a database query allows NoSQL injection.
**Prevention:** Always explicitly cast `req.query` and `req.body` parameters to `String(param)` before performing string operations or database queries, while preserving existing truthiness checks (e.g. `if (search)` instead of `if (search !== undefined)`) so empty strings are correctly ignored.
