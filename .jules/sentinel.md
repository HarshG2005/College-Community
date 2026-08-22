## 2024-05-18 - Type DoS and ReDoS via Uncast Parameters
**Vulnerability:** User inputs (`req.query`, `req.body`) were passed directly into string methods (`.toLowerCase()`) and constructors (`new RegExp()`) without explicit type casting.
**Learning:** In Express, body parsers can parse JSON objects/arrays which bypass truthiness checks but crash string methods, leading to Type DoS. Additionally, passing unsanitized strings directly to `new RegExp()` enables ReDoS and NoSQL Injection.
**Prevention:** Always explicitly cast variable inputs to `String()` and apply standard regex escaping (`.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")`) before interacting with string methods or constructing regular expressions.
