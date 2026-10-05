# Security Notes

This is a small, client-side app: plain HTML/CSS/JavaScript with no backend,
no network requests, and no third-party dependencies. The only stored data is
the user's own task list in `localStorage` under
`study-task-tracker:v1`.

## Audit summary

Reviewed: `index.html`, `style.css`, `app.js`.

Findings and status:

| Area | Finding | Status |
|------|---------|--------|
| Cross-site scripting (XSS) | No `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `new Function`, or `document.write`. All user/stored text is written with `textContent`. | Safe |
| Attribute injection | Task ids are written with `setAttribute("data-id", …)`, which does not create script or break out of the attribute. | Safe |
| Stored-data tampering | `localStorage` is untrusted input: parsed in `try/catch`, shape-validated, and impossible calendar dates are rejected. | Handled |
| Storage failure / blocking | `localStorage` property access, `getItem`, and `setItem` are each guarded; the app stays usable in memory and shows a clear message. | Handled |
| Unbounded input / resource use | Titles are capped at 200 characters and at most 500 stored tasks are loaded, limiting layout/storage abuse. | Hardened |
| Ambiguous task ids | Duplicate stored ids are de-duplicated on load (first wins) so actions always target one task. | Hardened |
| Script/style injection surface | A Content-Security-Policy meta restricts `default-src`/`script-src`/`style-src` to `'self'`, blocks objects, and disables `base-uri` and `form-action`. A no-referrer policy is set. | Hardened |
| Secrets / network | No API keys, credentials, cookies, telemetry, or outbound requests. `.gitignore` excludes local config and credential files. | Safe |

## Content-Security-Policy

`index.html` sets:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'none'
```

The app uses no inline scripts or styles, so the policy does not break
normal operation.

## Verification

Real headless Chromium checks against the combined app (same CSP as
production, same-origin external test scripts):

- XSS payload in a stored title rendered as literal text; no `<img>`/`<script>`
  nodes and no injected globals.
- Impossible dates (`2026-02-31`, `2025-13-01`) dropped; valid leap date
  `2024-02-29` accepted.
- Duplicate ids de-duplicated; 600 stored tasks loaded as the first 500.
- Titles of 200 characters accepted; 201 rejected with a message.
- Malformed storage and blocked storage did not crash the app.
- No Content-Security-Policy violations and no console errors.

## Limitations

- `localStorage` is readable by any script running on the same origin; an XSS
  elsewhere on the origin would expose task data. The CSP and text-only
  rendering reduce this risk within this app.
- Storage is per browser/device and is not encrypted. Do not store secrets in
  task titles.
- No cross-browser or manual penetration testing beyond Chromium was performed.
