// Búsqueda, filtros y ordenamiento de una lista de videojuegos (funciones puras: no tocan el HTML)
// "controles" es un objeto como { consulta, genero, plataforma, precio, estado, orden }

const LIMITE_PRECIO = 100000; // "Menos de $100.000" y "$100.000 o más"
const comparador = new Intl.Collator("es", { sensitivity: "base" });

// ---------- Búsqueda por nombre (sin distinguir mayúsculas ni acentos) ----------
function simplificar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function coincideConBusqueda(videojuego, consulta) {
  if (consulta === "") return true;
  return simplificar(videojuego.nombre).includes(simplificar(consulta));
}

// ---------- Filtros ----------
function coincideConFiltros(videojuego, controles) {
  if (controles.genero !== "" && videojuego.genero !== controles.genero) return false;
  if (controles.plataforma !== "" && videojuego.plataforma !== controles.plataforma) return false;
  if (controles.estado !== "" && videojuego.estado !== controles.estado) return false;
  if (controles.precio === "bajo" && videojuego.precio >= LIMITE_PRECIO) return false;
  if (controles.precio === "alto" && videojuego.precio < LIMITE_PRECIO) return false;
  return true;
}

// ---------- Ordenamiento ----------
function numeroDeFecha(texto) {
  // "10/12/2020" -> 20201210, así se pueden comparar fechas como números
  const [dia, mes, anio] = texto.split("/").map(Number);
  return (anio || 0) * 10000 + (mes || 0) * 100 + (dia || 0);
}

function compararVideojuegos(a, b, modo) {
  let diferencia = 0;
  if (modo === "precio") diferencia = a.precio - b.precio; // más baratos primero
  if (modo === "fecha") diferencia = numeroDeFecha(b.fecha) - numeroDeFecha(a.fecha); // más recientes primero
  if (modo === "reciente") diferencia = b.ultimaVezJugado - a.ultimaVezJugado; // jugados hace poco primero
  if (diferencia !== 0) return diferencia;
  return comparador.compare(a.nombre, b.nombre); // si hay empate (o el modo es "nombre"), por nombre
}

// ---------- Todo junto ----------
export function aplicarControles(videojuegos, controles) {
  const visibles = videojuegos.filter((videojuego) => coincideConBusqueda(videojuego, controles.consulta) && coincideConFiltros(videojuego, controles));
  return visibles.sort((a, b) => compararVideojuegos(a, b, controles.orden));
}
