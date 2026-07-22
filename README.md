# ⚡ Pokédex App

Aplicación web interactiva que consume la **PokeAPI** para buscar, explorar y capturar Pokémon en tiempo real. Construida con manejo avanzado de asincronía, control de errores y estados de interfaz.

---

## 🚀 Características y Funcionalidades

- **Carga Inicial Asíncrona:** Renderiza los Pokémon iniciales utilizando `Promise.all` e `async/await`.
- **Búsqueda Flexible:** Permite consultar Pokémon por su nombre o por su número de ID.
- **Manejo de Errores Robustos:** Captura fallos de red y errores `404` con bloques `try/catch` y `throw` para feedback visual claro.
- **Estados de Interfaz (UI):** Indicadores visuales de carga (`#spinner`) garantizados con el bloque `finally` y mensajes de estado (`#mensaje`).
- **Capturar y Quitar:** Agrega Pokémon buscados a tu Pokédex local o remuévelos individualmente.
- **Paginación:** Carga progresiva mediante parámetros de consulta (`?limit` y `?offset`).

---

## 💻 Tecnologías Utilizadas

- **JavaScript (ES6+):** `fetch()`, `async/await`, `Promise.all()`, manejo de excepciones (`try/catch/finally`).
- **HTML5 & DOM Manipulation:** Creación e inserción dinámica de componentes.
- **Tailwind CSS:** Diseño responsivo y moderno mediante clases de utilidad.
- **[PokeAPI](https://pokeapi.co/):** Fuente de datos de los Pokémon.

---

## 📖 Cómo Usarlo

1. Abre el sitio en tu navegador.
2. Escribe el nombre o ID de un Pokémon en el buscador (ej. `charizard` o `25`) y presiona **Buscar** o la tecla **Enter**.
3. Haz clic en **⚡ Capturar** para guardarlo permanentemente en tu lista personal.
4. Usa el botón **✕** en las tarjetas para quitar Pokémon de tu Pokédex.
5. Presiona el botón **Cargar más** al final de la página para explorar nuevos Pokémon.

---

## 🔗 Demo Desplegada

Puedes probar la versión en vivo del proyecto en GitHub Pages:
👉 **[Ver Pokédex en GitHub Pages](https://yael123r.github.io/pokedex/)**