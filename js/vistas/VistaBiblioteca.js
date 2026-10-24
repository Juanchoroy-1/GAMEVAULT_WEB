// Vista de la biblioteca
import { buscar, buscarTodos } from "../auxiliares/dom.js";
import { mostrarTarjetas } from "./componentes/VistaTarjetaVideojuego.js";

export function mostrarBiblioteca(videojuegosVisibles, cantidadEnBiblioteca) {
  buscar(".library-grid").innerHTML = mostrarTarjetas(videojuegosVisibles, "biblioteca");
  buscar(".empty").hidden = videojuegosVisibles.length > 0;

  let texto = "juegos listos para ti.";
  if (cantidadEnBiblioteca === 1) texto = "juego listo para ti.";
  buscar("#cantidad-biblioteca").textContent = `${cantidadEnBiblioteca} ${texto}`;
}

// Ventana de confirmación para eliminar (un <dialog> escrito en biblioteca.html): aquí solo se escriben los datos del juego
export function mostrarVentanaEliminar(videojuego) {
  const ventana = buscar("#ventana-eliminar");
  buscar(".eliminar-nombre", ventana).textContent = videojuego.nombre;
  buscar('[data-accion="confirmar-eliminar"]', ventana).dataset.id = videojuego.id;
  ventana.showModal();
}

export function cerrarVentanaEliminar() {
  buscar("#ventana-eliminar").close();
}

// Cierra los menús de opciones abiertos (menos el que se acaba de abrir)
export function cerrarMenus(menuAConservar) {
  for (const menu of buscarTodos("details.menu-wrap[open]")) {
    if (menu !== menuAConservar) menu.open = false;
  }
}
