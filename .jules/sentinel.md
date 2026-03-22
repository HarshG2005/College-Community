## 2024-05-19 - Escape regex to prevent ReDoS vulnerability
**Vulnerability:** A user-supplied query string was being directly passed into `new RegExp(param, 'i')` in `server/routes/placements.js`, opening up the application to Regular Expression Denial of Service (ReDoS).
**Learning:** MongoDB string queries that use `new RegExp` without escaping input are inherently vulnerable to ReDoS and syntax errors from unexpected characters.
**Prevention:** Always escape user input before passing it to `new RegExp` using `string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.
