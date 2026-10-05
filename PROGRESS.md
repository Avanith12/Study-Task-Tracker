# Progress

Study Task Tracker is built through eight sequential milestones. Only the
user merges pull requests. A milestone is complete only after its PR is
merged.

| Milestone | Owner | Status | Branch | PR | Verification |
|-----------|-------|--------|--------|----|--------------|
| 1. Project setup | Orchestrator | Merged | milestone/01-project-setup | [#1](https://github.com/Avanith12/Study-Task-Tracker/pull/1) | Merged |
| 2. Page skeleton | UI Worker | Ready for review | milestone/02-page-skeleton | [open PR](https://github.com/Avanith12/Study-Task-Tracker/pull/new/milestone/02-page-skeleton) | Verified |
| 3. Add and display | Logic Worker | Not started | milestone/03-add-display | — | — |
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

- Milestone 1 is merged (PR #1).
- Milestone 2 creates the static page skeleton only; application logic
  begins in milestone 3.
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
