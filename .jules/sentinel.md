## 2024-06-11 - Type DoS and NoSQL Injection in Express Query Parameters
**Vulnerability:** Express parses query parameters like `?category[$ne]=All` as objects. Passing these objects directly to MongoDB queries (NoSQL Injection) or string methods like `.toLowerCase()` (Type DoS) allows attackers to crash the server or manipulate queries.
**Learning:** This vulnerability pattern existed because query parameters were implicitly trusted as strings. It's crucial to explicitly validate and cast request inputs.
**Prevention:** Always explicitly cast `req.query` parameters to strings using `String(param)` before passing them into DB queries or calling string methods, even when using truthiness checks like `if (search)`.
