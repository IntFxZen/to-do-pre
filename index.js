const initialTasks = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const STORAGE_KEY = "to-do-tasks";

const todoList = document.querySelector(".to-do__list");
const todoForm = document.querySelector(".to-do__form");
const taskInput = document.querySelector(".to-do__input");
const taskTemplate = document
  .querySelector("#to-do__item-template")
  .content.querySelector(".to-do__item");

function getSavedTasks() {
  const rawTasks = localStorage.getItem(STORAGE_KEY);
  if (rawTasks === null) {
    return [...initialTasks];
  }

  try {
    const tasks = JSON.parse(rawTasks);
    if (!Array.isArray(tasks) || !tasks.every((task) => typeof task === "string")) {
      throw new TypeError("Saved tasks must be an array of strings.");
    }
    return tasks;
  } catch (error) {
    console.error("Could not load saved tasks from localStorage.", error);
    return [...initialTasks];
  }
}

function collectTasksFromDOM() {
  const textNodes = todoList.querySelectorAll(".to-do__item-text");
  return Array.from(textNodes, (node) => node.textContent);
}

function updateStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function syncTasksWithStorage() {
  const currentTasks = collectTasksFromDOM();
  updateStorage(currentTasks);
}

function createItem(taskText) {
  const taskNode = taskTemplate.cloneNode(true);

  const textNode = taskNode.querySelector(".to-do__item-text");
  const removeBtn = taskNode.querySelector(".to-do__item-button_type_delete");
  const copyBtn = taskNode.querySelector(".to-do__item-button_type_duplicate");
  const editBtn = taskNode.querySelector(".to-do__item-button_type_edit");

  textNode.textContent = taskText;

  removeBtn.addEventListener("click", () => {
    taskNode.remove();
    syncTasksWithStorage();
  });

  copyBtn.addEventListener("click", () => {
    const copiedNode = createItem(textNode.textContent);
    todoList.prepend(copiedNode);
    syncTasksWithStorage();
  });

  editBtn.addEventListener("click", () => {
    textNode.contentEditable = "true";
    textNode.focus();
  });

  textNode.addEventListener("blur", () => {
    textNode.contentEditable = "false";
    syncTasksWithStorage();
  });

  return taskNode;
}

function handleFormSubmit(evt) {
  evt.preventDefault();

  const taskText = taskInput.value.trim();
  if (!taskText) {
    return;
  }

  const taskNode = createItem(taskText);
  todoList.prepend(taskNode);
  todoForm.reset();

  syncTasksWithStorage();
}

todoForm.addEventListener("submit", handleFormSubmit);

const loadedTasks = getSavedTasks();
for (const taskText of loadedTasks) {
  todoList.append(createItem(taskText));
}