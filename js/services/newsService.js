// Observación: Buena práctica usando constantes para valores fijos
// Sugerencia: Considerar mover estas constantes a un archivo de configuración
const apiKey = '0d7ce95c70bb9da1380da4e02b5ab6be';
const baseUrl = 'https://gnews.io/api/v4/search';

// Observación: Buena práctica usando un objeto para servicios
// Sugerencia: Considerar usar clases ES6 para mejor organización
export const newsService = {
  // Observación: Buena práctica obteniendo noticias principales
  // Sugerencia: Implementar un sistema de caché para mejor rendimiento
  getTopNews: async (lang = 'es', country = 'es', max = 5) => {
    const url = `${baseUrl}?q=${country}&lang=${lang}&max=${max}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener las noticias');
      }

      const data = await response.json();
      return data.articles;
    } catch (error) {
      console.error('Error fetching GNews data:', error);
      return [];
    }
  },

  // Observación: Buena práctica buscando noticias
  // Sugerencia: Implementar un sistema de reintentos para fallos de red
  searchNews: async query => {
    const url = `${baseUrl}?q=${query}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener noticias: ${response.statusText}`);
      }
      const data = await response.json();
      return data.articles;
    } catch (error) {
      console.error('Error al obtener datos de GNews:', error);
      throw new Error('Error al obtener las noticias');
    }
  }
};
