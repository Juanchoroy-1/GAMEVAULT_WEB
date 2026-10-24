# Portadas de los videojuegos

Pon aquí las imágenes que quieras usar como portadas del proyecto (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` o `.avif`).

- Usa nombres seguros y únicos, en minúsculas y sin espacios: `elden-ring.webp`, `forza-horizon-5.jpg`.
- Se enlazan con una ruta relativa al proyecto, en el campo `portada` del juego (por ejemplo en `js/modelos/datosVideojuegos.js`):
  `portada: "assets/imagenes/videojuegos/elden-ring.webp"`
- Si el archivo no existe, GameVault muestra la imagen de respaldo (`assets/imagenes/predeterminada.svg`).

Las portadas que se eligen desde el formulario **no** se copian a esta carpeta: el navegador no puede escribir en ella. Esas se guardan en el propio navegador (IndexedDB). Para pasarlas a esta carpeta, copia el archivo aquí a mano y cambia la ruta del juego.
