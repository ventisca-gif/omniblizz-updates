#!/usr/bin/env python3
"""Validate private game content without credentials, signing or publication."""
import argparse
from pathlib import Path
from validate_and_stage import read_asset_overlay, validate_blob

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--game", type=Path, required=True)
    ap.add_argument("--assets", type=Path, required=True)
    args = ap.parse_args()
    if args.game.is_symlink() or args.game.stat().st_size < 1000000:
        raise ValueError("game.js incompleto o symlink")
    validate_blob("game.js", args.game.read_bytes())
    assets = read_asset_overlay(args.assets)
    print(f"OK: game.js y {len(assets)} recursos; sin firma ni publicacion")
