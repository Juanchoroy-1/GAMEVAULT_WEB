// Vista de la ventana de compra: un <dialog id="ventana-compra"> escrito en el HTML. Aquí solo se escriben los datos del juego.
// (Escape, la «X», «Cancelar» y el foco los resuelve el propio <dialog>.)
import { buscar, buscarTodos } from "../../auxiliares/dom.js";
import { darFormatoPrecio, portadaDe } from "../../auxiliares/formato.js";

export function mostrarVentanaCompra(videojuego, yaEnBiblioteca) {
  const ventana = buscar("#ventana-compra");
  for (const nombre of buscarTodos(".compra-nombre", ventana)) nombre.textContent = videojuego.nombre;
  buscar("img", ventana).src = portadaDe(videojuego);
  buscar("#compra-genero", ventana).textContent = videojuego.genero;
  buscar("#compra-precio", ventana).textContent = darFormatoPrecio(videojuego.precio);
  buscar("#compra-confirmar", ventana).dataset.id = videojuego.id;

  // Si ya lo tiene, en lugar de «Confirmar compra» se ofrece ir a la biblioteca
  buscar("#compra-nueva", ventana).hidden = yaEnBiblioteca;
  buscar("#compra-confirmar", ventana).hidden = yaEnBiblioteca;
  buscar("#compra-existente", ventana).hidden = !yaEnBiblioteca;
  buscar("#compra-ir-biblioteca", ventana).hidden = !yaEnBiblioteca;
  ventana.showModal();
}

export function cerrarVentanaCompra() {
  buscar("#ventana-compra").close();
}
