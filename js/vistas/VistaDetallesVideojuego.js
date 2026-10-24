// Vista de la ficha de detalles. La estructura está escrita en detalles_videojuego.html: aquí solo se escriben los datos.
import { buscar, buscarTodos } from "../auxiliares/dom.js";
import { darFormatoPrecio, portadaDe } from "../auxiliares/formato.js";

const DATOS_DE_LISTA = ["desarrollador", "fecha", "plataforma", "tamano"]; // <dd id="detalle-...">

export function mostrarDetallesVideojuego(videojuego) {
  const ficha = buscar("#detalle");
  for (const imagen of buscarTodos("img", ficha)) imagen.src = portadaDe(videojuego);
  buscar(".detail-cover", ficha).alt = `Portada de ${videojuego.nombre}`;
  buscar(".eyebrow", ficha).textContent = [videojuego.genero, videojuego.categoria].filter(Boolean).join(" · ");
  buscar("h1", ficha).textContent = videojuego.nombre;
  buscar(".detail-description", ficha).textContent = videojuego.descripcion || "Sin descripción disponible.";
  for (const dato of DATOS_DE_LISTA) buscar(`#detalle-${dato}`, ficha).textContent = videojuego[dato] || "—";
  buscar("#detalle-precio", ficha).textContent = darFormatoPrecio(videojuego.precio);
  buscar('[data-accion="comprar"]', ficha).dataset.id = videojuego.id;
  buscar("#casilla-favorito", ficha).checked = videojuego.favorito;

  ficha.hidden = false;
  document.title = `${videojuego.nombre} · GameVault`;
}

export function mostrarVideojuegoNoEncontrado() {
  buscar("#detalle-no-encontrado").hidden = false;
}

// Llama a manejador(true/false) cuando se marca o desmarca la casilla de favoritos
export function conectarCasillaFavorito(manejador) {
  buscar("#casilla-favorito").addEventListener("change", (evento) => manejador(evento.target.checked));
}

// Llama a manejador(evento) cuando se pulsa «Volver»
export function conectarEnlaceVolver(manejador) {
  buscar('[data-accion="volver"]').addEventListener("click", manejador);
}
