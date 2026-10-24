// Único lugar que usa localStorage y sessionStorage.
// Los datos se quedan en este navegador: no se sincronizan entre dispositivos.
// Las claves conservan su nombre original para no perder lo que ya estaba guardado.
const CLAVE_VIDEOJUEGOS = "gamevault:games";
const VERSION_DATOS = 3; // 1: propiedades en inglés · 2: en español · 3: sin el dato «enBiblioteca» (ahora hay una biblioteca aparte)
const CLAVE_BIBLIOTECA = "gamevault:library";
const VERSION_BIBLIOTECA = 1;
const CLAVE_MENSAJE = "gamevault:pending-message";

// ---------- Videojuegos (localStorage) ----------

// Si los datos están dañados, se guarda una copia por si se quieren recuperar
function guardarCopiaDeDatosDanados(textoOriginal) {
  try {
    localStorage.setItem(CLAVE_VIDEOJUEGOS + ":corrupt", textoOriginal);
  } catch (error) {
    // Sin espacio o sin permiso: no se puede hacer nada más
  }
}

// Devuelve la lista guardada, o null si no hay datos (primera visita) o no se pueden leer.
// Esta función nunca guarda nada, así que no puede borrar datos existentes.
export function cargarVideojuegos() {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_VIDEOJUEGOS);
    if (textoGuardado === null) return null;

    let datos;
    try {
      datos = JSON.parse(textoGuardado);
    } catch (error) {
      guardarCopiaDeDatosDanados(textoGuardado);
      return null;
    }

    // Formato actual: { version, games }. Formato antiguo: un arreglo simple.
    // (ModeloVideojuego convierte los nombres de propiedades en inglés de versiones anteriores)
    if (Array.isArray(datos)) return datos;
    if (datos && Array.isArray(datos.games)) return datos.games;

    guardarCopiaDeDatosDanados(textoGuardado);
    return null;
  } catch (error) {
    console.error("GameVault: no se pudo leer el almacenamiento", error);
    return null;
  }
}

// Devuelve true si se guardó bien
export function guardarVideojuegos(videojuegos) {
  try {
    localStorage.setItem(CLAVE_VIDEOJUEGOS, JSON.stringify({ version: VERSION_DATOS, games: videojuegos }));
    return true;
  } catch (error) {
    console.error("GameVault: no se pudo guardar", error);
    return false;
  }
}

// ---------- Biblioteca del usuario (localStorage): solo ids de videojuegos ----------

// Devuelve la lista de ids guardada, o null si todavía no existe
export function cargarBiblioteca() {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_BIBLIOTECA);
    if (textoGuardado === null) return null;

    const datos = JSON.parse(textoGuardado);
    if (datos && Array.isArray(datos.ids)) return datos.ids;
    return null;
  } catch (error) {
    console.error("GameVault: no se pudo leer la biblioteca", error);
    return null;
  }
}

// Devuelve true si se guardó bien
export function guardarBiblioteca(ids) {
  try {
    localStorage.setItem(CLAVE_BIBLIOTECA, JSON.stringify({ version: VERSION_BIBLIOTECA, ids: ids }));
    return true;
  } catch (error) {
    console.error("GameVault: no se pudo guardar la biblioteca", error);
    return false;
  }
}

// ---------- Mensaje para la página siguiente (sessionStorage) ----------

export function guardarMensajeSiguientePagina(mensaje) {
  try {
    sessionStorage.setItem(CLAVE_MENSAJE, mensaje);
  } catch (error) {
    // Si no se puede guardar, simplemente no se muestra el aviso
  }
}

// Devuelve el mensaje pendiente (y lo borra), o "" si no hay
export function tomarMensajeSiguientePagina() {
  try {
    const mensaje = sessionStorage.getItem(CLAVE_MENSAJE);
    sessionStorage.removeItem(CLAVE_MENSAJE);
    return mensaje || "";
  } catch (error) {
    return "";
  }
}
