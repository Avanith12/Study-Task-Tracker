// Study Task Tracker — application logic.
// Milestone 3: add and display tasks (in-memory only).
// Persistence is added in a later milestone.

(function () {
  "use strict";

  // In-memory task collection. Insertion order is preserved.
  var tasks = [];

  var form = document.getElementById("task-form");
  var titleInput = document.getElementById("task-title");
  var deadlineInput = document.getElementById("task-deadline");
  var taskList = document.getElementById("task-list");
  var emptyState = document.getElementById("empty-state");
  var appMessage = document.getElementById("app-message");

  if (!form || !titleInput || !deadlineInput || !taskList || !emptyState || !appMessage) {
    return;
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function setMessage(text) {
    appMessage.textContent = text;
  }

  function createTask(title, deadline) {
    return {
      id: createId(),
      title: title,
      deadline: deadline,
      completed: false
    };
  }

  function renderTask(task) {
    var item = document.createElement("li");
    item.className = "task-item";
    item.setAttribute("data-id", task.id);

    if (task.completed) {
      item.classList.add("is-completed");
    }

    var title = document.createElement("span");
    title.className = "task-title";
    // Rendered as text so user-entered HTML is never parsed.
    title.textContent = task.title;

    var deadline = document.createElement("span");
    deadline.className = "task-deadline";
    deadline.textContent = task.deadline;

    var actions = document.createElement("div");
    actions.className = "task-actions";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "task-toggle";
    toggle.textContent = task.completed ? "Reopen" : "Complete";

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "task-delete";
    remove.textContent = "Delete";

    actions.appendChild(toggle);
    actions.appendChild(remove);

    item.appendChild(title);
    item.appendChild(deadline);
    item.appendChild(actions);

    return item;
  }

  function updateEmptyState() {
    emptyState.hidden = tasks.length > 0;
  }

  function renderTasks() {
    taskList.textContent = "";
    for (var i = 0; i < tasks.length; i += 1) {
      taskList.appendChild(renderTask(tasks[i]));
    }
    updateEmptyState();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var title = titleInput.value.trim();
    var deadline = deadlineInput.value;

    if (!title) {
      setMessage("Please enter a task title.");
      titleInput.focus();
      return;
    }

    if (!deadline) {
      setMessage("Please choose a deadline.");
      deadlineInput.focus();
      return;
    }

    tasks.push(createTask(title, deadline));
    setMessage("");
    form.reset();
    renderTasks();
  });

  renderTasks();
})();
