// Vista de la página de confirmación
import { buscar } from "../auxiliares/dom.js";
import { urlVideojuego } from "../auxiliares/navegacion.js";

// Si no hay juego, idVideojuego debe ser "" y se oculta el enlace a los detalles
export function mostrarConfirmacion(titulo, texto, idVideojuego) {
  buscar("#titulo-guardado").textContent = titulo;
  buscar("#texto-guardado").textContent = texto;

  const enlaceDetalles = buscar("#enlace-detalle-guardado");
  enlaceDetalles.hidden = idVideojuego === "";
  if (idVideojuego !== "") enlaceDetalles.href = urlVideojuego("detalles_videojuego.html", idVideojuego);
}
