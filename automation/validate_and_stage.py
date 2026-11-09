#!/usr/bin/env python3
"""Preflight de OmniBlizz Original: solo lectura, sin claves privadas ni publicación."""
import argparse
import copy
import base64
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile
import urllib.error
import urllib.request
import zipfile

REPO = "ventisca-gif/omniblizz-updates"
API = f"https://api.github.com/repos/{REPO}/releases/latest"
DOWNLOAD_PREFIX = f"https://github.com/{REPO}/releases/download/v"
SHA256 = re.compile(r"[0-9a-f]{64}\Z")
VERSION = re.compile(r"[0-9]+\.[0-9]+\.[0-9]+\Z")
BASELINE_VERSION = (2, 43, 26)
BASELINE_REVISION = 338


def require(condition, message):
    if not condition:
        raise ValueError(message)


def get(url):
    require(url.startswith(("https://api.github.com/", DOWNLOAD_PREFIX)), "URL no autorizada")
    asset = re.fullmatch(
        re.escape(DOWNLOAD_PREFIX)
        + r"([0-9]+\.[0-9]+\.[0-9]+)/(original-(?:content-)?manifest\.json|"
          r"(?:original|content)-[0-9a-f]{64}\.bin)",
        url,
    )

    def download(source, timeout):
        request = urllib.request.Request(
            source, headers={"User-Agent": "OmniBlizz-Original-Preflight/1.0",
                             "Accept": "application/vnd.github+json"})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            data = response.read(24 * 1024 * 1024 + 1)
        require(len(data) <= 24 * 1024 * 1024, "Descarga demasiado grande")
        return data

    try:
        return download(url, timeout=20 if asset else 120)
    except urllib.error.HTTPError as error:
        if not asset or error.code not in {500, 502, 503, 504}:
            raise
    except (urllib.error.URLError, TimeoutError):
        if not asset:
            raise

    # New releases commit the signed bytes at the same tag. The caller still
    # verifies the signature or the expected SHA-256 and length of every file.
    version, filename = asset.groups()
    mirror = f"https://raw.githubusercontent.com/{REPO}/v{version}/releases/original/{version}/{filename}"
    print(f"Descarga temporalmente indisponible: {filename}. Verificando los bytes del tag v{version}.")
    return download(mirror, timeout=20)


def json_bytes(data):
    return json.loads(data.decode("utf-8"))


def semver(value):
    require(isinstance(value, str) and VERSION.fullmatch(value), "Version invalida")
    return tuple(map(int, value.split(".")))


def safe_path(value):
    require(isinstance(value, str) and value and "\\" not in value
            and not value.startswith("/") and all(
                part not in ("", ".", "..") for part in value.split("/")
            ), f"Ruta de archivo insegura: {value!r}")


def checksum(blob):
    return hashlib.sha256(blob).hexdigest()


def check_url(url, expected_prefix, expected_sha):
    require(isinstance(url, str) and url.startswith(DOWNLOAD_PREFIX),
            "URL OTA fuera del repositorio original")
    require(url.endswith(f"/{expected_prefix}-{expected_sha}.bin"),
            "El nombre del recurso OTA no corresponde al SHA-256")


def verify_envelope(raw, key, expected_schema):
    envelope = json_bytes(raw)
    require(set(("payload", "signature")).issubset(envelope),
            "Faltan datos de firma")
    payload = base64.b64decode(envelope["payload"], validate=True)
    signature = base64.b64decode(envelope["signature"], validate=True)
    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        (base / "payload").write_bytes(payload)
        (base / "signature").write_bytes(signature)
        result = subprocess.run(
            ["openssl", "dgst", "-sha256", "-verify", str(key.resolve()),
             "-signature", str(base / "signature"), str(base / "payload")],
            capture_output=True, text=True, check=False)
        require(result.returncode == 0,
                "Firma OTA no valida: " + result.stderr.strip()[:200])
    value = json_bytes(payload)
    require(value.get("edition") == "original"
            and value.get("schema") == expected_schema, "Edicion o esquema incorrecto")
    require(isinstance(value.get("revision"), int), "Revision no valida")
    semver(value.get("version"))
    require(isinstance(value.get("files"), list) and value["files"],
            "Manifiesto sin archivos")
    return value


def validate_manifest_files(manifest, is_content=False):
    packs = {}
    if is_content:
        require(manifest.get("full") is True, "Falta indicador de contenido completo")
        for pack in manifest.get("packs", []):
            sha = pack.get("sha256")
            require(isinstance(sha, str) and SHA256.fullmatch(sha), "SHA de pack invalido")
            require(isinstance(pack.get("bytes"), int) and pack["bytes"] >= 0,
                    "Tamano de pack invalido")
            check_url(pack.get("url"), "content", sha)
            require(sha not in packs, "Pack duplicado")
            packs[sha] = pack["bytes"]
    seen = set()
    for item in manifest["files"]:
        path = item.get("path")
        safe_path(path)
        require(path not in seen, f"Ruta repetida: {path}")
        seen.add(path)
        sha = item.get("sha256")
        require(isinstance(sha, str) and SHA256.fullmatch(sha), "SHA invalido")
        size = item.get("bytes")
        require(isinstance(size, int) and size >= 0, "Tamano invalido")
        if is_content:
            pack_sha, offset = item.get("pack"), item.get("offset")
            require(pack_sha in packs and isinstance(offset, int)
                    and offset >= 0 and offset + size <= packs[pack_sha],
                    f"Offset fuera del pack: {path}")
        else:
            check_url(item.get("url"), "original", sha)
    return {item["path"]: item for item in manifest["files"]}


def verify_current_release():
    release = json_bytes(get(API))
    tag = release.get("tag_name")
    require(isinstance(tag, str) and tag.startswith("v")
            and not release.get("draft") and not release.get("prerelease"),
            "No hay ultima release estable valida")
    assets = {item["name"]: item for item in release["assets"]}
    required = ("original-manifest.json", "original-content-manifest.json")
    require(all(item in assets for item in required),
            "La ultima release no contiene ambos manifiestos")
    key = Path("original-update-public.pem")
    require(key.is_file(), "Falta la clave PUBLICA de verificacion")
    manifest = verify_envelope(get(assets[required[0]]["browser_download_url"]), key, 1)
    content = verify_envelope(get(assets[required[1]]["browser_download_url"]), key, 2)
    require(manifest["version"] == content["version"]
            and manifest["revision"] == content["revision"]
            and tag == "v" + manifest["version"],
            "Version/revision/tag distintos entre los manifiestos")
    require(semver(manifest["version"]) >= BASELINE_VERSION
            and manifest["revision"] >= BASELINE_REVISION,
            "La ultima release retrocede respecto de 2.43.26 revision 338")
    base_files = validate_manifest_files(manifest)
    full_files = validate_manifest_files(content, is_content=True)
    require("game.js" in base_files and "game.js" in full_files
            and base_files["game.js"]["sha256"] == full_files["game.js"]["sha256"],
            "El archivo game.js difiere entre ambos manifiestos")
    binary_count = 0
    for name, asset in assets.items():
        if not name.endswith(".bin"):
            continue
        match = re.fullmatch(r"(?:content|original)-([0-9a-f]{64})\.bin", name)
        require(match is not None, "Asset BIN con nombre inesperado")
        expected = match.group(1)
        payload = get(asset["browser_download_url"])
        require(checksum(payload) == expected, "SHA-256 incorrecto: " + name)
        require(len(payload) == asset["size"], "Tamano incorrecto: " + name)
        if name == f"original-{base_files['game.js']['sha256']}.bin":
            require(len(payload) == base_files["game.js"]["bytes"],
                    "Tamano de game.js difiere del manifiesto")
            # El codigo vigente se analiza, pero NO se ejecuta.
            with tempfile.TemporaryDirectory() as temp_dir:
                game_path = Path(temp_dir) / "game.js"
                game_path.write_bytes(payload)
                result = subprocess.run(
                    ["node", "--check", str(game_path)],
                    capture_output=True, text=True, check=False)
                require(result.returncode == 0,
                        "Sintaxis invalida en Latest game.js: " + result.stderr[:350])
            print("OK: sintaxis de game.js publicado en Latest")
        binary_count += 1
    require(binary_count > 0, "La release no contiene assets OTA")
    print(f"OK: release {tag} revision {manifest['revision']}; "
          f"{len(base_files)} archivos Original, {len(full_files)} archivos content; "
          f"{binary_count} BIN verificados; firmas validas.")
    return manifest, content, base_files, full_files


# Limits and path grammar accepted by the deployed schema-2 updater (shell 189).
MAX_ASSET_BYTES = 8 * 1024 * 1024
MAX_CONTENT_BYTES = 1024 * 1024 * 1024
MIMES = {".js": "text/javascript", ".json": "application/json",
         ".html": "text/html", ".css": "text/css", ".txt": "text/plain",
         ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg",
         ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".gif": "image/gif",
         ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".ogg": "audio/ogg",
         ".wav": "audio/wav", ".mp4": "video/mp4", ".webm": "video/webm",
         ".ttf": "font/ttf", ".otf": "font/otf", ".woff": "font/woff",
         ".woff2": "font/woff2"}


def content_path(path):
    safe_path(path)
    require(len(path) < 240 and re.fullmatch(r"[a-zA-Z0-9_./@ -]+", path),
            "Ruta incompatible con la APK: " + path)
    parts = path.lower().split("/")
    require(not any(p.startswith(".") for p in parts)
            and parts[0] not in {"update147", "meta-inf", "private", "android"}
            and path.lower() != "index.html"
            and not any(x in path.lower() for x in
                        ("update-signing", "private-key", "signing-key", "keystore")),
            "Ruta reservada o privada: " + path)
    require(Path(path).suffix.lower() in MIMES,
            "Tipo de recurso no soportado: " + path)
    return MIMES[Path(path).suffix.lower()]


def validate_blob(path, data):
    mime = content_path(path)
    require(isinstance(data, bytes) and 0 < len(data) <= MAX_ASSET_BYTES,
            "Cada recurso debe ocupar entre 1 byte y 8 MiB: " + path)
    # Secrets and APK/native files must never be disguised as normal content.
    require(b"PRIVATE KEY-----" not in data and not data.startswith(b"PK\x03\x04"),
            "Credencial o archivo empaquetado no permitido: " + path)
    if Path(path).suffix.lower() in {".js", ".json", ".html", ".css", ".txt", ".svg"}:
        data.decode("utf-8")
    if Path(path).suffix.lower() == ".json":
        json_bytes(data)
    if Path(path).suffix.lower() == ".js":
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "check.js"
            f.write_bytes(data)
            r = subprocess.run(["node", "--check", str(f)], capture_output=True)
            require(r.returncode == 0, "JavaScript invalido: " + path)
    return mime


def candidate_inputs(directory, current, previous_files):
    require(directory.is_dir() and not directory.is_symlink(), "Candidato inseguro")
    require({p.name for p in directory.iterdir()} <= {"game.js", "release.json", "assets", "README.md"},
            "Archivos inesperados en candidato; recursos deben ir en assets/")
    metadata = directory / "release.json"
    game = directory / "game.js"
    require(metadata.is_file() and game.is_file()
            and not metadata.is_symlink() and not game.is_symlink(), "Candidato incompleto")
    meta = json_bytes(metadata.read_bytes())
    require(set(meta) == {"version", "revision", "notes"}, "Metadatos de candidato invalidos")
    require(semver(meta["version"]) > semver(current["version"]), "Version obsoleta")
    require(type(meta["revision"]) is int and meta["revision"] > current["revision"], "Revision obsoleta")
    require(isinstance(meta["notes"], str) and meta["notes"].strip()
            and len(meta["notes"]) <= 2000, "Notas invalidas")
    require(game.stat().st_size <= MAX_ASSET_BYTES, "game.js supera 8 MiB")
    game_bytes = game.read_bytes()
    require(len(game_bytes) >= previous_files["game.js"]["bytes"] * 0.90,
            "game.js parece incompleto")
    validate_blob("game.js", game_bytes)
    assets = read_asset_overlay(directory / "assets")
    return meta, game_bytes, assets


def read_asset_overlay(root):
    assets, total = {}, 0
    if root.exists() or root.is_symlink():
        require(root.is_dir() and not root.is_symlink(), "assets/ no puede ser symlink")
        for p in sorted(root.rglob("*")):
            require(not p.is_symlink(), "No se permiten symlinks en assets/")
            if p.is_dir():
                continue
            require(p.is_file(), "Recurso no regular")
            name = p.relative_to(root).as_posix()
            require(name != "game.js", "game.js debe estar en codigo/ o raiz del candidato")
            require(p.stat().st_size <= MAX_ASSET_BYTES, "Recurso supera 8 MiB: " + name)
            data = p.read_bytes()
            validate_blob(name, data)
            total += len(data)
            require(total <= MAX_CONTENT_BYTES and len(assets) < 19999, "Candidato demasiado grande")
            assets[name] = data
    return assets


def prepare_unsigned_payloads(manifest, content, candidate, game_bytes, assets=None):
    """Overlay aditivo: mantiene todo lo no editado; nunca borra contenido previo."""
    original, full = copy.deepcopy(manifest), copy.deepcopy(content)
    old_raw = validate_manifest_files(manifest)
    old_full = validate_manifest_files(content, is_content=True)
    changes = dict(assets or {})
    if game_bytes is not None:
        changes["game.js"] = game_bytes
    raw = {f["path"]: f for f in original["files"]}
    packed = {f["path"]: f for f in full["files"]}
    packs = {p["sha256"]: p for p in full["packs"]}
    touched = []
    case_paths = {p.casefold(): p for p in set(raw) | set(packed)}
    for path, data in sorted(changes.items()):
        mime = validate_blob(path, data)
        require(path.casefold() not in case_paths or case_paths[path.casefold()] == path,
                "Rutas ambiguas por mayusculas: " + path)
        case_paths[path.casefold()] = path
        sha = checksum(data)
        previous = old_full.get(path)
        if previous and previous["sha256"] == sha and previous["bytes"] == len(data):
            continue
        touched.append(path)
        base = {"path": path, "sha256": sha, "bytes": len(data), "mime": mime}
        raw[path] = dict(base, url=f"{DOWNLOAD_PREFIX}{candidate['version']}/original-{sha}.bin")
        packed[path] = dict(base, pack=sha, offset=0)
        if sha not in packs:
            packs[sha] = {"sha256": sha, "bytes": len(data),
                          "url": f"{DOWNLOAD_PREFIX}{candidate['version']}/content-{sha}.bin"}
        require(packs[sha]["bytes"] == len(data), "Colision de pack")
    require(touched, "Sin cambios de contenido")
    used = {f["pack"] for f in packed.values()}
    full["packs"] = [p for sha, p in packs.items() if sha in used]
    original["files"], full["files"] = list(raw.values()), list(packed.values())
    for payload in (original, full):
        for key in ("version", "revision", "notes"):
            payload[key] = candidate[key]
    require(len(full["files"]) <= 20000 and len(full["packs"]) <= 2000
            and sum(f["bytes"] for f in full["files"]) <= MAX_CONTENT_BYTES,
            "Contenido supera los limites de la APK")
    require(len(base64.b64encode(json.dumps(full, separators=(",", ":"), sort_keys=True,
                                           ensure_ascii=False).encode("utf-8"))) <= 3 * 1024 * 1024,
            "Manifiesto supera el limite de la APK (3 MiB de payload base64)")
    # Includes paths only present in the full manifest, without dropping them.
    require(set(old_raw) <= set(raw) and set(old_full) <= set(packed), "Se pierden recursos previos")
    validate_manifest_files(original)
    validate_manifest_files(full, is_content=True)
    return original, full


def release_binaries(manifest, full, previous, old_full, data):
    """Return exactly the changed/new BIN files; deduplicate identical content."""
    result = {}
    raw_old = {f["path"]: f for f in previous["files"]}
    packed_old = {f["path"]: f for f in old_full["files"]}
    old_packs = {p["sha256"] for p in old_full["packs"]}
    for f in manifest["files"]:
        if f != raw_old.get(f["path"]):
            blob = data[f["path"]]
            require(checksum(blob) == f["sha256"], "BIN Original incorrecto")
            result[f"original-{f['sha256']}.bin"] = blob
    for f in full["files"]:
        if f != packed_old.get(f["path"]) and f["pack"] not in old_packs:
            result[f"content-{f['pack']}.bin"] = data[f["path"]]
    return result


def stage_candidate(manifest, full_manifest, files, candidate_dir, out_dir):
    if not (candidate_dir / "game.js").exists() and not (candidate_dir / "release.json").exists():
        print("Sin candidato; no se publica nada.")
        return
    meta, game, assets = candidate_inputs(candidate_dir, manifest, files)
    original, full = prepare_unsigned_payloads(manifest, full_manifest, meta, game, assets)
    blobs = release_binaries(original, full, manifest, full_manifest, dict(assets, **{"game.js": game}))
    report = {"status": "UNSIGNED_NOT_PUBLISHED", "edition": "original",
              "base_version": manifest["version"], "candidate_version": meta["version"],
              "candidate_revision": meta["revision"], "ota_assets_draft": sorted(blobs),
              "original_file_count": len(original["files"]), "content_file_count": len(full["files"])}
    out_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out_dir / "OmniBlizz-Candidato-SIN-FIRMA.zip", "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("game.js", game)
        for name, data in blobs.items():
            z.writestr(name, data)
        for name, payload in (("original-manifest", original), ("original-content-manifest", full)):
            z.writestr(name + ".PAYLOAD-SIN-FIRMA.json", json.dumps(payload, ensure_ascii=False))
        z.writestr("candidate-report.json", json.dumps(report))
    (out_dir / "candidate-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("Candidato de codigo y recursos SIN FIRMA, NO PUBLICADO")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate-dir", default="candidate", type=Path)
    parser.add_argument("--output-dir", default="dist", type=Path)
    args = parser.parse_args()
    manifest, full_manifest, files, _ = verify_current_release()
    stage_candidate(manifest, full_manifest, files,
                    args.candidate_dir, args.output_dir)


if __name__ == "__main__":
    main()

