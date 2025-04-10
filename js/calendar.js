import { calendarService } from './services/calendarService.js';

const holidaysContainer = document.getElementById('holidays-container');

const renderHoliday = holiday => {
  const holidayCard = document.createElement('div');
  holidayCard.classList.add('holiday-card');

  const holidayDate = document.createElement('p');
  holidayDate.classList.add('holiday-date');
  holidayDate.textContent = new Date(holiday.date).toLocaleDateString('es-ES'); // Asegúrate de formatear correctamente la fecha

  const holidayName = document.createElement('p');
  holidayName.classList.add('holiday-name');
  holidayName.textContent = holiday.localName;
  console.log(holiday);

  holidayCard.appendChild(holidayDate);
  holidayCard.appendChild(holidayName);

  // Optional: Add a left-colored border to the card
  holidayCard.style.borderLeft = '5px solid #FF6347';

  holidaysContainer.appendChild(holidayCard);
};

export const loadHolidays = async () => {
  const holidays = await calendarService.getHolidays();
  const today = new Date();

  if (holidays.length > 0) {
    // Filtrar los festivos posteriores a la fecha actual
    const upcomingHolidays = holidays
      .filter(holiday => new Date(holiday.date) > today)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordenar por fecha ascendente

    holidaysContainer.innerHTML = ''; // Clear previous holidays
    upcomingHolidays.slice(0, 3).forEach(holiday => renderHoliday(holiday)); // Show top 3 closest holidays
  } else {
    holidaysContainer.innerHTML = '<p>No holidays found</p>';
  }
};
