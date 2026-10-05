# Progress

Study Task Tracker is built through eight sequential milestones. Only the
user merges pull requests. A milestone is complete only after its PR is
merged.

| Milestone | Owner | Status | Branch | PR | Verification |
|-----------|-------|--------|--------|----|--------------|
| 1. Project setup | Orchestrator | Merged | milestone/01-project-setup | [#1](https://github.com/Avanith12/Study-Task-Tracker/pull/1) | Merged |
| 2. Page skeleton | UI Worker | Merged | milestone/02-page-skeleton | [#2](https://github.com/Avanith12/Study-Task-Tracker/pull/2) | Merged |
| 3. Add and display | Logic Worker | Ready for review | milestone/03-add-display | [open PR](https://github.com/Avanith12/Study-Task-Tracker/pull/new/milestone/03-add-display) | Verified |
| 4. Complete and delete | Logic Worker | Not started | milestone/04-complete-delete | — | — |
| 5. Save tasks | Logic Worker | Not started | milestone/05-persistence | — | — |
| 6. Deadline indicators | Logic Worker | Not started | milestone/06-deadlines | — | — |
| 7. Polished interface | UI Worker | Not started | milestone/07-interface | — | — |
| 8. Final verification | Orchestrator | Not started | milestone/08-final-verification | — | — |

Allowed statuses: Not started, In progress, Ready for review, Merged,
Blocked.

This committed tracker is a snapshot and may lag behind the live status
reported by the orchestrator.

## Notes

- Milestones 1 and 2 are merged (PRs #1 and #2).
- Milestone 3 implements in-memory add and display only; persistence is
  milestone 5 and complete/delete actions are milestone 4.
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
