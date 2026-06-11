
## 2024-06-11 - Prevent ReDoS and Type DoS in Placement Queries
**Vulnerability:** The `/api/placements` endpoint constructed `new RegExp()` using unescaped user input `req.query.company`, enabling Regular Expression Denial of Service (ReDoS). Furthermore, `req.query.type` and `req.query.search` were not cast to strings before string methods were called on them, causing Type Denial of Service (DoS) and potential NoSQL injection vectors.
**Learning:** Using `req.query` params directly into regex or string functions is a consistent source of DoS/NoSQLi. Express `req.query` and `req.body` values can be parsed as arrays or objects by default (e.g. `?type[]=foo`).
**Prevention:** Always explicitly cast `req.query` and `req.body` arguments using `String(param)` and escape regex special characters (e.g., using `.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) before dynamically constructing regular expressions.
