// Study Task Tracker — application logic.
// Study Task Tracker logic, including input hardening and safe loading.

(function () {
  "use strict";

  var STORAGE_KEY = "study-task-tracker:v1";
  var STORAGE_UNAVAILABLE_MESSAGE =
    "Tasks cannot be saved in this browser. Changes will be lost when you close the page.";
  var TITLE_MAX_LENGTH = 200;
  var MAX_LOADED_TASKS = 500;

  // In-memory task collection. Insertion order is preserved.
  var tasks = [];
  var storageUnavailable = false;

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

  // Keep the storage warning visible whenever no other message is showing.
  function clearMessage() {
    setMessage(storageUnavailable ? STORAGE_UNAVAILABLE_MESSAGE : "");
  }

  function markStorageUnavailable() {
    storageUnavailable = true;
    setMessage(STORAGE_UNAVAILABLE_MESSAGE);
  }

  function getStorage() {
    try {
      return window.localStorage || null;
    } catch (error) {
      return null;
    }
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // True only for a YYYY-MM-DD string that is a real calendar date
  // (month 01-12 and a day that exists in that month, leap years included).
  function isValidDateString(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    var year = Number(value.slice(0, 4));
    var month = Number(value.slice(5, 7));
    var day = Number(value.slice(8, 10));
    if (month < 1 || month > 12) {
      return false;
    }
    var daysInMonth = [
      31,
      isLeapYear(year) ? 29 : 28,
      31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ];
    return day >= 1 && day <= daysInMonth[month - 1];
  }

  function isValidTask(entry) {
    return (
      entry !== null &&
      typeof entry === "object" &&
      !Array.isArray(entry) &&
      typeof entry.id === "string" &&
      entry.id !== "" &&
      typeof entry.title === "string" &&
      entry.title.trim() !== "" &&
      isValidDateString(entry.deadline) &&
      typeof entry.completed === "boolean"
    );
  }

  function loadTasks() {
    var storage = getStorage();
    if (!storage) {
      markStorageUnavailable();
      return [];
    }

    var raw;
    try {
      raw = storage.getItem(STORAGE_KEY);
    } catch (error) {
      markStorageUnavailable();
      return [];
    }

    if (raw === null || raw === undefined) {
      return [];
    }

    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      // Corrupted JSON: start clean without crashing.
      return [];
    }

    if (!Array.isArray(parsed)) {
      return [];
    }

    var loaded = [];
    var seenIds = Object.create(null);
    for (var i = 0; i < parsed.length && loaded.length < MAX_LOADED_TASKS; i += 1) {
      var entry = parsed[i];
      if (!isValidTask(entry)) {
        continue;
      }
      if (seenIds[entry.id]) {
        // Keep the first occurrence of each id so actions stay unambiguous.
        continue;
      }
      seenIds[entry.id] = true;
      loaded.push({
        id: entry.id,
        title: entry.title.trim(),
        deadline: entry.deadline,
        completed: entry.completed
      });
    }
    return loaded;
  }

  function saveTasks() {
    var storage = getStorage();
    if (!storage) {
      markStorageUnavailable();
      return;
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      markStorageUnavailable();
    }
  }

  // Today's local calendar date as YYYY-MM-DD. Built from local date parts
  // (not toISOString) so there is no UTC conversion or timezone shift.
  function getTodayString() {
    var now = new Date();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + month + "-" + day;
  }

  // A task is overdue only when it is incomplete and its deadline is
  // earlier than today's local calendar date. Deadlines are YYYY-MM-DD,
  // so direct string comparison is a valid calendar comparison.
  function isOverdue(task) {
    return !task.completed && task.deadline < getTodayString();
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

    if (isOverdue(task)) {
      item.classList.add("is-overdue");
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

  function findTaskById(id) {
    for (var i = 0; i < tasks.length; i += 1) {
      if (tasks[i].id === id) {
        return tasks[i];
      }
    }
    return null;
  }

  function toggleTask(id) {
    var task = findTaskById(id);
    if (!task) {
      return;
    }
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    for (var i = 0; i < tasks.length; i += 1) {
      if (tasks[i].id === id) {
        tasks.splice(i, 1);
        saveTasks();
        renderTasks();
        return;
      }
    }
  }

  // Delegated so actions resolve by task id from the nearest .task-item,
  // never by DOM index.
  taskList.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") {
      return;
    }
    var item = target.closest(".task-item");
    if (!item) {
      return;
    }
    var id = item.getAttribute("data-id");
    if (target.closest(".task-toggle")) {
      toggleTask(id);
    } else if (target.closest(".task-delete")) {
      deleteTask(id);
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var title = titleInput.value.trim();
    var deadline = deadlineInput.value;

    if (!title) {
      setMessage("Please enter a task title.");
      titleInput.focus();
      return;
    }

    if (title.length > TITLE_MAX_LENGTH) {
      setMessage("Task titles must be " + TITLE_MAX_LENGTH + " characters or fewer.");
      titleInput.focus();
      return;
    }

    if (!deadline) {
      setMessage("Please choose a deadline.");
      deadlineInput.focus();
      return;
    }

    tasks.push(createTask(title, deadline));
    saveTasks();
    clearMessage();
    form.reset();
    renderTasks();
  });

  tasks = loadTasks();
  renderTasks();
})();
