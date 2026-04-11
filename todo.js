import { todos } from "./dummy.js";

const todoContainer = document.getElementById("todos-container");
const addButton = document.querySelector(
  '[data-testid="test-todo-add-button"]',
);

const formTitle = document.getElementById("title");
const formDescription = document.getElementById("description");
const formDate = document.getElementById("date");

function getRemainingTime(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const difference = due - now;

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (difference < 0) {
    return `Overdue by ${Math.abs(hours)} hour(s)`;
  } else if (days > 0) {
    return `Due in ${days} day(s)`;
  } else if (hours > 0) {
    return `Due in ${hours} hour(s)`;
  } else if (minutes > 0) {
    return `Due in ${minutes} minute(s)`;
  } else {
    return "Due now!";
  }
}

function renderTodos() {
  todoContainer.innerHTML = `<h2 class="todos-header">Todos</h2>`;

  todos.forEach((todo) => {
    const todoCard = document.createElement("article");
    todoCard.setAttribute("data-testid", "test-todo-card");

    todoCard.innerHTML = `
      <div class="todo-title">
        <h2
          data-testid="test-todo-title"
          class="${todo.status.toLowerCase() === "done" ? "complete" : ""}"
        >
          ${todo.title}
        </h2>

        <span
          data-testid="test-todo-status"
          class="${todo.status.toLowerCase().replace(" ", "-")}"
        >
          ${todo.status}
        </span>
      </div>

      <p
        data-testid="test-todo-description"
        class="${todo.status.toLowerCase() === "done" ? "complete" : ""}"
      >
        ${todo.description}
      </p>

      <div class="due-priority">
        <p class="priority">
          Priority:
          <span
            data-testid="test-todo-priority"
            class="${todo.priority.toLowerCase()}"
          >
            ${todo.priority}
          </span>
        </p>

        <p class="due">
          🗓️ Due:
          <time
            data-testid="test-todo-due-date"
            datetime="${todo.dueDate}"
          >
            ${new Date(todo.dueDate).toDateString()}
          </time>
        </p>

        <p class="due">
          ⏱️
          <time
            data-testid="test-todo-time-remaining"
            aria-live="polite"
          >
            ${getRemainingTime(todo.dueDate)}
          </time>
        </p>

        <div data-testid="test-todo-tags" role="list" class="tags">
            ${todo.tags
              .map(
                (tag) => `
                <span
                role="listitem"
                class="tag-chip"
                data-testid="test-todo-tag-${tag.toLowerCase()}">
                    ${tag}
                </span>
                `,
              )
              .join("")}
        </div>
      </div>


      <label class="completed" for="checkbox-${todo.id}">
        <input
          type="checkbox"
          id="checkbox-${todo.id}"
          data-testid="test-todo-complete-toggle"
          aria-label="Mark ${todo.title} as completed"
        />
        Completed
      </label>

      <div class="btns">
        <button
          data-testid="test-todo-edit-button"
          class="edit-btn"
          aria-label="Edit ${todo.title}"
        >
          Edit
        </button>

        <button
          data-testid="test-todo-delete-button"
          class="delete-btn"
          aria-label="Delete ${todo.title}"
        >
          Delete
        </button>
      </div>
    `;

    todoContainer.appendChild(todoCard);

    const checkbox = todoCard.querySelector('input[type="checkbox"]');
    const editBtn = todoCard.querySelector(".edit-btn");
    const deleteBtn = todoCard.querySelector(".delete-btn");

    checkbox.checked = todo.status === "Done";

    checkbox.addEventListener("change", (e) => {
      todo.status = e.target.checked ? "Done" : "In-Progress";
      renderTodos();
    });

    editBtn.addEventListener("click", () => {
      console.log("edit todo");
    });

    deleteBtn.addEventListener("click", () => {
      const index = todos.findIndex((item) => item.id === todo.id);
      todos.splice(index, 1);
      renderTodos();
    });
  });
}

renderTodos();
setInterval(renderTodos, 60000);

addButton.addEventListener("click", () => {
  todos.push({
    id: Date.now(),
    title: formTitle.value,
    description: formDescription.value,
    priority: "Low",
    status: "Pending",
    dueDate: formDate.value,
    tags: ["personal", "errand"],
  });

  formTitle.value = "";
  formDescription.value = "";
  formDate.value = "";

  renderTodos();
});
