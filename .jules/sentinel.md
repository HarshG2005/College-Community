## 2026-07-09 - Prevent Prompt & NoSQL Injection in Study Planner
**Vulnerability:** Found unmitigated user input being injected directly into an LLM prompt (Prompt Injection) and Mongoose findOne queries (NoSQL injection via object payloads) in `server/controllers/studyPlannerController.js`.
**Learning:** Destructuring `req.body` implicitly retains data types, allowing attackers to pass JSON objects to bypass authentication or database checks via query operators, or craft arbitrary prompt inputs that exploit LLMs.
**Prevention:** Always explicitly coerce destructure elements (e.g. `req.body.planId !== undefined ? String(req.body.planId) : undefined`) before utilizing them in sensitive DB queries or external API integrations.
