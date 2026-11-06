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
    request = urllib.request.Request(
        url, headers={"User-Agent": "OmniBlizz-Original-Preflight/1.0",
                      "Accept": "application/vnd.github+json"})
    with urllib.request.urlopen(request, timeout=120) as response:
        data = response.read(24 * 1024 * 1024 + 1)
    require(len(data) <= 24 * 1024 * 1024, "Descarga demasiado grande")
    return data


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


def prepare_unsigned_payloads(manifest, content, candidate, game_bytes):
    """Copia el estado vigente; solo game.js y los metadatos de version cambian.

    NO firma, NO publica, NO crea un manifest instalable.
    """
    original = copy.deepcopy(manifest)
    full = copy.deepcopy(content)
    sha = checksum(game_bytes)
    version, revision, notes = (candidate["version"], candidate["revision"],
                                candidate["notes"])
    require(sha != next(f["sha256"] for f in manifest["files"]
                        if f["path"] == "game.js"), "Sin cambios en game.js")
    for payload in (original, full):
        payload["version"] = version
        payload["revision"] = revision
        payload["notes"] = notes

    game_original = next(f for f in original["files"] if f["path"] == "game.js")
    game_original.update({
        "sha256": sha,
        "bytes": len(game_bytes),
        "url": f"{DOWNLOAD_PREFIX}{version}/original-{sha}.bin",
    })
    game_full = next(f for f in full["files"] if f["path"] == "game.js")
    old_pack = game_full["pack"]
    game_full.update({
        "sha256": sha, "bytes": len(game_bytes), "pack": sha, "offset": 0
    })
    require(sha not in {p["sha256"] for p in full["packs"]},
            "Colision con pack ya existente")
    if not any(f["pack"] == old_pack for f in full["files"]):
        full["packs"] = [p for p in full["packs"] if p["sha256"] != old_pack]
    full["packs"].append({
        "sha256": sha, "bytes": len(game_bytes),
        "url": f"{DOWNLOAD_PREFIX}{version}/content-{sha}.bin"
    })
    # Garantia: los recursos no editados mantienen exactamente su metadata.
    for previous, updated in ((manifest, original), (content, full)):
        old_other = {f["path"]: f for f in previous["files"] if f["path"] != "game.js"}
        new_other = {f["path"]: f for f in updated["files"] if f["path"] != "game.js"}
        require(old_other == new_other,
                "Se alteraron recursos ajenos a game.js")
        require(len(previous["files"]) == len(updated["files"]),
                "El candidato pierde recursos")
    validate_manifest_files(original)
    validate_manifest_files(full, is_content=True)
    require(next(f["sha256"] for f in original["files"]
                 if f["path"] == "game.js")
            == next(f["sha256"] for f in full["files"]
                    if f["path"] == "game.js"),
            "SHA de game.js no coincide en los borradores")
    return original, full


def stage_candidate(manifest, full_manifest, files, candidate_dir, out_dir):
    game = candidate_dir / "game.js"
    release_file = candidate_dir / "release.json"
    if not game.exists() and not release_file.exists():
        print("Sin candidato: se verifico la release vigente, sin crear ni publicar otra.")
        return
    require(game.is_file() and release_file.is_file(),
            "Un candidato requiere candidate/game.js y candidate/release.json")
    candidate = json_bytes(release_file.read_bytes())
    require(set(candidate) == {"version", "revision", "notes"},
            "release.json debe contener solo version, revision y notes")
    require(semver(candidate["version"]) > semver(manifest["version"]),
            "La nueva version debe superar la ultima release")
    require(type(candidate["revision"]) is int
            and candidate["revision"] > manifest["revision"],
            "La nueva revision debe aumentar")
    require(isinstance(candidate["notes"], str) and candidate["notes"].strip()
            and len(candidate["notes"]) <= 2000, "Faltan notas de la version")
    require(game.stat().st_size <= 24 * 1024 * 1024, "game.js demasiado grande")
    # Reduce el riesgo de cargar un archivo de prueba o codigo de otra version.
    require(game.stat().st_size >= files["game.js"]["bytes"] * 0.90,
            "game.js demasiado pequeno: parece incompleto o de una version antigua")
    result = subprocess.run(["node", "--check", str(game)],
                            capture_output=True, text=True, check=False)
    require(result.returncode == 0, "JavaScript invalido: " + result.stderr[:500])
    contents = game.read_bytes()
    sha = checksum(contents)
    require(sha != files["game.js"]["sha256"],
            "El candidato es identico a game.js de la release vigente")
    original_payload, content_payload = prepare_unsigned_payloads(
        manifest, full_manifest, candidate, contents)
    out_dir.mkdir(parents=True, exist_ok=True)
    report = {
        "status": "UNSIGNED_NOT_PUBLISHED",
        "edition": "original",
        "base_version": manifest["version"],
        "base_revision": manifest["revision"],
        "candidate_version": candidate["version"],
        "candidate_revision": candidate["revision"],
        "notes": candidate["notes"],
        "game_js_sha256": sha,
        "game_js_bytes": len(contents),
        "original_file_count": len(original_payload["files"]),
        "content_file_count": len(content_payload["files"]),
        "ota_assets_draft": [f"original-{sha}.bin", f"content-{sha}.bin"],
        "warning": "NO ES OTA FIRMADA NI APK. Requiere revision, firma original y autorizacion."
    }
    metadata = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    output = out_dir / "OmniBlizz-Candidato-SIN-FIRMA.zip"
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as zip_out:
        zip_out.writestr("game.js", contents)
        zip_out.writestr(f"original-{sha}.bin", contents)
        zip_out.writestr(f"content-{sha}.bin", contents)
        zip_out.writestr("original-manifest.PAYLOAD-SIN-FIRMA.json",
                         json.dumps(original_payload, ensure_ascii=False,
                                    separators=(",", ":"), sort_keys=True) + "\n")
        zip_out.writestr("original-content-manifest.PAYLOAD-SIN-FIRMA.json",
                         json.dumps(content_payload, ensure_ascii=False,
                                    separators=(",", ":"), sort_keys=True) + "\n")
        zip_out.writestr("candidate-report.json", metadata)
    (out_dir / "candidate-report.json").write_text(metadata, encoding="utf-8")
    print(f"Candidato validado y empaquetado SIN FIRMA: {output}")


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
