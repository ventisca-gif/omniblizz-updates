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
    validate_manifest_files, verify_current_release, verify_envelope
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
    require(set(new_files) == set(old_files),
            "Se han añadido/eliminado rutas; este flujo admite SOLO game.js")
    require(set(content_files) == {x["path"] for x in old_full["files"]},
            "Se han añadido/eliminado rutas en contenido completo")
    require(new_files["game.js"]["sha256"] ==
            content_files["game.js"]["sha256"],
            "Game.js tiene hashes distintos entre manifiestos")
    newsha = new_files["game.js"]["sha256"]
    require(newsha != old_files["game.js"]["sha256"],
            "Game.js no cambió")
    for item in original["files"]:
        if item["path"] != "game.js":
            require(item == old_files[item["path"]],
                    "Un recurso Original anterior fue alterado: " + item["path"])
    prev_content = {x["path"]: x for x in old_full["files"]}
    for item in full["files"]:
        if item["path"] != "game.js":
            require(item == prev_content[item["path"]],
                    "Un recurso de contenido anterior fue alterado")
    require(new_files["game.js"]["url"] ==
            f"{DOWNLOAD_PREFIX}{version}/original-{newsha}.bin",
            "URL Original nueva incorrecta")
    require(content_files["game.js"]["pack"] == newsha and
            content_files["game.js"]["offset"] == 0,
            "Game.js no está en su pack propio")
    pack = next((p for p in full["packs"] if p["sha256"] == newsha), None)
    require(pack is not None and
            pack["url"] == f"{DOWNLOAD_PREFIX}{version}/content-{newsha}.bin",
            "Falta pack content nuevo")
    # El pack de game.js previo se elimina solamente si nadie más lo usa.
    old_pack = prev_content["game.js"]["pack"]
    expected_packs = [
        p for p in old_full["packs"]
        if p["sha256"] != old_pack or
        any(f["pack"] == old_pack and f["path"] != "game.js"
            for f in old_full["files"])
    ]
    new_packs = [p for p in full["packs"] if p["sha256"] != newsha]
    require(new_packs == expected_packs,
            "Se alteraron otros packs que pertenecen a versiones anteriores")
    expected_bin = {f"original-{newsha}.bin", f"content-{newsha}.bin"}
    present_bin = {f for f in payloads if f.endswith(".bin")}
    require(present_bin == expected_bin,
            "BIN faltantes o inesperados; solo game.js puede cambiar")
    for name in expected_bin:
        require(checksum(payloads[name]) == newsha,
                "BIN nuevo no coincide con hash de game.js")
        require(len(payloads[name]) == new_files["game.js"]["bytes"],
                "Tamano de BIN no coincide con manifest")
    require(pack["bytes"] == new_files["game.js"]["bytes"],
            "Tamano de pack no coincide con game.js")
    text = payloads["release-notes.md"].decode("utf-8")
    require(text.startswith("# OmniBlizz Original " + version + "\n"),
            "Notas de release no coinciden con version")
    hashes = json.loads(payloads["SHA256SUMS.json"].decode("utf-8"))
    actual = {n: {"sha256": checksum(v), "bytes": len(v)}
              for n, v in payloads.items() if n != "SHA256SUMS.json"}
    require(hashes == actual, "SHA256SUMS.json inconsistente")
    require(set(payloads) == required | expected_bin,
            "Archivo adicional inesperado en carpeta de publicacion")
    print(f"OK: v{version} rev{original['revision']}; "
          f"ambas firmas verificadas; solo game.js cambia; "
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
