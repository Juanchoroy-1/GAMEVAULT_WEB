// Vista de favoritos
import { buscar } from "../auxiliares/dom.js";
import { mostrarTarjetas } from "./componentes/VistaTarjetaVideojuego.js";

export function mostrarFavoritos(favoritos, videojuegosVisibles) {
  buscar(".store-grid").innerHTML = mostrarTarjetas(videojuegosVisibles, "tienda");

  // Dos mensajes distintos: no hay favoritos, o los filtros no encuentran ninguno
  buscar("#favoritos-vacio").hidden = favoritos.length > 0;
  buscar("#favoritos-sin-resultados").hidden = favoritos.length === 0 || videojuegosVisibles.length > 0;
  buscar("#filtros-favoritos").hidden = favoritos.length === 0;

  let palabra = "favoritos";
  if (favoritos.length === 1) palabra = "favorito";
  buscar(".result-count").textContent = `${favoritos.length} ${palabra}`;
}
