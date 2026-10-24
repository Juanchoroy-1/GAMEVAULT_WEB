// Lectura de la barra de búsqueda, filtros y orden. La barra está escrita en el HTML de cada página (<div class="filters">).
import { buscar } from "../../auxiliares/dom.js";

// Lee lo que el usuario escribió o eligió en la barra (no todas las páginas tienen todos los controles)
export function leerControlesFiltros() {
  const valorDe = (nombre) => buscar(`.filters [name="${nombre}"]`)?.value ?? "";
  return {
    consulta: valorDe("busqueda").trim(),
    genero: valorDe("genero"),
    plataforma: valorDe("plataforma"),
    precio: valorDe("precio"),
    estado: valorDe("estado"),
    orden: valorDe("orden") || "nombre",
  };
}

// Llama a alCambiar cada vez que el usuario escribe o cambia un filtro
export function alCambiarFiltros(alCambiar) {
  buscar(".filters")?.addEventListener("input", alCambiar);
}
