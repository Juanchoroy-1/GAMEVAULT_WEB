// Navegación entre las páginas HTML de GameVault

// Lee un parámetro de la URL: detalles_videojuego.html?id=3 -> obtenerParametro("id") devuelve "3"
export function obtenerParametro(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

// urlVideojuego("detalles_videojuego.html", "3") -> "detalles_videojuego.html?id=3"
export function urlVideojuego(pagina, id) {
  return pagina + "?id=" + encodeURIComponent(id);
}

// Abre otra página
export function irA(url) {
  window.location.href = url;
}

// Vuelve a la página anterior. Devuelve false si no hay una (entonces el enlace sigue su camino normal).
export function volverAtras() {
  if (window.history.length > 1) {
    window.history.back();
    return true;
  }
  return false;
}
