## 2024-04-20 - [Missing RegExp Input Validation]
**Vulnerability:** Unsanitized user input passed directly to `new RegExp` in MongoDB queries.
**Learning:** This exposes the application to Regular Expression Denial of Service (ReDoS) and potential NoSQL injection if objects are passed.
**Prevention:** Always explicitly cast user input to strings and escape regex meta-characters before passing to `new RegExp`.
