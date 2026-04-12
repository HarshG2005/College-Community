## 2024-05-24 - DoS and ReDoS vulnerabilities via req.query
**Vulnerability:** Unsanitized query parameters used directly in regex and string methods in multiple endpoints, exposing the application to Unhandled Exception DoS and Regular Expression Denial of Service (ReDoS).
**Learning:** Due to the lack of a global security middleware for query parameter sanitization, route parameters `req.query` and `req.params` must be explicitly cast to String and escaped before use.
**Prevention:** Always explicitly cast user inputs to `String()` and strictly escape regex user input (e.g., `String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) prior to processing or DB queries.
