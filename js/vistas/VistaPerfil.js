// Vista del perfil
import { buscar } from "../auxiliares/dom.js";

export function mostrarPerfil(estadisticas) {
  buscar("#estadistica-biblioteca").textContent = estadisticas.biblioteca;
  buscar("#estadistica-favoritos").textContent = estadisticas.favoritos;
  buscar("#estadistica-jugando").textContent = estadisticas.jugando;
  buscar("#estadistica-completados").textContent = estadisticas.completados;
}
