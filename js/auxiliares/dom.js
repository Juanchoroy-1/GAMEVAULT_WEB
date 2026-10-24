// Operaciones comunes con el DOM

// Busca un elemento
export function buscar(selector, raiz = document) {
  return raiz.querySelector(selector);
}

// Busca varios elementos y los devuelve en un arreglo
export function buscarTodos(selector, raiz = document) {
  return Array.from(raiz.querySelectorAll(selector));
}

const CARACTERES_HTML = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// Convierte el texto del usuario en texto seguro antes de insertarlo como HTML
export function escaparHtml(valor) {
  const texto = String(valor ?? "");
  return texto.replace(/[&<>"']/g, (caracter) => CARACTERES_HTML[caracter]);
}
