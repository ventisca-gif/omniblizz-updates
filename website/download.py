"""Build the web from the verified 2.41.0 signed content using the existing Pages workflow."""
from pathlib import Path
import subprocess, sys
subprocess.run([sys.executable, "assemble307.py", "--web"], check=True)
root=Path("_site")
assert (root/"index.html").is_file() and (root/"play/index.html").is_file()
(root/".nojekyll").touch()
