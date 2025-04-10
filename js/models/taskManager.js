export const TaskManager = {
  tasks: [],

  addTask: taskData => {
    TaskManager.tasks.push(taskData);
    TaskManager.saveTasks();
    TaskManager.displayTasks();
  },

  updateTask: taskData => {
    const index = TaskManager.tasks.findIndex(task => task.id === taskData.id);
    if (index !== -1) {
      TaskManager.tasks[index] = taskData;
      TaskManager.saveTasks();
      TaskManager.displayTasks();
    }
  },

  deleteTask: taskId => {
    TaskManager.tasks = TaskManager.tasks.filter(task => task.id !== taskId);
    TaskManager.saveTasks();
    TaskManager.displayTasks();
  },

  saveTasks: () => {
    if (!User.currentUser) return;

    const tasksData = { tasks: TaskManager.tasks };
    localStorage.setItem(
      `tasks_${User.currentUser.email}`,
      JSON.stringify(tasksData)
    );
  },

  loadTasks: () => {
    if (!User.currentUser) return;

    const tasksData = JSON.parse(
      localStorage.getItem(`tasks_${User.currentUser.email}`)
    ) || { tasks: [] };
    TaskManager.tasks = tasksData.tasks;
    TaskManager.displayTasks();
  },

  displayTasks: () => {
    document.querySelectorAll('.task-column .tasks').forEach(column => {
      column.innerHTML = '';
    });

    TaskManager.tasks.forEach(task => {
      TaskManager.createTaskCard(task);
    });
  },

  createTaskCard: taskData => {
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
      tagEl.innerHTML = `<i class="${Task.getTagIcon(tag)}"></i>&nbsp;${tag}`;
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
    editIcon.className = 'fas fa-pen editIcon';

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash deleteIcon';

    actionsDiv.appendChild(editIcon);
    actionsDiv.appendChild(deleteIcon);
    footer.appendChild(priorityDiv);
    footer.appendChild(actionsDiv);
    taskCard.appendChild(footer);

    editIcon.addEventListener('click', () => {
      Modal.open(taskData, taskCard);
    });

    deleteIcon.addEventListener('click', () => {
      TaskManager.deleteTask(taskData.id);
    });

    const column = document.querySelector(`.task-column.${status} .tasks`);
    if (column) column.appendChild(taskCard);
  }
};
