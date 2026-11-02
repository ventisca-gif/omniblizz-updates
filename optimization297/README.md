# OmniBlizz Original 2.36.5

Publicación: https://github.com/ventisca-gif/omniblizz-updates/releases/tag/v2.36.5

La actualización firmada (revisión 297) limita la carga inicial a seis imágenes simultáneas con un reintento, alinea la simulación con el renderizado para todas las razas y agrupa el HUD de varios pasos de física en una transacción. Conserva el tiempo acumulado y los pasos máximos de 40 ms.

Validación: sintaxis del motor; 66 escenarios de ritmo/HUD; 4 escenarios del cargador; 1.597 archivos de la base reconstruidos y verificados; firma y pack descargados después de publicar. Inicio, movimiento, teléfono y mochila comprobados en navegador de nube. No hay medición de FPS en Android físico ni garantía de 40 FPS.

Los recursos del bosque grande no figuran en el manifiesto completo. Se cambiaron solo game.js y game-entry147.html. Descarga incremental: 5.428.931 bytes.

El material privado de firma no se incluye en el repositorio ni en el paquete público.

Reproducir el parche sobre el código público 2.36.4:

~~~sh
gh release download v2.36.4 -p '*Codigo-Publico.zip' -D /tmp/omni-base
unzip /tmp/omni-base/*.zip -d /tmp/omni-base/source
python3 optimization297/patch.py /tmp/omni-base/source/alienx280/public/game.js
node --check /tmp/omni-base/source/alienx280/public/game.js
node optimization297/test.cjs /tmp/omni-base/source/alienx280/public/game.js
node optimization297/test-loader.cjs /tmp/omni-base/source/alienx280/public/game.js
python3 optimization297/recover_runtime.py /tmp/omni-base/source
~~~

Pendiente: medir Android, comparar rendimiento antes/después en el mismo dispositivo y recorrer escenarios y combate de cada raza. Esta revisión no afirma que se haya terminado de optimizar cada sistema del juego.
