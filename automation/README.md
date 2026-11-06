# Automatización segura de OmniBlizz Original

**Estado:** propuesta de Pull Request. El flujo de validación es de solo lectura. Hay un nuevo publicador de Releases que únicamente se habilitará cuando el propietario apruebe el PR y active el entorno protegido; no modifica la web ni compila APK.

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
6. Ejecuta pruebas unitarias sin red que garantizan conservación de recursos. En un **entorno privado**, también puede validar un nuevo game.js y crear BINs nuevos junto a borradores **sin firma** de ambos manifiestos. Ninguna clave privada se usa.
7. **No crea releases, no cambia `main`, no despliega Pages, no accede a secretos, no publica APK.**

## Cómo preparar una actualización futura (solo en entorno PRIVADO)

**IMPORTANTE: NO subir el código editable completo de OmniBlizz a este repositorio público, ni siquiera dentro de una rama o Pull Request.** Las reglas .gitignore y los controles de CI ayudan, pero no sustituyen la revisión antes de cada commit.

En un directorio de trabajo local o en un futuro repositorio realmente privado, preparar:

- `candidate/game.js`: versión **nueva** del código completo, mantenida de manera privada.
- `candidate/release.json`:

```json
{
  "version": "2.43.27",
  "revision": 339,
  "notes": "Descripción de los cambios reales"
}
```

Los números son **solo un ejemplo**: consultar siempre Latest antes de escogerlos. El script rechazará versiones o revisiones no superiores, un `game.js` idéntico al actual o un archivo sospechosamente pequeño.

En el entorno privado, con un Python 3, Node.js y OpenSSL disponibles, ejecutar:

```bash
python3 automation/validate_and_stage.py --candidate-dir candidate --output-dir dist
```

El resultado `OmniBlizz-Candidato-SIN-FIRMA.zip` contiene los BIN nuevos de `game.js`, borradores de los dos payloads JSON y un informe de integridad. **No contiene los manifiestos firmados necesarios para que una OTA sea instalable**. El workflow público de GitHub verifica la última release real y ejecuta las pruebas sin recibir el código privado.

Para publicar una OTA real, se necesita firmar los borradores con la **clave OTA original**, validarlos y obtener una autorización explícita separada. Nunca subir la clave al repositorio público; el keystore de Android para compilar APK es distinto.

**Firmas y seguridad:** la clave OTA privada se conserva fuera del repositorio y no se incluye en GitHub Actions, variables, artefactos ni logs de este Pull Request. Si más adelante se diseña un flujo de firma online, será una propuesta separada con aislamiento/protección de credenciales, aprobación humana y prueba contra el APK instalado. La firma Android de APK requiere además el keystore Android original; la clave OTA es distinta.

## Cosas que deliberadamente no se modifican

- Los workflows existentes `pages.yml` y `windows.yml`. **Sí se reemplaza en este PR `publish-original.yml`**, cuyo anterior proceso de reconstrucción está desactualizado: el nuevo publicador verifica una carpeta de OTA ya firmada y solo publica si se activa explícitamente el entorno `original-release`.
- Los manifiestos ya firmados y todos los releases publicados.
- La edición Creator.
- Guardado de jugadores, dominio, pity, misiones, interfaces ni la aplicación Android.

## Publicación con aprobación

El nuevo sistema de firma local, verificación de Release y publicación en GitHub está descrito en [PUBLICACION.md](PUBLICACION.md). La firma se hace fuera de GitHub público. El flujo de publicación espera archivos firmados de `releases/original/VERSION/` y requiere `OMNIBLIZZ_RELEASES_ENABLED=true` en el entorno `original-release`; sin ello no publica nada.

## Para aprobar este Pull Request

Revisar los archivos incluidos, comprobar el resultado de la acción de validación y **no fusionar automáticamente**. Una aprobación posterior y separada será necesaria para modificar el despliegue de la web y habilitar publicación de nuevas OTA.

El objetivo es reducir repetición de pruebas y evitar sobrescribir builds sin sacrificar seguridad; no garantiza capacidad ilimitada de ChatGPT ni sustituye el trabajo de desarrollar mejoras.
