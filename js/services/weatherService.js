// Observación: Buena práctica usando constantes para valores fijos
// Sugerencia: Considerar mover estas constantes a un archivo de configuración
const apiKey = 'f53b18e8611267b98faa272a1039e762';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Observación: Buena práctica usando un objeto para servicios
// Sugerencia: Considerar usar clases ES6 para mejor organización
export const weatherService = {
  // Observación: Buena práctica obteniendo clima por ciudad
  // Sugerencia: Implementar un sistema de caché para mejor rendimiento
  getWeatherByCity: async city => {
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener el clima');
      }

      const data = await response.json();
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  },

  // Observación: Buena práctica obteniendo clima por fecha
  // Sugerencia: Implementar un sistema de reintentos para fallos de red
  getWeatherByDate: async date => {
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener el pronóstico');
      }

      const data = await response.json();

      const targetDate = new Date(date);

      const forecast = data.list.find(item => {
        const forecastDate = new Date(item.dt * 1000);
        return (
          forecastDate.getFullYear() === targetDate.getFullYear() &&
          forecastDate.getMonth() === targetDate.getMonth() &&
          forecastDate.getDate() === targetDate.getDate()
        );
      });

      if (forecast) {
        return {
          temperature: forecast.main.temp,
          description: data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`
        };
      } else {
        throw new Error(
          'No se encontró un pronóstico para la fecha solicitada'
        );
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }
};
