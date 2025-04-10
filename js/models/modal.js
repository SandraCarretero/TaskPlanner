export const Modal = {
  open: (taskData = null, taskCard = null) => {
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
  },

  close: () => {
    modalElement.classList.add('hidden');
    clearForm();
  }
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

