// Controlador de un videojuego: ficha de detalles y compra (acciones disponibles en cualquier página)
import { obtenerVideojuego, iniciarVideojuegos } from "../modelos/ModeloVideojuego.js";
import { marcarFavorito } from "../modelos/ModeloFavorito.js";
import { estaEnBiblioteca, agregarABiblioteca } from "../modelos/ModeloBiblioteca.js";
import { obtenerParametro, irA, volverAtras } from "../auxiliares/navegacion.js";
import { mostrarNotificacion, avisarEnPaginaSiguiente } from "../vistas/componentes/VistaNotificacion.js";
import { mostrarVentanaCompra, cerrarVentanaCompra } from "../vistas/componentes/VistaVentanaCompra.js";
import {
  mostrarDetallesVideojuego, mostrarVideojuegoNoEncontrado,
  conectarCasillaFavorito, conectarEnlaceVolver,
} from "../vistas/VistaDetallesVideojuego.js";

// ---------- Página de detalles: detalles_videojuego.html?id=... ----------
export function iniciarControladorDetalles() {
  const videojuego = obtenerVideojuego(obtenerParametro("id"));
  if (!videojuego) {
    mostrarVideojuegoNoEncontrado();
    return;
  }

  mostrarDetallesVideojuego(videojuego);

  conectarCasillaFavorito((esFavorito) => {
    marcarFavorito(videojuego.id, esFavorito);
    mostrarNotificacion(esFavorito ? "Agregado a favoritos" : "Eliminado de favoritos");
  });

  // Si otra pestaña elimina este juego, esta ficha ya no es válida: se vuelve a la tienda
  window.addEventListener("storage", () => {
    iniciarVideojuegos();
    if (!obtenerVideojuego(videojuego.id)) irA("tienda.html");
  });

  // «Volver»: regresa a la página anterior; si no hay, el enlace lleva a la tienda
  conectarEnlaceVolver((evento) => {
    if (volverAtras()) evento.preventDefault();
  });
}

// ---------- Comprar (botones con data-accion) ----------
// Comprar solo agrega el juego a la biblioteca: el catálogo de la tienda no cambia
function comprarVideojuego(videojuego) {
  if (!agregarABiblioteca(videojuego.id)) {
    cerrarVentanaCompra();
    mostrarNotificacion("No se pudo guardar en el navegador. La compra no se conservará al recargar.", "error");
    return;
  }
  avisarEnPaginaSiguiente("Juego comprado correctamente"); // demostración: no hay pago real
  irA("biblioteca.html");
}

function manejarAccionDeVideojuego(evento) {
  const boton = evento.target.closest("[data-accion]");
  const videojuego = boton && obtenerVideojuego(boton.dataset.id); // los botones sin data-id no son de un juego
  if (!videojuego) return;

  if (boton.dataset.accion === "comprar") mostrarVentanaCompra(videojuego, estaEnBiblioteca(videojuego.id));
  if (boton.dataset.accion === "confirmar-compra") comprarVideojuego(videojuego);
}

export function iniciarAccionesDeVideojuego() {
  document.addEventListener("click", manejarAccionDeVideojuego);
}
