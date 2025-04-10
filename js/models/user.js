export const User = {
  currentUser: null,

  checkSession: () => {
    const session =
      JSON.parse(localStorage.getItem('session')) ||
      JSON.parse(sessionStorage.getItem('session'));

    if (!session || !session.isLoggedIn) {
      window.location.href = 'html/login.html';
      return;
    }

    User.currentUser = session;
    const firstName = User.currentUser.name.split(' ')[0];
    userNameElement.textContent = `Bienvenid@ ${firstName}`;

    const nameParts = User.currentUser.name.split(' ');
    const initials =
      nameParts.length > 1
        ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`
        : nameParts[0].charAt(0);
    avatarElement.textContent = initials.toUpperCase();
  },

  logout: () => {
    localStorage.removeItem('session');
    sessionStorage.removeItem('session');
    window.location.href = 'html/login.html';
  }
};