# Security review

Reviewed 2026-10-05: `app.js`, `index.html`, `style.css`, `favicon.svg`,
and tracked repository files. This is a dependency-free, client-side app
with no backend, authentication, or external API. The review found validation
and data-integrity weaknesses and fixed them. No exploitable XSS was found
in the reviewed rendering paths. This is a scoped review, not a guarantee
that the app is free of vulnerabilities.

## Findings and fixes

| Area | Finding | Resolution |
|------|---------|------------|
| Submitted dates | Submission checked presence but not real calendar dates; the form disables native validation. | Validate YYYY-MM-DD, years 0001–9999, month/day ranges and leap years before adding. |
| Saved titles | The 200-character submission limit was not enforced on loaded titles. | Apply the same trimmed-title limit to saved data. |
| Silent data loss | Loading only 500 tasks could cause later edits to overwrite the original collection; additions had no matching cap. | Cap additions at 500; preserve original saved content and pause writes whenever loading rejects or truncates content. |
| Resource use | Raw JSON and saved IDs lacked explicit limits. | Reject saved strings above 1,048,576 UTF-16 characters before parsing; bound IDs to 200 characters and rendered tasks to 500. These are pragmatic bounds, not complete denial-of-service protection. |
| XSS | Task titles and IDs are untrusted, including saved values. | Continue using createElement, textContent and setAttribute; no HTML parsing, dynamic code execution, or interpolated selectors. Duplicate IDs are rejected using a null-prototype map. |
| Storage failures | Storage may be blocked or unavailable. | Guard access/read/write; keep task actions available in memory with a warning. |
| CSP | Existing policy allowed unused same-origin connection, frame and worker capabilities. | Explicitly block connections, frames and workers; remove unused data-image permission. Keep external local scripts/styles and no-referrer policy. |

Rejected saved data is preserved rather than automatically repaired. Valid
entries can still be used in memory. A persistent warning explains that
changes will not survive refresh. To recover, back up the raw saved value,
repair it or remove only `study-task-tracker:v1`, then reload. Removing that
key deletes its saved tasks. There is no recovery/export interface.

## Browser policy

The HTML meta CSP is:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; frame-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'
```

The app has no inline scripts, inline styles, remote assets or third-party
dependencies. HTTP and direct-file operation were verified in Chrome.
A meta CSP cannot enforce `frame-ancestors`; a future public host should set
that directive in a response header if embedding protection is required.
See [MDN on frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

Text-only rendering and treating storage as untrusted follow
[OWASP HTML5 guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).

## Verification

- Real headless Chrome: 33/33 integrated checks passed, including add,
  complete/reopen, delete, persistence, local-calendar overdue behavior,
  literal submitted/stored HTML payloads, duplicate/prototype-like IDs,
  malformed/partially invalid/oversized storage preservation, title/task
  bounds, blocked storage, and direct-file operation.
- Responsive checks at 320px, 390px and 1100px: no horizontal overflow,
  controls at least 44px high, long titles wrap. Populated desktop/mobile
  screenshots visually reviewed. Keyboard tab order, visible focus and
  action focus restoration verified; status is actual DOM text.
- Logic Worker harness: 47 focused assertions passed, including impossible
  submitted dates and saved data validation. JavaScript syntax and Git
  whitespace checks passed.
- Integrated normal-operation checks produced no browser console errors or
  runtime exceptions. CSP was active throughout the checks.
- Current tracked files reviewed for unsafe HTML/code sinks, remote requests,
  dependencies and credential patterns; no credentials found. Git history
  was not comprehensively scanned for previously removed secrets.

## Residual limitations

- localStorage is unencrypted and readable by other scripts on the same
  origin. Use a dedicated origin when hosting; avoid storing sensitive data.
- Concurrent tabs can overwrite one another's changes; there is no sync or
  conflict resolution. Tasks do not update overdue status at midnight until
  another action re-renders them or the page reloads.
- ID fallback uses time/randomness when crypto.randomUUID is unavailable;
  IDs are task identifiers, not authentication tokens.
- No Firefox/Safari, human screen-reader, automated accessibility audit,
  deployment-header assessment or independent penetration test was performed.
