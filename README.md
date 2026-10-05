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

No build step or server is required.

1. Clone or download this repository.
2. Open `index.html` directly in a modern browser.

You can also serve the folder locally if you prefer, for example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/> in your browser.

## Data and storage behavior

- Tasks are saved under the `localStorage` key `study-task-tracker:v1`.
- Data is stored as a JSON array of task objects:
  `{ id, title, deadline, completed }`.
- `deadline` uses the `YYYY-MM-DD` calendar format.
- If `localStorage` is unavailable, the app stays usable in memory and
  shows a message that changes cannot be saved.
- Malformed saved data does not crash the app.

## Project status

This project is built milestone by milestone. See [`PROGRESS.md`](PROGRESS.md)
for the current status, and [`AGENTS.md`](AGENTS.md) for the agent roles and
shared interface.
