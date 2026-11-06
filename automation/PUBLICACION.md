# Publicacion automatica segura de OmniBlizz Original

**IMPORTANTE:** Este repositorio es PUBLICO; aqui no se sube ninguna clave privada, keystore Android, contrasena, respaldo de continuidad PRIVADA ni el codigo editable de desarrollo.

**Version inicial:** ultima release publica real `v2.43.26`, revision `338`, al 5 de noviembre de 2026.

## Arquitectura

1. **Desarrollo privado/local**: conserva `game.js`, nuevos sprites y proyectos Android sin exponerlos en GitHub publico.
2. **Firma OTA local con clave ORIGINAL**: `automation/sign_candidate_locally.py` verifica la clave RSA privada frente a `original-update-public.pem`, comprueba version, revision y sintaxis JS, y firma ambos manifiestos. No requiere dar la clave a GitHub. Actualmente soporta cambios en **game.js solamente**.
3. **Pull Request publico SOLO con archivos ya firmados**: la carpeta `releases/original/VERSION/` contiene dos manifiestos firmados, dos archivos BIN nuevos, `release-notes.md` y `SHA256SUMS.json`. El PR se verifica; las versiones anteriores NO se reemplazan. Ese contenido es deliberadamente publico: sera descargado por las APK.
4. **Publicacion GitHub Actions**: despues de aprobar y fusionar el PR, `.github/workflows/publish-original.yml` revisa firmas, hashes, rutas, versiones y que los demas recursos permanezcan iguales. Primero crea una release **borrador**, sube los BIN y solo entonces la publica como Latest.
5. **Bloqueo a prueba de error**: antes de publicar, el workflow exige la variable `OMNIBLIZZ_RELEASES_ENABLED=true` configurada en el entorno `original-release`. Si no existe, la publicacion se bloquea. Un entorno no configurado carece de protecciones automaticas por defecto, asi que **se recomienda activar 'Required reviewers'** en el entorno publico.

## Habilitar publicacion una sola vez en GitHub

La conexion GitHub actual no dispone de un endpoint para crear y configurar entornos. El propietario debe hacer esta configuracion en GitHub:

1. Abrir `https://github.com/ventisca-gif/omniblizz-updates/settings/environments`.
2. Crear ambiente **original-release**.
3. Seleccionar **Required reviewers**, añadir `ventisca-gif`, guardar. Si solo el propietario administrara la cuenta, **no activar Prevent self-review**, porque no habria quien aprobara.
4. En **Environment variables**, crear `OMNIBLIZZ_RELEASES_ENABLED` con valor exacto `true`.
5. Opcionalmente, limitar los **Deployment branches** a `main`.
6. Revisar y fusionar el PR #2 una vez las pruebas esten verdes. La instalacion del workflow en main **no publica nada** mientras no haya una nueva version firmada.
7. Al incluir una version firmada nueva en `releases/original/VERSION/`, un merge a `main` lanza la validacion. GitHub pedira aprobar la publicacion en **Review deployments**; al aceptar, continuara automaticamente. **No es necesario iniciar la Release a mano.**

Documentacion GitHub: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments

## Preparar una version futura (SOLO en ambiente privado/local)

En un directorio local de trabajo privado (NO dentro del repositorio publico), conservar `candidate/game.js`, `candidate/release.json`, `original-update-public.pem` y una copia descargada de `automation/`. La clave OTA privada original permanece fuera del repositorio publico.

Ejemplo de `candidate/release.json` (**NO es una nueva version real publicada**):

```json
{"version":"2.43.27","revision":339,"notes":"Notas de las nuevas mejoras"}
```

Para crear el paquete **firmado, pero todavia NO publicado**:

```bash
python3 automation/sign_candidate_locally.py \
  --candidate-dir candidate \
  --out-root releases/original \
  --private-key /ruta/externa/segura/update-signing.pem
```

El programa rechaza versiones que no superan Latest, `game.js` sin cambios y firmas de otra clave. Genera `releases/original/VERSION/` sin incluir la clave. Antes de subir esa carpeta para PR, revisar su contenido; dejar afuera el directorio `candidate`.

Para comprobar los archivos firmados localmente antes de un PR:

```bash
python3 automation/verify_staged_release.py --root releases/original --version VERSION
```

No confundir el ZIP `OmniBlizz-Candidato-SIN-FIRMA.zip` (solo borrador) con una carpeta OTA firmada.

## Limitaciones y siguientes fases

- Este primer publicador automatiza versiones **Original que solo cambian game.js**; para archivos nuevos de arte u otros recursos se debe extender el empaquetador y sus pruebas antes de autorizar la publicacion.
- La edicion **Creator** requiere repo, clave de verificacion y protocolo propios; no usar la firma Original a ciegas.
- La **APK Android** necesita el proyecto Android y su keystore de firma; un OTA firmado no es una APK nueva.
- **Web Pages** sigue usando el proceso antiguo y no se despliega automaticamente desde este flujo. Hacer migracion con pruebas separadas.
- Para compilar totalmente desde GitHub un nuevo `game.js` se necesita un **repositorio privado de desarrollo** y decidir una politica segura de firma (secreto protegido, CI privada, o firma local).
- Recomendado: conservar copias seguras offline de ambas claves y respaldos; **jamás publicar claves ni contrasenas en Issues/PR**.

**Regla de oro:** PR firmado → pruebas → merge con aprobacion → GitHub Actions verifica → aprobacion de entorno → publica Release. Nunca sustituir una Release existente.
