// Vista del formulario de videojuegos. Los campos están escritos en el HTML (ventana de la tienda y página de editar),
// con sus reglas en atributos (required, pattern, min…) y sus mensajes de error en cada <small>, que muestra CSS.
import { buscar } from "../auxiliares/dom.js";

export function obtenerFormulario() {
  return buscar("#formulario-videojuego");
}

// Escribe cada propiedad del juego en el campo que tiene su mismo nombre
export function llenarFormulario(videojuego) {
  const formulario = obtenerFormulario();
  for (const [nombre, valor] of Object.entries(videojuego)) {
    if (formulario.elements[nombre]) formulario.elements[nombre].value = valor;
  }
}

// Lo que escribió el usuario, campo por campo: { nombre: "...", precio: "..." } (la imagen se lee aparte)
export function leerValoresFormulario() {
  const valores = Object.fromEntries(new FormData(obtenerFormulario()));
  delete valores.imagen;
  return valores;
}

// ---------- Portada: selector de archivo con vista previa (escrito en el HTML) ----------
let urlDeSeleccion = null; // dirección temporal de la imagen elegida; se libera al cambiarla

export function leerArchivoImagen() {
  return obtenerFormulario().elements.imagen.files[0];
}

// origen: un archivo recién elegido (File) o la dirección de la portada actual (texto)
export function mostrarVistaPrevia(origen) {
  if (urlDeSeleccion) URL.revokeObjectURL(urlDeSeleccion);
  urlDeSeleccion = typeof origen === "string" ? null : URL.createObjectURL(origen);
  buscar(".cover-preview", obtenerFormulario()).src = urlDeSeleccion ?? origen;
}

// mensaje vacío = sin error
export function mostrarErrorImagen(mensaje) {
  const aviso = buscar(".cover-error", obtenerFormulario());
  aviso.textContent = mensaje;
  aviso.hidden = mensaje === "";
}

export function mostrarLimiteImagen(megabytes) {
  buscar(".cover-limite", obtenerFormulario()).textContent = megabytes;
}

export function limpiarSeleccionImagen() {
  obtenerFormulario().elements.imagen.value = "";
}

export function reiniciarFormulario(portadaPredeterminada) {
  const formulario = obtenerFormulario();
  formulario.reset();
  formulario.classList.remove("intentado");
  mostrarErrorImagen("");
  mostrarVistaPrevia(portadaPredeterminada);
}

export function abrirVentanaFormulario() {
  buscar("#ventana-formulario").showModal();
}

export function cerrarVentanaFormulario() {
  buscar("#ventana-formulario").close();
}

export function mostrarFormularioNoEncontrado() {
  buscar("#formulario").hidden = true;
  buscar("#formulario-no-encontrado").hidden = false;
}
