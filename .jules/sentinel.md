## 2024-05-24 - Uncast Query Parameters Causing Type DoS, ReDoS, and NoSQL Injection
**Vulnerability:** Express `req.query` and `req.body` inputs are passed directly into string methods like `.toLowerCase()`, `new RegExp()`, or Mongoose queries without explicit type casting or escaping.
**Learning:** By passing objects or arrays in query strings (e.g., `?category[]=1` or `?search[]=foo`), attackers can trigger Type DoS crashes, NoSQL injections, or ReDoS vulnerabilities in unescaped regex.
**Prevention:** Always explicitly cast user-provided inputs (`req.query`, `req.body`) to strings using `String(input)` before calling string methods or executing database searches. Always escape special characters when constructing `RegExp` objects dynamically from user inputs.
