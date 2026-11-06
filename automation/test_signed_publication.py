"""Pruebas sin red de la firma LOCAL y del bloqueo de publicaciones."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sign_candidate_locally as signer
import verify_staged_release as gate
import validate_and_stage as ota
from test_unsigned_ota import fixtures


class SignedReleaseTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.prevdir = os.getcwd()
        os.chdir(self.tmp.name)
        self.public = Path("original-update-public.pem")
        self.private = Path("test-only-private-key.pem")
        subprocess.run(["openssl", "genpkey", "-algorithm", "RSA",
                        "-pkeyopt", "rsa_keygen_bits:2048",
                        "-out", str(self.private)], capture_output=True, check=True)
        subprocess.run(["openssl", "pkey", "-in", str(self.private),
                        "-pubout", "-out", str(self.public)],
                       capture_output=True, check=True)

    def tearDown(self):
        os.chdir(self.prevdir)
        self.tmp.cleanup()

    def build_stage(self):
        base, full, candidate, _, _ = fixtures()
        game = b"console.log('new-version');\n"
        raw, content = ota.prepare_unsigned_payloads(base, full, candidate, game)
        sha = ota.checksum(game)
        folder = Path("releases/original") / candidate["version"]
        folder.mkdir(parents=True)
        blobs = {
            "original-manifest.json":
                signer.signed_envelope(raw, self.private, self.public),
            "original-content-manifest.json":
                signer.signed_envelope(content, self.private, self.public),
            f"original-{sha}.bin": game,
            f"content-{sha}.bin": game,
            "release-notes.md":
                (f"# OmniBlizz Original {candidate['version']}\n\n"
                 f"{candidate['notes']}\n").encode("utf-8")
        }
        for name, contents in blobs.items():
            (folder / name).write_bytes(contents)
        hashes = {n: {"sha256": ota.checksum(v), "bytes": len(v)}
                  for n, v in blobs.items()}
        (folder / "SHA256SUMS.json").write_text(json.dumps(hashes))
        return folder, base, full

    def test_valid_signed_release_is_accepted(self):
        folder, base, full = self.build_stage()
        prior = {f["path"]: f for f in base["files"]}
        self.assertEqual(gate.validate_stage(folder, base, full, prior),
                         "2.43.27")

    def test_modified_binary_is_rejected(self):
        folder, base, full = self.build_stage()
        binary = next(folder.glob("original-*.bin"))
        binary.write_bytes(b"tampered")
        with self.assertRaises(ValueError):
            gate.validate_stage(folder, base, full,
                                {f["path"]: f for f in base["files"]})

    def test_modified_signature_is_rejected(self):
        folder, base, full = self.build_stage()
        manifest = folder / "original-manifest.json"
        data = json.loads(manifest.read_bytes())
        data["signature"] = "AAAA"
        manifest.write_text(json.dumps(data))
        with self.assertRaises((ValueError, RuntimeError)):
            gate.validate_stage(folder, base, full,
                                {f["path"]: f for f in base["files"]})

    def test_mismatched_signing_key_is_rejected(self):
        signer.check_private_key(self.private, self.public)
        self.public.write_text(self.public.read_text().replace(
            "-----BEGIN PUBLIC KEY-----", "-----BEGIN INVALID KEY-----"))
        with self.assertRaises(subprocess.CalledProcessError):
            signer.check_private_key(self.private, self.public)

    def test_reject_current_or_older_version(self):
        folder, base, _ = self.build_stage()
        root = folder.parent
        self.assertIsNotNone(gate.select_candidate(root, base, ""))
        self.assertIsNone(gate.select_candidate(root, base, "2.43.26"))

    def test_reject_extra_binary(self):
        folder, base, full = self.build_stage()
        (folder / ("content-" + "0" * 64 + ".bin")).write_bytes(b"unexpected")
        with self.assertRaises(ValueError):
            gate.validate_stage(folder, base, full,
                                {f["path"]: f for f in base["files"]})


if __name__ == "__main__":
    unittest.main()
