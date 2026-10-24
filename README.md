# GameVault

Plataforma web (HTML, CSS y JavaScript puro, sin servidor) para explorar videojuegos, ver sus detalles y gestionar una biblioteca personal: agregar juegos a la tienda, editar, comprar, marcar favoritos, buscar, filtrar y ordenar.

## Cómo ejecutarlo

Abre `index.html` con doble clic: redirige a `paginas/inicio.html`. También funciona desde un servidor local o GitHub Pages.

Las páginas cargan `js/gamevault.paquete.js`, un solo archivo clásico que se **genera** a partir de los módulos de `js/` (los navegadores bloquean los módulos ES al abrir archivos con doble clic). Si editas cualquier archivo de `js/`, vuelve a generarlo con Node.js:

```bash
node construir.mjs
```

`construir.mjs` ordena los módulos según sus `import` y se detiene con un mensaje si dos archivos declaran una función o constante con el mismo nombre (en el paquete se pisarían sin avisar). Cada `import` debe ir en **una sola línea**. Lleva extensión `.mjs` (y no `.js`) porque usa `import` y Node solo lo permite así sin un `package.json`.

Las portadas vienen de Unsplash y las fuentes de Google Fonts: hace falta conexión para verlas (sin conexión se muestra una portada neutra).

## Estructura de carpetas

```
GameVault/
├── index.html                  Entrada: redirige a paginas/inicio.html
├── construir.mjs               Genera js/gamevault.paquete.js
├── README.md
├── paginas/                    Las páginas de la aplicación
│   ├── inicio.html · tienda.html · biblioteca.html · favoritos.html
│   ├── detalles_videojuego.html · editar_videojuego.html
│   └── confirmacion.html · perfil.html
├── css/
│   ├── estilos.css             Variables, base, navegación y maquetación de páginas
│   ├── componentes.css         Botones, tarjetas, filtros, menús, formularios, ventanas, avisos
│   └── adaptable.css           Tabletas, celulares y movimiento reducido
└── js/
    ├── principal.js            Punto de entrada: prepara lo común y arranca el controlador de la página
    ├── gamevault.paquete.js    (generado por construir.mjs)
    ├── modelos/                Datos
    │   ├── datosVideojuegos.js     Los 8 videojuegos originales y las listas de géneros, plataformas y estados
    │   ├── ModeloVideojuego.js     Estructura de un juego y CATÁLOGO de la tienda: obtener, agregar, actualizar
    │   ├── ModeloBiblioteca.js     BIBLIOTECA del usuario: guarda solo los ids de los juegos que posee
    │   ├── ModeloFavorito.js       Favoritos: obtener y marcar/desmarcar
    │   ├── ModeloEliminacion.js        Eliminación global de un videojuego (biblioteca + catálogo + portada)
    │   └── ModeloPerfil.js         Estadísticas del perfil
    ├── controladores/          Acciones del usuario (uno por página)
    │   ├── ControladorInicio · Tienda · Biblioteca · Favoritos · Perfil · Confirmacion
    │   ├── ControladorVideojuego.js    Detalles + comprar (acción de cualquier página)
    │   └── ControladorFormulario.js    Agregar (ventana en la tienda) y editar: comprobar la fecha y guardar
    ├── vistas/                 Escriben los datos en el HTML (y dibujan las tarjetas, que son una lista dinámica)
    │   ├── componentes/
    │   │   ├── VistaTarjetaVideojuego.js   mostrarTarjetaVideojuego(juego, "compacta" | "tienda" | "biblioteca")
    │   │   ├── VistaBarraFiltros.js        Lee los valores de la barra de búsqueda/filtros (la barra está en el HTML)
    │   │   ├── VistaVentanaCompra.js       Escribe los datos del juego en la ventana de compra (<dialog> del HTML)
    │   │   ├── VistaNotificacion.js        Muestra el aviso (que está en el HTML); también funciona entre páginas
    │   │   └── iconos.js                   Iconos SVG
    │   └── VistaInicio · Tienda · Biblioteca · Favoritos · DetallesVideojuego · Formulario · Confirmacion · Perfil
    └── auxiliares/             Funciones reutilizables
        ├── almacenamiento.js   Único lugar que usa localStorage y sessionStorage
        ├── filtrosLista.js     Búsqueda, filtros y orden (funciones puras)
        ├── formato.js          Precios, estados y portadas (portadaDe: decide de dónde sale la imagen)
        ├── imagenesLocales.js  Portadas elegidas por el usuario: validación y almacenamiento en IndexedDB
        ├── navegacion.js       Leer parámetros de la URL, cambiar de página, volver
        └── dom.js              buscar, buscarTodos, escaparHtml
```

No hay carpeta `recursos/`: los iconos están en `iconos.js` y las portadas son enlaces a Unsplash, así que estaría vacía. Si algún día agregas imágenes propias, créala y úsalas con rutas como `../recursos/imagenes/foto.png` desde las páginas.

## Arquitectura: Modelos, Vistas y Controladores

```
Usuario ──clic──▶ Controlador ──pide/guarda datos──▶ Modelo
                      │
                      └──────pide dibujar───────────▶ Vista
Auxiliares: funciones generales que usan las tres capas
```

- **Modelo:** representa y gestiona los datos. No toca el HTML.
- **Vista:** dibuja el HTML y lee lo que escribe el usuario. No guarda datos ni decide reglas.
- **Controlador:** recibe las acciones del usuario, llama al modelo y le pide a la vista que se actualice.
- **Auxiliar:** funciones reutilizables que no pertenecen a una sola capa.

Cada HTML tiene solo el contenido de su sección y `<body data-page="…">`; `principal.js` lee ese valor y arranca únicamente el controlador de esa página.

| Página | Controlador |
|---|---|
| `inicio.html` | `ControladorInicio` |
| `tienda.html` (catálogo + botón «Agregar videojuego») | `ControladorTienda` y `ControladorFormulario` |
| `biblioteca.html` (consulta, jugar y eliminar) | `ControladorBiblioteca` |
| `favoritos.html` | `ControladorFavoritos` |
| `detalles_videojuego.html?id=…` | `ControladorVideojuego` |
| `editar_videojuego.html?id=…` | `ControladorFormulario` |
| `confirmacion.html?id=…` (después de editar) | `ControladorConfirmacion` |
| `perfil.html` | `ControladorPerfil` |

## Dónde está cada cosa

- **HTML (estructura fija, escrita en cada página):** encabezado y navegación (con el enlace actual marcado con `is-current`), barras de búsqueda y filtros, la imagen destacada de Inicio, la ficha de detalles, los mensajes de «no encontrado», el aviso (`.toast`), la ventana de compra y los formularios de agregar y editar. JavaScript solo escribe los datos del juego en esos elementos.
- **JavaScript (lo que cambia según los datos):** las tarjetas de videojuegos las genera `VistaTarjetaVideojuego.js`, porque son una lista que crece y se filtra. Una sola función dibuja las tarjetas de Inicio, Tienda, Favoritos y Biblioteca.
- **Ventanas:** son elementos `<dialog>` nativos (`#ventana-compra` en Inicio, Tienda, Favoritos y Detalles; `#ventana-formulario` en la Tienda). El navegador se encarga de abrirlas encima de todo, atrapar el foco y cerrarlas con Escape; los botones «X» y «Cancelar» las cierran con `<form method="dialog">`. JavaScript solo las abre (`showModal()`) y cierra la ventana al hacer clic en el fondo oscuro.
- **Validación del formulario:** las reglas están en los atributos de cada campo (`required`, `min`, `pattern`, `type="url"`) y el mensaje de error en su `<small>`. CSS muestra el error de un campo con `:user-invalid`, y todos los errores tras pulsar «Guardar» con la clase `intentado` (que pone `ControladorFormulario.js` cuando el navegador rechaza el envío). JavaScript solo comprueba que la fecha exista de verdad (no «31/02/2020») y que no sea muy futura.
- **Eliminar un videojuego:** desde el menú ⋮ de cada tarjeta de la Biblioteca (opción «Eliminar»), con una ventana de confirmación (`<dialog id="ventana-eliminar">`). Es una eliminación **global y permanente**: no existe «retirar solo de la biblioteca». Toda la lógica está en un único punto, `eliminarVideojuegoGlobal()` (`js/modelos/ModeloEliminacion.js`), que: (1) quita el id de la biblioteca, (2) quita el registro del catálogo (los favoritos son un campo del propio juego, así que desaparecen con él) y (3) borra su portada si es un archivo del navegador (`idb:…`) que ningún otro juego usa. Si un guardado falla, se deshace lo anterior y se avisa con un error (nunca queda a medias ni se muestra un falso éxito). Las portadas `assets/…` y las URL solo pierden la referencia: el navegador no puede borrar archivos del proyecto. Los controladores y las vistas no eliminan nada por su cuenta.
- **Estilos:** `css/estilos.css` (variables, base y páginas), `css/componentes.css` (piezas reutilizables) y `css/adaptable.css` (pantallas). Los colores van en variables CSS en `:root`.
- **Animaciones:** transiciones y animaciones en CSS (`componentes.css`); `adaptable.css` las desactiva si el usuario pide movimiento reducido. JavaScript solo programa cuándo se oculta un aviso.
- **Portadas:** un juego puede tener su imagen en tres sitios, y `portadaDe()` (en `formato.js`) lo resuelve:
  1. **Elegida en el formulario** → se guarda como archivo en **IndexedDB** del navegador y el juego conserva solo una referencia estable (`idb:<id>`). No se usa Base64 ni `blob:` en `localStorage`.
  2. **Archivo del proyecto** → ruta relativa (`assets/imagenes/videojuegos/elden-ring.webp`) en el campo `portada` del juego. Ver `assets/imagenes/videojuegos/LEEME.md`.
  3. **URL antigua** (`https://…`) → se sigue mostrando; si no carga, se usa la imagen de respaldo `assets/imagenes/predeterminada.svg`.
  
  Un navegador no puede escribir archivos en las carpetas del proyecto, y GameVault no tiene servidor, así que lo elegido en el formulario **no** se copia a `assets/`: vive en el navegador y no se sincroniza entre dispositivos ni con los archivos del proyecto. El límite de tamaño se cambia en `LIMITE_IMAGEN_MB` (`imagenesLocales.js`; el texto de ayuda del formulario se actualiza solo). Formatos: JPG, JPEG, PNG, WEBP, GIF y AVIF (el SVG no se permite).
- **Iconos:** `iconos.js` inserta una sola vez un bloque SVG con todos los iconos; el HTML y las tarjetas los reutilizan con `<use href="#i-…">`.

## Tienda y biblioteca: datos separados

- **Catálogo (tienda):** `ModeloVideojuego.js`, clave `gamevault:games`. Contiene todos los videojuegos disponibles con sus datos. Es donde se agregan juegos nuevos (botón «Agregar videojuego» de la tienda, que abre el formulario en una ventana) y donde se editan.
- **Biblioteca (usuario):** `ModeloBiblioteca.js`, clave `gamevault:library`. Guarda **solo los ids** de los juegos que posee; los datos de cada juego se leen del catálogo, así no hay información duplicada.
- **Comprar** (demostración, sin pago real) agrega el id a la biblioteca y no toca el catálogo. **Agregar un juego a la tienda** lo agrega al catálogo y no toca la biblioteca (para tenerlo en la biblioteca hay que comprarlo).
- **Eliminar es global:** la única forma de quitar un juego de la biblioteca es eliminarlo de GameVault (opción «Eliminar» del menú ⋮, con confirmación): desaparece también de la tienda, de favoritos y de todas las demás secciones. No existe «retirar solo de la biblioteca». Comprar, jugar, editar y marcar favoritos nunca eliminan nada.
- Jugar cambia el estado del juego (`Jugando`) en el catálogo; editar también actualiza el catálogo. Ninguna de las dos acciones cambia qué juegos hay en la biblioteca.

## Cómo se guardan los datos

- Cada página carga ambos datos de `localStorage` al abrirse (`principal.js`: primero el catálogo y luego la biblioteca), así que un cambio se ve en todas las páginas y tras recargar. Todo el acceso a `localStorage` está en `auxiliares/almacenamiento.js`.
- **Datos de versiones anteriores:** antes cada juego llevaba dentro un dato «enBiblioteca» (y antes «owned», con nombres en inglés). Al abrir cualquier página, si todavía no existe la biblioteca guardada, se calcula con esos datos y se guarda de inmediato en `gamevault:library`. El catálogo se conserva completo y, cuando se vuelve a guardar, ya sin ese dato. No se pierde ningún juego de la colección.
- **Primera visita:** el catálogo son los 8 juegos de `datosVideojuegos.js` (se guardan al hacer el primer cambio) y la biblioteca empieza con los ids `1` a `6`.
- **Datos dañados:** el catálogo conserva una copia en `gamevault:games:corrupt` y usa los iniciales; una biblioteca dañada se recalcula como si no existiera.
- **Ids:** los originales son `"1"`…`"8"`; los nuevos son `g…`, sin repetirse. Editar usa siempre el mismo id, así que no crea duplicados.
- **Avisos entre páginas:** al editar o comprar, el aviso se guarda en `sessionStorage` y se muestra en la página siguiente.
- `localStorage` guarda los datos en este navegador; no se sincronizan entre dispositivos. Para volver al estado inicial: `localStorage.removeItem("gamevault:games"); localStorage.removeItem("gamevault:library")` y recargar.

## Cómo agregar una página nueva

1. Copia `paginas/tienda.html` con el nombre nuevo y cambia el título, el `data-page` y el contenido de `<main>`. Mantén el encabezado (cambia qué enlace lleva `is-current`), el aviso `.toast` y las rutas `../css/…` y `../js/gamevault.paquete.js`.
2. Escribe en el HTML de la página todo lo que sea fijo. Crea `js/vistas/VistaNueva.js` (escribe los datos en ese HTML) y `js/controladores/ControladorNuevo.js` (pide los datos al modelo y llama a la vista).
3. En `js/principal.js`, importa el controlador y añade `nueva: iniciarControladorNuevo` en `CONTROLADORES_POR_PAGINA`.
4. Si debe aparecer en el menú, añade el enlace en el encabezado de **todas** las páginas (el menú está escrito en cada HTML).
5. Ejecuta `node construir.mjs`.

## Reglas de la aplicación

- La tienda muestra el catálogo completo; la biblioteca, solo los juegos comprados.
- «Ordenar: Fecha» muestra primero los más recientes; «Última vez jugado» usa la fecha en que se pulsó «Jugar».
- «Editar» está en el menú ⋮ de cada juego de la biblioteca; cambia los datos del catálogo.
- Todavía no hay una función para eliminar juegos del catálogo.
