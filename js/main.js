import { Modal } from './models/modal.js';
import { Task } from './models/tasks.js';

// Array para almacenar las tareas
const taskList = [];

// Referencias a elementos del DOM
const saveButtonElement = document.getElementById('save-button');
const titleTask = document.querySelector('#titleTask');
const dateTask = document.querySelector('#dateTask');
const descriptionTask = document.querySelector('#descriptionTask');
const priorityTask = document.querySelector('#priorityTask');
const statusTask = document.querySelector('#statusTask');
const taskContainer = document.querySelector('.tasks');

// Variables para editar tareas
let editingTaskId = null;

// Función para manejar el envío del formulario (crear o editar tarea)
const handleFormSubmit = event => {
  event.preventDefault();

  const title = titleTask.value;
  const date = dateTask.value;
  const description = descriptionTask.value;
  const priority = priorityTask.value;
  const status = statusTask.value;

  // Si estamos editando una tarea, actualizamos la tarea correspondiente
  if (editingTaskId) {
    const updatedTask = new Task(title, description, date, priority, status);
    updatedTask.id = editingTaskId;
    const taskIndex = taskList.findIndex(task => task.id === editingTaskId);
    taskList[taskIndex] = updatedTask;
    editingTaskId = null;
  } else {
    // Crear una nueva tarea
    const newTask = new Task(title, description, date, priority, status);
    taskList.push(newTask);
  }

  Modal.close();
  renderTaskList();
};

// Función para renderizar las tareas en la vista
const renderTaskList = () => {
  taskContainer.innerHTML = ''; // Limpiar tareas anteriores

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    taskContainer.appendChild(taskCard);
  });
};

// Función para crear la tarjeta de una tarea
const createTaskCard = task => {
  const card = document.createElement('div');
  card.classList.add('task-card');
  card.dataset.id = task.id;

  card.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p><strong>Fecha:</strong> ${task.date}</p>
    <p><strong>Prioridad:</strong> ${task.priority}</p>
    <p><strong>Estado:</strong> ${task.status}</p>
    <button class="edit-btn">Editar</button>
    <button class="delete-btn">Eliminar</button>
  `;

  // Agregar eventos para editar y eliminar
  card
    .querySelector('.edit-btn')
    .addEventListener('click', () => handleEditTask(task.id));
  card
    .querySelector('.delete-btn')
    .addEventListener('click', () => handleDeleteTask(task.id));

  return card;
};

// Función para manejar la edición de una tarea
const handleEditTask = taskId => {
  const taskToEdit = taskList.find(task => task.id === taskId);

  if (taskToEdit) {
    Modal.open(taskToEdit);
    editingTaskId = taskId;
  }
};

// Función para manejar la eliminación de una tarea
const handleDeleteTask = taskId => {
  const taskIndex = taskList.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    taskList.splice(taskIndex, 1);
  }

  renderTaskList();
};

// Inicializar el formulario al abrir el modal
saveButtonElement.addEventListener('click', handleFormSubmit);

// Función para cerrar el modal y limpiar el formulario
Modal.close = () => {
  document.querySelector('.modal').classList.add('hidden');
  clearForm();
};

// Limpiar el formulario
const clearForm = () => {
  titleTask.value = '';
  dateTask.value = '';
  descriptionTask.value = '';
  priorityTask.value = '';
  statusTask.value = '';

  document.querySelectorAll('.tags-selection .tag').forEach(tag => {
    tag.classList.remove('selected');
    tag.classList.add('noselected');
  });

  document
    .querySelectorAll('.error-message')
    .forEach(el => (el.textContent = ''));
};

// Abrir modal para nueva tarea o editar
document
  .querySelector('#newTaskButton')
  .addEventListener('click', () => Modal.open());

// Renderizar tareas al cargar la página
renderTaskList();
