import concurrent.futures,hashlib,json,time,urllib.request,urllib.parse
from pathlib import Path,PurePosixPath
m=json.loads(Path('website/files.json').read_text());root=Path('_site');root.mkdir(exist_ok=True)
assert m['origin']=='https://omniblizz-ventisca-sergio.pokeventiscapoke.chatgpt.site'
def download(f):
 p=PurePosixPath(f['path']);assert not p.is_absolute() and '..' not in p.parts
 url=m['origin']+'/'+urllib.parse.quote(str(p),safe='/')
 local=Path('website/static')/str(p)
 if local.is_file():
  b=local.read_bytes();assert len(b)==f['bytes'] and hashlib.sha256(b).hexdigest()==f['sha256']
  out=root/str(p);out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(b);return
 for attempt in range(4):
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'OmniBlizz-GitHub-Pages','Accept-Encoding':'identity'})
   with urllib.request.urlopen(req,timeout=90) as response:b=response.read(f['bytes']+1)
   assert len(b)==f['bytes'] and hashlib.sha256(b).hexdigest()==f['sha256'],f['path']+' integrity mismatch'
   out=root/str(p);out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(b);return
  except Exception as exc:
   if attempt==3:raise RuntimeError("Cannot download "+f["path"]+": "+str(exc)) from None
   time.sleep(2**attempt)
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:list(pool.map(download,m['files']))
assert (root/'index.html').is_file() and (root/'play/index.html').is_file()
(root/'.nojekyll').touch();print('Verified all',len(m['files']),'web files')
