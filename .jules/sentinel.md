## 2024-05-24 - [Remove Verbose Error Logging]
**Vulnerability:** The login endpoint logged full error objects using `JSON.stringify(error, Object.getOwnPropertyNames(error))`. This is a critical security risk as it can expose stack traces, database schema details, and potentially sensitive environment variables to system logs.
**Learning:** Developers sometimes use deep stringification to debug errors, but this leaks internals in production.
**Prevention:** Only log the `error.message` or safely destructure non-sensitive error properties in route handlers.
