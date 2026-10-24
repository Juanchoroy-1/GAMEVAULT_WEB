// Vista de la página de inicio
import { buscar } from "../auxiliares/dom.js";
import { darFormatoPrecio, portadaGrandeDe } from "../auxiliares/formato.js";
import { mostrarTarjetas } from "./componentes/VistaTarjetaVideojuego.js";

// Dibuja una fila de tarjetas; si no hay juegos, oculta toda la sección
function dibujarFila(selector, videojuegos) {
  const fila = buscar(selector);
  fila.innerHTML = mostrarTarjetas(videojuegos, "compacta");
  fila.closest("section").hidden = videojuegos.length === 0;
}

// La imagen destacada está escrita en el HTML: aquí solo se escriben los datos del juego
function dibujarPrincipal(videojuego) {
  const principal = buscar("#inicio-principal");
  principal.hidden = !videojuego;
  if (!videojuego) return;

  buscar("img", principal).src = portadaGrandeDe(videojuego);
  buscar("h1", principal).textContent = videojuego.nombre;
  buscar("p", principal).textContent = videojuego.descripcion;
  buscar("strong", principal).textContent = darFormatoPrecio(videojuego.precio);
  buscar("button", principal).dataset.id = videojuego.id;
}

export function mostrarInicio(videojuegoPrincipal, destacados, nuevos, hayVideojuegos) {
  dibujarPrincipal(videojuegoPrincipal);
  dibujarFila("#inicio-destacados", destacados);
  dibujarFila("#inicio-nuevos", nuevos);
  buscar("#inicio-vacio").hidden = hayVideojuegos;
}
