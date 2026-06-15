## 2024-06-15 - [CRITICAL] Fix ReDoS and Type DoS in placements.js
**Vulnerability:** Unsanitized user input (`req.query.company`) was directly passed to `new RegExp(company, "i")`, enabling a Regular Expression Denial of Service (ReDoS) if crafted input is supplied. Additionally, `type.toLowerCase()` was called on `req.query.type` without string casting, which could lead to a Type DoS if `type` is an array.
**Learning:** In Mongoose/MongoDB, explicit casting and regex escaping is required to avoid DoS issues when taking input from queries or body.
**Prevention:** Always explicitly cast user inputs (`req.query`, `req.body`) to String and escape special characters using `.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` before using them in `new RegExp()`.
