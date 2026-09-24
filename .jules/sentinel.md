## 2024-05-27 - [NoSQL Injection in Mongoose findOne via Uncast req.body]
**Vulnerability:** `planId` from `req.body` is passed directly to `StudyPlan.findOne({ _id: planId })` in `updateProgress` and `syncAgent` without string coercion.
**Learning:** Even in non-Express `req.query` scenarios, user-supplied inputs from `req.body` must be explicitly cast to strings before being passed into Mongoose queries to prevent NoSQL object injection (e.g. `planId: { $ne: null }`).
**Prevention:** Always explicitly coerce `req.body` parameters to `String` (e.g., `String(planId)`) when they are used as query parameters in Mongoose/MongoDB, or use schema type casting if appropriate, but manually validating or casting before query construction is safer against NoSQL injection via objects.
