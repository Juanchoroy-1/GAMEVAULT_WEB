// Controlador de favoritos
import { alCambiarVideojuegos } from "../modelos/ModeloVideojuego.js";
import { obtenerFavoritos } from "../modelos/ModeloFavorito.js";
import { aplicarControles } from "../auxiliares/filtrosLista.js";
import { leerControlesFiltros, alCambiarFiltros } from "../vistas/componentes/VistaBarraFiltros.js";
import { mostrarFavoritos } from "../vistas/VistaFavoritos.js";

function actualizarFavoritos() {
  const favoritos = obtenerFavoritos();
  const videojuegosVisibles = aplicarControles(favoritos, leerControlesFiltros());
  mostrarFavoritos(favoritos, videojuegosVisibles);
}

export function iniciarControladorFavoritos() {
  alCambiarFiltros(actualizarFavoritos);
  actualizarFavoritos();
  alCambiarVideojuegos(actualizarFavoritos);
}
