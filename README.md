# Study Task Tracker

A small website that helps students track assignments and deadlines.

## Goal

The Study Task Tracker lets a student:

- Add a task with a title and a deadline.
- Mark a task complete or incomplete.
- Delete a task.
- See which tasks are overdue.
- Keep tasks after refreshing the page.

The app is intentionally small: plain HTML, CSS, and JavaScript with no
backend, database, framework, or external API. Tasks are stored in the
browser with `localStorage`.

## Running the app

No build step, install, or server is required.

1. Clone or download this repository.
2. Open `index.html` directly in a modern browser (double-click it, or use
   **File → Open**).

You can also serve the folder locally if you prefer:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/> in your browser.

## How to use

1. Type a title and pick a deadline, then select **Add task**.
   Empty or whitespace-only titles, titles longer than 200 characters, and
   missing or invalid calendar deadlines are rejected. You can keep up to 500 tasks.
2. Select **Complete** on a task to mark it done; select **Reopen** to make
   it active again.
3. Select **Delete** to remove a task.
4. A task is shown as **Overdue** only when it is incomplete and its deadline
   is earlier than today. Tasks due today are not overdue. Completed tasks
   are never overdue.

Completed tasks are shown with a struck-through title and a "✓ Completed"
badge; overdue tasks show a "⚠ Overdue" badge, so status is clear without
relying on color alone.

## Data and storage behavior

- Tasks are saved under the `localStorage` key `study-task-tracker:v1`.
- Data is stored as a JSON array of task objects:
  `{ id, title, deadline, completed }`.
- `deadline` uses the `YYYY-MM-DD` local calendar format.
- Deadlines are treated as local calendar dates with no timezone conversion.
- If `localStorage` is unavailable, the app stays usable in memory and shows
  a clear message that changes cannot be saved.
- Malformed, oversized, duplicated, or partially invalid saved data does not
  crash the app. Valid entries can still be used in memory, but saving is
  paused with a warning to preserve the original saved data.
- To recover from that warning, first back up the raw value of
  `study-task-tracker:v1` using your browser developer tools. Repair that JSON
  or remove that specific key, then reload. Removing the key deletes the saved
  tasks; changes made while saving is paused are not persisted.
- Saved input is bounded to 1,048,576 UTF-16 characters before JSON parsing.
  See [SECURITY.md](SECURITY.md) for review findings and limits.

## Project files

- `index.html` — page structure and inputs.
- `style.css` — layout and visual styling.
- `app.js` — task logic and `localStorage` persistence.
- `AGENTS.md` — agent roles and the shared interface contract.
- `PROGRESS.md` — milestone history and verification notes.

## Limitations

- Data is stored per browser and per device; there is no sync or export.
- Clearing browser storage removes saved tasks.
- There is no login, notification, or cloud backup.

## Project status

This project was built milestone by milestone. See [`PROGRESS.md`](PROGRESS.md)
for the status and verification results, and [`AGENTS.md`](AGENTS.md) for the
agent roles and shared interface.
