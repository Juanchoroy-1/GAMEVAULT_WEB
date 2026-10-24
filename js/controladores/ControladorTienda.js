// Controlador de la tienda: catálogo con búsqueda, filtros y orden, y botón «Agregar videojuego»
import { obtenerVideojuegos, alCambiarVideojuegos } from "../modelos/ModeloVideojuego.js";
import { aplicarControles } from "../auxiliares/filtrosLista.js";
import { buscar } from "../auxiliares/dom.js";
import { leerControlesFiltros, alCambiarFiltros } from "../vistas/componentes/VistaBarraFiltros.js";
import { mostrarTienda } from "../vistas/VistaTienda.js";
import { conectarFormulario, abrirFormularioAgregar } from "./ControladorFormulario.js";

function actualizarTienda() {
  const videojuegosVisibles = aplicarControles(obtenerVideojuegos(), leerControlesFiltros());
  mostrarTienda(videojuegosVisibles);
}

export function iniciarControladorTienda() {
  alCambiarFiltros(actualizarTienda);
  actualizarTienda();
  alCambiarVideojuegos(actualizarTienda);

  // Botón «Agregar videojuego»: abre el formulario en una ventana
  conectarFormulario();
  buscar('[data-accion="agregar-videojuego"]').addEventListener("click", abrirFormularioAgregar);
}
