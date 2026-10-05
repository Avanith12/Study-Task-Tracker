# Study Task Tracker — Agent Instructions

## 1. Project Goal

Build a small website that helps students track assignments and deadlines.

Users can:
- Add a task with a title and deadline.
- Mark tasks complete or incomplete.
- Delete tasks.
- Identify overdue tasks.
- Keep tasks after refreshing the page.

This project also demonstrates coordination between three Pi agents,
with visible progress and a user-reviewed PR for each milestone.

## 2. Technology and Scope

- Plain HTML, CSS, and JavaScript.
- localStorage for saving tasks.
- No backend, database, framework, or external API.
- Run by opening index.html in a browser.
- No login, cloud sync, notifications, or AI features in this version.
- Never commit API keys, credentials, or private configuration.
- Render user-entered titles as text, never as HTML.

## 3. Agent Roles

### Pi Orchestrator

Responsibilities:
- Inspect the repository and read this file.
- Coordinate exactly two workers: Logic Worker and UI Worker.
- Assign only the current milestone.
- Confirm the shared interface before implementation.
- Prepare separate Git worktrees and branches.
- Monitor progress and resolve coordination questions.
- Review changes and verify milestone requirements.
- Maintain PROGRESS.md.
- Report PR links, verification results, and blockers to the user.
- Wait for the user to merge before starting the next milestone.

The orchestrator owns shared documentation:
- AGENTS.md
- PROGRESS.md
- README.md
- .gitignore

The orchestrator does not implement application features.
Assign application fixes to the appropriate worker.

Use available Herdr orchestration tools if configured.
If automatic delegation is unavailable, provide worker prompts for
the user to deliver. Never claim delegation occurred unless it did.

### Pi Logic Worker

Owns:
- app.js

Responsibilities:
- Adding and displaying tasks.
- Completing and reopening tasks.
- Deleting tasks.
- Saving and loading tasks.
- Deadline and overdue behavior.
- Input validation and storage error handling.

Do not edit UI or shared documentation without orchestrator agreement.

### Pi UI Worker

Owns:
- index.html
- style.css

Responsibilities:
- Page structure and inputs.
- Task list and empty-state layout.
- Completed and overdue styles.
- Responsive layout.
- Accessible labels, buttons, and keyboard focus.

During milestone 2 only, this worker may create an empty app.js
placeholder. Later JavaScript changes belong to the Logic Worker.

Do not change application logic or shared documentation without
orchestrator agreement.

## 4. Shared Interface

Confirm this contract before implementation.
Coordinate any changes through the orchestrator.

### HTML Elements

- task-form: form for creating tasks
- task-title: required text input
- task-deadline: required date input
- task-list: ul containing task items
- empty-state: message shown when no tasks exist
- app-message: validation/storage message with aria-live="polite"

Load app.js with a script tag using defer.

### Task Data

Each task contains:
- id: unique string
- title: trimmed, nonempty string
- deadline: YYYY-MM-DD string
- completed: boolean

Preserve task insertion order.

### Storage

localStorage key:
study-task-tracker:v1

Store tasks as a JSON array.

Malformed saved data must not crash the app.
If storage is unavailable, keep the app usable in memory and show
a clear message that changes cannot be saved.

### Rendered Task Elements

The Logic Worker creates li elements with class task-item.

Use these classes:
- task-title
- task-deadline
- task-actions
- task-toggle
- task-delete
- is-completed
- is-overdue

Apply is-completed and is-overdue to the task-item element.
Use real buttons for complete/reopen and delete actions.

The UI Worker styles this contract.

### Deadline Rules

A task is overdue only when:
- It is incomplete.
- Its deadline is earlier than today's local calendar date.

Tasks due today are not overdue.
Completed tasks are not overdue.
Treat deadlines as local calendar dates without UTC conversion.

## 5. Milestone Workflow

Complete the eight milestones sequentially.

For every milestone:
1. Confirm the previous milestone PR is merged.
2. Fetch the latest origin/main.
3. Create a fresh milestone branch from origin/main.
4. Assign the milestone to its owner.
5. Implement only the milestone scope.
6. Verify its acceptance criteria.
7. Update progress documentation.
8. Push the branch and open one PR targeting main.
9. Report the PR link and verification results.
10. Wait for the user to merge.

Only the user merges PRs.

Opening a PR does not mean the milestone is complete.
Mark it complete only after confirming it was merged.

Do not begin the next milestone while the current one awaits review.
If the user requests changes, update the existing milestone PR.

## 6. Milestones

### Milestone 1 — Project Setup

Owner: Orchestrator
Branch: milestone/01-project-setup

Deliver:
- README with project goal and planned running instructions.
- AGENTS.md with confirmed roles and shared interface.
- .gitignore for local configuration and credentials.
- PROGRESS.md with all eight milestones.
- Separate worker worktrees.

Acceptance:
- Both workers have clear roles and file ownership.
- Shared interface is documented.
- Progress tracker exists.
- No credentials are committed.

### Milestone 2 — Page Skeleton

Owner: UI Worker
Branch: milestone/02-page-skeleton

Deliver:
- index.html with the agreed HTML elements.
- Basic style.css.
- Empty app.js placeholder if needed.
- Script reference using defer.

Acceptance:
- Page opens successfully.
- Inputs have accessible labels.
- Task list and empty state are present.
- Agreed element IDs match AGENTS.md.

### Milestone 3 — Add and Display Tasks

Owner: Logic Worker
Branch: milestone/03-add-display

Deliver:
- In-memory task collection.
- Task creation and rendering.
- Input validation.
- Empty-state updates.

Acceptance:
- A title and deadline create a visible task.
- Empty or whitespace-only titles are rejected.
- Missing deadlines are rejected.
- Titles containing HTML are displayed as text.
- Adding a task hides the empty state.

Persistence and task actions are implemented in later milestones.

### Milestone 4 — Complete and Delete

Owner: Logic Worker
Branch: milestone/04-complete-delete

Deliver:
- Complete and reopen actions.
- Delete action.
- Completed-state class updates.

Acceptance:
- Each task can be completed and reopened.
- Each task can be deleted.
- Actions affect the correct task.
- Deleting the last task restores the empty state.

### Milestone 5 — Save Tasks

Owner: Logic Worker
Branch: milestone/05-persistence

Deliver:
- Load tasks from localStorage.
- Save after adding, completing, reopening, or deleting.
- Validate loaded task data.
- Handle malformed data and storage failures.

Acceptance:
- Tasks survive refresh.
- Completion status survives refresh.
- Deleted tasks remain deleted after refresh.
- Malformed saved data does not crash the app.
- Storage failures produce a clear message.
- With unavailable storage, task actions still work in memory.

### Milestone 6 — Deadline Indicators

Owner: Logic Worker
Branch: milestone/06-deadlines

Deliver:
- Overdue calculation.
- is-overdue class updates.
- Deadline display consistent with local calendar dates.

Acceptance:
- An incomplete task due yesterday is overdue.
- A task due today is not overdue.
- A future task is not overdue.
- Completing an overdue task removes its overdue state.
- Reopening it restores its overdue state when applicable.

### Milestone 7 — Polished Interface

Owner: UI Worker
Branch: milestone/07-interface

Deliver:
- Clean spacing, typography, and colors.
- Completed and overdue styling.
- Responsive desktop and mobile layout.
- Visible keyboard focus.
- Clear validation and storage messages.

Acceptance:
- The app is usable at a narrow mobile viewport.
- Inputs and buttons work with a keyboard.
- Completed and overdue states are easy to distinguish.
- Status is understandable without relying only on color.
- Long titles do not break the layout.

### Milestone 8 — Final Verification

Owner: Orchestrator, with fixes assigned to workers
Branch: milestone/08-final-verification

Deliver:
- Full workflow verification.
- Any necessary worker fixes.
- Final README running instructions.
- Documented verification results and limitations.

Acceptance:
- All previous milestone requirements work together.
- Add, complete, reopen, delete, refresh, and overdue checks pass.
- Desktop and mobile layout checks pass.
- No unexpected browser console errors occur.
- README explains how to run the app and its localStorage behavior.
- No unresolved blockers are hidden.

If no code fixes are needed, open a documentation PR recording
verification results and final running instructions.

## 7. Git and Worktree Rules

- Each worker uses its own worktree.
- Never switch branches in another agent's folder.
- Use the milestone branch names listed above.
- Start each milestone from updated origin/main.
- Keep commits focused and messages clear.
- Push only the assigned milestone branch.
- Never push directly to main.
- Never merge PRs.
- Never force-push or rewrite shared history.
- Never delete another agent's worktree or branch.
- Do not overwrite unrelated user changes.

For each milestone, there is one shared milestone branch.

When documentation updates or fixes require another agent:
- Coordinate access through the orchestrator.
- Commit changes sequentially.
- Fetch and fast-forward before another agent contributes.
- Do not let multiple agents write to the same worktree.
- Do not create extra administrative PRs just to update tracking.

If GitHub authentication or permissions are missing:
- Report the blocker.
- Provide the exact remaining steps.
- Do not claim a push or PR succeeded without checking.

## 8. Progress Tracking

PROGRESS.md must contain:

| Milestone | Owner | Status | Branch | PR | Verification |
|-----------|-------|--------|--------|----|--------------|
| 1. Project setup | Orchestrator | Not started | milestone/01-project-setup | — | — |
| 2. Page skeleton | UI Worker | Not started | milestone/02-page-skeleton | — | — |
| 3. Add and display | Logic Worker | Not started | milestone/03-add-display | — | — |
| 4. Complete and delete | Logic Worker | Not started | milestone/04-complete-delete | — | — |
| 5. Save tasks | Logic Worker | Not started | milestone/05-persistence | — | — |
| 6. Deadline indicators | Logic Worker | Not started | milestone/06-deadlines | — | — |
| 7. Polished interface | UI Worker | Not started | milestone/07-interface | — | — |
| 8. Final verification | Orchestrator | Not started | milestone/08-final-verification | — | — |

Allowed statuses:
- Not started
- In progress
- Ready for review
- Merged
- Blocked

The orchestrator reports live status in its session.
Committed tracking is a snapshot and may lag behind GitHub.

Before opening a milestone PR:
- Mark that milestone Ready for review.
- Record checks and any limitations.

After opening it:
- Record the PR link in the tracker and update the same PR.
- Confirm the merge before advancing.
- Record its Merged status in the next milestone's tracker update.

For milestone 8, the final merge is confirmed in the orchestrator's
completion report. Do not create a ninth PR solely to record that merge.

## 9. PR Requirements

Title format:
Milestone N: Short description

PR description must include:
- Goal and implemented changes.
- Files changed.
- Acceptance checks and results.
- Checks that could not be performed.
- Known issues or blockers.

Keep each PR limited to its milestone and necessary fixes.

## 10. Verification Honesty

- Run checks appropriate to the milestone.
- Do not introduce a large test framework for this small app.
- Manual browser checks are acceptable.
- Use focused automated tests when they meaningfully verify logic.
- Never claim browser testing if it was not performed.
- Clearly identify checks that require the user to verify.

## 11. Completion Report

At every checkpoint, the orchestrator reports:
- Milestone number and name.
- Work completed and responsible agent.
- Verification results.
- PR link.
- Remaining issues.
- Whether it is awaiting user review or confirmed merged.

When all milestones are merged, report:
- Final app features.
- How to run it.
- Verification summary.
- Any remaining limitations.