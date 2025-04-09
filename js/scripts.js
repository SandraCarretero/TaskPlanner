import { weatherService } from './weather/weatherService.js';

const addButtonElement = document.getElementById('addTask');
const modalElement = document.getElementById('modal');
const cancelButtonElement = document.getElementById('cancel-button');
const saveButtonElement = document.getElementById('save-button');

const modalTitleElement = document.getElementById('modal-title');

const titleTask = document.getElementById('task-title');
const dateTask = document.getElementById('task-date');
const descriptionTask = document.getElementById('task-description');
const priorityTask = document.getElementById('task-priority');
const statusTask = document.getElementById('task-status');

const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Elementos de usuario
const userNameElement = document.querySelector('.title');
const logoutBtn = document.querySelector('.nav-item:nth-child(4)');
const avatarElement = document.querySelector('.avatar');

const weatherTemp = document.getElementById('weather-temp');
const weatherIcon = document.getElementById('weather-icon');

let editingTaskCard = null;
let editingTaskId = null;
let taskToDelete = null;
let currentUser = null;

// Comprobar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  checkSession();
  loadTasks();
});

// Comprobar si hay sesión activa
function checkSession() {
  const session =
    JSON.parse(localStorage.getItem('session')) ||
    JSON.parse(sessionStorage.getItem('session'));

  if (!session || !session.isLoggedIn) {
    // Si no hay sesión activa, redirigir al login
    window.location.href = 'html/login.html';
    return;
  }

  // Establecer usuario actual
  currentUser = session;

  // Actualizar nombre de usuario en la UI
  const firstName = currentUser.name.split(' ')[0];
  userNameElement.textContent = `Bienvenid@ ${firstName}`;

  // Actualizar avatar con iniciales
  const nameParts = currentUser.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`
      : nameParts[0].charAt(0);
  avatarElement.textContent = initials.toUpperCase();
}

// Manejar cierre de sesión
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('session');
  sessionStorage.removeItem('session');
  window.location.href = 'html/login.html';
});

const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const openModal = (taskData = null, taskCard = null) => {
  modalElement.classList.remove('hidden');

  if (taskData) {
    modalTitleElement.textContent = 'Editar tarea';
    saveButtonElement.textContent = 'Actualizar tarea';
    editingTaskId = taskData.id;
    editingTaskCard = taskCard;

    titleTask.value = taskData.title;
    dateTask.value = taskData.date;
    descriptionTask.value = taskData.description;
    priorityTask.value = taskData.priority;
    statusTask.value = taskData.status;

    document.querySelectorAll('.tags-selection .tag').forEach(tag => {
      const tagText = tag.textContent.trim().toLowerCase();
      if (taskData.tags.map(t => t.toLowerCase()).includes(tagText)) {
        tag.classList.add('selected');
        tag.classList.remove('noselected');
      } else {
        tag.classList.remove('selected');
        tag.classList.add('noselected');
      }
    });
  } else {
    modalTitleElement.textContent = 'Nueva tarea';
    saveButtonElement.textContent = 'Crear tarea';
    clearForm();
    editingTaskId = null;
    editingTaskCard = null;
  }
};

const closeModal = () => {
  modalElement.classList.add('hidden');
  clearForm();
};

const getTaskData = () => {
  const title = capitalizeFirstLetter(titleTask.value);
  const date = dateTask.value;
  const description = capitalizeFirstLetter(descriptionTask.value);
  const priority = priorityTask.value;
  const status = statusTask.value;

  const selectedTags = Array.from(
    document.querySelectorAll('.tags-selection .tag.selected')
  ).map(tag => tag.textContent.trim());

  return {
    id: editingTaskId || generateId(),
    title,
    date,
    description,
    priority,
    status,
    tags: selectedTags,
    updatedAt: new Date().toISOString()
  };
};

// Generar ID único para tareas
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const getTagIcon = tag => {
  switch (tag.toLowerCase()) {
    case 'trabajo':
      return 'fas fa-briefcase fa-xs';
    case 'documentación':
    case 'documentacion':
      return 'fas fa-file-alt fa-xs';
    case 'diseño':
      return 'fas fa-paint-brush fa-xs';
    case 'personal':
      return 'fas fa-user fa-xs';
    case 'reunión':
    case 'reunion':
      return 'fas fa-users fa-xs';
    case 'desarrollo':
      return 'fas fa-code fa-xs';
    default:
      return 'fas fa-tag fa-xs';
  }
};

const createTaskCard = taskData => {
  const { id, title, date, tags, description, priority, status } = taskData;

  const taskCard = document.createElement('div');
  taskCard.className = `task-card priority-${priority}`;
  taskCard.dataset.taskId = id;

  const dateDiv = document.createElement('div');
  dateDiv.className = 'date';
  dateDiv.innerHTML = `<i class="fa-regular fa-calendar"></i><span>${date}</span>`;
  taskCard.appendChild(dateDiv);

  const h3 = document.createElement('h3');
  h3.textContent = title;
  taskCard.appendChild(h3);

  const tagContainer = document.createElement('div');
  tagContainer.className = 'tag-container';
  tags.forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.className = `tag tag-${tag.toLowerCase()}`;
    tagEl.innerHTML = `<i class="${getTagIcon(tag)}"></i>&nbsp;${tag}`;
    tagContainer.appendChild(tagEl);
  });
  taskCard.appendChild(tagContainer);

  const p = document.createElement('p');
  p.textContent = description;
  taskCard.appendChild(p);

  const footer = document.createElement('div');
  footer.className = `task-footer priority-${priority}`;

  const priorityDiv = document.createElement('div');
  priorityDiv.className = 'priority-indicator';
  priorityDiv.innerHTML = `
    <span class="priority-dot priority-${priority}"></span>
    <span class="priority-text">${
      priority.charAt(0).toUpperCase() + priority.slice(1)
    }</span>
  `;

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';

  const editIcon = document.createElement('i');
  editIcon.className = 'fas fa-pen editIcon ';

  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fas fa-trash deleteIcon';

  actionsDiv.appendChild(editIcon);
  actionsDiv.appendChild(deleteIcon);
  footer.appendChild(priorityDiv);
  footer.appendChild(actionsDiv);
  taskCard.appendChild(footer);

  editIcon.addEventListener('click', () => {
    openModal(taskData, taskCard);
  });

  deleteIcon.addEventListener('click', () => openDeleteModal(taskCard, id));

  const column = document.querySelector(`.task-column.${status} .tasks`);
  if (column) column.appendChild(taskCard);
  updateBadges();
};

const validateForm = () => {
  let isValid = true;

  // Limpia mensajes anteriores
  document
    .querySelectorAll('.error-message')
    .forEach(el => (el.textContent = ''));

  if (!titleTask.value.trim()) {
    document.getElementById('error-title').textContent = 'Campo obligatorio';
    isValid = false;
  }

  if (!dateTask.value.trim()) {
    document.getElementById('error-date').textContent = 'Campo obligatorio';
    isValid = false;
  }

  if (!descriptionTask.value.trim()) {
    document.getElementById('error-description').textContent =
      'Campo obligatorio';
    isValid = false;
  }

  if (!priorityTask.value.trim()) {
    document.getElementById('error-priority').textContent = 'Campo obligatorio';
    isValid = false;
  }

  if (!statusTask.value.trim()) {
    document.getElementById('error-status').textContent = 'Campo obligatorio';
    isValid = false;
  }

  const selectedTags = Array.from(
    document.querySelectorAll('.tags-selection .tag.selected')
  );
  if (selectedTags.length === 0) {
    document.getElementById('error-tags').textContent =
      'Debes seleccionar al menos una etiqueta';
    isValid = false;
  }

  return isValid;
};

const saveTask = () => {
  if (!validateForm()) return;

  const taskData = getTaskData();

  if (editingTaskCard) {
    editingTaskCard.remove();
    editingTaskCard = null;
  }

  createTaskCard(taskData);
  saveTasks();
  clearForm();
  closeModal();
};

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

document.querySelectorAll('.tags-selection .tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('selected');
    tag.classList.toggle('noselected');
  });
});

const openDeleteModal = (taskCard, taskId) => {
  deleteModal.classList.remove('hidden');
  taskToDelete = { taskCard, taskId };
};

const closeDeleteModal = () => {
  deleteModal.classList.add('hidden');
  taskToDelete = null;
};

confirmDeleteBtn.addEventListener('click', () => {
  if (taskToDelete) {
    taskToDelete.taskCard.remove();
    saveTasks(); // Guardar el estado después de eliminar
    updateBadges();
  }
  closeDeleteModal();
});

const updateBadges = () => {
  const statuses = ['pending', 'progress', 'completed'];

  statuses.forEach(status => {
    const columnTasks = document.querySelectorAll(
      `.task-column.${status} .task-card`
    );
    const badge = document.getElementById(`badge-${status}`);
    if (badge) {
      badge.textContent = columnTasks.length;
    }
  });
};

// Cargar tareas desde localStorage
const loadTasks = () => {
  if (!currentUser) return;

  // Limpiar tareas existentes en la UI
  document.querySelectorAll('.task-column .tasks').forEach(column => {
    column.innerHTML = '';
  });

  // Cargar tareas del usuario actual
  const tasksData = JSON.parse(
    localStorage.getItem(`tasks_${currentUser.email}`)
  ) || { tasks: [] };

  tasksData.tasks.forEach(task => {
    createTaskCard(task);
  });

  updateBadges();
};

// Guardar tareas en localStorage
const saveTasks = () => {
  if (!currentUser) return;

  const allTasks = [];

  // Recopilar todas las tareas actualmente en la UI
  document.querySelectorAll('.task-card').forEach(taskCard => {
    const taskId = taskCard.dataset.taskId;
    const status = taskCard
      .closest('.task-column')
      .classList.contains('pending')
      ? 'pending'
      : taskCard.closest('.task-column').classList.contains('progress')
      ? 'progress'
      : 'completed';

    const taskTitle = taskCard.querySelector('h3').textContent;
    const taskDate = taskCard.querySelector('.date span').textContent;
    const taskDescription = taskCard.querySelector('p').textContent;
    const taskPriority = taskCard.classList.contains('priority-alta')
      ? 'alta'
      : taskCard.classList.contains('priority-media')
      ? 'media'
      : 'baja';

    // Recopilar etiquetas
    const tags = Array.from(taskCard.querySelectorAll('.tag')).map(tag => {
      return tag.textContent.trim();
    });

    allTasks.push({
      id: taskId,
      title: taskTitle,
      date: taskDate,
      description: taskDescription,
      priority: taskPriority,
      status: status,
      tags: tags,
      updatedAt: new Date().toISOString()
    });
  });

  // Guardar en localStorage
  const tasksData = { tasks: allTasks };
  localStorage.setItem(`tasks_${currentUser.email}`, JSON.stringify(tasksData));
};

const filterBtn = document.getElementById('priority-filter-btn');
const priorityOptions = document.getElementById('priority-options');

filterBtn.addEventListener('click', () => {
  priorityOptions.classList.toggle('show');
});

priorityOptions.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const selectedPriority = e.target.getAttribute('data-priority');
    filterTasksByPriority(selectedPriority);
    priorityOptions.classList.remove('show');
  }
});

const filterTasksByPriority = priority => {
  const allTasks = document.querySelectorAll('.task-card');

  allTasks.forEach(task => {
    const taskPriority = [...task.classList]
      .find(c => c.startsWith('priority-'))
      ?.replace('priority-', '');

    console.log('Prioridad seleccionada:', priority);
    console.log('Prioridad de la tarea:', taskPriority);

    if (priority === 'all' || taskPriority === priority) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
};

const showWeatherByCity = async city => {
  const weather = await weatherService.getWeatherByCity(city);

  if (weather) {
    const roundedTemperature = Math.round(weather.temperature);
    weatherTemp.textContent = `${roundedTemperature}°C`;

    weatherIcon.src = weather.icon;
    weatherIcon.alt = weather.description; // Añade la descripción como alt para accesibilidad
  } else {
    console.log('No se pudo obtener el clima.');
  }
};

showWeatherByCity('Madrid');

addButtonElement.addEventListener('click', () => openModal());
cancelButtonElement.addEventListener('click', closeModal);
saveButtonElement.addEventListener('click', saveTask);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
