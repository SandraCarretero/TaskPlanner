// Importaciones
import { loadCurrentWeather } from './weather.js';
import { loadHolidays } from './calendar.js';
import {
  getDOMElements,
  showElement,
  hideElement,
  updateBadgeCount,
  createTaskCardElement
} from './utils/domUtils.js';
import {
  validateTaskForm,
  getTaskFormData,
  clearTaskForm,
  capitalizeFirstLetter
} from './utils/formUtils.js';
import {
  loadUserTasks,
  saveUserTasks,
  getAllTasksFromDOM
} from './utils/taskStorage.js';
import {
  checkUserSession,
  getCurrentUser,
  logoutUser
} from './services/authService.js';

// Módulo de gestión de tareas
const TaskManager = (() => {
  // Estado local
  let state = {
    editingTaskId: null,
    editingTaskCard: null,
    taskToDelete: null,
    currentUser: null
  };

  // Inicialización
  const init = () => {
    const elements = getDOMElements();
    bindEventListeners(elements);

    // Comprobar sesión al cargar
    state.currentUser = checkUserSession();
    if (!state.currentUser) {
      window.location.href = 'html/login.html';
      return;
    }

    // Inicializar UI
    initializeUserInterface(state.currentUser, elements);
    loadUserTasks(state.currentUser).forEach(task => createTaskCard(task));
    updateBadges();

    // Cargar APIs externas
    loadCurrentWeather('Madrid');
    loadHolidays();
  };

  // Inicializar interfaz de usuario con datos de sesión
  const initializeUserInterface = (user, elements) => {
    const firstName = user.name.split(' ')[0];
    elements.userNameElement.textContent = `Bienvenid@ ${firstName}`;

    const nameParts = user.name.split(' ');
    const initials =
      nameParts.length > 1
        ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`
        : nameParts[0].charAt(0);

    elements.avatarElement.textContent = initials.toUpperCase();
  };

  // Vinculación de event listeners
  const bindEventListeners = elements => {
    // Botones principales
    elements.addButtonElement.addEventListener('click', () => openTaskModal());
    elements.cancelButtonElement.addEventListener('click', closeTaskModal);
    elements.saveButtonElement.addEventListener('click', saveTaskHandler);
    elements.logoutBtn.addEventListener('click', handleLogout);

    // Modal de eliminación
    elements.confirmDeleteBtn.addEventListener('click', confirmDelete);
    elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // Tags
    document.querySelectorAll('.tags-selection .tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        tag.classList.toggle('noselected');
      });
    });

    // Filtrado
    const filterBtn = elements.filterBtn;
    const filterMenu = elements.filterMenu;
    const priorityOptions = elements.priorityOptions;
    const priorityOptionsMenu = elements.priorityOptionsMenu;

    const toggleButtons = [filterBtn, filterMenu];
    const optionLists = [priorityOptions, priorityOptionsMenu];

    toggleButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        optionLists[index].classList.toggle('show');
      });
    });

    optionLists.forEach(list => {
      list.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
          const selectedPriority = e.target.getAttribute('data-priority');
          filterTasksByPriority(selectedPriority);
          list.classList.remove('show');
        }
      });
    });
  };

  // Handler para guardar/actualizar tarea
  const saveTaskHandler = () => {
    const elements = getDOMElements();
    if (!validateTaskForm(elements)) return;

    const taskData = getTaskFormData(
      elements,
      state.editingTaskId,
      generateTaskId
    );

    if (state.editingTaskCard) {
      state.editingTaskCard.remove();
      state.editingTaskCard = null;
    }

    createTaskCard(taskData);
    persistTaskChanges();
    clearTaskForm(elements);
    closeTaskModal();
  };

  // Gestión de modales
  const openTaskModal = (taskData = null, taskCard = null) => {
    const elements = getDOMElements();

    if (taskData) {
      // Modo edición
      elements.modalTitleElement.textContent = 'Editar tarea';
      elements.saveButtonElement.textContent = 'Actualizar tarea';
      state.editingTaskId = taskData.id;
      state.editingTaskCard = taskCard;

      // Rellenar formulario con datos de la tarea
      elements.titleTask.value = taskData.title;
      elements.dateTask.value = taskData.date;
      elements.descriptionTask.value = taskData.description;
      elements.priorityTask.value = taskData.priority;
      elements.statusTask.value = taskData.status;

      // Marcar tags seleccionados
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
      // Modo creación
      elements.modalTitleElement.textContent = 'Nueva tarea';
      elements.saveButtonElement.textContent = 'Crear tarea';
      clearTaskForm(elements);
      state.editingTaskId = null;
      state.editingTaskCard = null;
    }

    showElement(elements.modalElement);
  };

  const closeTaskModal = () => {
    const elements = getDOMElements();
    hideElement(elements.modalElement);
    clearTaskForm(elements);
  };

  const openDeleteModal = (taskCard, taskId) => {
    const elements = getDOMElements();
    showElement(elements.deleteModal);
    state.taskToDelete = { taskCard, taskId };
  };

  const closeDeleteModal = () => {
    const elements = getDOMElements();
    hideElement(elements.deleteModal);
    state.taskToDelete = null;
  };

  const confirmDelete = () => {
    if (state.taskToDelete) {
      state.taskToDelete.taskCard.remove();
      persistTaskChanges();
      updateBadges();
    }
    closeDeleteModal();
  };

  // Funciones para manejo de tareas
  const createTaskCard = taskData => {
    const taskCard = createTaskCardElement(
      taskData,
      (taskCard, id) => openTaskModal(taskData, taskCard),
      openDeleteModal
    );

    const column = document.querySelector(
      `.task-column.${taskData.status} .tasks`
    );
    if (column) column.appendChild(taskCard);
    updateBadges();
  };

  const updateBadges = () => {
    const statuses = ['pending', 'progress', 'completed'];

    statuses.forEach(status => {
      const columnTasks = document.querySelectorAll(
        `.task-column.${status} .task-card`
      );
      updateBadgeCount(`badge-${status}`, columnTasks.length);
    });
  };

  // Mantener los cambios persistentes
  const persistTaskChanges = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const allTasks = getAllTasksFromDOM();
    saveUserTasks(currentUser, allTasks);
  };

  // Filtrado de tareas
  const filterTasksByPriority = priority => {
    const allTasks = document.querySelectorAll('.task-card');

    allTasks.forEach(task => {
      const taskPriority = [...task.classList]
        .find(c => c.startsWith('priority-'))
        ?.replace('priority-', '');

      if (priority === 'all' || taskPriority === priority) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    });
  };

  // Cierre de sesión
  const handleLogout = () => {
    logoutUser();
    window.location.href = 'html/login.html';
  };

  // Utilidad para generar ID único para tareas
  const generateTaskId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  return {
    init
  };
})();

// Inicializar la aplicación cuando el DOM está listo
document.addEventListener('DOMContentLoaded', TaskManager.init);
