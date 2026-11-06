# Publicación protegida de OmniBlizz Original

El repositorio público distribuye contenido OTA firmado; el código editable se mantiene en `ventisca-gif/omniblizz-development` (Private).

1. Editar `codigo/game.js` y/o añadir/reemplazar archivos bajo `assets/` en el repositorio privado. Ejemplo: `assets/art/alien.webp` se instala como `art/alien.webp`.
2. Ejecutar la acción manual **Preparar OTA Original y proponer PR publico**, indicando versión y revisión superiores a Latest y notas reales.
3. El workflow valida sintaxis, rutas y tamaños, conserva todos los recursos anteriores, genera los BIN necesarios, firma ambos manifiestos con `OMNIBLIZZ_OTA_PRIVATE_PEM` y crea un PR borrador usando `OMNIBLIZZ_RELEASE_PR_TOKEN`.
4. Revisar el PR y las pruebas. La carpeta pública `releases/original/VERSION/` contiene únicamente los dos manifiestos firmados, los BIN de contenido nuevo/modificado, notas y `SHA256SUMS.json`.
5. Al fusionar el PR, el publicador verifica ambas firmas, todos los BIN nuevos y la conservación de recursos. El entorno `original-release` exige aprobación humana y `OMNIBLIZZ_RELEASES_ENABLED=true`.
6. Después de aprobar, crea una Release borrador, sube todos los BIN verificados y la publica como Latest. Nunca reemplaza una Release existente.

Se admiten actualizaciones solo de recursos sin modificar `game.js`, así como código y recursos juntos. Los packs históricos se conservan mientras algún archivo los use. Omitir un archivo en `assets/` significa conservarlo, nunca eliminarlo.

Los secretos se guardan solo en el repositorio privado; no van en commits, artefactos, logs ni este repositorio público. La clave pública debe coincidir con la clave de firma original instalada en las APK.

Consultar [README.md](README.md) para tipos de archivos y límites de la APK. Recursos mayores de 8 MiB o cambios al shell nativo requieren otro diseño; las herramientas rechazan contenido incompatible. Este flujo no compila APK, no publica Creator ni despliega Pages.
