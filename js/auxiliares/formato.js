// Funciones para dar formato a los valores que se muestran
import { PREFIJO_IMAGEN_LOCAL, urlDeImagenLocal } from "./imagenesLocales.js";

// Portada que se usa cuando un juego no tiene imagen o la imagen no carga (todas las páginas están en paginas/)
export const IMAGEN_PROVISIONAL = "../assets/imagenes/predeterminada.svg";

// 159900 -> "$159.900"
export function darFormatoPrecio(precio) {
  const digitos = String(Math.round(precio));
  const conPuntos = digitos.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "$" + conPuntos;
}

// "No instalado" -> "status-no-instalado" (clase CSS del estado)
export function claseDeEstado(estado) {
  return "status-" + estado.toLowerCase().replace(/\s+/g, "-");
}

// Dirección de la portada de un juego según dónde esté guardada:
// «idb:…» (elegida en el formulario, guardada en el navegador), «assets/…» (archivo del proyecto) o una URL antigua.
export function portadaDe(videojuego) {
  const ruta = videojuego.portada;
  if (ruta.startsWith(PREFIJO_IMAGEN_LOCAL)) return urlDeImagenLocal(ruta) || IMAGEN_PROVISIONAL;
  if (ruta.startsWith("assets/")) return "../" + ruta;
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return IMAGEN_PROVISIONAL; // vacía o con un formato que no sirve (por ejemplo un blob: antiguo)
}

// Versión grande de la portada para la imagen destacada de Inicio (solo cambia las URLs de Unsplash)
export function portadaGrandeDe(videojuego) {
  return portadaDe(videojuego).replace("w=800&q=80", "w=1200&q=85");
}
