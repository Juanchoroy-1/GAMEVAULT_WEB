// Vista de los avisos (toast) de éxito o error. El aviso está escrito en el HTML de cada página (<div class="toast">).
import { buscar } from "../../auxiliares/dom.js";
import { guardarMensajeSiguientePagina, tomarMensajeSiguientePagina } from "../../auxiliares/almacenamiento.js";

let temporizador = null;

// tipo puede ser "exito" (por defecto) o "error"
export function mostrarNotificacion(mensaje, tipo = "exito") {
  const aviso = buscar(".toast");
  const esError = tipo === "error";

  aviso.classList.toggle("toast-error", esError);
  buscar("use", aviso).setAttribute("href", esError ? "#i-cerrar" : "#i-confirmar");
  buscar("b", aviso).textContent = mensaje;
  aviso.hidden = false;

  clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    aviso.hidden = true;
  }, 2600);
}

// Deja un aviso para mostrarlo en la página siguiente (por ejemplo, después de guardar un juego)
export function avisarEnPaginaSiguiente(mensaje) {
  guardarMensajeSiguientePagina(mensaje);
}

// Se llama al cargar cada página: muestra el aviso pendiente, si hay uno
export function mostrarAvisoPendiente() {
  const mensaje = tomarMensajeSiguientePagina();
  if (mensaje !== "") mostrarNotificacion(mensaje);
}
