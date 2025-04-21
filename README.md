# 🗂️ Flowtask
![Imagen del proyecto](https://github.com/SandraCarretero/ejercicio-final-maquetacion/blob/main/img/readme/furnih_landing.png)

## Descripción 📑

**Flowtask** es una aplicación web para gestionar tus tareas de forma visual, organizada y eficaz. Está diseñada con JavaScript Vanilla, aplicando principios SOLID y buenas prácticas de estructura y modularización del código.

🔗 **[Ver demo online](https://sandracarretero.github.io/TaskPlanner/html/login.html)**

---

## ✨ Funcionalidades principales

- 🔐 Registro e inicio de sesión de usuarios.
- 👤 Sección de perfil para editar tus datos personales.
- 📝 Crear, editar y eliminar tareas.
- 📅 Las tareas incluyen:
  - Título
  - Descripción
  - Fecha
  - Estado (incompleta, en proceso, finalizada)
  - Prioridad
  - Etiquetas
- 💾 **Tareas y usuarios almacenados en LocalStorage** para mantener los datos sin necesidad de servidor.
- 🌤️ Muestra el clima del día actual y del día de finalización de cada tarea usando la API de **OpenWeather**.
- 🗞️ Muestra noticias actualizadas en una sección lateral utilizando la API de **GNews**.
- 🧠 Vista en tres columnas:
  - Izquierda: tareas incompletas
  - Centro: tareas en proceso
  - Derecha: tareas finalizadas
- 🔍 Filtros por estado.
- 📱 Diseño responsive con uso de Flexbox y Grid.
- ✅ Aplicación de principios **SOLID** en la organización del código.

---

## 📁 Estructura del proyecto

<pre>
TaskPlanner/
├── css/
│   ├── login.css
│   ├── profile.css
│   ├── sidebar.css
│   └── style.css
├── html/
│   ├── login.html
│   └── profile.html
├── img/
│   └── icon.svg
├── js/
│   ├── services/
│   │   ├── authService.js
│   │   ├── newsService.js
│   │   └── weatherService.js
│   ├── utils/
│   │   ├── domUtils.js
│   │   ├── formUtils.js
│   │   ├── taskCounter.js
│   │   └── taskStorage.js
│   ├── login.js
│   ├── main.js
│   ├── news.js
│   ├── profile.js
│   └── weather.js
└── index.html
</pre>

## ¿Qué he aprendido en este proyecto? 🙇🏻

Este proyecto me ha permitido aplicar y consolidar muchos de los conocimientos adquiridos durante mi formación, entre ellos:

🧱 Diseñar y desarrollar una interfaz dinámica y responsive con HTML, CSS y JavaScript Vanilla, sin depender de frameworks.

🧠 Aplicar los principios SOLID para escribir un código más limpio, mantenible y escalable.

🧩 Trabajar con el DOM de forma eficiente, creando y actualizando elementos dinámicamente.

💾 Usar el LocalStorage para la gestión y persistencia de datos sin servidor.

🌐 Integrar APIs externa para mostrar contenido en tiempo real.

🔐 Crear un sistema básico de autenticación de usuarios, incluyendo registro, login y edición de perfil.

📂 Organizar el proyecto de forma modular, separando lógica, servicios, vistas y estilos.

🧑‍💻 Enfocarme en una buena experiencia de usuario (UX) a través de filtros, organización visual y diseño adaptable.

## 🛠️ Tecnologías utilizadas

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://es.wikipedia.org/wiki/HTML5)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://es.wikipedia.org/wiki/CSS)
[![JS](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square)](https://es.wikipedia.org/wiki/JavaScript)


- [OpenWeather API](https://openweathermap.org/)
- [GNews API](https://gnews.io/)
- **LocalStorage** para persistencia de tareas y usuarios

---

## Autor ✒️

**SANDRA CARRETERO**

- [sandracarretero24@gmail.com](sandracarretero24@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/sandra-carretero-lopez/)
<!-- - [Porfolio web](https://tu-dominio.com/) -->

## Instalación

Este proyecto no necesita de instalación. Simplemente abre la carpeta o haz doble click en el .html

## Licencia 📄

MIT Public License v3.0
No puede usarse comercialmente.