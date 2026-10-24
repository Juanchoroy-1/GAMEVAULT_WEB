// Controlador del formulario de videojuegos:
// - agregar: se abre en una ventana dentro de la tienda (botón «Agregar videojuego»)
// - editar: página editar_videojuego.html?id=...
// Las reglas de validación están en los atributos del HTML; aquí solo se comprueba que la fecha exista de verdad.
import { agregarVideojuego, actualizarVideojuego, obtenerVideojuego } from "../modelos/ModeloVideojuego.js";
import { obtenerParametro, irA, urlVideojuego } from "../auxiliares/navegacion.js";
import { IMAGEN_PROVISIONAL, portadaDe } from "../auxiliares/formato.js";
import { LIMITE_IMAGEN_MB, validarImagen, guardarImagen, borrarImagen } from "../auxiliares/imagenesLocales.js";
import { mostrarNotificacion, avisarEnPaginaSiguiente } from "../vistas/componentes/VistaNotificacion.js";
import {
  obtenerFormulario, llenarFormulario, leerValoresFormulario, reiniciarFormulario, leerArchivoImagen,
  mostrarVistaPrevia, mostrarErrorImagen, mostrarLimiteImagen, limpiarSeleccionImagen, abrirVentanaFormulario, cerrarVentanaFormulario, mostrarFormularioNoEncontrado,
} from "../vistas/VistaFormulario.js";

let idEnEdicion = null; // id del juego que se edita (null cuando se está agregando)
let portadaActual = IMAGEN_PROVISIONAL; // portada que se muestra si no hay un archivo elegido (la del juego, o la de respaldo)

// «31/02/2020» cumple el patrón del HTML (DD/MM/AAAA) pero no existe; tampoco se aceptan fechas muy futuras
function esFechaValida(texto) {
  const [dia, mes, anio] = texto.trim().split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia); // si la fecha no existe, JavaScript la «corrige» y los números ya no coinciden
  const existe = fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  return existe && anio >= 1970 && fecha <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
}

function revisarFecha() {
  const campo = obtenerFormulario().elements.fecha;
  campo.setCustomValidity(esFechaValida(campo.value) ? "" : "Fecha no válida");
}

// Al elegir un archivo: se valida y se muestra la vista previa; si no sirve, se descarta y se explica por qué
async function elegirImagen(evento) {
  const archivo = evento.target.files[0];
  const error = archivo ? await validarImagen(archivo) : "";
  mostrarErrorImagen(error);
  if (error) limpiarSeleccionImagen();
  mostrarVistaPrevia(archivo && !error ? archivo : portadaActual);
}

// El navegador solo llega aquí si todos los campos son válidos
async function guardarVideojuego(evento) {
  evento.preventDefault();
  const datos = leerValoresFormulario();
  const archivo = leerArchivoImagen(); // sin archivo nuevo no se envía «portada»: al editar se conserva la actual

  if (archivo) {
    try {
      datos.portada = await guardarImagen(archivo);
    } catch (error) {
      mostrarErrorImagen("No se pudo guardar la imagen en el navegador. Prueba con otra o inténtalo de nuevo.");
      return;
    }
  }

  if (idEnEdicion === null) {
    agregarVideojuego(datos);
    cerrarVentanaFormulario();
    mostrarNotificacion("Videojuego agregado correctamente"); // la tienda se actualiza sola
    return;
  }

  const portadaAnterior = obtenerVideojuego(idEnEdicion).portada;
  const videojuego = actualizarVideojuego(idEnEdicion, datos); // mismo id: no crea un registro nuevo
  if (!videojuego) return;
  if (archivo) await borrarImagen(portadaAnterior); // la portada reemplazada ya no la usa nadie
  avisarEnPaginaSiguiente("Cambios guardados correctamente");
  irA(urlVideojuego("confirmacion.html", videojuego.id));
}

// Conecta el formulario de la página (una sola vez)
export function conectarFormulario() {
  const formulario = obtenerFormulario();
  formulario.addEventListener("submit", guardarVideojuego);
  formulario.elements.fecha.addEventListener("input", revisarFecha);
  formulario.elements.imagen.addEventListener("change", elegirImagen);
  mostrarLimiteImagen(LIMITE_IMAGEN_MB);

  // Sin las burbujas del navegador: los mensajes están en el HTML y CSS los muestra (clase «intentado» + :invalid)
  formulario.addEventListener("invalid", (evento) => {
    evento.preventDefault();
    formulario.classList.add("intentado");
    if (evento.target === [...formulario.elements].find((campo) => !campo.validity.valid)) evento.target.focus(); // el primero con error
  }, true);
}

// ---------- Agregar (se llama desde la tienda al pulsar «Agregar videojuego») ----------
export function abrirFormularioAgregar() {
  idEnEdicion = null;
  portadaActual = IMAGEN_PROVISIONAL;
  reiniciarFormulario(portadaActual);
  revisarFecha();
  abrirVentanaFormulario();
}

// ---------- Editar: editar_videojuego.html?id=... ----------
export function iniciarControladorEdicion() {
  const videojuego = obtenerVideojuego(obtenerParametro("id"));
  if (!videojuego) {
    mostrarFormularioNoEncontrado();
    return;
  }

  idEnEdicion = videojuego.id;
  portadaActual = portadaDe(videojuego);
  mostrarVistaPrevia(portadaActual);
  llenarFormulario(videojuego);
  conectarFormulario();
  revisarFecha();
}
