// Controlador de la página de inicio
import { obtenerVideojuegos, alCambiarVideojuegos } from "../modelos/ModeloVideojuego.js";
import { mostrarInicio } from "../vistas/VistaInicio.js";

function actualizarInicio() {
  const videojuegos = obtenerVideojuegos();

  // Imagen destacada: el juego marcado como principal, o el primero si ese ya no existe
  let videojuegoPrincipal = videojuegos.find((videojuego) => videojuego.principal);
  if (!videojuegoPrincipal) videojuegoPrincipal = videojuegos[0];

  const destacados = videojuegos.filter((videojuego) => videojuego.destacado).slice(0, 4);
  const nuevos = videojuegos.filter((videojuego) => videojuego.esNuevo).slice(-4); // los 4 más recientes de la lista

  mostrarInicio(videojuegoPrincipal, destacados, nuevos, videojuegos.length > 0);
}

export function iniciarControladorInicio() {
  actualizarInicio();
  alCambiarVideojuegos(actualizarInicio);
}
