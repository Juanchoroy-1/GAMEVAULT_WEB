// Portadas elegidas por el usuario: validación y almacenamiento en IndexedDB.
// El navegador no puede escribir en las carpetas del proyecto, así que el archivo de imagen se guarda en IndexedDB
// y el videojuego solo conserva una referencia estable («idb:» + id). Nunca se guardan Base64 ni rutas blob:.
// Los videojuegos con portada en una carpeta del proyecto («assets/…») o con una URL antigua no pasan por aquí.

export const LIMITE_IMAGEN_MB = 2; // tamaño máximo de una portada (configurable)
export const PREFIJO_IMAGEN_LOCAL = "idb:";

const TIPOS_PERMITIDOS = { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"], "image/gif": ["gif"], "image/avif": ["avif"] };
const NOMBRE_BASE = "gamevault-imagenes";
const NOMBRE_ALMACEN = "portadas";
const urlsDeImagenes = new Map(); // id -> dirección temporal (blob:) para mostrar la imagen; vive solo en esta página

// ---------- Validación ----------

// Devuelve el mensaje de error, o "" si el archivo sirve como portada
export async function validarImagen(archivo) {
  const extension = archivo.name.split(".").pop().toLowerCase();
  if (!(TIPOS_PERMITIDOS[archivo.type] || []).includes(extension)) {
    return "El archivo no es una imagen válida. Usa JPG, PNG, WEBP, GIF o AVIF.";
  }
  if (archivo.size > LIMITE_IMAGEN_MB * 1024 * 1024) {
    return `La imagen pesa ${(archivo.size / 1048576).toFixed(1)} MB y el máximo es ${LIMITE_IMAGEN_MB} MB.`;
  }
  try {
    (await createImageBitmap(archivo)).close(); // comprueba que el navegador realmente puede abrirla
  } catch (error) {
    return "No se pudo leer la imagen: el archivo está dañado o no es una imagen.";
  }
  return "";
}

// ---------- IndexedDB ----------

// Abre la base, ejecuta una operación sobre el almacén y devuelve su resultado cuando la transacción termina
async function usarAlmacen(modo, operacion) {
  const base = await new Promise((resolver, rechazar) => {
    const peticion = indexedDB.open(NOMBRE_BASE, 1);
    peticion.onupgradeneeded = () => peticion.result.createObjectStore(NOMBRE_ALMACEN, { keyPath: "id" });
    peticion.onsuccess = () => resolver(peticion.result);
    peticion.onerror = () => rechazar(peticion.error);
  });
  return new Promise((resolver, rechazar) => {
    const transaccion = base.transaction(NOMBRE_ALMACEN, modo);
    const peticion = operacion(transaccion.objectStore(NOMBRE_ALMACEN));
    transaccion.oncomplete = () => { base.close(); resolver(peticion.result); };
    transaccion.onerror = transaccion.onabort = () => { base.close(); rechazar(transaccion.error); };
  });
}

// Se llama una vez al cargar cada página, antes de dibujar portadas. Si IndexedDB no está disponible, la app sigue funcionando.
export async function cargarImagenesLocales() {
  try {
    for (const registro of await usarAlmacen("readonly", (almacen) => almacen.getAll())) {
      urlsDeImagenes.set(registro.id, URL.createObjectURL(registro.archivo));
    }
  } catch (error) {
    console.warn("GameVault: no se pudieron leer las imágenes guardadas (¿IndexedDB no está disponible?)", error);
  }
}

// Dirección para mostrar una referencia «idb:…», o undefined si esa imagen ya no existe
export function urlDeImagenLocal(referencia) {
  return urlsDeImagenes.get(referencia.slice(PREFIJO_IMAGEN_LOCAL.length));
}

// Guarda el archivo y devuelve la referencia estable para el videojuego. Lanza un error si no se pudo guardar.
export async function guardarImagen(archivo) {
  const id = "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  await usarAlmacen("readwrite", (almacen) => almacen.put({ id, archivo }));
  urlsDeImagenes.set(id, URL.createObjectURL(archivo));
  return PREFIJO_IMAGEN_LOCAL + id;
}

// Borra una portada que ya no usa ningún juego (se ignoran las referencias que no son «idb:…»)
export async function borrarImagen(referencia) {
  if (!referencia.startsWith(PREFIJO_IMAGEN_LOCAL)) return;
  const id = referencia.slice(PREFIJO_IMAGEN_LOCAL.length);
  try {
    await usarAlmacen("readwrite", (almacen) => almacen.delete(id));
    URL.revokeObjectURL(urlsDeImagenes.get(id));
    urlsDeImagenes.delete(id);
  } catch (error) {
    console.warn("GameVault: no se pudo borrar la imagen anterior", error);
  }
}
