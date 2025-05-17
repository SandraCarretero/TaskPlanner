// Observación: Buena práctica cargando tareas del usuario
// Sugerencia: Implementar un sistema de caché para mejor rendimiento
export const loadUserTasks = user => {
  if (!user) return [];

  const tasksData = JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || {
    tasks: []
  };

  return tasksData.tasks;
};

// Observación: Buena práctica guardando tareas del usuario
// Sugerencia: Implementar un sistema de respaldo para datos críticos
export const saveUserTasks = (user, tasks) => {
  if (!user) return;

  const tasksData = { tasks };
  localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasksData));
};

// Observación: Buena práctica obteniendo tareas del DOM
// Sugerencia: Considerar usar un sistema de estado más robusto
export const getAllTasksFromDOM = () => {
  const allTasks = [];

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

  allTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  return allTasks;
};
