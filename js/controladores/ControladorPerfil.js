// Controlador del perfil
import { obtenerEstadisticasPerfil } from "../modelos/ModeloPerfil.js";
import { mostrarPerfil } from "../vistas/VistaPerfil.js";

export function iniciarControladorPerfil() {
  mostrarPerfil(obtenerEstadisticasPerfil());
}
