"""Build the web from verified 2.41.2 signed content with the existing Pages workflow."""
from pathlib import Path
import subprocess, sys
subprocess.run([sys.executable, "assemble309.py", "--web"], check=True)
root=Path("_site")
assert (root/"index.html").is_file() and (root/"play/index.html").is_file()
(root/".nojekyll").touch()
