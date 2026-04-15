import { todos } from "./dummy.js";

const todoContainer = document.getElementById("todos-container");
const addButton = document.querySelector(
  '[data-testid="test-todo-add-button"]',
);

const formTitle = document.getElementById("title");
const formDescription = document.getElementById("description");
const formDate = document.getElementById("date");

function getRemainingTime(dueDate, status) {
  if (status === "Done") return "Completed";

  const now = new Date();
  const due = new Date(dueDate);
  const difference = due - now;

  const totalMinutes = Math.floor(Math.abs(difference) / (1000 * 60));
  const totalHours = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
  const totalDays = Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24));

  if (difference < 0) {
    if (totalDays > 0) return `Overdue by ${totalDays} day(s)`;
    if (totalHours > 0) return `Overdue by ${totalHours} hour(s)`;
    return `Overdue by ${totalMinutes} minute(s)`;
  } else if (totalDays > 0) {
    return `Due in ${totalDays} day(s)`;
  } else if (totalHours > 0) {
    return `Due in ${totalHours} hour(s)`;
  } else if (totalMinutes > 0) {
    return `Due in ${totalMinutes} minute(s)`;
  } else {
    return "Due now!";
  }
}

function isOverdue(dueDate, status) {
  if (status === "Done") return false;
  return new Date(dueDate) < new Date();
}

function getPriorityDot(priority) {
  const map = { High: "high", Medium: "medium", Low: "low" };
  return `<span class="priority-dot ${map[priority] || "low"}" data-testid="test-todo-priority-indicator" aria-label="${priority} priority"></span>`;
}

function renderTodos() {
  todoContainer.innerHTML = `<h2 class="todos-header">Todos</h2>`;

  todos.forEach((todo) => {
    const overdue = isOverdue(todo.dueDate, todo.status);
    const todoCard = document.createElement("article");
    todoCard.setAttribute("data-testid", "test-todo-card");
    todoCard.setAttribute("data-priority", todo.priority.toLowerCase());
    if (overdue) todoCard.classList.add("overdue-card");

    const collapsibleId = `collapsible-${todo.id}`;
    const isLong = todo.description.length > 120;

    todoCard.innerHTML = `
      <div class="view-mode">

        <div class="todo-title">
          <div class="title-row">
            ${getPriorityDot(todo.priority)}
            <h2 class="${todo.status === "Done" ? "complete" : ""}">
              ${todo.title}
            </h2>
          </div>

          <span data-testid="test-todo-status"
            class="${todo.status.toLowerCase().replace(" ", "-")} status-badge">
            ${todo.status}
          </span>
        </div>

        ${overdue ? `<div class="overdue-indicator" data-testid="test-todo-overdue-indicator" role="alert" aria-live="polite">⚠️ Overdue</div>` : ""}

        <div id="${collapsibleId}" data-testid="test-todo-collapsible-section">
          <p
            data-testid="test-todo-description"
            class="${todo.status === "Done" ? "complete" : ""} description${isLong ? "" : ""}"
          >${todo.description}</p>
        </div>

        ${
          isLong
            ? `
          <button
            class="expand-btn"
            data-testid="test-todo-expand-toggle"
            aria-expanded="false"
            aria-controls="${collapsibleId}"
          >
            Expand
          </button>
        `
            : ""
        }

        <div class="due-priority">
          <p class="priority">
            Priority:
            <span class="${todo.priority.toLowerCase()}">
              ${todo.priority}
            </span>
          </p>

          <p>
            🗓️ Due:
            <time datetime="${todo.dueDate}">
              ${new Date(todo.dueDate).toDateString()}
            </time>
          </p>

          <p class="${overdue ? "overdue-time" : ""}">
            ⏱️
            <time aria-live="polite">
              ${getRemainingTime(todo.dueDate, todo.status)}
            </time>
          </p>

          <div class="tags">
            ${todo.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
          </div>
        </div>

        <label for="checkbox-${todo.id}" class="completed-check">
          <input type="checkbox" id="checkbox-${todo.id}" ${todo.status === "Done" ? "checked" : ""} />
          Completed
        </label>

        <label for="status-${todo.id}" class="sr-only">Change status</label>
        <select id="status-${todo.id}" class="status-control" data-testid="test-todo-status-control" aria-label="Todo status">
          <option ${todo.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${todo.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option ${todo.status === "Done" ? "selected" : ""}>Done</option>
        </select>

        <div class="btns">
          <button class="edit-btn" aria-label="Edit todo: ${todo.title}">Edit</button>
          <button class="delete-btn" aria-label="Delete todo: ${todo.title}">Delete</button>
        </div>
      </div>

      <div class="edit-form hidden" data-testid="test-todo-edit-form" role="form" aria-label="Edit todo">
        <label for="edit-title-${todo.id}">Title</label>
        <input id="edit-title-${todo.id}" placeholder="Title" data-testid="test-todo-edit-title-input" />

        <label for="edit-desc-${todo.id}">Description</label>
        <textarea id="edit-desc-${todo.id}" placeholder="Description" data-testid="test-todo-edit-description-input"></textarea>

        <label for="edit-priority-${todo.id}">Priority</label>
        <select id="edit-priority-${todo.id}" data-testid="test-todo-edit-priority-select" aria-label="Priority">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label for="edit-date-${todo.id}">Due Date</label>
        <input type="date" id="edit-date-${todo.id}" data-testid="test-todo-edit-due-date-input" />

        <div class="btns">
          <button type="button" class="save-btn" data-testid="test-todo-save-button">Save</button>
          <button type="button" class="cancel-btn" data-testid="test-todo-cancel-button">Cancel</button>
        </div>
      </div>
    `;

    // ELEMENTS
    const checkbox = todoCard.querySelector(`#checkbox-${todo.id}`);
    const editBtn = todoCard.querySelector(".edit-btn");
    const deleteBtn = todoCard.querySelector(".delete-btn");
    const statusControl = todoCard.querySelector(".status-control");
    const expandBtn = todoCard.querySelector(".expand-btn");
    const desc = todoCard.querySelector(
      '[data-testid="test-todo-description"]',
    );

    const editForm = todoCard.querySelector(
      '[data-testid="test-todo-edit-form"]',
    );
    const viewMode = todoCard.querySelector(".view-mode");
    const saveBtn = todoCard.querySelector(
      '[data-testid="test-todo-save-button"]',
    );
    const cancelBtn = todoCard.querySelector(
      '[data-testid="test-todo-cancel-button"]',
    );

    // CHECKBOX SYNC
    checkbox.addEventListener("change", (e) => {
      todo.status = e.target.checked ? "Done" : "Pending";
      renderTodos();
    });

    // STATUS CONTROL
    statusControl.addEventListener("change", (e) => {
      todo.status = e.target.value;
      renderTodos();
    });

    // DELETE
    deleteBtn.addEventListener("click", () => {
      const index = todos.findIndex((t) => t.id === todo.id);
      todos.splice(index, 1);
      renderTodos();
    });

    // EDIT
    editBtn.addEventListener("click", () => {
      viewMode.classList.add("hidden");
      editForm.classList.remove("hidden");

      todoCard.querySelector(
        '[data-testid="test-todo-edit-title-input"]',
      ).value = todo.title;
      todoCard.querySelector(
        '[data-testid="test-todo-edit-description-input"]',
      ).value = todo.description;
      todoCard.querySelector(
        '[data-testid="test-todo-edit-priority-select"]',
      ).value = todo.priority;
      todoCard.querySelector(
        '[data-testid="test-todo-edit-due-date-input"]',
      ).value = todo.dueDate.split("T")[0];

      // Focus first field for accessibility
      todoCard
        .querySelector('[data-testid="test-todo-edit-title-input"]')
        .focus();
    });

    cancelBtn.addEventListener("click", () => {
      editForm.classList.add("hidden");
      viewMode.classList.remove("hidden");
      editBtn.focus(); // return focus to Edit button
    });

    saveBtn.addEventListener("click", () => {
      todo.title = todoCard.querySelector(
        '[data-testid="test-todo-edit-title-input"]',
      ).value;
      todo.description = todoCard.querySelector(
        '[data-testid="test-todo-edit-description-input"]',
      ).value;
      todo.priority = todoCard.querySelector(
        '[data-testid="test-todo-edit-priority-select"]',
      ).value;
      const dateVal = todoCard.querySelector(
        '[data-testid="test-todo-edit-due-date-input"]',
      ).value;
      if (dateVal) todo.dueDate = dateVal + "T00:00:00Z";

      renderTodos();
    });

    // EXPAND / COLLAPSE
    if (isLong && expandBtn) {
      desc.classList.add("collapsed");

      expandBtn.addEventListener("click", () => {
        const isExpanded = desc.classList.toggle("expanded");
        desc.classList.toggle("collapsed", !isExpanded);
        expandBtn.setAttribute("aria-expanded", String(isExpanded));
        expandBtn.textContent = isExpanded ? "Collapse" : "Expand";
      });
    }

    todoContainer.appendChild(todoCard);
  });
}

renderTodos();

// refresh time every 30s
setInterval(renderTodos, 30000);

// ADD TODO
addButton.addEventListener("click", () => {
  const title = formTitle.value.trim();
  if (!title) {
    formTitle.focus();
    return;
  }

  todos.unshift({
    id: Date.now(),
    title,
    description: formDescription.value,
    priority: "Low",
    status: "Pending",
    dueDate: formDate.value
      ? formDate.value + "T00:00:00Z"
      : new Date().toISOString(),
    tags: ["personal", "task"],
  });

  formTitle.value = "";
  formDescription.value = "";
  formDate.value = "";

  renderTodos();
});
