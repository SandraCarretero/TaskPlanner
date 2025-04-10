export const Task = {
  create: (id, title, date, description, priority, status, tags) => ({
    id,
    title,
    date,
    description,
    priority,
    status,
    tags,
    updatedAt: new Date().toISOString()
  }),

  generateId: () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2),

  getTagIcon: tag => {
    switch (tag.toLowerCase()) {
      case 'trabajo':
        return 'fas fa-briefcase fa-xs';
      case 'documentación':
      case 'documentacion':
        return 'fas fa-file-alt fa-xs';
      case 'diseño':
        return 'fas fa-paint-brush fa-xs';
      case 'personal':
        return 'fas fa-user fa-xs';
      case 'reunión':
      case 'reunion':
        return 'fas fa-users fa-xs';
      case 'desarrollo':
        return 'fas fa-code fa-xs';
      default:
        return 'fas fa-tag fa-xs';
    }
  }
};