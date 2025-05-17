// Observación: Buena práctica importando el servicio de clima
// Sugerencia: Considerar implementar un sistema de caché para las llamadas al clima
import { weatherService } from './services/weatherService.js';

// Observación: Buena práctica obteniendo referencias a elementos del DOM al inicio
// Sugerencia: Considerar agrupar estos elementos en un objeto para mejor organización
const weatherTemp = document.getElementById('weather-temp');
const weatherIcon = document.getElementById('weather-icon');

// Observación: Buena práctica usando async/await para operaciones asíncronas
// Sugerencia: Implementar un sistema de reintentos para fallos de red
export const loadCurrentWeather = async city => {
  try {
    const weather = await weatherService.getWeatherByCity(city);
    if (weather) {
      const roundedTemperature = Math.round(weather.temperature);
      weatherTemp.textContent = `${roundedTemperature}°C`;

      weatherIcon.src = weather.icon;
      weatherIcon.alt = weather.description;
    }
  } catch (error) {
    console.error('Error al obtener el clima:', error);
    weatherTemp.textContent = 'Error';
    weatherIcon.alt = 'Error';
  }
};
