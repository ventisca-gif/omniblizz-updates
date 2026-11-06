#!/usr/bin/env python3
"""Firma OTA Original LOCALMENTE y prepara una carpeta de release; no la publica.

No subir clave privada ni contenido completo del respaldo privado a este repo.
"""
import argparse
import base64
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

from validate_and_stage import (
    checksum, get, json_bytes, prepare_unsigned_payloads, require, semver,
    validate_manifest_files, verify_current_release
)


def check_private_key(key: Path, public_key: Path):
    require(key.is_file(), "No se encontro la clave privada OTA")
    require(public_key.is_file(), "No se encontro la clave publica OTA")
    with tempfile.TemporaryDirectory() as directory:
        output = Path(directory) / "derived.pub"
        subprocess.run(["openssl", "pkey", "-in", str(key.resolve()), "-pubout",
                        "-out", str(output)], check=True, capture_output=True)
        # No compara texto PEM formateado: compara representación publica DER.
        def pubder(path):
            p = subprocess.run(
                ["openssl", "pkey", "-pubin", "-in", str(path),
                 "-pubout", "-outform", "DER"], capture_output=True, check=True)
            return p.stdout
        require(pubder(output) == pubder(public_key.resolve()),
                "La clave privada NO coincide con original-update-public.pem")


def signed_envelope(payload, key, public_key):
    raw = json.dumps(payload, separators=(",", ":"), sort_keys=True,
                     ensure_ascii=False).encode("utf-8")
    with tempfile.TemporaryDirectory() as directory:
        raw_path = Path(directory) / "payload.bin"
        signature_path = Path(directory) / "signature.bin"
        raw_path.write_bytes(raw)
        subprocess.run(["openssl", "dgst", "-sha256", "-sign", str(key.resolve()),
                        "-out", str(signature_path), str(raw_path)],
                       check=True, capture_output=True)
        subprocess.run(["openssl", "dgst", "-sha256", "-verify",
                        str(public_key.resolve()), "-signature",
                        str(signature_path), str(raw_path)],
                       check=True, capture_output=True)
        signature = signature_path.read_bytes()
    return json.dumps({
        "payload": base64.b64encode(raw).decode("ascii"),
        "signature": base64.b64encode(signature).decode("ascii")
    }, separators=(",", ":")).encode("utf-8") + b"\n"


def prepare_release(candidate_dir, out_root, key_file, public_key):
    current, full, previous_files, _ = verify_current_release()
    game = candidate_dir / "game.js"
    metadata = candidate_dir / "release.json"
    require(game.is_file() and metadata.is_file(),
            "Candidato incompleto: faltan game.js y release.json")
    candidate = json_bytes(metadata.read_bytes())
    require(set(candidate) == {"version", "revision", "notes"},
            "release.json debe contener version, revision y notes")
    require(semver(candidate["version"]) > semver(current["version"]),
            "Se intento reutilizar una version ya publicada o anterior")
    require(type(candidate["revision"]) is int
            and candidate["revision"] > current["revision"], "Revision obsoleta")
    require(isinstance(candidate["notes"], str) and
            candidate["notes"].strip() and len(candidate["notes"]) <= 2000,
            "Las notas deben ser un texto no vacio de menos de 2000 caracteres")
    game_bytes = game.read_bytes()
    require(len(game_bytes) <= 24 * 1024 * 1024 and
            len(game_bytes) >= previous_files["game.js"]["bytes"] * 0.90,
            "El codigo parece incompleto o demasiado grande")
    js = subprocess.run(["node", "--check", str(game)], check=False,
                        capture_output=True, text=True)
    require(js.returncode == 0, "Codigo JavaScript invalido")
    sha = checksum(game_bytes)
    require(sha != previous_files["game.js"]["sha256"],
            "No hubo cambios en game.js")
    check_private_key(key_file, public_key)
    original, content = prepare_unsigned_payloads(current, full, candidate,
                                                   game_bytes)
    validate_manifest_files(original)
    validate_manifest_files(content, is_content=True)
    version = candidate["version"]
    dest = out_root / version
    require(not dest.exists(), f"No se sobrescribe una carpeta existente: {dest}")
    # La carpeta temporal se crea junto al destino y se mueve al final.
    out_root.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".ota-build-", dir=out_root) as t:
        stage = Path(t)
        (stage / "original-manifest.json").write_bytes(
            signed_envelope(original, key_file, public_key))
        (stage / "original-content-manifest.json").write_bytes(
            signed_envelope(content, key_file, public_key))
        (stage / f"original-{sha}.bin").write_bytes(game_bytes)
        (stage / f"content-{sha}.bin").write_bytes(game_bytes)
        (stage / "release-notes.md").write_text(
            "# OmniBlizz Original " + version + "\n\n" +
            candidate["notes"] + "\n", encoding="utf-8")
        # No añadir clave ni game.js editable a carpeta publica de release.
        files = {p.name: {"sha256": checksum(p.read_bytes()),
                          "bytes": p.stat().st_size}
                 for p in stage.iterdir() if p.is_file()}
        (stage / "SHA256SUMS.json").write_text(
            json.dumps(files, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8")
        # No usamos shutil.move a un destino anterior; se niega sobrescritura.
        shutil.copytree(stage, dest)
    print(f"OK: OTA original {version} firmada LOCALMENTE y verificada, "
          f"{len(files)} archivos. NO PUBLICADA: {dest}")
    return dest


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--candidate-dir", required=True, type=Path)
    p.add_argument("--out-root", default=Path("releases/original"), type=Path)
    p.add_argument("--private-key", required=True, type=Path)
    p.add_argument("--public-key", default=Path("original-update-public.pem"),
                   type=Path)
    args = p.parse_args()
    prepare_release(args.candidate_dir, args.out_root,
                    args.private_key, args.public_key)


if __name__ == "__main__":
    main()
