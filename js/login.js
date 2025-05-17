// Observación: Buena práctica obteniendo referencias a elementos del DOM al inicio
// Sugerencia: Considerar agrupar estos elementos en un objeto para mejor organización
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const cancelRegisterBtn = document.getElementById('cancel-register');
const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Observación: Buena práctica separando elementos del formulario
// Sugerencia: Considerar usar un sistema de formularios más robusto
const newName = document.getElementById('new-name');
const newEmail = document.getElementById('new-email');
const newPassword = document.getElementById('new-password');
const confirmPassword = document.getElementById('confirm-password');

// Observación: Buena práctica inicializando al cargar
// Sugerencia: Implementar un sistema de manejo de errores en la inicialización
document.addEventListener('DOMContentLoaded', () => {
  initUIHandlers();
  checkSession();
});

// Observación: Buena práctica delegando eventos
// Sugerencia: Implementar un sistema de eventos más robusto
const initUIHandlers = () => {
  showRegisterBtn?.addEventListener('click', showRegisterForm);
  cancelRegisterBtn?.addEventListener('click', cancelRegisterForm);
  loginForm?.addEventListener('submit', handleLogin);
  registerForm?.addEventListener('submit', handleRegister);
};

// Observación: Buena práctica alternando entre formularios
// Sugerencia: Considerar usar un sistema de estados más robusto
const showRegisterForm = () => {
  registerBox?.classList.remove('hidden');
  loginBox?.classList.add('hidden');
};

// Observación: Buena práctica limpiando formularios
// Sugerencia: Implementar un sistema de reset más robusto
const cancelRegisterForm = () => {
  registerBox?.classList.add('hidden');
  registerForm?.reset();
  registerError?.classList.add('hidden');
  loginBox?.classList.remove('hidden');
};

// Observación: Buena práctica validando datos de login
// Sugerencia: Implementar un sistema de validación más robusto
const handleLogin = e => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const user = getUsers().find(
    u => u.email === email && u.password === password
  );

  if (user) {
    createSession(user);
    redirectToHome();
  } else {
    document.getElementById('login-error')?.classList.remove('hidden');
  }
};

// Observación: Buena práctica validando datos de registro
// Sugerencia: Implementar un sistema de validación más robusto
const handleRegister = e => {
  e.preventDefault();

  const name = newName?.value.trim();
  const email = newEmail?.value.trim();
  const password = newPassword?.value;
  const confirmPass = confirmPassword?.value;

  resetFormErrors();

  const { valid } = validateRegistration(
    name,
    email,
    password,
    confirmPass
  );

  if (!valid) return;

  const newUser = {
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  saveUser(newUser);
  createEmptyTaskList(email);
  createSession(newUser);
  redirectToHome();
};

// Observación: Buena práctica validando registro
// Sugerencia: Implementar un sistema de validación más robusto
const validateRegistration = (name, email, password, confirmPassword) => {
  let valid = true;

  if (!name) {
    showError('new-name', 'El nombre no puede estar vacío');
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('new-email', 'Introduce un correo válido');
    valid = false;
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
    showError(
      'new-password',
      'La contraseña debe tener al menos 6 caracteres, incluyendo letras y números'
    );
    valid = false;
  }

  if (password !== confirmPassword) {
    showError('confirm-password', 'Las contraseñas no coinciden');
    valid = false;
  }

  if (getUsers().some(u => u.email === email)) {
    showError('new-email', 'El correo ya está en uso');
    valid = false;
  }

  return { valid };
};

// Observación: Buena práctica obteniendo usuarios
// Sugerencia: Implementar un sistema de caché para mejor rendimiento
const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || [];
};

// Observación: Buena práctica guardando usuarios
// Sugerencia: Implementar un sistema de respaldo para datos críticos
const saveUser = user => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

// Observación: Buena práctica inicializando datos
// Sugerencia: Implementar un sistema de migración de datos
const createEmptyTaskList = email => {
  localStorage.setItem(`tasks_${email}`, JSON.stringify({ tasks: [] }));
};

// Observación: Buena práctica manejando sesiones
// Sugerencia: Implementar un sistema de sesiones más seguro
const createSession = user => {
  const session = {
    email: user.email,
    name: user.name,
    isLoggedIn: true,
    timestamp: new Date().getTime()
  };
  sessionStorage.setItem('session', JSON.stringify(session));
};

// Observación: Buena práctica verificando sesiones
// Sugerencia: Implementar un sistema de sesiones más robusto
const checkSession = () => {
  const session = JSON.parse(sessionStorage.getItem('session'));
  if (session?.isLoggedIn) {
    redirectToHome();
  }
};

// Observación: Buena práctica mostrando errores
// Sugerencia: Implementar un sistema de notificaciones más amigable
const showError = (inputId, message) => {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`error-${inputId}`);
  input?.classList.add('wrong');
  if (error) {
    error.textContent = message;
    error.classList.remove('hidden');
  }
};

// Observación: Buena práctica limpiando errores
// Sugerencia: Implementar un sistema de validación más robusto
const resetFormErrors = () => {
  document
    .querySelectorAll('.form-control')
    .forEach(input => input.classList.remove('wrong'));
  [
    'error-new-name',
    'error-new-email',
    'error-new-password',
    'error-confirm-password'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
      el.classList.add('hidden');
    }
  });
  registerError?.classList.add('hidden');
};

// Observación: Buena práctica redirigiendo
// Sugerencia: Implementar un sistema de rutas más robusto
const redirectToHome = () => {
  window.location.href = '../index.html';
};
