## 2026-10-20 - [Synchronous File Operations Block Event Loop]
**Vulnerability:** Synchronous file operations like `fs.readFileSync`, `fs.unlinkSync`, and `fs.appendFileSync` block the Node.js event loop, causing Denial of Service (DoS) vulnerability.
**Learning:** In asynchronous route handlers, synchronous file operations will block all other concurrent requests while the file operation completes, severely impacting server responsiveness.
**Prevention:** Always prefer and use the asynchronous counterparts from `fs.promises` (e.g., `fs.promises.readFile`, `fs.promises.unlink`, `fs.promises.appendFile`) wrapped with `await`.
