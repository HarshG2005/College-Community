
## 2024-05-24 - [Unsanitized Route Parameters - ReDoS and Type DoS Risk]
**Vulnerability:** Unsanitized user inputs from `req.query` (`company`, `category`, `subject`, `search`) were passed directly into `new RegExp()` (causing ReDoS) or `.toLowerCase()` (causing Type DoS if an array/object is provided) in multiple routes (`placements.js`, `events.js`, `notices.js`, `materials.js`).
**Learning:** The lack of global input validation or schema validation means any query parameters can be arrays or objects (e.g. `?search[$ne]=1`). If passed uncast to string methods or regex instantiations, it can easily crash the process or trigger ReDoS / NoSQLi.
**Prevention:** Always explicitly cast `req.query` and `req.params` values to `String(value)` and strictly escape characters `String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` before passing them to `new RegExp()`.
