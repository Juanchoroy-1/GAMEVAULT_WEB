// Modelo de la biblioteca: guarda solo los ids de los juegos del catálogo que el usuario posee.
// Los datos de cada juego siguen en el catálogo (ModeloVideojuego.js), así no se duplican.
import { BIBLIOTECA_INICIAL } from "./datosVideojuegos.js";
import { obtenerVideojuegos } from "./ModeloVideojuego.js";
import { cargarVideojuegos, cargarBiblioteca, guardarBiblioteca } from "../auxiliares/almacenamiento.js";

let idsBiblioteca = [];

// Las versiones anteriores guardaban en cada juego si estaba en la biblioteca
// («enBiblioteca», y antes «owned»). Esta función lo lee para no perder esa información.
function idsDesdeDatosAnteriores(datosCrudos) {
  const ids = [];
  for (const dato of datosCrudos) {
    let perteneceABiblioteca = dato.enBiblioteca;
    if (perteneceABiblioteca === undefined) perteneceABiblioteca = dato.owned;
    if (perteneceABiblioteca !== false) ids.push(String(dato.id));
  }
  return ids;
}

// Se llama una vez al cargar cada página, después de iniciar el catálogo
export function iniciarBiblioteca() {
  const idsGuardados = cargarBiblioteca();
  if (idsGuardados !== null) {
    idsBiblioteca = idsGuardados.map(String);
    return;
  }

  // Todavía no existe la biblioteca guardada: primera visita o datos de una versión anterior
  const datosCrudos = cargarVideojuegos();
  if (datosCrudos === null) {
    idsBiblioteca = [...BIBLIOTECA_INICIAL];
  } else {
    idsBiblioteca = idsDesdeDatosAnteriores(datosCrudos);
  }
  guardarBiblioteca(idsBiblioteca); // se guarda ya, para no depender de los datos antiguos
}

export function estaEnBiblioteca(id) {
  return idsBiblioteca.includes(String(id));
}

// Los videojuegos de la biblioteca (datos tomados del catálogo)
export function obtenerJuegosDeBiblioteca() {
  return obtenerVideojuegos().filter((videojuego) => estaEnBiblioteca(videojuego.id));
}

// Quita un id de la biblioteca guardada. Devuelve false si no se pudo guardar; en ese caso la biblioteca queda como estaba.
// Solo la usa eliminarVideojuegoGlobal: la interfaz no ofrece «retirar de la biblioteca» sin eliminar el juego.
export function quitarDeBiblioteca(id) {
  if (!estaEnBiblioteca(id)) return true;
  const restantes = idsBiblioteca.filter((idGuardado) => idGuardado !== String(id));
  if (!guardarBiblioteca(restantes)) return false;
  idsBiblioteca = restantes;
  return true;
}

// Agrega un juego del catálogo a la biblioteca. Devuelve false si no se pudo guardar.
export function agregarABiblioteca(id) {
  if (estaEnBiblioteca(id)) return true;
  idsBiblioteca = [...idsBiblioteca, String(id)];
  return guardarBiblioteca(idsBiblioteca);
}
