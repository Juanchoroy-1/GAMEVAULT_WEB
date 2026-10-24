/* Une los módulos de js/ en un solo archivo clásico: js/gamevault.paquete.js
   Las páginas cargan ese archivo, así funcionan al abrirlas con doble clic (file://),
   donde los navegadores bloquean los módulos ES.
   Uso: node construir.mjs   (ejecútalo después de editar cualquier archivo de js/) */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const carpetaJs = path.join(path.dirname(fileURLToPath(import.meta.url)), "js");
const visitados = [];
const partes = [];
const nombresDeclarados = {}; // nombre -> archivo donde se declaró

// Visita primero los archivos que importa cada módulo, para que queden en el orden correcto
function agregarModulo(archivo) {
  if (visitados.includes(archivo)) return;
  visitados.push(archivo);

  const codigoOriginal = fs.readFileSync(archivo, "utf8");
  const patronImport = /^import \{[^}]*\} from "(.+?)";\s*$/gm;
  for (const coincidencia of codigoOriginal.matchAll(patronImport)) {
    agregarModulo(path.resolve(path.dirname(archivo), coincidencia[1]));
  }

  // Al unir los archivos, dos funciones con el mismo nombre se pisarían sin avisar: se detecta aquí
  const patronDeclaracion = /^(?:export )?(?:async )?(?:function|const|let) +([A-Za-z_$][\w$]*)/gm;
  for (const coincidencia of codigoOriginal.matchAll(patronDeclaracion)) {
    const nombre = coincidencia[1];
    if (nombresDeclarados[nombre]) {
      throw new Error(`El nombre "${nombre}" está en ${nombresDeclarados[nombre]} y en ${path.relative(carpetaJs, archivo)}. Cámbialo en uno de los dos.`);
    }
    nombresDeclarados[nombre] = path.relative(carpetaJs, archivo);
  }

  // Quita las líneas import y la palabra export: en el paquete todo comparte el mismo ámbito
  const codigo = codigoOriginal.replace(patronImport, "").replace(/^export /gm, "");
  partes.push(`/* ===== ${path.relative(carpetaJs, archivo)} ===== */\n${codigo.trim()}`);
}

agregarModulo(path.join(carpetaJs, "principal.js"));

const paquete = `/* GENERADO por construir.mjs a partir de los módulos de js/. No lo edites a mano. */\n(() => {\n"use strict";\n\n${partes.join("\n\n")}\n})();\n`;
fs.writeFileSync(path.join(carpetaJs, "gamevault.paquete.js"), paquete);
console.log(`js/gamevault.paquete.js generado (${partes.length} módulos)`);
