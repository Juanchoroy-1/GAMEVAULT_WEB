/* GENERADO por construir.mjs a partir de los módulos de js/. No lo edites a mano. */
(() => {
"use strict";

/* ===== modelos/datosVideojuegos.js ===== */
// Datos iniciales de GameVault. Las opciones de género y plataforma de filtros y formularios están escritas en el HTML.
const ESTADOS = ["Instalado", "No instalado", "Jugando", "Completado"];

// Catálogo de la tienda. principal / destacado / esNuevo indican dónde aparece cada juego en Inicio
const VIDEOJUEGOS_INICIALES = [
  { id: "1", nombre: "Cyberpunk 2077", precio: 159900, genero: "RPG", categoria: "Mundo abierto", desarrollador: "CD Projekt Red", fecha: "10/12/2020", plataforma: "PC", tamano: "70 GB", descripcion: "Una historia de acción y aventura en una megalópolis obsesionada con el poder, el glamour y la modificación corporal.", portada: "https://images.unsplash.com/photo-1668624156054-528565e7efc8?auto=format&fit=crop&w=800&q=80", estado: "Instalado", principal: true },
  { id: "2", nombre: "Grand Theft Auto V", precio: 59900, genero: "Acción", categoria: "Mundo abierto", desarrollador: "Rockstar Games", fecha: "17/09/2013", plataforma: "PC", tamano: "110 GB", descripcion: "Tres criminales arriesgan todo en una serie de peligrosos golpes en una ciudad donde no pueden confiar en nadie.", portada: "https://images.unsplash.com/photo-1708247874023-f6d71a45113a?auto=format&fit=crop&w=800&q=80", estado: "Instalado", destacado: true },
  { id: "3", nombre: "FIFA 24", precio: 109900, genero: "Deportes", categoria: "Simulación", desarrollador: "EA Sports", fecha: "29/09/2023", plataforma: "PC", tamano: "50 GB", descripcion: "Vive el fútbol con clubes, ligas y jugadores de todo el mundo en una experiencia auténtica.", portada: "https://images.unsplash.com/photo-1729158323904-c3147d9138a9?auto=format&fit=crop&w=800&q=80", estado: "No instalado", destacado: true },
  { id: "4", nombre: "Minecraft", precio: 119900, genero: "Aventura", categoria: "Sandbox", desarrollador: "Mojang Studios", fecha: "18/11/2011", plataforma: "PC", tamano: "2 GB", descripcion: "Explora mundos infinitos y construye desde la casa más sencilla hasta el castillo más grandioso.", portada: "https://images.unsplash.com/photo-1788251402421-38cec6b02f96?auto=format&fit=crop&w=800&q=80", estado: "Jugando", destacado: true },
  { id: "5", nombre: "Forza Horizon 5", precio: 199900, genero: "Carreras", categoria: "Mundo abierto", desarrollador: "Playground Games", fecha: "05/11/2021", plataforma: "PC", tamano: "110 GB", descripcion: "Lidera expediciones por paisajes vibrantes en cientos de los mejores vehículos del mundo.", portada: "https://images.unsplash.com/photo-1679590373888-9363db416357?auto=format&fit=crop&w=800&q=80", estado: "Completado", destacado: true, esNuevo: true },
  { id: "6", nombre: "Elden Ring", precio: 219900, genero: "RPG", categoria: "Fantasía", desarrollador: "FromSoftware", fecha: "25/02/2022", plataforma: "PC", tamano: "60 GB", descripcion: "Levántate, Sinluz, y recorre las Tierras Intermedias para convertirte en el Señor del Círculo.", portada: "https://images.unsplash.com/photo-1645300041147-769f0a6bb778?auto=format&fit=crop&w=800&q=80", estado: "No instalado", esNuevo: true },
  { id: "7", nombre: "Night Circuit", precio: 89900, genero: "Carreras", categoria: "Arcade", desarrollador: "Neon Works", fecha: "12/03/2024", plataforma: "PC", tamano: "38 GB", descripcion: "Compite en circuitos nocturnos donde cada curva cambia la carrera.", portada: "https://images.unsplash.com/photo-1682079809978-559f47823e87?auto=format&fit=crop&w=800&q=80", estado: "No instalado", esNuevo: true },
  { id: "8", nombre: "Silent District", precio: 74900, genero: "Acción", categoria: "Sigilo", desarrollador: "North Studio", fecha: "28/06/2024", plataforma: "PC", tamano: "42 GB", descripcion: "Infiltra una ciudad aislada y descubre quién controla sus calles.", portada: "https://images.unsplash.com/photo-1700257992019-0cd5995be606?auto=format&fit=crop&w=800&q=80", estado: "No instalado", esNuevo: true },
];

// Biblioteca del usuario: solo guarda los ids de los juegos del catálogo que ya posee
const BIBLIOTECA_INICIAL = ["1", "2", "3", "4", "5", "6"];

/* ===== auxiliares/almacenamiento.js ===== */
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
function cargarVideojuegos() {
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
function guardarVideojuegos(videojuegos) {
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
function cargarBiblioteca() {
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
function guardarBiblioteca(ids) {
  try {
    localStorage.setItem(CLAVE_BIBLIOTECA, JSON.stringify({ version: VERSION_BIBLIOTECA, ids: ids }));
    return true;
  } catch (error) {
    console.error("GameVault: no se pudo guardar la biblioteca", error);
    return false;
  }
}

// ---------- Mensaje para la página siguiente (sessionStorage) ----------

function guardarMensajeSiguientePagina(mensaje) {
  try {
    sessionStorage.setItem(CLAVE_MENSAJE, mensaje);
  } catch (error) {
    // Si no se puede guardar, simplemente no se muestra el aviso
  }
}

// Devuelve el mensaje pendiente (y lo borra), o "" si no hay
function tomarMensajeSiguientePagina() {
  try {
    const mensaje = sessionStorage.getItem(CLAVE_MENSAJE);
    sessionStorage.removeItem(CLAVE_MENSAJE);
    return mensaje || "";
  } catch (error) {
    return "";
  }
}

/* ===== modelos/ModeloVideojuego.js ===== */
// Modelo de videojuego: define cómo es un videojuego y gestiona el CATÁLOGO de la tienda.
// Qué juegos posee el usuario se guarda aparte, en ModeloBiblioteca.js.


let videojuegos = [];
let escuchas = [];
let manejadorErrorGuardado = function () {};

// Las páginas se suscriben para volver a dibujarse cuando cambian los datos
function alCambiarVideojuegos(escucha) {
  escuchas.push(escucha);
}

// Se ejecuta si no se pudo guardar en el navegador
function alFallarGuardado(manejador) {
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
function crearVideojuego(datos) {
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
function iniciarVideojuegos() {
  const guardados = cargarVideojuegos();
  let origen = VIDEOJUEGOS_INICIALES;
  if (guardados !== null) origen = guardados;
  videojuegos = origen.map(crearVideojuego).filter((videojuego) => videojuego.id !== "" && videojuego.nombre !== "");
}

function obtenerVideojuegos() {
  return videojuegos;
}

function obtenerVideojuego(id) {
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
function eliminarVideojuego(id) {
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
function agregarVideojuego(datos) {
  const videojuego = crearVideojuego({ ...datos, id: crearId(), esNuevo: true, favorito: false, ultimaVezJugado: 0 });
  videojuegos = [...videojuegos, videojuego];
  guardarYAvisar(true);
  return videojuego;
}

// Mezcla los cambios con el juego original (mismo id): lo que no se envía se conserva
function actualizarVideojuego(id, cambios, avisar = true) {
  const actual = obtenerVideojuego(id);
  if (!actual) return null;

  const actualizado = crearVideojuego({ ...actual, ...cambios, id: actual.id });
  videojuegos = videojuegos.map((videojuego) => (videojuego.id === actual.id ? actualizado : videojuego));
  guardarYAvisar(avisar);
  return actualizado;
}

/* ===== modelos/ModeloBiblioteca.js ===== */
// Modelo de la biblioteca: guarda solo los ids de los juegos del catálogo que el usuario posee.
// Los datos de cada juego siguen en el catálogo (ModeloVideojuego.js), así no se duplican.



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
function iniciarBiblioteca() {
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

function estaEnBiblioteca(id) {
  return idsBiblioteca.includes(String(id));
}

// Los videojuegos de la biblioteca (datos tomados del catálogo)
function obtenerJuegosDeBiblioteca() {
  return obtenerVideojuegos().filter((videojuego) => estaEnBiblioteca(videojuego.id));
}

// Quita un id de la biblioteca guardada. Devuelve false si no se pudo guardar; en ese caso la biblioteca queda como estaba.
// Solo la usa eliminarVideojuegoGlobal: la interfaz no ofrece «retirar de la biblioteca» sin eliminar el juego.
function quitarDeBiblioteca(id) {
  if (!estaEnBiblioteca(id)) return true;
  const restantes = idsBiblioteca.filter((idGuardado) => idGuardado !== String(id));
  if (!guardarBiblioteca(restantes)) return false;
  idsBiblioteca = restantes;
  return true;
}

// Agrega un juego del catálogo a la biblioteca. Devuelve false si no se pudo guardar.
function agregarABiblioteca(id) {
  if (estaEnBiblioteca(id)) return true;
  idsBiblioteca = [...idsBiblioteca, String(id)];
  return guardarBiblioteca(idsBiblioteca);
}

/* ===== auxiliares/imagenesLocales.js ===== */
// Portadas elegidas por el usuario: validación y almacenamiento en IndexedDB.
// El navegador no puede escribir en las carpetas del proyecto, así que el archivo de imagen se guarda en IndexedDB
// y el videojuego solo conserva una referencia estable («idb:» + id). Nunca se guardan Base64 ni rutas blob:.
// Los videojuegos con portada en una carpeta del proyecto («assets/…») o con una URL antigua no pasan por aquí.

const LIMITE_IMAGEN_MB = 2; // tamaño máximo de una portada (configurable)
const PREFIJO_IMAGEN_LOCAL = "idb:";

const TIPOS_PERMITIDOS = { "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"], "image/gif": ["gif"], "image/avif": ["avif"] };
const NOMBRE_BASE = "gamevault-imagenes";
const NOMBRE_ALMACEN = "portadas";
const urlsDeImagenes = new Map(); // id -> dirección temporal (blob:) para mostrar la imagen; vive solo en esta página

// ---------- Validación ----------

// Devuelve el mensaje de error, o "" si el archivo sirve como portada
async function validarImagen(archivo) {
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
async function cargarImagenesLocales() {
  try {
    for (const registro of await usarAlmacen("readonly", (almacen) => almacen.getAll())) {
      urlsDeImagenes.set(registro.id, URL.createObjectURL(registro.archivo));
    }
  } catch (error) {
    console.warn("GameVault: no se pudieron leer las imágenes guardadas (¿IndexedDB no está disponible?)", error);
  }
}

// Dirección para mostrar una referencia «idb:…», o undefined si esa imagen ya no existe
function urlDeImagenLocal(referencia) {
  return urlsDeImagenes.get(referencia.slice(PREFIJO_IMAGEN_LOCAL.length));
}

// Guarda el archivo y devuelve la referencia estable para el videojuego. Lanza un error si no se pudo guardar.
async function guardarImagen(archivo) {
  const id = "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  await usarAlmacen("readwrite", (almacen) => almacen.put({ id, archivo }));
  urlsDeImagenes.set(id, URL.createObjectURL(archivo));
  return PREFIJO_IMAGEN_LOCAL + id;
}

// Borra una portada que ya no usa ningún juego (se ignoran las referencias que no son «idb:…»)
async function borrarImagen(referencia) {
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

/* ===== auxiliares/formato.js ===== */
// Funciones para dar formato a los valores que se muestran

// Portada que se usa cuando un juego no tiene imagen o la imagen no carga (todas las páginas están en paginas/)
const IMAGEN_PROVISIONAL = "../assets/imagenes/predeterminada.svg";

// 159900 -> "$159.900"
function darFormatoPrecio(precio) {
  const digitos = String(Math.round(precio));
  const conPuntos = digitos.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "$" + conPuntos;
}

// "No instalado" -> "status-no-instalado" (clase CSS del estado)
function claseDeEstado(estado) {
  return "status-" + estado.toLowerCase().replace(/\s+/g, "-");
}

// Dirección de la portada de un juego según dónde esté guardada:
// «idb:…» (elegida en el formulario, guardada en el navegador), «assets/…» (archivo del proyecto) o una URL antigua.
function portadaDe(videojuego) {
  const ruta = videojuego.portada;
  if (ruta.startsWith(PREFIJO_IMAGEN_LOCAL)) return urlDeImagenLocal(ruta) || IMAGEN_PROVISIONAL;
  if (ruta.startsWith("assets/")) return "../" + ruta;
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return IMAGEN_PROVISIONAL; // vacía o con un formato que no sirve (por ejemplo un blob: antiguo)
}

// Versión grande de la portada para la imagen destacada de Inicio (solo cambia las URLs de Unsplash)
function portadaGrandeDe(videojuego) {
  return portadaDe(videojuego).replace("w=800&q=80", "w=1200&q=85");
}

/* ===== vistas/componentes/iconos.js ===== */
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
function icono(nombre) {
  return `<svg class="ic"><use href="#${nombre}"/></svg>`;
}

// Inserta todos los iconos en la página (una sola vez por página)
function insertarIconos() {
  let simbolos = "";
  for (const nombre of Object.keys(ICONOS)) {
    simbolos += `<symbol id="${nombre}" viewBox="0 0 24 24">${ICONOS[nombre]}</symbol>`;
  }
  document.body.insertAdjacentHTML("afterbegin", `<svg class="sprite" aria-hidden="true">${simbolos}</svg>`);
}

/* ===== auxiliares/dom.js ===== */
// Operaciones comunes con el DOM

// Busca un elemento
function buscar(selector, raiz = document) {
  return raiz.querySelector(selector);
}

// Busca varios elementos y los devuelve en un arreglo
function buscarTodos(selector, raiz = document) {
  return Array.from(raiz.querySelectorAll(selector));
}

const CARACTERES_HTML = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// Convierte el texto del usuario en texto seguro antes de insertarlo como HTML
function escaparHtml(valor) {
  const texto = String(valor ?? "");
  return texto.replace(/[&<>"']/g, (caracter) => CARACTERES_HTML[caracter]);
}

/* ===== vistas/componentes/VistaNotificacion.js ===== */
// Vista de los avisos (toast) de éxito o error. El aviso está escrito en el HTML de cada página (<div class="toast">).


let temporizador = null;

// tipo puede ser "exito" (por defecto) o "error"
function mostrarNotificacion(mensaje, tipo = "exito") {
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
function avisarEnPaginaSiguiente(mensaje) {
  guardarMensajeSiguientePagina(mensaje);
}

// Se llama al cargar cada página: muestra el aviso pendiente, si hay uno
function mostrarAvisoPendiente() {
  const mensaje = tomarMensajeSiguientePagina();
  if (mensaje !== "") mostrarNotificacion(mensaje);
}

/* ===== auxiliares/navegacion.js ===== */
// Navegación entre las páginas HTML de GameVault

// Lee un parámetro de la URL: detalles_videojuego.html?id=3 -> obtenerParametro("id") devuelve "3"
function obtenerParametro(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

// urlVideojuego("detalles_videojuego.html", "3") -> "detalles_videojuego.html?id=3"
function urlVideojuego(pagina, id) {
  return pagina + "?id=" + encodeURIComponent(id);
}

// Abre otra página
function irA(url) {
  window.location.href = url;
}

// Vuelve a la página anterior. Devuelve false si no hay una (entonces el enlace sigue su camino normal).
function volverAtras() {
  if (window.history.length > 1) {
    window.history.back();
    return true;
  }
  return false;
}

/* ===== vistas/componentes/VistaTarjetaVideojuego.js ===== */
// Vista de las tarjetas de videojuegos: una sola función para Inicio, Tienda, Favoritos y Biblioteca




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
function mostrarTarjetaVideojuego(videojuego, variante) {
  if (variante === "compacta") return tarjetaCompacta(videojuego);
  if (variante === "biblioteca") return tarjetaBiblioteca(videojuego);
  return tarjetaTienda(videojuego);
}

// Dibuja una lista de tarjetas del mismo tipo
function mostrarTarjetas(videojuegos, variante) {
  return videojuegos.map((videojuego) => mostrarTarjetaVideojuego(videojuego, variante)).join("");
}

/* ===== vistas/VistaInicio.js ===== */
// Vista de la página de inicio



// Dibuja una fila de tarjetas; si no hay juegos, oculta toda la sección
function dibujarFila(selector, videojuegos) {
  const fila = buscar(selector);
  fila.innerHTML = mostrarTarjetas(videojuegos, "compacta");
  fila.closest("section").hidden = videojuegos.length === 0;
}

// La imagen destacada está escrita en el HTML: aquí solo se escriben los datos del juego
function dibujarPrincipal(videojuego) {
  const principal = buscar("#inicio-principal");
  principal.hidden = !videojuego;
  if (!videojuego) return;

  buscar("img", principal).src = portadaGrandeDe(videojuego);
  buscar("h1", principal).textContent = videojuego.nombre;
  buscar("p", principal).textContent = videojuego.descripcion;
  buscar("strong", principal).textContent = darFormatoPrecio(videojuego.precio);
  buscar("button", principal).dataset.id = videojuego.id;
}

function mostrarInicio(videojuegoPrincipal, destacados, nuevos, hayVideojuegos) {
  dibujarPrincipal(videojuegoPrincipal);
  dibujarFila("#inicio-destacados", destacados);
  dibujarFila("#inicio-nuevos", nuevos);
  buscar("#inicio-vacio").hidden = hayVideojuegos;
}

/* ===== controladores/ControladorInicio.js ===== */
// Controlador de la página de inicio


function actualizarInicio() {
  const videojuegos = obtenerVideojuegos();

  // Imagen destacada: el juego marcado como principal, o el primero si ese ya no existe
  let videojuegoPrincipal = videojuegos.find((videojuego) => videojuego.principal);
  if (!videojuegoPrincipal) videojuegoPrincipal = videojuegos[0];

  const destacados = videojuegos.filter((videojuego) => videojuego.destacado).slice(0, 4);
  const nuevos = videojuegos.filter((videojuego) => videojuego.esNuevo).slice(-4); // los 4 más recientes de la lista

  mostrarInicio(videojuegoPrincipal, destacados, nuevos, videojuegos.length > 0);
}

function iniciarControladorInicio() {
  actualizarInicio();
  alCambiarVideojuegos(actualizarInicio);
}

/* ===== auxiliares/filtrosLista.js ===== */
// Búsqueda, filtros y ordenamiento de una lista de videojuegos (funciones puras: no tocan el HTML)
// "controles" es un objeto como { consulta, genero, plataforma, precio, estado, orden }

const LIMITE_PRECIO = 100000; // "Menos de $100.000" y "$100.000 o más"
const comparador = new Intl.Collator("es", { sensitivity: "base" });

// ---------- Búsqueda por nombre (sin distinguir mayúsculas ni acentos) ----------
function simplificar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function coincideConBusqueda(videojuego, consulta) {
  if (consulta === "") return true;
  return simplificar(videojuego.nombre).includes(simplificar(consulta));
}

// ---------- Filtros ----------
function coincideConFiltros(videojuego, controles) {
  if (controles.genero !== "" && videojuego.genero !== controles.genero) return false;
  if (controles.plataforma !== "" && videojuego.plataforma !== controles.plataforma) return false;
  if (controles.estado !== "" && videojuego.estado !== controles.estado) return false;
  if (controles.precio === "bajo" && videojuego.precio >= LIMITE_PRECIO) return false;
  if (controles.precio === "alto" && videojuego.precio < LIMITE_PRECIO) return false;
  return true;
}

// ---------- Ordenamiento ----------
function numeroDeFecha(texto) {
  // "10/12/2020" -> 20201210, así se pueden comparar fechas como números
  const [dia, mes, anio] = texto.split("/").map(Number);
  return (anio || 0) * 10000 + (mes || 0) * 100 + (dia || 0);
}

function compararVideojuegos(a, b, modo) {
  let diferencia = 0;
  if (modo === "precio") diferencia = a.precio - b.precio; // más baratos primero
  if (modo === "fecha") diferencia = numeroDeFecha(b.fecha) - numeroDeFecha(a.fecha); // más recientes primero
  if (modo === "reciente") diferencia = b.ultimaVezJugado - a.ultimaVezJugado; // jugados hace poco primero
  if (diferencia !== 0) return diferencia;
  return comparador.compare(a.nombre, b.nombre); // si hay empate (o el modo es "nombre"), por nombre
}

// ---------- Todo junto ----------
function aplicarControles(videojuegos, controles) {
  const visibles = videojuegos.filter((videojuego) => coincideConBusqueda(videojuego, controles.consulta) && coincideConFiltros(videojuego, controles));
  return visibles.sort((a, b) => compararVideojuegos(a, b, controles.orden));
}

/* ===== vistas/componentes/VistaBarraFiltros.js ===== */
// Lectura de la barra de búsqueda, filtros y orden. La barra está escrita en el HTML de cada página (<div class="filters">).

// Lee lo que el usuario escribió o eligió en la barra (no todas las páginas tienen todos los controles)
function leerControlesFiltros() {
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
function alCambiarFiltros(alCambiar) {
  buscar(".filters")?.addEventListener("input", alCambiar);
}

/* ===== vistas/VistaTienda.js ===== */
// Vista de la tienda


function mostrarTienda(videojuegosVisibles) {
  const total = videojuegosVisibles.length;
  buscar(".store-grid").innerHTML = mostrarTarjetas(videojuegosVisibles, "tienda");
  buscar(".empty").hidden = total > 0;

  let palabra = "juegos";
  if (total === 1) palabra = "juego";
  buscar(".result-count").textContent = `${total} ${palabra}`;
}

/* ===== vistas/VistaFormulario.js ===== */
// Vista del formulario de videojuegos. Los campos están escritos en el HTML (ventana de la tienda y página de editar),
// con sus reglas en atributos (required, pattern, min…) y sus mensajes de error en cada <small>, que muestra CSS.

function obtenerFormulario() {
  return buscar("#formulario-videojuego");
}

// Escribe cada propiedad del juego en el campo que tiene su mismo nombre
function llenarFormulario(videojuego) {
  const formulario = obtenerFormulario();
  for (const [nombre, valor] of Object.entries(videojuego)) {
    if (formulario.elements[nombre]) formulario.elements[nombre].value = valor;
  }
}

// Lo que escribió el usuario, campo por campo: { nombre: "...", precio: "..." } (la imagen se lee aparte)
function leerValoresFormulario() {
  const valores = Object.fromEntries(new FormData(obtenerFormulario()));
  delete valores.imagen;
  return valores;
}

// ---------- Portada: selector de archivo con vista previa (escrito en el HTML) ----------
let urlDeSeleccion = null; // dirección temporal de la imagen elegida; se libera al cambiarla

function leerArchivoImagen() {
  return obtenerFormulario().elements.imagen.files[0];
}

// origen: un archivo recién elegido (File) o la dirección de la portada actual (texto)
function mostrarVistaPrevia(origen) {
  if (urlDeSeleccion) URL.revokeObjectURL(urlDeSeleccion);
  urlDeSeleccion = typeof origen === "string" ? null : URL.createObjectURL(origen);
  buscar(".cover-preview", obtenerFormulario()).src = urlDeSeleccion ?? origen;
}

// mensaje vacío = sin error
function mostrarErrorImagen(mensaje) {
  const aviso = buscar(".cover-error", obtenerFormulario());
  aviso.textContent = mensaje;
  aviso.hidden = mensaje === "";
}

function mostrarLimiteImagen(megabytes) {
  buscar(".cover-limite", obtenerFormulario()).textContent = megabytes;
}

function limpiarSeleccionImagen() {
  obtenerFormulario().elements.imagen.value = "";
}

function reiniciarFormulario(portadaPredeterminada) {
  const formulario = obtenerFormulario();
  formulario.reset();
  formulario.classList.remove("intentado");
  mostrarErrorImagen("");
  mostrarVistaPrevia(portadaPredeterminada);
}

function abrirVentanaFormulario() {
  buscar("#ventana-formulario").showModal();
}

function cerrarVentanaFormulario() {
  buscar("#ventana-formulario").close();
}

function mostrarFormularioNoEncontrado() {
  buscar("#formulario").hidden = true;
  buscar("#formulario-no-encontrado").hidden = false;
}

/* ===== controladores/ControladorFormulario.js ===== */
// Controlador del formulario de videojuegos:
// - agregar: se abre en una ventana dentro de la tienda (botón «Agregar videojuego»)
// - editar: página editar_videojuego.html?id=...
// Las reglas de validación están en los atributos del HTML; aquí solo se comprueba que la fecha exista de verdad.






let idEnEdicion = null; // id del juego que se edita (null cuando se está agregando)
let portadaActual = IMAGEN_PROVISIONAL; // portada que se muestra si no hay un archivo elegido (la del juego, o la de respaldo)

// «31/02/2020» cumple el patrón del HTML (DD/MM/AAAA) pero no existe; tampoco se aceptan fechas muy futuras
function esFechaValida(texto) {
  const [dia, mes, anio] = texto.trim().split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia); // si la fecha no existe, JavaScript la «corrige» y los números ya no coinciden
  const existe = fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  return existe && anio >= 1970 && fecha <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
}

function revisarFecha() {
  const campo = obtenerFormulario().elements.fecha;
  campo.setCustomValidity(esFechaValida(campo.value) ? "" : "Fecha no válida");
}

// Al elegir un archivo: se valida y se muestra la vista previa; si no sirve, se descarta y se explica por qué
async function elegirImagen(evento) {
  const archivo = evento.target.files[0];
  const error = archivo ? await validarImagen(archivo) : "";
  mostrarErrorImagen(error);
  if (error) limpiarSeleccionImagen();
  mostrarVistaPrevia(archivo && !error ? archivo : portadaActual);
}

// El navegador solo llega aquí si todos los campos son válidos
async function guardarVideojuego(evento) {
  evento.preventDefault();
  const datos = leerValoresFormulario();
  const archivo = leerArchivoImagen(); // sin archivo nuevo no se envía «portada»: al editar se conserva la actual

  if (archivo) {
    try {
      datos.portada = await guardarImagen(archivo);
    } catch (error) {
      mostrarErrorImagen("No se pudo guardar la imagen en el navegador. Prueba con otra o inténtalo de nuevo.");
      return;
    }
  }

  if (idEnEdicion === null) {
    agregarVideojuego(datos);
    cerrarVentanaFormulario();
    mostrarNotificacion("Videojuego agregado correctamente"); // la tienda se actualiza sola
    return;
  }

  const portadaAnterior = obtenerVideojuego(idEnEdicion).portada;
  const videojuego = actualizarVideojuego(idEnEdicion, datos); // mismo id: no crea un registro nuevo
  if (!videojuego) return;
  if (archivo) await borrarImagen(portadaAnterior); // la portada reemplazada ya no la usa nadie
  avisarEnPaginaSiguiente("Cambios guardados correctamente");
  irA(urlVideojuego("confirmacion.html", videojuego.id));
}

// Conecta el formulario de la página (una sola vez)
function conectarFormulario() {
  const formulario = obtenerFormulario();
  formulario.addEventListener("submit", guardarVideojuego);
  formulario.elements.fecha.addEventListener("input", revisarFecha);
  formulario.elements.imagen.addEventListener("change", elegirImagen);
  mostrarLimiteImagen(LIMITE_IMAGEN_MB);

  // Sin las burbujas del navegador: los mensajes están en el HTML y CSS los muestra (clase «intentado» + :invalid)
  formulario.addEventListener("invalid", (evento) => {
    evento.preventDefault();
    formulario.classList.add("intentado");
    if (evento.target === [...formulario.elements].find((campo) => !campo.validity.valid)) evento.target.focus(); // el primero con error
  }, true);
}

// ---------- Agregar (se llama desde la tienda al pulsar «Agregar videojuego») ----------
function abrirFormularioAgregar() {
  idEnEdicion = null;
  portadaActual = IMAGEN_PROVISIONAL;
  reiniciarFormulario(portadaActual);
  revisarFecha();
  abrirVentanaFormulario();
}

// ---------- Editar: editar_videojuego.html?id=... ----------
function iniciarControladorEdicion() {
  const videojuego = obtenerVideojuego(obtenerParametro("id"));
  if (!videojuego) {
    mostrarFormularioNoEncontrado();
    return;
  }

  idEnEdicion = videojuego.id;
  portadaActual = portadaDe(videojuego);
  mostrarVistaPrevia(portadaActual);
  llenarFormulario(videojuego);
  conectarFormulario();
  revisarFecha();
}

/* ===== controladores/ControladorTienda.js ===== */
// Controlador de la tienda: catálogo con búsqueda, filtros y orden, y botón «Agregar videojuego»






function actualizarTienda() {
  const videojuegosVisibles = aplicarControles(obtenerVideojuegos(), leerControlesFiltros());
  mostrarTienda(videojuegosVisibles);
}

function iniciarControladorTienda() {
  alCambiarFiltros(actualizarTienda);
  actualizarTienda();
  alCambiarVideojuegos(actualizarTienda);

  // Botón «Agregar videojuego»: abre el formulario en una ventana
  conectarFormulario();
  buscar('[data-accion="agregar-videojuego"]').addEventListener("click", abrirFormularioAgregar);
}

/* ===== modelos/ModeloEliminacion.js ===== */
// Modelo de eliminación: borra un videojuego de TODA la aplicación (no solo lo retira de la biblioteca).
// Es el único camino para eliminar: los controladores y las vistas no tocan el catálogo ni la biblioteca por su cuenta.
//
// Dónde se guarda un juego, y qué pasa con cada parte:
// - Catálogo (ModeloVideojuego): el registro completo. Tienda, Favoritos, Inicio y Perfil leen de aquí;
//   los favoritos no son una lista aparte (es el campo «favorito» del propio juego), así que desaparecen con él.
// - Biblioteca (ModeloBiblioteca): solo el id del juego. Se quita para que no quede una referencia huérfana.
// - Portada: si es un archivo guardado en el navegador («idb:…») y ningún otro juego lo usa, se borra.
//   Las portadas «assets/…» (archivos del proyecto) y las URL no se pueden borrar desde el navegador: solo se quita la referencia.



// Devuelve "eliminado", "inexistente" (el juego ya no estaba) o "error" (no se pudo guardar: no se cambió nada)
async function eliminarVideojuegoGlobal(id) {
  const videojuego = obtenerVideojuego(id);
  if (!videojuego) return "inexistente";

  const estabaEnBiblioteca = estaEnBiblioteca(id);
  if (!quitarDeBiblioteca(id)) return "error"; // 1. biblioteca: si falla, no se ha cambiado nada

  if (!eliminarVideojuego(id)) { // 2. catálogo (y con él, favoritos): las páginas se actualizan solas
    if (estabaEnBiblioteca) agregarABiblioteca(id); // se deshace el paso 1: nunca queda una eliminación a medias
    return "error";
  }

  // 3. portada: solo si ya no la usa ningún otro juego (borrarImagen ignora las que no son archivos del navegador)
  const lasigueUsandoOtro = obtenerVideojuegos().some((otro) => otro.portada === videojuego.portada);
  if (!lasigueUsandoOtro) await borrarImagen(videojuego.portada);
  return "eliminado";
}

/* ===== vistas/VistaBiblioteca.js ===== */
// Vista de la biblioteca


function mostrarBiblioteca(videojuegosVisibles, cantidadEnBiblioteca) {
  buscar(".library-grid").innerHTML = mostrarTarjetas(videojuegosVisibles, "biblioteca");
  buscar(".empty").hidden = videojuegosVisibles.length > 0;

  let texto = "juegos listos para ti.";
  if (cantidadEnBiblioteca === 1) texto = "juego listo para ti.";
  buscar("#cantidad-biblioteca").textContent = `${cantidadEnBiblioteca} ${texto}`;
}

// Ventana de confirmación para eliminar (un <dialog> escrito en biblioteca.html): aquí solo se escriben los datos del juego
function mostrarVentanaEliminar(videojuego) {
  const ventana = buscar("#ventana-eliminar");
  buscar(".eliminar-nombre", ventana).textContent = videojuego.nombre;
  buscar('[data-accion="confirmar-eliminar"]', ventana).dataset.id = videojuego.id;
  ventana.showModal();
}

function cerrarVentanaEliminar() {
  buscar("#ventana-eliminar").close();
}

// Cierra los menús de opciones abiertos (menos el que se acaba de abrir)
function cerrarMenus(menuAConservar) {
  for (const menu of buscarTodos("details.menu-wrap[open]")) {
    if (menu !== menuAConservar) menu.open = false;
  }
}

/* ===== controladores/ControladorBiblioteca.js ===== */
// Controlador de la biblioteca: lista, filtros, detalles, botón «Jugar» y eliminación global de un videojuego (con confirmación).







const juegosIniciandose = []; // ids de juegos que se están iniciando (evita iniciar dos veces)

function actualizarBiblioteca() {
  const juegosDeBiblioteca = obtenerJuegosDeBiblioteca();
  const videojuegosVisibles = aplicarControles(juegosDeBiblioteca, leerControlesFiltros());
  mostrarBiblioteca(videojuegosVisibles, juegosDeBiblioteca.length);
}

function jugarVideojuego(id) {
  if (juegosIniciandose.includes(id) || !obtenerVideojuego(id)) return;

  juegosIniciandose.push(id);
  mostrarNotificacion("Iniciando juego...");

  setTimeout(() => {
    juegosIniciandose.splice(juegosIniciandose.indexOf(id), 1);
    if (!obtenerVideojuego(id)) return; // el juego se eliminó mientras iniciaba

    actualizarVideojuego(id, { estado: "Jugando", ultimaVezJugado: Date.now() });
    mostrarNotificacion("Jugando");
  }, 1200);
}

// Eliminar borra el juego de TODA la aplicación (ver ModeloEliminacion.js); aquí solo se confirma y se avisa del resultado
let eliminando = false; // evita que un doble clic ejecute dos veces la misma eliminación

async function confirmarEliminacion(id) {
  if (eliminando) return;
  eliminando = true;
  cerrarVentanaEliminar();
  const nombre = obtenerVideojuego(id)?.nombre;
  try {
    const resultado = await eliminarVideojuegoGlobal(id);
    if (resultado === "error") {
      mostrarNotificacion("No se pudo eliminar el videojuego. No se hizo ningún cambio; inténtalo de nuevo.", "error");
    } else if (resultado === "inexistente") {
      mostrarNotificacion("Ese videojuego ya no existe.");
      actualizarBiblioteca();
    } else {
      mostrarNotificacion(`«${nombre}» se eliminó de GameVault`);
    }
  } finally {
    eliminando = false;
  }
}

function manejarClicEnBiblioteca(evento) {
  cerrarMenus(evento.target.closest("details.menu-wrap"));
  if (evento.target.closest(".context-menu a, .context-menu button")) cerrarMenus(null);

  const botonJugar = evento.target.closest('[data-accion="jugar"]');
  if (botonJugar) jugarVideojuego(botonJugar.dataset.id);

  const botonEliminar = evento.target.closest('[data-accion="eliminar"]');
  const videojuegoAEliminar = botonEliminar && obtenerVideojuego(botonEliminar.dataset.id);
  if (videojuegoAEliminar) mostrarVentanaEliminar(videojuegoAEliminar);

  const botonConfirmar = evento.target.closest('[data-accion="confirmar-eliminar"]');
  if (botonConfirmar) confirmarEliminacion(botonConfirmar.dataset.id);
}

function iniciarControladorBiblioteca() {
  alCambiarFiltros(actualizarBiblioteca);
  actualizarBiblioteca();
  alCambiarVideojuegos(actualizarBiblioteca);

  document.addEventListener("click", manejarClicEnBiblioteca);
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarMenus(null);
  });
}

/* ===== modelos/ModeloFavorito.js ===== */
// Modelo de favoritos: son los juegos marcados con el corazón (se guardan en el propio juego)

function obtenerFavoritos() {
  return obtenerVideojuegos().filter((videojuego) => videojuego.favorito);
}

// Se guarda sin volver a dibujar la página, para no reemplazar la casilla mientras se usa
function marcarFavorito(id, esFavorito) {
  return actualizarVideojuego(id, { favorito: esFavorito }, false);
}

/* ===== vistas/VistaFavoritos.js ===== */
// Vista de favoritos


function mostrarFavoritos(favoritos, videojuegosVisibles) {
  buscar(".store-grid").innerHTML = mostrarTarjetas(videojuegosVisibles, "tienda");

  // Dos mensajes distintos: no hay favoritos, o los filtros no encuentran ninguno
  buscar("#favoritos-vacio").hidden = favoritos.length > 0;
  buscar("#favoritos-sin-resultados").hidden = favoritos.length === 0 || videojuegosVisibles.length > 0;
  buscar("#filtros-favoritos").hidden = favoritos.length === 0;

  let palabra = "favoritos";
  if (favoritos.length === 1) palabra = "favorito";
  buscar(".result-count").textContent = `${favoritos.length} ${palabra}`;
}

/* ===== controladores/ControladorFavoritos.js ===== */
// Controlador de favoritos





function actualizarFavoritos() {
  const favoritos = obtenerFavoritos();
  const videojuegosVisibles = aplicarControles(favoritos, leerControlesFiltros());
  mostrarFavoritos(favoritos, videojuegosVisibles);
}

function iniciarControladorFavoritos() {
  alCambiarFiltros(actualizarFavoritos);
  actualizarFavoritos();
  alCambiarVideojuegos(actualizarFavoritos);
}

/* ===== vistas/componentes/VistaVentanaCompra.js ===== */
// Vista de la ventana de compra: un <dialog id="ventana-compra"> escrito en el HTML. Aquí solo se escriben los datos del juego.
// (Escape, la «X», «Cancelar» y el foco los resuelve el propio <dialog>.)


function mostrarVentanaCompra(videojuego, yaEnBiblioteca) {
  const ventana = buscar("#ventana-compra");
  for (const nombre of buscarTodos(".compra-nombre", ventana)) nombre.textContent = videojuego.nombre;
  buscar("img", ventana).src = portadaDe(videojuego);
  buscar("#compra-genero", ventana).textContent = videojuego.genero;
  buscar("#compra-precio", ventana).textContent = darFormatoPrecio(videojuego.precio);
  buscar("#compra-confirmar", ventana).dataset.id = videojuego.id;

  // Si ya lo tiene, en lugar de «Confirmar compra» se ofrece ir a la biblioteca
  buscar("#compra-nueva", ventana).hidden = yaEnBiblioteca;
  buscar("#compra-confirmar", ventana).hidden = yaEnBiblioteca;
  buscar("#compra-existente", ventana).hidden = !yaEnBiblioteca;
  buscar("#compra-ir-biblioteca", ventana).hidden = !yaEnBiblioteca;
  ventana.showModal();
}

function cerrarVentanaCompra() {
  buscar("#ventana-compra").close();
}

/* ===== vistas/VistaDetallesVideojuego.js ===== */
// Vista de la ficha de detalles. La estructura está escrita en detalles_videojuego.html: aquí solo se escriben los datos.


const DATOS_DE_LISTA = ["desarrollador", "fecha", "plataforma", "tamano"]; // <dd id="detalle-...">

function mostrarDetallesVideojuego(videojuego) {
  const ficha = buscar("#detalle");
  for (const imagen of buscarTodos("img", ficha)) imagen.src = portadaDe(videojuego);
  buscar(".detail-cover", ficha).alt = `Portada de ${videojuego.nombre}`;
  buscar(".eyebrow", ficha).textContent = [videojuego.genero, videojuego.categoria].filter(Boolean).join(" · ");
  buscar("h1", ficha).textContent = videojuego.nombre;
  buscar(".detail-description", ficha).textContent = videojuego.descripcion || "Sin descripción disponible.";
  for (const dato of DATOS_DE_LISTA) buscar(`#detalle-${dato}`, ficha).textContent = videojuego[dato] || "—";
  buscar("#detalle-precio", ficha).textContent = darFormatoPrecio(videojuego.precio);
  buscar('[data-accion="comprar"]', ficha).dataset.id = videojuego.id;
  buscar("#casilla-favorito", ficha).checked = videojuego.favorito;

  ficha.hidden = false;
  document.title = `${videojuego.nombre} · GameVault`;
}

function mostrarVideojuegoNoEncontrado() {
  buscar("#detalle-no-encontrado").hidden = false;
}

// Llama a manejador(true/false) cuando se marca o desmarca la casilla de favoritos
function conectarCasillaFavorito(manejador) {
  buscar("#casilla-favorito").addEventListener("change", (evento) => manejador(evento.target.checked));
}

// Llama a manejador(evento) cuando se pulsa «Volver»
function conectarEnlaceVolver(manejador) {
  buscar('[data-accion="volver"]').addEventListener("click", manejador);
}

/* ===== controladores/ControladorVideojuego.js ===== */
// Controlador de un videojuego: ficha de detalles y compra (acciones disponibles en cualquier página)







// ---------- Página de detalles: detalles_videojuego.html?id=... ----------
function iniciarControladorDetalles() {
  const videojuego = obtenerVideojuego(obtenerParametro("id"));
  if (!videojuego) {
    mostrarVideojuegoNoEncontrado();
    return;
  }

  mostrarDetallesVideojuego(videojuego);

  conectarCasillaFavorito((esFavorito) => {
    marcarFavorito(videojuego.id, esFavorito);
    mostrarNotificacion(esFavorito ? "Agregado a favoritos" : "Eliminado de favoritos");
  });

  // Si otra pestaña elimina este juego, esta ficha ya no es válida: se vuelve a la tienda
  window.addEventListener("storage", () => {
    iniciarVideojuegos();
    if (!obtenerVideojuego(videojuego.id)) irA("tienda.html");
  });

  // «Volver»: regresa a la página anterior; si no hay, el enlace lleva a la tienda
  conectarEnlaceVolver((evento) => {
    if (volverAtras()) evento.preventDefault();
  });
}

// ---------- Comprar (botones con data-accion) ----------
// Comprar solo agrega el juego a la biblioteca: el catálogo de la tienda no cambia
function comprarVideojuego(videojuego) {
  if (!agregarABiblioteca(videojuego.id)) {
    cerrarVentanaCompra();
    mostrarNotificacion("No se pudo guardar en el navegador. La compra no se conservará al recargar.", "error");
    return;
  }
  avisarEnPaginaSiguiente("Juego comprado correctamente"); // demostración: no hay pago real
  irA("biblioteca.html");
}

function manejarAccionDeVideojuego(evento) {
  const boton = evento.target.closest("[data-accion]");
  const videojuego = boton && obtenerVideojuego(boton.dataset.id); // los botones sin data-id no son de un juego
  if (!videojuego) return;

  if (boton.dataset.accion === "comprar") mostrarVentanaCompra(videojuego, estaEnBiblioteca(videojuego.id));
  if (boton.dataset.accion === "confirmar-compra") comprarVideojuego(videojuego);
}

function iniciarAccionesDeVideojuego() {
  document.addEventListener("click", manejarAccionDeVideojuego);
}

/* ===== vistas/VistaConfirmacion.js ===== */
// Vista de la página de confirmación


// Si no hay juego, idVideojuego debe ser "" y se oculta el enlace a los detalles
function mostrarConfirmacion(titulo, texto, idVideojuego) {
  buscar("#titulo-guardado").textContent = titulo;
  buscar("#texto-guardado").textContent = texto;

  const enlaceDetalles = buscar("#enlace-detalle-guardado");
  enlaceDetalles.hidden = idVideojuego === "";
  if (idVideojuego !== "") enlaceDetalles.href = urlVideojuego("detalles_videojuego.html", idVideojuego);
}

/* ===== controladores/ControladorConfirmacion.js ===== */
// Controlador de la confirmación después de editar: confirmacion.html?id=...



function iniciarControladorConfirmacion() {
  const videojuego = obtenerVideojuego(obtenerParametro("id"));

  if (!videojuego) {
    mostrarConfirmacion("Todo listo", "No hay cambios recientes que mostrar.", "");
    return;
  }
  mostrarConfirmacion("Cambios guardados", `Se actualizó la información de ${videojuego.nombre}.`, videojuego.id);
}

/* ===== modelos/ModeloPerfil.js ===== */
// Modelo del perfil: estadísticas calculadas con los mismos datos de los videojuegos


function obtenerEstadisticasPerfil() {
  const biblioteca = obtenerJuegosDeBiblioteca();
  return {
    biblioteca: biblioteca.length,
    favoritos: obtenerFavoritos().length,
    jugando: biblioteca.filter((videojuego) => videojuego.estado === "Jugando").length,
    completados: biblioteca.filter((videojuego) => videojuego.estado === "Completado").length,
  };
}

/* ===== vistas/VistaPerfil.js ===== */
// Vista del perfil

function mostrarPerfil(estadisticas) {
  buscar("#estadistica-biblioteca").textContent = estadisticas.biblioteca;
  buscar("#estadistica-favoritos").textContent = estadisticas.favoritos;
  buscar("#estadistica-jugando").textContent = estadisticas.jugando;
  buscar("#estadistica-completados").textContent = estadisticas.completados;
}

/* ===== controladores/ControladorPerfil.js ===== */
// Controlador del perfil


function iniciarControladorPerfil() {
  mostrarPerfil(obtenerEstadisticasPerfil());
}

/* ===== principal.js ===== */
// GameVault · punto de entrada: cada página indica quién es con <body data-page="...">














// Qué controlador inicia cada página (solo el suyo)
const CONTROLADORES_POR_PAGINA = {
  inicio: iniciarControladorInicio,
  tienda: iniciarControladorTienda,
  biblioteca: iniciarControladorBiblioteca,
  favoritos: iniciarControladorFavoritos,
  detalles: iniciarControladorDetalles,
  editar: iniciarControladorEdicion,
  confirmacion: iniciarControladorConfirmacion,
  perfil: iniciarControladorPerfil,
};

async function iniciarAplicacion() {
  insertarIconos();
  iniciarVideojuegos();
  iniciarBiblioteca(); // después del catálogo y antes de cualquier cambio
  alFallarGuardado(() => mostrarNotificacion("No se pudo guardar en el navegador. Los cambios se perderán al recargar.", "error"));
  iniciarAccionesDeVideojuego();
  mostrarAvisoPendiente();

  // Si una portada no carga (sin conexión, URL rota), se reemplaza por una imagen neutra
  document.addEventListener("error", (evento) => {
    const imagen = evento.target;
    if (imagen.tagName === "IMG" && imagen.getAttribute("src") !== IMAGEN_PROVISIONAL) imagen.src = IMAGEN_PROVISIONAL;
  }, true);

  // Un clic en el fondo oscuro cierra el <dialog> (Escape y los botones «Cancelar» y «X» lo cierran solos)
  document.addEventListener("click", (evento) => {
    if (evento.target.matches("dialog")) evento.target.close();
  });

  await cargarImagenesLocales(); // las portadas guardadas en el navegador deben estar listas antes de dibujar

  // Lo propio de la página actual
  const iniciarControlador = CONTROLADORES_POR_PAGINA[document.body.dataset.page];
  if (iniciarControlador) iniciarControlador();
}

iniciarAplicacion();
})();
