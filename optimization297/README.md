# OmniBlizz: optimización pendiente de integración

Base verificada: código público de Original 2.36.4, revisión 296.

Cambios preparados:
- Todas las razas usan la simulación alineada con el renderizado; se acumula el tiempo entre fotogramas y se mantienen pasos de física de hasta 40 ms.
- Un fotograma con varios pasos de simulación agrupa el refresco del HUD en una sola transacción. Los refrescos explícitos fuera de la simulación conservan su comportamiento.

Validación: node --check del motor modificado y 66 casos con el bucle de producción extraído (8 identificadores de raza, 30/60 FPS, pantallas de 60/90/120/144 Hz y limpieza del HUD incluso ante excepciones).

Estas pruebas no ejecutan el juego completo ni miden FPS en Android. No se ha publicado una nueva versión instalable: el empaquetado de 2.36.4 requiere la clave privada de firma y recursos que no se incluyen en el código público. La versión instalada sigue siendo 2.36.4.

Reproducir desde la raíz del repositorio:

~~~sh
gh release download v2.36.4 -p '*Codigo-Publico.zip' -D /tmp/omni-base
unzip /tmp/omni-base/*.zip -d /tmp/omni-base/source
python3 optimization297/patch.py /tmp/omni-base/source/alienx280/public/game.js
node --check /tmp/omni-base/source/alienx280/public/game.js
node optimization297/test.cjs /tmp/omni-base/source/alienx280/public/game.js
~~~

Pendiente: recorrido real de escenarios, teléfono/inventario, mascotas/monturas y combate de cada raza; comparación visual; medición Android; firma y publicación mediante el proceso original. No se afirma que la optimización de todo el juego esté terminada.
