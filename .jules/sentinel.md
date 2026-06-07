## 2025-05-14 - Information Leakage in SvelteKit Load Functions
**Vulnerability:** Passing raw error objects to SvelteKit's `error()` function in universal/client-side load functions.
**Learning:** In SvelteKit, the second argument to the `error()` helper is the message. If a raw `Error` object is passed, it can be serialized and its properties (like stack traces or internal paths) exposed to the client-side error page.
**Prevention:** Always catch errors in load functions, log the detailed error to the server/build console, and return a generic, safe string message to the `error()` helper.
