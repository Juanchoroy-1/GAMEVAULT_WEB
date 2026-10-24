// Controlador de la biblioteca: lista, filtros, detalles, botón «Jugar» y eliminación global de un videojuego (con confirmación).
import { obtenerVideojuego, actualizarVideojuego, alCambiarVideojuegos } from "../modelos/ModeloVideojuego.js";
import { obtenerJuegosDeBiblioteca } from "../modelos/ModeloBiblioteca.js";
import { eliminarVideojuegoGlobal } from "../modelos/ModeloEliminacion.js";
import { aplicarControles } from "../auxiliares/filtrosLista.js";
import { leerControlesFiltros, alCambiarFiltros } from "../vistas/componentes/VistaBarraFiltros.js";
import { mostrarNotificacion } from "../vistas/componentes/VistaNotificacion.js";
import { mostrarBiblioteca, cerrarMenus, mostrarVentanaEliminar, cerrarVentanaEliminar } from "../vistas/VistaBiblioteca.js";

const juegosIniciandose = []; // ids de juegos que se están iniciando (evita iniciar dos veces)

function actualizarBiblioteca() {
  const juegosDeBiblioteca = obtenerJuegosDeBiblioteca();
  const videojuegosVisibles = aplicarControles(juegosDeBiblioteca, leerControlesFiltros());
  mostrarBiblioteca(videojuegosVisibles, juegosDeBiblioteca.length);
}

function jugarVideojuego(id) {
  if (juegosIniciandose.includes(id) || !obtenerVideojuego(id)) return;

  juegosIniciandose.push(id);
  mostrarNotificacion("Iniciando juego...");

  setTimeout(() => {
    juegosIniciandose.splice(juegosIniciandose.indexOf(id), 1);
    if (!obtenerVideojuego(id)) return; // el juego se eliminó mientras iniciaba

    actualizarVideojuego(id, { estado: "Jugando", ultimaVezJugado: Date.now() });
    mostrarNotificacion("Jugando");
  }, 1200);
}

// Eliminar borra el juego de TODA la aplicación (ver ModeloEliminacion.js); aquí solo se confirma y se avisa del resultado
let eliminando = false; // evita que un doble clic ejecute dos veces la misma eliminación

async function confirmarEliminacion(id) {
  if (eliminando) return;
  eliminando = true;
  cerrarVentanaEliminar();
  const nombre = obtenerVideojuego(id)?.nombre;
  try {
    const resultado = await eliminarVideojuegoGlobal(id);
    if (resultado === "error") {
      mostrarNotificacion("No se pudo eliminar el videojuego. No se hizo ningún cambio; inténtalo de nuevo.", "error");
    } else if (resultado === "inexistente") {
      mostrarNotificacion("Ese videojuego ya no existe.");
      actualizarBiblioteca();
    } else {
      mostrarNotificacion(`«${nombre}» se eliminó de GameVault`);
    }
  } finally {
    eliminando = false;
  }
}

function manejarClicEnBiblioteca(evento) {
  cerrarMenus(evento.target.closest("details.menu-wrap"));
  if (evento.target.closest(".context-menu a, .context-menu button")) cerrarMenus(null);

  const botonJugar = evento.target.closest('[data-accion="jugar"]');
  if (botonJugar) jugarVideojuego(botonJugar.dataset.id);

  const botonEliminar = evento.target.closest('[data-accion="eliminar"]');
  const videojuegoAEliminar = botonEliminar && obtenerVideojuego(botonEliminar.dataset.id);
  if (videojuegoAEliminar) mostrarVentanaEliminar(videojuegoAEliminar);

  const botonConfirmar = evento.target.closest('[data-accion="confirmar-eliminar"]');
  if (botonConfirmar) confirmarEliminacion(botonConfirmar.dataset.id);
}

export function iniciarControladorBiblioteca() {
  alCambiarFiltros(actualizarBiblioteca);
  actualizarBiblioteca();
  alCambiarVideojuegos(actualizarBiblioteca);

  document.addEventListener("click", manejarClicEnBiblioteca);
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarMenus(null);
  });
}
