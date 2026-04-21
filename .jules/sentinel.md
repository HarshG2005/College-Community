## 2024-05-24 - DoS Risk via Object Parameter Prototype Methods
**Vulnerability:** Use of string methods directly on route parameters (e.g., `req.query.category.toLowerCase()`) without explicit string casting.
**Learning:** Express `req.query` and `req.params` can contain objects or arrays (e.g., `?category[]=test`), leading to application crash (DoS) when `.toLowerCase()` is called.
**Prevention:** Always explicitly cast user input parameters to strings before using string methods (e.g., `String(req.query.category).toLowerCase()`).

## 2024-05-24 - Unsanitized User Input in Mongoose Regular Expressions
**Vulnerability:** Passing raw user input directly into Mongoose `new RegExp(user_input, 'i')`.
**Learning:** User input may contain RegExp special characters (`.*+?^${}()|[\]\\]`), allowing for ReDoS attacks or unexpected search matches.
**Prevention:** Explicitly escape all user input used in regular expressions (e.g., `String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`).
