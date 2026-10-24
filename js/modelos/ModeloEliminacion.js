// Modelo de eliminación: borra un videojuego de TODA la aplicación (no solo lo retira de la biblioteca).
// Es el único camino para eliminar: los controladores y las vistas no tocan el catálogo ni la biblioteca por su cuenta.
//
// Dónde se guarda un juego, y qué pasa con cada parte:
// - Catálogo (ModeloVideojuego): el registro completo. Tienda, Favoritos, Inicio y Perfil leen de aquí;
//   los favoritos no son una lista aparte (es el campo «favorito» del propio juego), así que desaparecen con él.
// - Biblioteca (ModeloBiblioteca): solo el id del juego. Se quita para que no quede una referencia huérfana.
// - Portada: si es un archivo guardado en el navegador («idb:…») y ningún otro juego lo usa, se borra.
//   Las portadas «assets/…» (archivos del proyecto) y las URL no se pueden borrar desde el navegador: solo se quita la referencia.
import { obtenerVideojuego, obtenerVideojuegos, eliminarVideojuego } from "./ModeloVideojuego.js";
import { estaEnBiblioteca, quitarDeBiblioteca, agregarABiblioteca } from "./ModeloBiblioteca.js";
import { borrarImagen } from "../auxiliares/imagenesLocales.js";

// Devuelve "eliminado", "inexistente" (el juego ya no estaba) o "error" (no se pudo guardar: no se cambió nada)
export async function eliminarVideojuegoGlobal(id) {
  const videojuego = obtenerVideojuego(id);
  if (!videojuego) return "inexistente";

  const estabaEnBiblioteca = estaEnBiblioteca(id);
  if (!quitarDeBiblioteca(id)) return "error"; // 1. biblioteca: si falla, no se ha cambiado nada

  if (!eliminarVideojuego(id)) { // 2. catálogo (y con él, favoritos): las páginas se actualizan solas
    if (estabaEnBiblioteca) agregarABiblioteca(id); // se deshace el paso 1: nunca queda una eliminación a medias
    return "error";
  }

  // 3. portada: solo si ya no la usa ningún otro juego (borrarImagen ignora las que no son archivos del navegador)
  const lasigueUsandoOtro = obtenerVideojuegos().some((otro) => otro.portada === videojuego.portada);
  if (!lasigueUsandoOtro) await borrarImagen(videojuego.portada);
  return "eliminado";
}
