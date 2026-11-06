# OmniBlizz Original: código y recursos por OTA

El publicador admite actualizaciones de código, sprites, imágenes, mapas JSON, HTML/CSS, sonido, música, vídeo y fuentes. Se conserva el protocolo firmado de las APK existentes (schema 1 y schema 2).

## Desarrollo privado

Repositorio privado: `ventisca-gif/omniblizz-development`.

- `codigo/game.js`: código completo actual.
- `assets/`: overlay opcional con archivos nuevos o reemplazos. Sus rutas son relativas a la raíz del juego: `assets/art/alien.webp` se instala como `art/alien.webp`, y `assets/maps/zona.json` como `maps/zona.json`.
- Los recursos que no se incluyen se conservan. No hace falta volver a subir todo el juego.
- Una actualización puede cambiar solo recursos, solo código o ambos. Si no cambia ningún byte, se rechaza.

El workflow privado copia el código y `assets/` a un candidato, verifica el contenido, firma con el secreto OTA original y propone un PR público en borrador. El PR público solo lleva manifiestos firmados, BIN de los recursos cambiados, notas y hashes. Nunca se envían claves, código editable privado ni respaldos.

## Preparación local alternativa

`candidate/game.js`, `candidate/assets/` y `candidate/release.json`:

```json
{"version":"2.43.27","revision":339,"notes":"Ejemplo: no publicar sin cambios reales"}
```

Consultar Latest antes de elegir versión y revisión. Las dos deben aumentar.

```bash
python3 automation/validate_and_stage.py --candidate-dir candidate --output-dir dist
python3 automation/sign_candidate_locally.py --candidate-dir candidate --out-root releases/original --private-key /ruta/externa/update-signing.pem
python3 automation/verify_staged_release.py --root releases/original --version VERSION
```

El primer comando solo crea borradores SIN FIRMA; no son instalables. Los otros firman y verifican sin publicar.

## Integridad y compatibilidad

El verificador reconstruye los dos manifiestos desde la release previa y el overlay. Rechaza firmas incorrectas, BIN faltantes/adicionales/alterados, discrepancias entre manifiestos, recursos eliminados, cambios ocultos en rutas, MIME, offsets o packs, symlinks y archivos privados/reservados. Mantiene los packs históricos usados por archivos no modificados y deduplica contenido idéntico.

Límites del actualizador instalado: 8 MiB por recurso/pack, 20 000 archivos, 2 000 packs y 1 GiB total. Archivos mayores deben comprimirse o dividirse en recursos independientes que el juego sepa cargar. El empaquetador no cambia estos límites de la APK. Rutas ASCII de menos de 240 caracteres, sin escapes ni colisiones de mayúsculas. `index.html`, `update147/`, claves y archivos nativos/APK no son contenido OTA.

Las comprobaciones detectan integridad y sintaxis, pero cada mecánica, mapa y recurso debe probarse dentro del juego. El código necesita referenciar las rutas nuevas; subir una imagen no crea por sí solo un alien.

## Publicación

PR de contenido firmado → CI → revisión/merge → validación → aprobación de `original-release` → Release nueva. El entorno exige `OMNIBLIZZ_RELEASES_ENABLED=true` y aprobación de `ventisca-gif`. No se sobrescriben versiones anteriores.

Este flujo es para contenido de **Original**. Creator, compilación/firma Android y despliegue web Pages son procesos separados. No requiere cambiar la versión pública del juego para instalar herramientas de empaquetado.
