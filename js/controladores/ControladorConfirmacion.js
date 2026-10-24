// Controlador de la confirmación después de editar: confirmacion.html?id=...
import { obtenerVideojuego } from "../modelos/ModeloVideojuego.js";
import { obtenerParametro } from "../auxiliares/navegacion.js";
import { mostrarConfirmacion } from "../vistas/VistaConfirmacion.js";

export function iniciarControladorConfirmacion() {
  const videojuego = obtenerVideojuego(obtenerParametro("id"));

  if (!videojuego) {
    mostrarConfirmacion("Todo listo", "No hay cambios recientes que mostrar.", "");
    return;
  }
  mostrarConfirmacion("Cambios guardados", `Se actualizó la información de ${videojuego.nombre}.`, videojuego.id);
}
