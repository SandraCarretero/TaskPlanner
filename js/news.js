// Observación: Buena práctica importando el servicio de noticias
// Sugerencia: Considerar implementar un sistema de caché para las llamadas a noticias
import { newsService } from './services/newsService.js';

// Observación: Buena práctica obteniendo referencias a elementos del DOM al inicio
// Sugerencia: Considerar agrupar estos elementos en un objeto para mejor organización
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('news-search');
const searchForm = document.getElementById('news-search-form');

// Observación: Buena práctica manejando noticias de forma asíncrona
// Sugerencia: Implementar un sistema de paginación para mejor rendimiento
export const loadNews = async (query = 'noticias') => {
  try {
    const articles = await newsService.searchNews(query, 'es', 'es', 4);
    newsContainer.innerHTML = '';

    if (articles.length === 0) {
      newsContainer.innerHTML = '<p>No se encontraron noticias.</p>';
      return;
    }

    articles.forEach(article => {
      const card = document.createElement('div');
      card.classList.add('news-card');

      card.innerHTML = `
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || 'Sin descripción.'}</p>
          <a href="${article.url}" target="_blank">Leer más</a>
        </div>
      `;

      newsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error al mostrar noticias:', error);
  }
};

// Observación: Buena práctica manejando búsquedas
// Sugerencia: Implementar un sistema de búsqueda más robusto
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  loadNews(query || 'noticias');
});
