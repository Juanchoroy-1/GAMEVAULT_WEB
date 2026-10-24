// GameVault · punto de entrada: cada página indica quién es con <body data-page="...">
import { iniciarVideojuegos, alFallarGuardado } from "./modelos/ModeloVideojuego.js";
import { iniciarBiblioteca } from "./modelos/ModeloBiblioteca.js";
import { IMAGEN_PROVISIONAL } from "./auxiliares/formato.js";
import { cargarImagenesLocales } from "./auxiliares/imagenesLocales.js";
import { insertarIconos } from "./vistas/componentes/iconos.js";
import { mostrarNotificacion, mostrarAvisoPendiente } from "./vistas/componentes/VistaNotificacion.js";
import { iniciarControladorInicio } from "./controladores/ControladorInicio.js";
import { iniciarControladorTienda } from "./controladores/ControladorTienda.js";
import { iniciarControladorBiblioteca } from "./controladores/ControladorBiblioteca.js";
import { iniciarControladorFavoritos } from "./controladores/ControladorFavoritos.js";
import { iniciarControladorDetalles, iniciarAccionesDeVideojuego } from "./controladores/ControladorVideojuego.js";
import { iniciarControladorEdicion } from "./controladores/ControladorFormulario.js";
import { iniciarControladorConfirmacion } from "./controladores/ControladorConfirmacion.js";
import { iniciarControladorPerfil } from "./controladores/ControladorPerfil.js";

// Qué controlador inicia cada página (solo el suyo)
const CONTROLADORES_POR_PAGINA = {
  inicio: iniciarControladorInicio,
  tienda: iniciarControladorTienda,
  biblioteca: iniciarControladorBiblioteca,
  favoritos: iniciarControladorFavoritos,
  detalles: iniciarControladorDetalles,
  editar: iniciarControladorEdicion,
  confirmacion: iniciarControladorConfirmacion,
  perfil: iniciarControladorPerfil,
};

async function iniciarAplicacion() {
  insertarIconos();
  iniciarVideojuegos();
  iniciarBiblioteca(); // después del catálogo y antes de cualquier cambio
  alFallarGuardado(() => mostrarNotificacion("No se pudo guardar en el navegador. Los cambios se perderán al recargar.", "error"));
  iniciarAccionesDeVideojuego();
  mostrarAvisoPendiente();

  // Si una portada no carga (sin conexión, URL rota), se reemplaza por una imagen neutra
  document.addEventListener("error", (evento) => {
    const imagen = evento.target;
    if (imagen.tagName === "IMG" && imagen.getAttribute("src") !== IMAGEN_PROVISIONAL) imagen.src = IMAGEN_PROVISIONAL;
  }, true);

  // Un clic en el fondo oscuro cierra el <dialog> (Escape y los botones «Cancelar» y «X» lo cierran solos)
  document.addEventListener("click", (evento) => {
    if (evento.target.matches("dialog")) evento.target.close();
  });

  await cargarImagenesLocales(); // las portadas guardadas en el navegador deben estar listas antes de dibujar

  // Lo propio de la página actual
  const iniciarControlador = CONTROLADORES_POR_PAGINA[document.body.dataset.page];
  if (iniciarControlador) iniciarControlador();
}

iniciarAplicacion();
