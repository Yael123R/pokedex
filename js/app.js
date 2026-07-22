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

// 1. Obtener contenedor
const contenedor = document.getElementById("resultado");

// 2. Función para fabricar la tarjeta en el DOM
function crearTarjeta(pokemon) {
  // 2.1. Destructuring de propiedades
  const { nombre, imagen, tipos = [] } = pokemon;

  // LOGRO 3: Destructuring de Array para el tipo principal
  const [principal = "normal"] = tipos;

  // 2.2. Acceso seguro con ?? para la imagen de respaldo
  const img = imagen ?? "https://via.placeholder.com/96?text=?";

  // LOGRO 1: Badges con colores dinámicos
  const badges = tipos
    .map((tipo) => {
      const color = coloresTipo[tipo] ?? "bg-slate-200 text-slate-700";
      return `<span class="text-xs px-2 py-1 rounded-full font-medium ${color}">${tipo}</span>`;
    })
    .join("");

  // 2.4. Crear nodo y armar plantilla HTML
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

// 4. Ejecutar renderizado inicial (usando el array ampliado del Logro 2)
//render(pokemonAmpliado);

// 5. Obtener referencia al input y filtrar en vivo
const buscador = document.getElementById("buscador");

buscador?.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase().trim();
  const filtrados = pokemonAmpliado.filter((p) =>
    p.nombre.toLowerCase().includes(texto),
  );
  render(filtrados);
});

// --- TRAER UN POKÉMON DE LA API ---

// 1. Mostrar estado de carga inicial en la pantalla
contenedor.innerHTML = `<p class="col-span-full text-center text-slate-500">Cargando…</p>`;

// 2. Pedir los datos a la PokeAPI
fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
  .then(function (response) {
    // 2.1: convierte el texto JSON a un objeto de JavaScript
    return response.json();
  })
  .then(function (data) {
    // 2.2: recibe el objeto listo de la API
    console.log("Datos de la API para Pikachu:", data);
  })
  .catch(function (error) {
    // Se ejecuta si hay un error de red
    console.error(error);
    contenedor.innerHTML = `<p class="col-span-full text-center text-red-600">No se pudo cargar.</p>`;
  });