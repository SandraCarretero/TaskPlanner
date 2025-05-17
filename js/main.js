// Observación: Buena práctica usando módulos ES6 para importaciones
// Sugerencia: Considerar usar un sistema de bundling para mejor organización
import { loadCurrentWeather } from './weather.js';
import { loadNews } from './news.js';

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
  clearTaskForm
} from './utils/formUtils.js';
import {
  loadUserTasks,
  saveUserTasks,
  getAllTasksFromDOM
} from './utils/taskStorage.js';
import {
  checkUserSession,
  getCurrentUser
} from './services/authService.js';

// Observación: Buena práctica usando IIFE para encapsulamiento
// Sugerencia: Considerar usar clases ES6 para mejor organización
const TaskManager = (() => {
  // Observación: Buena práctica usando un objeto state para gestión de estado
  // Sugerencia: Considerar usar un sistema de gestión de estado más robusto
  let state = {
    editingTaskId: null,
    editingTaskCard: null,
    taskToDelete: null,
    currentUser: null
  };

  // Observación: Buena práctica inicializando la aplicación
  // Sugerencia: Implementar un sistema de manejo de errores más robusto
  const init = () => {
    const elements = getDOMElements();
    bindEventListeners(elements);

    state.currentUser = checkUserSession();
    if (!state.currentUser) {
      window.location.href = 'html/login.html';
      return;
    }

    initializeUserInterface(state.currentUser, elements);
    loadUserTasks(state.currentUser).forEach(task => createTaskCard(task));
    updateBadges();

    loadCurrentWeather('Madrid');
    loadNews();
  };

  // Observación: Buena práctica inicializando la interfaz de usuario
  // Sugerencia: Considerar usar un sistema de templates para mejor mantenimiento
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

  // Observación: Buena práctica usando delegación de eventos
  // Sugerencia: Considerar usar un sistema de eventos más centralizado
  const bindEventListeners = elements => {
    elements.addButtonElement.addEventListener('click', () => openTaskModal());
    elements.addButtonMenuElement.addEventListener('click', () =>
      openTaskModal()
    );
    elements.cancelButtonElement.addEventListener('click', closeTaskModal);
    elements.saveButtonElement.addEventListener('click', saveTaskHandler);

    elements.confirmDeleteBtn.addEventListener('click', confirmDelete);
    elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    document.querySelectorAll('.tags-selection .tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        tag.classList.toggle('noselected');
      });
    });

    const filterBtn = elements.filterBtn;
    const priorityOptions = elements.priorityOptions;

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
  };

  // Observación: Buena práctica manejando el guardado de tareas
  // Sugerencia: Implementar un sistema de validación más robusto
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

    if (state.editingTaskCard) {
      state.editingTaskCard.remove();
      state.editingTaskCard = null;
    }

    createTaskCard(taskData);
    persistTaskChanges();
    clearTaskForm(elements);
    closeTaskModal();
  };

  // Observación: Buena práctica manejando modales
  // Sugerencia: Considerar usar un sistema de modales más reutilizable
  const openTaskModal = (taskData = null, taskCard = null) => {
    const elements = getDOMElements();

    if (taskData) {
      elements.modalTitleElement.textContent = 'Editar tarea';
      elements.saveButtonElement.textContent = 'Actualizar';
      state.editingTaskId = taskData.id;
      state.editingTaskCard = taskCard;

      elements.titleTask.value = taskData.title;
      elements.dateTask.value = taskData.date;
      elements.descriptionTask.value = taskData.description;
      elements.priorityTask.value = taskData.priority;
      elements.statusTask.value = taskData.status;

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
      elements.modalTitleElement.textContent = 'Nueva tarea';
      elements.saveButtonElement.textContent = 'Crear tarea';
      clearTaskForm(elements);
      state.editingTaskId = null;
      state.editingTaskCard = null;
    }

    showElement(elements.modalElement);
  };

  // Observación: Buena práctica cerrando modales
  // Sugerencia: Implementar un sistema de animaciones para transiciones
  const closeTaskModal = () => {
    const elements = getDOMElements();
    hideElement(elements.modalElement);
    clearTaskForm(elements);
  };

  // Observación: Buena práctica manejando eliminación de tareas
  // Sugerencia: Implementar un sistema de confirmación más robusto
  const openDeleteModal = (taskCard, taskId) => {
    const elements = getDOMElements();
    showElement(elements.deleteModal);
    state.taskToDelete = { taskCard, taskId };
  };

  // Observación: Buena práctica cerrando modales de eliminación
  // Sugerencia: Considerar usar un sistema de modales más reutilizable
  const closeDeleteModal = () => {
    const elements = getDOMElements();
    hideElement(elements.deleteModal);
    state.taskToDelete = null;
  };

  // Observación: Buena práctica confirmando eliminación
  // Sugerencia: Implementar un sistema de respaldo antes de eliminar
  const confirmDelete = () => {
    if (state.taskToDelete) {
      state.taskToDelete.taskCard.remove();
      persistTaskChanges();
      updateBadges();
    }
    closeDeleteModal();
  };

  // Observación: Buena práctica creando tarjetas de tareas
  // Sugerencia: Considerar usar un sistema de templates para mejor mantenimiento
  const createTaskCard = taskData => {
    const taskCard = createTaskCardElement(
      taskData,
      (taskCard, id) => openTaskModal(taskData, taskCard),
      openDeleteModal
    );

    const column = document.querySelector(
      `.task-column.${taskData.status} .tasks`
    );
    if (column) {
      const allTaskCards = Array.from(column.children);
      allTaskCards.push(taskCard);
      allTaskCards.sort((a, b) => {
        const dateA = new Date(a.querySelector('.date span').textContent);
        const dateB = new Date(b.querySelector('.date span').textContent);
        return dateA - dateB; 
      });
      allTaskCards.forEach(card => column.appendChild(card));
    }
    updateBadges();
  };

  // Observación: Buena práctica actualizando contadores
  // Sugerencia: Implementar un sistema de notificaciones para cambios
  const updateBadges = () => {
    const statuses = ['pending', 'progress', 'completed'];

    statuses.forEach(status => {
      const columnTasks = document.querySelectorAll(
        `.task-column.${status} .task-card`
      );
      updateBadgeCount(`badge-${status}`, columnTasks.length);
    });
  };

  // Observación: Buena práctica persistiendo cambios
  // Sugerencia: Implementar un sistema de caché para mejor rendimiento
  const persistTaskChanges = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const allTasks = getAllTasksFromDOM();

    allTasks.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    saveUserTasks(currentUser, allTasks);
  };

  // Observación: Buena práctica filtrando tareas
  // Sugerencia: Implementar un sistema de filtros más avanzado
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

  // Observación: Buena práctica generando IDs únicos
  // Sugerencia: Considerar usar UUID para mayor seguridad
  const generateTaskId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  return {
    init
  };
})();

// Observación: Buena práctica inicializando la aplicación al cargar el DOM
// Sugerencia: Implementar un sistema de manejo de errores más robusto
document.addEventListener('DOMContentLoaded', TaskManager.init);
