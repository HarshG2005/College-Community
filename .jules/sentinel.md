## 2025-02-14 - Fix NoSQL Injection in Study Planner
**Vulnerability:** User-supplied `planId` from `req.body` was directly passed to `StudyPlan.findOne({ _id: planId })` in `server/controllers/studyPlannerController.js` without validation, exposing the app to NoSQL object injection.
**Learning:** Even internal API payloads can be manipulated to pass objects (like `{"$ne": null}`) instead of expected strings, bypassing intended ID matching logic.
**Prevention:** Always explicitly cast `req.body` and `req.query` parameters to `String` (handling `undefined` gracefully) before using them in Mongoose queries to enforce type safety and neutralize object payloads.
