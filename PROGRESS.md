# Progress

Study Task Tracker is built through eight sequential milestones. Only the
user merges pull requests. A milestone is complete only after its PR is
merged.

| Milestone | Owner | Status | Branch | PR | Verification |
|-----------|-------|--------|--------|----|--------------|
| 1. Project setup | Orchestrator | Merged | milestone/01-project-setup | [#1](https://github.com/Avanith12/Study-Task-Tracker/pull/1) | Merged |
| 2. Page skeleton | UI Worker | Merged | milestone/02-page-skeleton | [#2](https://github.com/Avanith12/Study-Task-Tracker/pull/2) | Merged |
| 3. Add and display | Logic Worker | Merged | milestone/03-add-display | [#3](https://github.com/Avanith12/Study-Task-Tracker/pull/3) | Merged |
| 4. Complete and delete | Logic Worker | Merged | milestone/04-complete-delete | [#4](https://github.com/Avanith12/Study-Task-Tracker/pull/4) | Merged |
| 5. Save tasks | Logic Worker | Ready for review | milestone/05-persistence | [open PR](https://github.com/Avanith12/Study-Task-Tracker/pull/new/milestone/05-persistence) | Verified |
| 6. Deadline indicators | Logic Worker | Not started | milestone/06-deadlines | — | — |
| 7. Polished interface | UI Worker | Not started | milestone/07-interface | — | — |
| 8. Final verification | Orchestrator | Not started | milestone/08-final-verification | — | — |

Allowed statuses: Not started, In progress, Ready for review, Merged,
Blocked.

This committed tracker is a snapshot and may lag behind the live status
reported by the orchestrator.

## Notes

- Milestones 1–4 are merged (PRs #1–#4).
- Milestone 5 implements localStorage persistence; overdue indicators are
  milestone 6.
- Worktrees remain: Logic Worker `herdr_projects-logic`, UI Worker
  `herdr_projects-ui`.

## Verification log

### Milestone 1 — Project setup

- `README.md` documents the goal, running instructions, and storage behavior.
- `AGENTS.md` documents roles, file ownership, and the shared interface.
- `.gitignore` covers local configuration and credentials.
- `PROGRESS.md` lists all eight milestones.
- Separate worktrees exist for the Logic Worker and UI Worker.
- Manual browser checks: not applicable to this milestone (no app code yet).
- Tooling note: no GitHub CLI or API token was available, so PRs are opened
  by the user via the links above (or provided by the orchestrator).

### Milestone 2 — Page skeleton

- `index.html` contains the agreed elements: `task-form`, `task-title`
  (required text), `task-deadline` (required date), `task-list` (ul),
  `empty-state`, and `app-message` with `role="status" aria-live="polite"`.
- Inputs have associated `<label for="…">` elements.
- `app.js` is loaded with `defer` and is an empty placeholder this milestone.
- `style.css` provides the basic layout and visible keyboard focus styles.
- Reviewed by the orchestrator against AGENTS.md section 4; branch
  `milestone/02-page-skeleton` based on merged `origin/main` (`a0a5ffd`).
- Manual GUI browser check was not performed; the UI Worker verified a
  headless DOM render. Interactive and responsive checks are deferred to
  milestone 7.
- Commit: `70fcea4`.

### Milestone 3 — Add and display

- `app.js` implements an in-memory task array (insertion order kept) and an
  `#task-form` submit handler.
- Validation rejects empty/whitespace-only titles and missing deadlines and
  writes a message to `#app-message`; messages clear on success.
- Tasks render as `li.task-item` with `.task-title` (via `textContent`),
  `.task-deadline`, and a `.task-actions` container holding real
  `.task-toggle` and `.task-delete` buttons (behaviors deferred to M4).
- `#empty-state` is hidden when tasks exist and shown when none.
- Orchestrator ran a real headless Chrome harness against the byte-identical
  logic: 19/19 checks passed, including HTML-in-title escaped as text,
  whitespace title rejection, missing deadline rejection, insertion order,
  and no `is-overdue`/`is-completed` leakage. No console/runtime errors.
- Not performed: manual GUI interaction by the user.
- Commit: `388abb7`.

### Milestone 4 — Complete and delete

- `app.js` adds delegated click handling on `#task-list`; actions resolve
  the task by its `data-id` (never by DOM index).
- `.task-toggle` completes/reopens the targeted task, toggles it
  `is-completed` on the `.task-item` only, and switches its label between
  "Complete" and "Reopen".
- `.task-delete` removes exactly the targeted task and re-renders;
  deleting the last task restores `#empty-state`.
- Still no `localStorage` (M5) and no overdue logic (M6).
- Orchestrator ran a real headless Chrome harness: 16/16 checks passed,
  including completing the middle of three tasks, reopen, order/state
  preservation across deletes, and empty-state restoration. No runtime errors.
- Logic Worker's milestone 3 regression harness still passed 29/29.
- Not performed: manual GUI click/keyboard interaction by the user.
- Commit: `83f6af6`.

### Milestone 5 — Save tasks

- `app.js` persists to the exact key `study-task-tracker:v1` as a JSON
  array of `{ id, title, deadline, completed }` and saves after every
  add, complete, reopen, and delete.
- Load-time validation keeps only nonempty-string `id`/`title`,
  `YYYY-MM-DD` deadline, and boolean `completed`; invalid entries are
  dropped and malformed JSON/non-arrays fall back to an empty list
  without throwing.
- Storage access (property, `getItem`, `setItem`) is guarded; on failure a
  persistent warning is shown in `#app-message` and the warning is restored
  after normal messages clear. All actions still work in memory.
- Orchestrator verified in real Chrome over HTTP across separate page loads
  (shared profile): add/complete/delete persisted with correct record shape;
  simulated refresh restored order and completion and kept deletions;
  malformed JSON loaded empty then accepted a valid add; mixed data kept only
  the trimmed valid entry; blocked storage showed the warning, still added in
  memory, and restored the warning after a successful add. All six scenarios
  matched expectations, no crashes.
- Logic Worker's fake-DOM storage harness passed 34/34; M3 (29/29) and M4
  (21/21) regressions still pass.
- Not performed: manual GUI reload/quota testing by the user.
- Commit: `9c79fb8`.
