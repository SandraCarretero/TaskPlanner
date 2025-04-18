import { checkUserSession, logoutUser } from './services/authService.js';
import { renderTagSummaryCards } from './utils/taskCounter.js';

// Elementos del DOM
const passwordInput = document.getElementById('password'); // Añadir este elemento
const updateBtn = document.getElementById('update-btn');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const deleteUserBtn = document.getElementById('delete-user');
const confirmModal = document.getElementById('confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout');
const editBtn = document.getElementById('edit-btn');

// Estado actual
let currentUser = null;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// Inicializar la aplicación
const initializeApp = () => {
  currentUser = checkUserSession();

  if (!currentUser) {
    // Redirigir a la página de login si no hay sesión
    window.location.href = 'login.html';
    return;
  }

  // Cargar datos del usuario
  loadUserData();

  // Inicializar event listeners
  bindEventListeners();

  renderTagSummaryCards(currentUser);
};

// Cargar datos del usuario actual
const loadUserData = () => {
  // Obtener datos del usuario del localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userDetails = users.find(user => user.email === currentUser.email);

  if (userDetails) {
    // Rellenar el formulario con los datos del usuario
    usernameInput.value = userDetails.name;
    emailInput.value = userDetails.email;
    passwordInput.value = userDetails.password; // No mostramos la contraseña por razones de seguridad

    // Actualizar avatar con iniciales
    updateAvatar(userDetails.name);
  }
};

// Actualizar el avatar con las iniciales del usuario
const updateAvatar = fullName => {
  const nameParts = fullName.split(' ');
  let initials;

  if (nameParts.length > 1) {
    initials = `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  } else {
    initials = nameParts[0].charAt(0);
  }

  userAvatar.textContent = initials.toUpperCase();
};

// Vincular event listeners
const bindEventListeners = () => {
  editBtn.addEventListener('click', toggleEdit);
  updateBtn.addEventListener('click', handleProfileUpdate); // Aquí cambiamos 'submit' por 'click'
  deleteUserBtn.addEventListener('click', openConfirmModal);
  confirmDeleteBtn.addEventListener('click', deleteUserAccount);
  cancelDeleteBtn.addEventListener('click', closeConfirmModal);
  logoutBtn.addEventListener('click', handleLogout);
};

// Alternar entre editar y deshabilitar
const toggleEdit = () => {
  const inputs = document.querySelectorAll('input');
  const saveBtn = document.querySelector('.save-btn'); // Asegúrate de que el botón tenga la clase correcta.

  // Alterna la habilitación de los inputs
  inputs.forEach(input => {
    input.disabled = !input.disabled;
  });

  // Habilita o deshabilita el botón de guardar
  updateBtn.disabled = !updateBtn.disabled; // Habilitar updateBtn

  // Cambia el texto del botón "Editar"
  if (editBtn.textContent === 'Editar') {
    editBtn.textContent = 'Cancelar';

    // Mostrar la contraseña en texto
    passwordInput.type = 'text'; // Cambiar tipo de contraseña a texto para que sea visible
  } else {
    editBtn.textContent = 'Editar';

    // Si se cancela, deshabilitamos los inputs y el botón de actualizar
    inputs.forEach(input => {
      input.disabled = true;
    });
    updateBtn.disabled = true; // Deshabilitar updateBtn

    // Restaurar el tipo de la contraseña a password
    passwordInput.type = 'password'; // Volver a ocultar la contraseña
  }
};

// Manejar la actualización del perfil
const handleProfileUpdate = e => {
  e.preventDefault();

  const name = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validación básica
  if (!name || !email || (password && password.length < 6)) {
    alert(
      'Por favor completa todos los campos y asegúrate de que la contraseña tenga al menos 6 caracteres.'
    );
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Por favor ingresa un correo electrónico válido');
    return;
  }

  // Actualizar datos del usuario
  updateUserData(name, email, password);
};

// Actualizar los datos del usuario en localStorage
const updateUserData = (name, email, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const oldEmail = currentUser.email;

  // Verificar si el nuevo email ya existe (si es diferente al actual)
  if (email !== oldEmail && users.some(user => user.email === email)) {
    alert('Este correo electrónico ya está en uso');
    return;
  }

  // Encontrar y actualizar usuario
  const userIndex = users.findIndex(user => user.email === oldEmail);

  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], name, email };

    // Si la contraseña fue cambiada, agregarla
    if (password) {
      updatedUser.password = password;
    }

    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));

    // Si el email cambió, actualizar la clave de las tareas
    if (email !== oldEmail) {
      // Obtener tareas del usuario
      const userTasks = JSON.parse(
        localStorage.getItem(`tasks_${oldEmail}`)
      ) || { tasks: [] };

      // Guardar tareas con la nueva clave de email
      localStorage.setItem(`tasks_${email}`, JSON.stringify(userTasks));

      // Eliminar la antigua entrada
      localStorage.removeItem(`tasks_${oldEmail}`);
    }

    // Actualizar la sesión
    const session = {
      email: email,
      name: name,
      isLoggedIn: true,
      timestamp: new Date().getTime()
    };

    sessionStorage.setItem('session', JSON.stringify(session));
    localStorage.setItem('session', JSON.stringify(session));

    // Actualizar avatar con el nuevo nombre
    updateAvatar(name);

    // Mensaje de éxito
    alert('Perfil actualizado correctamente');

    // Después de guardar, restauramos la interfaz:
    // Deshabilitamos los inputs y el botón de guardar
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.disabled = true;
    });
    passwordInput.type = 'password';

    // Cambiamos el texto del botón "Editar" a "Editar"
    editBtn.textContent = 'Editar';
    // Deshabilitamos el botón de actualizar
    updateBtn.disabled = true;
  }
};

// Abrir modal de confirmación para eliminar cuenta
const openConfirmModal = () => {
  confirmModal.classList.remove('hidden');
};

// Cerrar modal de confirmación
const closeConfirmModal = () => {
  confirmModal.classList.add('hidden');
};

// Eliminar cuenta de usuario
const deleteUserAccount = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userEmail = currentUser.email;

  // Filtrar para eliminar el usuario actual
  const updatedUsers = users.filter(user => user.email !== userEmail);

  // Guardar lista actualizada de usuarios
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  // Eliminar tareas del usuario
  localStorage.removeItem(`tasks_${userEmail}`);

  // Cerrar sesión
  logoutUser();

  // Redirigir a la página de login
  window.location.href = 'login.html';
};

// Manejar cierre de sesión
const handleLogout = () => {
  logoutUser();
  window.location.href = 'login.html';
};
