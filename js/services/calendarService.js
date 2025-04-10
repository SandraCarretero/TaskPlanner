const baseUrl = 'https://date.nager.at/api/v3/PublicHolidays';

export const calendarService = {
  getHolidays: async (year = new Date().getFullYear()) => {
    try {
      const response = await fetch(`${baseUrl}/${year}/ES`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener festivos:', error);
      return [];
    }
  }
};
