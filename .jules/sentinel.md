## 2024-05-18 - DoS via Synchronous File Operations in Express Routes

**Vulnerability:** Found `fs.appendFileSync` and `fs.readFileSync` used inside asynchronous route handlers (`server/controllers/resumeController.js` and `server/agent/tools.js`), which block the Node.js event loop during I/O operations. This creates a Denial of Service (DoS) vulnerability where a flood of requests executing these paths can stall the entire server, preventing other users' requests from being processed until the file operations complete.

**Learning:** Developers sometimes use synchronous file operations (`*Sync`) for simplicity or logging in async functions without realizing the global impact on the single-threaded Node.js event loop. In high-traffic scenarios, even small file writes/reads can add up to significant latency, starving the application of resources and causing severe service degradation or crashes.

**Prevention:** Never use synchronous file operations (`fs.*Sync`) in production code serving HTTP requests or background jobs. Always enforce the use of asynchronous alternatives like `fs.promises.readFile`, `fs.promises.writeFile`, `fs.promises.unlink`, and `fs.promises.appendFile` to ensure I/O operations are offloaded and the event loop remains unblocked.
