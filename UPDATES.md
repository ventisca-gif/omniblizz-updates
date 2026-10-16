# Actualizaciones de OmniBlizz Original

Este repositorio distribuye contenido para la edición **Original**. No contiene el proyecto completo, partidas ni claves privadas. La edición Creator no usa este canal.

Instala una vez la APK Original **1.43**. Después, al abrir con internet, el juego consulta el manifiesto publicado en Releases. Puedes descargar contenido desde «Actualizaciones» y aplicarlo al reiniciar. Sin internet se conserva la última versión que abrió correctamente.

El canal admite cambios de JavaScript/HTML/CSS, escenarios, NPC, aliens, razas, animaciones y mejoras de la lógica online. Los cambios de funciones nativas de Android requieren una APK nueva. Photon sigue gestionando las salas; este repositorio distribuye archivos.

Cada manifiesto está firmado y cada archivo tiene SHA-256 y tamaño esperado. Una descarga incompleta no sustituye la versión activa. Si un contenido nuevo no termina de arrancar, se recupera el anterior en el siguiente inicio. La instalación se guarda aparte de las partidas.

## Publicaciones

Los archivos de una versión se preparan localmente con la herramienta privada `package_content.py`, usando la clave de actualización conservada en el respaldo del proyecto. **Nunca subas esa clave, las claves de firma Android ni el ZIP completo del código a este repositorio.**

Los paquetes preparados se añaden a `releases/original/VERSION/`. El flujo `Publish Original content` comprueba la firma con `original-update-public.pem`, verifica los archivos y publica una GitHub Release. La APK consulta `releases/latest/download/original-manifest.json`.

La primera publicación 1.43.0 registra el contenido incluido en la APK inicial: no necesita volver a descargar los mapas existentes. Las siguientes contienen los cambios acumulados respecto de esa base; el teléfono reutiliza archivos cuyo hash ya tenga.

No deben mezclarse publicaciones Creator en este repositorio. Las versiones de protocolo online incompatibles deben cambiar su identificador de salas al preparar una actualización de contenido.
