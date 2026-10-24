// Iconos SVG: se definen una vez y se reutilizan con <use>
const ICONOS = {
  "i-inicio": '<path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" />',
  "i-tienda": '<path d="M4 8h16l-1 12H5L4 8Z" /><path d="m7 8 1-4h8l1 4" />',
  "i-biblioteca": '<path d="M5 4h4v16H5zM10 4h4v16h-4zM16 5l3-1 3 15-3 1z" />',
  "i-usuario": '<circle cx="12" cy="8" r="4" /><path d="M4 21c.7-4 3.3-6 8-6s7.3 2 8 6" />',
  "i-buscar": '<circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />',
  "i-flecha": '<path d="m9 18 6-6-6-6" />',
  "i-volver": '<path d="m15 18-6-6 6-6" /><path d="M9 12h11" />',
  "i-mas": '<path d="M12 5v14M5 12h14" />',
  "i-puntos": '<circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />',
  "i-jugar": '<path d="m8 5 11 7-11 7V5Z" />',
  "i-corazon": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />',
  "i-confirmar": '<path d="m5 12 4 4L19 6" />',
  "i-cerrar": '<path d="m6 6 12 12M18 6 6 18" />',
  "i-basura": '<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" /><path d="M10 11v5M14 11v5" />',
  "i-editar": '<path d="m4 16-1 5 5-1L19 9l-4-4L4 16Z" /><path d="m13 7 4 4" />',
  "i-ojo": '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" />',
  "i-filtro": '<path d="M4 6h16M7 12h10M10 18h4" />',
};

// icono("i-jugar") -> el icono listo para poner dentro de un botón
export function icono(nombre) {
  return `<svg class="ic"><use href="#${nombre}"/></svg>`;
}

// Inserta todos los iconos en la página (una sola vez por página)
export function insertarIconos() {
  let simbolos = "";
  for (const nombre of Object.keys(ICONOS)) {
    simbolos += `<symbol id="${nombre}" viewBox="0 0 24 24">${ICONOS[nombre]}</symbol>`;
  }
  document.body.insertAdjacentHTML("afterbegin", `<svg class="sprite" aria-hidden="true">${simbolos}</svg>`);
}
