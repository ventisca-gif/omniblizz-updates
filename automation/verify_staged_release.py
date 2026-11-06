#!/usr/bin/env python3
"""Valida una OTA Original ya firmada antes de publicar; solo lectura."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re

from validate_and_stage import (
    DOWNLOAD_PREFIX, checksum, require, semver,
    validate_manifest_files, verify_current_release, verify_envelope,
    prepare_unsigned_payloads, release_binaries, MAX_ASSET_BYTES
)

VERSION = re.compile(r"[0-9]+\.[0-9]+\.[0-9]+\Z")
BINARY = re.compile(r"(original|content)-([0-9a-f]{64})\.bin\Z")


def all_bytes(folder: Path):
    require(folder.is_dir(), "Falta carpeta de version firmada")
    require(not folder.is_symlink(), "La carpeta de version no puede ser symlink")
    result = {}
    for item in folder.iterdir():
        require(item.is_file() and not item.is_symlink(),
                "No se permiten subdirectorios ni symlinks en una release")
        require(item.stat().st_size <= 25 * 1024 * 1024,
                f"Archivo demasiado grande: {item.name}")
        result[item.name] = item.read_bytes()
    return result


def validate_stage(folder: Path, baseline, old_full, old_files):
    version = folder.name
    require(VERSION.fullmatch(version) is not None,
            f"Carpeta con version no valida: {version}")
    require(semver(version) > semver(baseline["version"]),
            "La version firmada no supera la version Latest")
    payloads = all_bytes(folder)
    required = {"original-manifest.json", "original-content-manifest.json",
                "release-notes.md", "SHA256SUMS.json"}
    require(required.issubset(payloads), "Carpeta firmada incompleta")
    pubkey = Path("original-update-public.pem")
    require(pubkey.is_file(), "Falta clave publica de verificacion")
    original = verify_envelope(payloads["original-manifest.json"], pubkey, 1)
    full = verify_envelope(payloads["original-content-manifest.json"], pubkey, 2)
    require(original["version"] == full["version"] == version,
            "Version distinta entre directorio y manifiestos")
    require(type(original["revision"]) is int and
            original["revision"] == full["revision"] and
            original["revision"] > baseline["revision"],
            "Revision obsoleta o distinta entre manifiestos")
    require(original["minShell"] == baseline["minShell"]
            and full["minShell"] == old_full["minShell"],
            "Cambio de minShell requiere revisión y APK separada")
    require(original["notes"] == full["notes"] and
            isinstance(original["notes"], str) and
            original["notes"].strip(), "Notas incoherentes")
    new_files = validate_manifest_files(original)
    content_files = validate_manifest_files(full, is_content=True)
    old_content = {f["path"]: f for f in old_full["files"]}
    require(set(old_files) <= set(new_files) and set(old_content) <= set(content_files),
            "Se han eliminado recursos previos")
    # Recover only changed blobs, then independently rebuild both manifests from
    # the verified previous release. This rejects unrelated edits, lost packs,
    # divergent schemas, path escapes and forged offsets/MIME/URLs.
    changed = {}
    for path, f in content_files.items():
        if f == old_content.get(path):
            continue
        name = f"original-{f['sha256']}.bin"
        require(name in payloads, "Falta BIN para recurso: " + path)
        blob = payloads[name]
        require(checksum(blob) == f["sha256"] and len(blob) == f["bytes"],
                "Hash/tamano incorrecto: " + path)
        require(len(blob) <= MAX_ASSET_BYTES, "Recurso incompatible con paquetes de 8 MiB")
        changed[path] = blob
    meta = {k: original[k] for k in ("version", "revision", "notes")}
    game = changed.pop("game.js", None)
    expected_original, expected_full = prepare_unsigned_payloads(
        baseline, old_full, meta, game, changed)
    require(original == expected_original and full == expected_full,
            "Manifiestos no corresponden al overlay aditivo verificado")
    data = dict(changed)
    if game is not None:
        data["game.js"] = game
    expected_bin = release_binaries(expected_original, expected_full, baseline, old_full, data)
    present_bin = {f: blob for f, blob in payloads.items() if f.endswith(".bin")}
    require(present_bin == expected_bin, "BIN faltantes, alterados o adicionales")
    text = payloads["release-notes.md"].decode("utf-8")
    require(text.startswith("# OmniBlizz Original " + version + "\n"),
            "Notas de release no coinciden con version")
    hashes = json.loads(payloads["SHA256SUMS.json"].decode("utf-8"))
    actual = {n: {"sha256": checksum(v), "bytes": len(v)}
              for n, v in payloads.items() if n != "SHA256SUMS.json"}
    require(hashes == actual, "SHA256SUMS.json inconsistente")
    require(set(payloads) == required | set(expected_bin),
            "Archivo adicional inesperado en carpeta de publicacion")
    print(f"OK: v{version} rev{original['revision']}; "
          f"ambas firmas verificadas; codigo y recursos verificados; "
          f"{len(original['files'])} entradas Original conservadas.")
    return version


def select_candidate(root: Path, current, requested):
    candidates = [p for p in root.iterdir() if p.is_dir()
                  and VERSION.fullmatch(p.name)
                  and semver(p.name) > semver(current["version"])]
    if requested:
        require(VERSION.fullmatch(requested), "Version manual invalida")
        candidates = [p for p in candidates if p.name == requested]
    require(len(candidates) <= 1, "Varias versiones pendientes; elegir una por version")
    return candidates[0] if candidates else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path("releases/original"))
    ap.add_argument("--version", default="")
    ap.add_argument("--output", default="")
    args = ap.parse_args()
    current, full, files, _ = verify_current_release()
    chosen = select_candidate(args.root, current, args.version)
    if chosen is None:
        print("Sin versión nueva firmada pendiente; no se publica nada.")
        if args.output:
            with open(args.output, "a", encoding="utf-8") as o:
                o.write("ready=false\n")
        return
    version = validate_stage(chosen, current, full, files)
    if args.output:
        with open(args.output, "a", encoding="utf-8") as o:
            o.write("ready=true\nversion=" + version + "\n"
                    "directory=releases/original/" + version + "\n")


if __name__ == "__main__":
    main()

