// Modelo de videojuego: define cómo es un videojuego y gestiona el CATÁLOGO de la tienda.
// Qué juegos posee el usuario se guarda aparte, en ModeloBiblioteca.js.
import { VIDEOJUEGOS_INICIALES, ESTADOS } from "./datosVideojuegos.js";
import { cargarVideojuegos, guardarVideojuegos } from "../auxiliares/almacenamiento.js";

let videojuegos = [];
let escuchas = [];
let manejadorErrorGuardado = function () {};

// Las páginas se suscriben para volver a dibujarse cuando cambian los datos
export function alCambiarVideojuegos(escucha) {
  escuchas.push(escucha);
}

// Se ejecuta si no se pudo guardar en el navegador
export function alFallarGuardado(manejador) {
  manejadorErrorGuardado = manejador;
}

// Nombres que tenían las propiedades antes de pasar al español.
// Así los videojuegos guardados por la versión anterior no se pierden.
const NOMBRES_ANTIGUOS = {
  nombre: "name", precio: "price", genero: "genre", categoria: "category",
  desarrollador: "developer", fecha: "date", plataforma: "platform", tamano: "size",
  descripcion: "description", portada: "image", estado: "status", favorito: "favorite",
  destacado: "featured", esNuevo: "isNew", principal: "hero",
  ultimaVezJugado: "lastPlayed",
};

function leerCampo(datos, nombre) {
  if (datos[nombre] !== undefined) return datos[nombre];
  return datos[NOMBRES_ANTIGUOS[nombre]];
}

function aTexto(valor) {
  return String(valor ?? "").trim();
}

// Estructura de un videojuego. Completa los campos que falten,
// así los datos viejos o incompletos no rompen la interfaz.
export function crearVideojuego(datos) {
  let estado = leerCampo(datos, "estado");
  if (!ESTADOS.includes(estado)) estado = "No instalado";

  return {
    id: aTexto(datos.id),
    nombre: aTexto(leerCampo(datos, "nombre")),
    precio: Number(leerCampo(datos, "precio")) || 0,
    genero: aTexto(leerCampo(datos, "genero")),
    categoria: aTexto(leerCampo(datos, "categoria")),
    desarrollador: aTexto(leerCampo(datos, "desarrollador")),
    fecha: aTexto(leerCampo(datos, "fecha")),
    plataforma: aTexto(leerCampo(datos, "plataforma")) || "PC",
    tamano: aTexto(leerCampo(datos, "tamano")),
    descripcion: aTexto(leerCampo(datos, "descripcion")),
    portada: aTexto(leerCampo(datos, "portada")),
    estado: estado,
    favorito: Boolean(leerCampo(datos, "favorito")),
    destacado: Boolean(leerCampo(datos, "destacado")), // aparece en «Juegos destacados»
    esNuevo: Boolean(leerCampo(datos, "esNuevo")), // aparece en «Nuevos lanzamientos»
    principal: Boolean(leerCampo(datos, "principal")), // es la imagen destacada de Inicio
    ultimaVezJugado: Number(leerCampo(datos, "ultimaVezJugado")) || 0,
  };
}

// Se llama una vez al cargar cada página
export function iniciarVideojuegos() {
  const guardados = cargarVideojuegos();
  let origen = VIDEOJUEGOS_INICIALES;
  if (guardados !== null) origen = guardados;
  videojuegos = origen.map(crearVideojuego).filter((videojuego) => videojuego.id !== "" && videojuego.nombre !== "");
}

export function obtenerVideojuegos() {
  return videojuegos;
}

export function obtenerVideojuego(id) {
  return videojuegos.find((videojuego) => videojuego.id === String(id));
}

// Guarda en localStorage y, si se pide, avisa a las páginas suscritas
function guardarYAvisar(avisar) {
  const seGuardo = guardarVideojuegos(videojuegos);
  if (!seGuardo) manejadorErrorGuardado();
  if (avisar) escuchas.forEach((escucha) => escucha(videojuegos));
}

// Quita un juego del catálogo y guarda. Devuelve false si no se pudo guardar; en ese caso el catálogo queda como estaba.
// No la uses desde controladores ni vistas: la eliminación completa (biblioteca, portada…) es eliminarVideojuegoGlobal.
export function eliminarVideojuego(id) {
  const restantes = videojuegos.filter((videojuego) => videojuego.id !== String(id));
  if (!guardarVideojuegos(restantes)) return false;
  videojuegos = restantes;
  escuchas.forEach((escucha) => escucha(videojuegos)); // las páginas se vuelven a dibujar
  return true;
}

// Crea un id que no exista todavía
function crearId() {
  let id = "";
  do {
    id = "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  } while (obtenerVideojuego(id));
  return id;
}

// Agrega un juego al catálogo de la tienda (no lo agrega a la biblioteca: para eso hay que comprarlo)
export function agregarVideojuego(datos) {
  const videojuego = crearVideojuego({ ...datos, id: crearId(), esNuevo: true, favorito: false, ultimaVezJugado: 0 });
  videojuegos = [...videojuegos, videojuego];
  guardarYAvisar(true);
  return videojuego;
}

// Mezcla los cambios con el juego original (mismo id): lo que no se envía se conserva
export function actualizarVideojuego(id, cambios, avisar = true) {
  const actual = obtenerVideojuego(id);
  if (!actual) return null;

  const actualizado = crearVideojuego({ ...actual, ...cambios, id: actual.id });
  videojuegos = videojuegos.map((videojuego) => (videojuego.id === actual.id ? actualizado : videojuego));
  guardarYAvisar(avisar);
  return actualizado;
}

