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

// Diccionario de colores por tipo
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
const btnCargarMas = document.getElementById("cargar-mas");
const mensaje = document.getElementById("mensaje");
// LAB 12 - HU3: Referencia al spinner de carga
const spinner = document.getElementById("spinner");

// --- LOGRO 2: ELIMINAR UN POKÉMON DE LA POKÉDEX ---
function eliminarPokemon(nombre) {
  pokedex = pokedex.filter((p) => p.nombre !== nombre);
  render(pokedex);
}

// 2. Función para fabricar la tarjeta en el DOM
function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos = [] } = pokemon;
  const [principal = "normal"] = tipos;
  const img = imagen ?? "https://via.placeholder.com/96?text=?";

  const badges = tipos
    .map((tipo) => {
      const color = coloresTipo[tipo] ?? "bg-slate-200 text-slate-700";
      return `<span class="text-xs px-2 py-1 rounded-full font-medium ${color}">${tipo}</span>`;
    })
    .join("");

  const articulo = document.createElement("article");
  articulo.className =
    "bg-white rounded-xl shadow p-4 text-center border border-slate-100 relative group";

  articulo.innerHTML = `
      <!-- LOGRO 2: Botón para quitar de la Pokédex -->
      <button 
        class="btn-quitar absolute top-2 right-2 text-slate-300 hover:text-red-500 font-bold p-1 rounded-full transition-colors cursor-pointer text-xs" 
        title="Quitar de Pokédex"
      >
        ✕
      </button>

      <img src="${img}" alt="${nombre}" class="w-24 h-24 mx-auto">
      <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
      <p class="text-[10px] text-slate-400 capitalize mt-0.5">Principal: ${principal}</p>
      <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
    `;

  // Listener para el botón de eliminar del Logro 2
  const btnQuitar = articulo.querySelector(".btn-quitar");
  btnQuitar?.addEventListener("click", (e) => {
    e.stopPropagation();
    eliminarPokemon(nombre);
  });

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

// --- LAB 11/12 - ASYNC/AWAIT Y ADAPTADOR DE POKÉMON ---

let pokedex = [];

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

// LAB 12 - HU2: Validar respuesta HTTP y lanzar error propio con throw
async function obtenerPokemon(idONombre) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${idONombre}`,
  );

  if (!response.ok) {
    throw new Error(`No se encontró "${idONombre}"`);
  }

  return response.json();
}

// LAB 12 - HU3: Carga inicial con estado de carga mediante spinner y finally
async function cargarPokedex() {
  if (spinner) spinner.classList.remove("hidden");
  if (mensaje) mensaje.classList.add("hidden");

  const nombres = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "jigglypuff",
    "gengar",
  ];

  try {
    const datos = await Promise.all(nombres.map(obtenerPokemon));
    pokedex = datos.map(adaptarPokemon);
    render(pokedex);
  } catch (error) {
    console.error("Error al cargar Pokédex inicial:", error);
    if (mensaje) {
      mensaje.textContent = "No se pudo cargar la Pokédex.";
      mensaje.classList.remove("hidden");
    }
  } finally {
    if (spinner) spinner.classList.add("hidden");
  }
}

// --- LAB 11/12 - BÚSQUEDA Y ERRORES ---

async function buscarPokemon(consulta) {
  const param = isNaN(consulta) ? consulta.toLowerCase() : consulta;
  const data = await obtenerPokemon(param);
  return adaptarPokemon(data);
}

function capturar(pokemon) {
  if (!pokedex.some((p) => p.nombre === pokemon.nombre)) {
    pokedex.push(pokemon);
  }

  render(pokedex);

  if (buscador) {
    buscador.value = "";
  }
}

function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  const btnQuitar = tarjeta.querySelector(".btn-quitar");
  if (btnQuitar) btnQuitar.remove();

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
    "mt-3 w-full bg-yellow-400 font-semibold rounded-lg py-1.5 hover:bg-yellow-500 cursor-pointer transition-colors text-sm font-medium";

  botonCapturar.addEventListener("click", () => capturar(pokemon));

  tarjeta.appendChild(botonCapturar);

  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}

// LAB 12 - HU3: Búsqueda con spinner y ocultado garantizado en el bloque finally
async function mostrarBusqueda(consulta) {
  if (spinner) spinner.classList.remove("hidden");
  if (mensaje) mensaje.classList.add("hidden");

  try {
    const pokemon = await buscarPokemon(consulta);
    mostrarResultado(pokemon);
  } catch (error) {
    console.error("Error capturado:", error);
    if (mensaje) {
      mensaje.textContent = error.message;
      mensaje.classList.remove("hidden");
    }
  } finally {
    if (spinner) spinner.classList.add("hidden");
  }
}

boton?.addEventListener("click", function () {
  const consulta = buscador.value.trim();
  if (consulta !== "") mostrarBusqueda(consulta);
});

buscador?.addEventListener("keydown", function (event) {
  if (event.key === "Enter") boton?.click();
});

// --- LAB 11 - HU5: CARGAR MÁS CON PARÁMETROS DE CONSULTA ---

let offset = 0;

async function cargarMas() {
  try {
    const respuesta = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`,
    );
    const lista = await respuesta.json();

    const datos = await Promise.all(
      lista.results.map((item) => fetch(item.url).then((r) => r.json())),
    );

    datos.map(adaptarPokemon).forEach(function (pokemon) {
      if (!pokedex.some((p) => p.nombre === pokemon.nombre)) {
        pokedex.push(pokemon);
      }
    });

    offset += 12;
    render(pokedex);
  } catch (error) {
    console.error("Error al cargar más Pokémon:", error);
  }
}

btnCargarMas?.addEventListener("click", cargarMas);

// Ejecutamos la carga inicial al abrir
cargarPokedex();