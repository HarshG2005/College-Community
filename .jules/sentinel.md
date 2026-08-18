## 2024-08-18 - [Missing Registration Rate Limit]
**Vulnerability:** The `/api/auth/register` endpoint lacked rate limiting, making it susceptible to automated account creation spam and Denial of Service (DoS) attacks by exhaustion of resources.
**Learning:** Only the login endpoint had a custom rate limiter (`loginRateLimit.js`). The registration endpoint was similarly exposed as a public-facing unauthenticated route but was overlooked.
**Prevention:** Always apply rate limiting across all unauthenticated public-facing endpoints (e.g. login, register, password reset) to prevent automated abuse.
