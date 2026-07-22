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

// 1. Obtener contenedor
const contenedor = document.getElementById("resultado");

// 2. Función para fabricar la tarjeta en el DOM
function crearTarjeta(pokemon) {
  // 2.1. Destructuring de propiedades
  const { nombre, imagen, tipos } = pokemon;

  // 2.2. Acceso seguro con ?? para la imagen de respaldo
  const img = imagen ?? "https://via.placeholder.com/96?text=?";

  // 2.3. Convertir el array de tipos en badges HTML
  const badges = tipos
    ? tipos
        .map(
          (tipo) =>
            `<span class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">${tipo}</span>`,
        )
        .join("")
    : "";

  // 2.4. Crear nodo y armar plantilla HTML
  const articulo = document.createElement("article");
  articulo.className = "bg-white rounded-xl shadow p-4 text-center";
  articulo.innerHTML = `
      <img src="${img}" alt="${nombre}" class="w-24 h-24 mx-auto">
      <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
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

// 4. Ejecutar renderizado
render(pokemonLocal);