// Modelo de favoritos: son los juegos marcados con el corazón (se guardan en el propio juego)
import { obtenerVideojuegos, actualizarVideojuego } from "./ModeloVideojuego.js";

export function obtenerFavoritos() {
  return obtenerVideojuegos().filter((videojuego) => videojuego.favorito);
}

// Se guarda sin volver a dibujar la página, para no reemplazar la casilla mientras se usa
export function marcarFavorito(id, esFavorito) {
  return actualizarVideojuego(id, { favorito: esFavorito }, false);
}
