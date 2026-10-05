# Progress

Study Task Tracker is built through eight sequential milestones. Only the
user merges pull requests. A milestone is complete only after its PR is
merged.

| Milestone | Owner | Status | Branch | PR | Verification |
|-----------|-------|--------|--------|----|--------------|
| 1. Project setup | Orchestrator | Ready for review | milestone/01-project-setup | — | — |
| 2. Page skeleton | UI Worker | Not started | milestone/02-page-skeleton | — | — |
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

- Milestone 1 prepares the shared documentation and separate worker
  worktrees. It contains no application logic.
- Worktrees for the Logic Worker and UI Worker are created from
  `origin/main` before milestone 2 begins.

## Verification log

### Milestone 1 — Project setup

- `README.md` documents the goal, running instructions, and storage behavior.
- `AGENTS.md` documents roles, file ownership, and the shared interface.
- `.gitignore` covers local configuration and credentials.
- `PROGRESS.md` lists all eight milestones.
- Separate worktrees exist for the Logic Worker and UI Worker.
- Manual browser checks: not applicable to this milestone (no app code yet).
