from pathlib import Path
import hashlib

def patch(s):
    old='const s=hbState231(),entries=bagEntries217();cleanQuick276(entries);'
    assert s.count(old)==1
    s=s.replace(old,'const s=hbState231(),entries=s.slots.some(Boolean)?bagEntries217():[];cleanQuick276(entries);')
    old='function active285(o=player){const id='
    assert s.count(old)==1
    s=s.replace(old,"function active285(o=player){if(o===player&&!o.expeditionRewards285?.active)return null;const id=")
    old='function phoenix289(o=player){const s=o===player?state289():o.cosmic289;'
    assert s.count(old)==1
    s=s.replace(old,"function phoenix289(o=player){if(o===player&&(!o.cosmic289?.owned?.phoenix||o.cosmic289.mount!=='phoenix'))return false;const s=o===player?state289():o.cosmic289;")
    old='function garmentKey289(o=player){const r='
    assert s.count(old)==1
    s=s.replace(old,'function garmentKey289(o=player){if(o===player&&(!o.cosmic289?.owned?.garment||!o.cosmic289.garment))return null;const r=')
    old='const out=drawBefore285(...a);if(!started||cinematic)return out;ctx.save();'
    assert s.count(old)==1
    s=s.replace(old,'const out=drawBefore285(...a);if(!started||cinematic)return out;if(!run285().fx.length&&!player.expeditionRewards285?.equipped?.aura)return out;ctx.save();')
    # Native DOM behavior matches 2.28.0. Retain the HUD rate limiter and raster caches.
    a=s.index('const styleProxies294='); b=s.index('function hudState294',a)
    s=s[:a]+s[b:]
    return s

if __name__=='__main__':
    import sys
    src=Path(sys.argv[1]); dst=Path(sys.argv[2]); s=src.read_text(); dst.write_text(patch(s)); print(hashlib.sha256(dst.read_bytes()).hexdigest())
