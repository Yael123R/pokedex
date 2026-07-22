/*
const pokemonLocal = [
  {
    nombre: "bulbasaur",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    tipos: ["grass", "poison"],
  },
  {
    nombre: "charmander",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    tipos: ["fire"],
  },
  {
    nombre: "squirtle",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    tipos: ["water"],
  },
  {
    nombre: "pikachu",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    tipos: ["electric"],
  },
  {
    nombre: "jigglypuff",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    tipos: ["normal", "fairy"],
  },
  {
    nombre: "gengar",
    imagen:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    tipos: ["ghost", "poison"],
  },
];
*/

// LOGRO 2: Inmutabilidad con Spread Operator
/*
const nuevoPokemon = {
  nombre: "mewtwo",
  imagen:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
  tipos: ["psychic"],
};
const pokemonAmpliado = [...pokemonLocal, nuevoPokemon];
*/

// LOGRO 1: Diccionario de colores por tipo
const coloresTipo = {
  grass: "bg-emerald-100 text-emerald-800",
  poison: "bg-purple-100 text-purple-800",
  fire: "bg-red-100 text-red-800",
  water: "bg-blue-100 text-blue-800",
  electric: "bg-amber-100 text-amber-800",
  normal: "bg-slate-200 text-slate-700",
  fairy: "bg-pink-100 text-pink-800",
  ghost: "bg-indigo-100 text-indigo-800",
  psychic: "bg-fuchsia-100 text-fuchsia-800",
};

// 1. Obtener referencias del DOM
const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");
const boton = document.getElementById("btn-buscar");

// 2. Función para fabricar la tarjeta en el DOM
function crearTarjeta(pokemon) {
  // Destructuring de propiedades
  const { nombre, imagen, tipos = [] } = pokemon;

  // Destructuring de Array para el tipo principal
  const [principal = "normal"] = tipos;

  // Acceso seguro con ?? para la imagen de respaldo
  const img = imagen ?? "https://via.placeholder.com/96?text=?";

  // Badges con colores dinámicos
  const badges = tipos
    .map((tipo) => {
      const color = coloresTipo[tipo] ?? "bg-slate-200 text-slate-700";
      return `<span class="text-xs px-2 py-1 rounded-full font-medium ${color}">${tipo}</span>`;
    })
    .join("");

  // Crear nodo y armar plantilla HTML
  const articulo = document.createElement("article");
  articulo.className =
    "bg-white rounded-xl shadow p-4 text-center border border-slate-100";
  articulo.innerHTML = `
      <img src="${img}" alt="${nombre}" class="w-24 h-24 mx-auto">
      <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
      <p class="text-[10px] text-slate-400 capitalize mt-0.5">Principal: ${principal}</p>
      <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
    `;

  return articulo;
}

// 3. Función para renderizar la lista completa
function render(lista) {
  contenedor.innerHTML = "";
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);
    contenedor.appendChild(tarjeta);
  });
}

// --- LAB 11 - HU1 & HU4: ASYNC/AWAIT Y ADAPTADOR DE POKÉMON ---

// Variable global para guardar los Pokémon cargados
let pokedex = [];

// Función adaptadora de datos de la API (HU4: incluye estadísticas)
function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen:
      data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos: data.types.map((t) => t.type.name),
    stats: (data.stats ?? []).map((s) => ({
      nombre: s.stat.name,
      valor: s.base_stat,
    })),
  };
}

// Obtener un Pokémon individual con async/await
async function obtenerPokemon(idONombre) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${idONombre}`,
  );
  return response.json();
}

// Cargar la rejilla inicial en paralelo con await Promise.all
async function cargarPokedex() {
  const nombres = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "jigglypuff",
    "gengar",
  ];

  contenedor.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12 gap-3">
        <div class="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p class="text-sm text-slate-500 font-medium">Cargando Pokédex…</p>
      </div>
    `;

  try {
    const datos = await Promise.all(nombres.map(obtenerPokemon));
    pokedex = datos.map(adaptarPokemon);
    render(pokedex);
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p class="col-span-full text-center text-red-600">No se pudo cargar la Pokédex.</p>`;
  }
}

// --- LAB 11 - HU2, HU3 & HU4: BÚSQUEDA, CAPTURA Y ESTADÍSTICAS ---

// 1. HU2: Traer un Pokémon de la API por su nombre
async function buscarPokemon(nombre) {
  const data = await obtenerPokemon(nombre.toLowerCase());
  return adaptarPokemon(data);
}

// 2. HU3: Función para capturar e integrar el Pokémon a la colección
function capturar(pokemon) {
  if (!pokedex.some((p) => p.nombre === pokemon.nombre)) {
    pokedex.push(pokemon);
  }

  render(pokedex);

  if (buscador) {
    buscador.value = "";
  }
}

// 3. HU3 & HU4: Mostrar resultado individual con Stats y Botón 'Capturar'
function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  // HU4: Bloque de estadísticas
  const stats = document.createElement("div");
  stats.className =
    "mt-3 text-left text-xs space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100";
  stats.innerHTML = (pokemon.stats ?? [])
    .map(
      (s) => `
      <div class="flex justify-between">
        <span class="capitalize text-slate-500">${s.nombre}</span>
        <span class="font-semibold text-slate-700">${s.valor}</span>
      </div>
    `,
    )
    .join("");

  tarjeta.appendChild(stats);

  // HU3: Botón de capturar
  const botonCapturar = document.createElement("button");
  botonCapturar.textContent = "⚡ Capturar";
  botonCapturar.className =
    "mt-3 w-full bg-yellow-400 font-semibold rounded-lg py-1.5 hover:bg-yellow-500 cursor-pointer transition-colors text-sm";

  botonCapturar.addEventListener("click", () => capturar(pokemon));

  tarjeta.appendChild(botonCapturar);

  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}

// 4. HU2: Cargar el spinner de "Buscando..." y procesar el resultado
async function mostrarBusqueda(nombre) {
  try {
    contenedor.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12 gap-3">
          <div class="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          <p class="text-sm text-slate-500 font-medium">Buscando a "${nombre}"…</p>
        </div>
      `;
    const pokemon = await buscarPokemon(nombre);
    mostrarResultado(pokemon);
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p class="col-span-full text-center text-red-600 py-8">No se encontró el Pokémon "${nombre}".</p>`;
  }
}

// 5. Escuchar clic en el botón de búsqueda
boton?.addEventListener("click", function () {
  const nombre = buscador.value.trim();
  if (nombre !== "") mostrarBusqueda(nombre);
});

// 6. Escuchar tecla Enter en el input de búsqueda
buscador?.addEventListener("keydown", function (event) {
  if (event.key === "Enter") boton?.click();
});

// Ejecutamos la carga inicial al abrir
cargarPokedex();