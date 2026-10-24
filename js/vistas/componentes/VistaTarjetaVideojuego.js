// Vista de las tarjetas de videojuegos: una sola función para Inicio, Tienda, Favoritos y Biblioteca
import { escaparHtml } from "../../auxiliares/dom.js";
import { darFormatoPrecio, claseDeEstado, portadaDe } from "../../auxiliares/formato.js";
import { urlVideojuego } from "../../auxiliares/navegacion.js";
import { icono } from "./iconos.js";

// Tarjeta pequeña de Inicio
function tarjetaCompacta(videojuego) {
  return `
    <article class="game-card compact">
      <a class="cover-button" href="${urlVideojuego("detalles_videojuego.html", videojuego.id)}" aria-label="Ver ${escaparHtml(videojuego.nombre)}"><img src="${escaparHtml(portadaDe(videojuego))}" alt="" loading="lazy" /></a>
      <div class="card-content"><div><p>${escaparHtml(videojuego.genero)}</p><h3>${escaparHtml(videojuego.nombre)}</h3></div>
        <div class="card-bottom"><strong>${darFormatoPrecio(videojuego.precio)}</strong></div></div>
    </article>`;
}

// Tarjeta de Tienda y Favoritos
function tarjetaTienda(videojuego) {
  return `
    <article class="game-card">
      <a class="cover-button" href="${urlVideojuego("detalles_videojuego.html", videojuego.id)}" aria-label="Ver ${escaparHtml(videojuego.nombre)}"><img src="${escaparHtml(portadaDe(videojuego))}" alt="" loading="lazy" /></a>
      <div class="card-content"><div><p>${escaparHtml(videojuego.genero)}</p><h3>${escaparHtml(videojuego.nombre)}</h3></div>
        <div class="card-bottom"><strong>${darFormatoPrecio(videojuego.precio)}</strong>
          <button type="button" class="btn btn-secondary" data-accion="comprar" data-id="${escaparHtml(videojuego.id)}">Comprar</button></div>
        <a class="detail-link" href="${urlVideojuego("detalles_videojuego.html", videojuego.id)}">Ver detalles ${icono("i-flecha")}</a></div>
    </article>`;
}

// Tarjeta de la Biblioteca (con menú de opciones y botón Jugar)
function tarjetaBiblioteca(videojuego) {
  const id = escaparHtml(videojuego.id);
  let textoJugar = "Jugar";
  if (videojuego.estado === "Jugando") textoJugar = "Jugando";

  return `
    <article class="library-card"><img src="${escaparHtml(portadaDe(videojuego))}" alt="" loading="lazy" />
      <div class="library-card-content">
        <div class="library-card-head">
          <div><p>${escaparHtml(videojuego.genero)}</p><h3>${escaparHtml(videojuego.nombre)}</h3></div>
          <details class="menu-wrap"><summary class="icon-button" aria-label="Opciones de ${escaparHtml(videojuego.nombre)}">${icono("i-puntos")}</summary>
            <div class="context-menu">
              <a href="${urlVideojuego("editar_videojuego.html", videojuego.id)}">${icono("i-editar")}Editar</a>
              <a href="${urlVideojuego("detalles_videojuego.html", videojuego.id)}">${icono("i-ojo")}Ver detalles</a>
              <button type="button" class="danger" data-accion="eliminar" data-id="${id}">${icono("i-basura")}Eliminar</button>
            </div></details>
        </div>
        <span class="status ${claseDeEstado(videojuego.estado)}"><i></i>${escaparHtml(videojuego.estado)}</span>
        <button type="button" class="btn btn-secondary" data-accion="jugar" data-id="${id}">${icono("i-jugar")}${textoJugar}</button>
      </div>
    </article>`;
}

// variante puede ser "compacta" (Inicio), "tienda" (Tienda y Favoritos) o "biblioteca" (Biblioteca)
export function mostrarTarjetaVideojuego(videojuego, variante) {
  if (variante === "compacta") return tarjetaCompacta(videojuego);
  if (variante === "biblioteca") return tarjetaBiblioteca(videojuego);
  return tarjetaTienda(videojuego);
}

// Dibuja una lista de tarjetas del mismo tipo
export function mostrarTarjetas(videojuegos, variante) {
  return videojuegos.map((videojuego) => mostrarTarjetaVideojuego(videojuego, variante)).join("");
}
