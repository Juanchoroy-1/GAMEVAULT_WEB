// Modelo del perfil: estadísticas calculadas con los mismos datos de los videojuegos
import { obtenerJuegosDeBiblioteca } from "./ModeloBiblioteca.js";
import { obtenerFavoritos } from "./ModeloFavorito.js";

export function obtenerEstadisticasPerfil() {
  const biblioteca = obtenerJuegosDeBiblioteca();
  return {
    biblioteca: biblioteca.length,
    favoritos: obtenerFavoritos().length,
    jugando: biblioteca.filter((videojuego) => videojuego.estado === "Jugando").length,
    completados: biblioteca.filter((videojuego) => videojuego.estado === "Completado").length,
  };
}
