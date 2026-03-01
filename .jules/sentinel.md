## 2026-03-01 - [NoSQL Injection & DoS in Query Parameters]
**Vulnerability:** User input from `req.query` and `req.params` was passed directly into Mongoose queries (NoSQL Injection risk) and String prototype methods (DoS risk via TypeError when objects are passed).
**Learning:** Express parses query strings like `?category[$ne]=All` into objects (`{ $ne: 'All' }`). If these are passed to Mongoose `find()` uncast, it allows attackers to inject operators. If passed to `.toLowerCase()`, it throws an uncaught error and crashes the Node.js process.
**Prevention:** Explicitly cast inputs expected to be strings using `String(param)` before using them. This converts malicious objects to `'[object Object]'` and arrays to comma-separated strings, neutralizing both attack vectors safely.
