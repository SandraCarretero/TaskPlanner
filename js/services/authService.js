// Observación: Buena práctica verificando sesiones
// Sugerencia: Implementar un sistema de sesiones más seguro
export const checkUserSession = () => {
  const session =
    JSON.parse(localStorage.getItem('session')) ||
    JSON.parse(sessionStorage.getItem('session'));

  if (!session || !session.isLoggedIn) {
    return null;
  }

  return session;
};

// Observación: Buena práctica obteniendo usuario actual
// Sugerencia: Implementar un sistema de caché para mejor rendimiento
export const getCurrentUser = () => {
  return checkUserSession();
};

export const logoutUser = () => {
  localStorage.removeItem('session');
  sessionStorage.removeItem('session');
};
