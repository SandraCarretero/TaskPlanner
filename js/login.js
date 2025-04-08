const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const cancelRegisterBtn = document.getElementById('cancel-register');
const registerBox = document.getElementById('register-box');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

checkSession();

showRegisterBtn.addEventListener('click', () => {
  registerBox.classList.remove('hidden');
});

cancelRegisterBtn.addEventListener('click', () => {
  registerBox.classList.add('hidden');
  registerForm.reset();
  registerError.classList.add('hidden');
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Guardar sesión activa
    const sessionData = {
      email: user.email,
      name: user.name,
      isLoggedIn: true,
      timestamp: new Date().getTime()
    };

    if (remember) {
      localStorage.setItem('session', JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem('session', JSON.stringify(sessionData));
    }

    // Redireccionar a la página principal
    window.location.href = '../index.html';
  } else {
    loginError.classList.remove('hidden');
  }
});

// Manejar registro de usuario
registerForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('new-email').value.trim();
  const name = document.getElementById('new-name').value.trim();
  const password = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Restablecer clases antes de cualquier validación
  resetFormClasses();

  let valid = true;

  // Validar que el nombre no esté vacío
  if (name === '') {
    document.getElementById('new-name').classList.add('wrong');
    registerError.textContent = 'El nombre no puede estar vacío';
    registerError.classList.remove('hidden');
    valid = false;
  }

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    document.getElementById('new-password').classList.add('wrong');
    document.getElementById('confirm-password').classList.add('wrong');
    registerError.textContent = 'Las contraseñas no coinciden';
    registerError.classList.remove('hidden');
    valid = false;
  }

  // Verificar si el correo ya está en uso
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.email === email)) {
    document.getElementById('new-email').classList.add('wrong');
    registerError.textContent = 'El correo ya está en uso';
    registerError.classList.remove('hidden');
    valid = false;
  }

  // Si todo es válido, guardar el nuevo usuario
  if (valid) {
    const newUser = {
      email,
      name,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Crear estructura de tareas vacía para el nuevo usuario
    const userTasks = {
      tasks: []
    };
    localStorage.setItem(`tasks_${email}`, JSON.stringify(userTasks));

    // Crear sesión y redirigir automáticamente al login
    const sessionData = {
      email: newUser.email,
      name: newUser.name,
      isLoggedIn: true,
      timestamp: new Date().getTime()
    };

    sessionStorage.setItem('session', JSON.stringify(sessionData)); // O localStorage si se prefiere mantener sesión

    // Redirigir a la página principal
    window.location.href = '../index.html';
  }
});

// Función para restablecer las clases de los campos
function resetFormClasses() {
  document.getElementById('new-name').classList.remove('wrong');
  document.getElementById('new-email').classList.remove('wrong');
  document.getElementById('new-password').classList.remove('wrong');
  document.getElementById('confirm-password').classList.remove('wrong');
  registerError.classList.add('hidden');
}

// Función para verificar si hay una sesión activa
function checkSession() {
  const session =
    JSON.parse(localStorage.getItem('session')) ||
    JSON.parse(sessionStorage.getItem('session'));

  if (session && session.isLoggedIn) {
    // Si hay una sesión activa, redirigir a la página principal
    window.location.href = '../index.html';
  }
}
