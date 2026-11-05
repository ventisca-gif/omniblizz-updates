# Automatización segura de OmniBlizz Original

**Estado:** propuesta de Pull Request. No publica contenido, no modifica la web y no firma actualizaciones.

## Punto de partida confirmado (5 de noviembre de 2026)

- Repositorio: `ventisca-gif/omniblizz-updates` (PUBLICO).
- Última release publicada: `v2.43.26` / revisión `338`.
- La rama `main` aún tiene herramientas de construcción de la etapa 2.41.2; **no tomar el código de main como si fuera game.js 2.43.26**.
- El ZIP público de continuidad, conservado fuera de este repositorio, incluye el `game.js` exacto y los manifiestos firmados.
- El ZIP privado de continuidad, que contiene `private/update-signing.pem`, **nunca debe subirse aquí**.
- Este repositorio distribuye **Original**; no incluye el canal **Creator** ni el proyecto Android/keystore original.

## Qué hace `.github/workflows/omniblizz-automation.yml`

1. Se ejecuta al abrir/actualizar un Pull Request relevante contra `main`. También puede ejecutarse manualmente *después de que el workflow haya sido aprobado e incorporado a la rama por defecto*.
2. Tiene únicamente `permissions: contents: read` y Checkout sin credenciales persistidas.
3. Consulta la **release Latest real** de GitHub, NO el último commit de `main`.
4. Descarga ambos manifiestos de la release pública y verifica sus firmas RSA/SHA-256 con `original-update-public.pem`.
5. Valida versión, revisión, edición, rutas, hashes y referencias de recursos; verifica los SHA-256 de todos los archivos `.bin` **de la última release**. No descarga/verifica exhaustivamente todos los packs históricos que referencian los manifiestos.
6. Si hay candidato de código nuevo, valida sintaxis JS y que versión/revisión crezcan, y genera un ZIP **sin firma** como artefacto de prueba con caducidad de 7 días.
7. **No crea releases, no cambia `main`, no despliega Pages, no accede a secretos, no publica APK.**

## Cómo preparar una actualización futura (aún no se publica)

En una rama de propuesta, añadir:

- `candidate/game.js`: versión **nueva** del código completo; este repositorio es público, por lo tanto ese archivo también sería público.
- `candidate/release.json`:

```json
{
  "version": "2.43.27",
  "revision": 339,
  "notes": "Descripción de los cambios reales"
}
```

Los números son **solo un ejemplo**: consultar siempre Latest antes de escogerlos. El script rechazará versiones o revisiones no superiores, y rechazará un `game.js` idéntico al actual.

Tras las verificaciones, GitHub Actions permitirá descargar un ZIP denominado `OmniBlizz-Candidato-SIN-FIRMA.zip`. **No es una actualización OTA instalable.** Para generar una OTA real se necesita reconstruir los manifiestos/paquetes según el protocolo actual, firmarlos con la misma clave OTA original, comprobar firmas y hashes, y recibir autorización explícita de publicación. Nada de eso ocurre en esta propuesta.

**Firmas y seguridad:** la clave OTA privada se conserva fuera del repositorio y no se incluye en GitHub Actions, variables, artefactos ni logs de este Pull Request. Si más adelante se diseña un flujo de firma online, será una propuesta separada con aislamiento/protección de credenciales, aprobación humana y prueba contra el APK instalado. La firma Android de APK requiere además el keystore Android original; la clave OTA es distinta.

## Cosas que deliberadamente no se modifican

- Los workflows existentes `pages.yml`, `publish-original.yml` y `windows.yml`.
- Los manifiestos ya firmados y todos los releases publicados.
- La edición Creator.
- Guardado de jugadores, dominio, pity, misiones, interfaces ni la aplicación Android.

## Para aprobar este Pull Request

Revisar los archivos incluidos, comprobar el resultado de la acción de validación y **no fusionar automáticamente**. Una aprobación posterior y separada será necesaria para modificar el despliegue de la web y habilitar publicación de nuevas OTA.

El objetivo es reducir repetición de pruebas y evitar sobrescribir builds sin sacrificar seguridad; no garantiza capacidad ilimitada de ChatGPT ni sustituye el trabajo de desarrollar mejoras.
