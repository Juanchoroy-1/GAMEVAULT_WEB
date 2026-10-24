// Vista de la tienda
import { buscar } from "../auxiliares/dom.js";
import { mostrarTarjetas } from "./componentes/VistaTarjetaVideojuego.js";

export function mostrarTienda(videojuegosVisibles) {
  const total = videojuegosVisibles.length;
  buscar(".store-grid").innerHTML = mostrarTarjetas(videojuegosVisibles, "tienda");
  buscar(".empty").hidden = total > 0;

  let palabra = "juegos";
  if (total === 1) palabra = "juego";
  buscar(".result-count").textContent = `${total} ${palabra}`;
}
