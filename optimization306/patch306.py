from pathlib import Path
r=Path(__file__).resolve().parent
s=(r/'base305-game.js').read_text();m=(r/'base305-mission305.js').read_text();assert m in s
n=m
n=n.replace("if(q.stage==='stone'&&q.t<5){const id=WAY130;const def=ALIENS[id];if(def)sprite(def.row,0,400,530,330,1);}",'')
n=n.replace("if(q.stage==='badge'&&q.t>=3){const bx","if(q.stage==='badge'&&q.t>=7){const bx")
n=n.replace("max=kind==='eyes'?1.2:kind==='gauntlet'?1.05:.8", "max=kind==='shock'?1.8:kind==='eyes'?1.65:kind==='gauntlet'?1.5:kind==='crystal'?1.3:1.15")
n=n.replace("{sword:3.2,eyes:6,gauntlet:7,shock:9,crystal:10}","{sword:4.5,eyes:7,gauntlet:8,shock:11,crystal:7.5}")
n=n.replace("e.dodgeCD=5;e.dodge305=.32", "e.dodgeCD=7.5;e.dodge305=.24").replace('*650*dt','*520*dt')
n=n.replace('*180*dt','*130*dt').replace('*130*dt,520,825','*95*dt,520,825')
n=n.replace("if(c.t<c.max*.45)","if(c.t<.15)")
n=n.replace("c.t>=c.max*.65","c.t>=c.max*(c.kind==='shock'?.84:.74)")
n=n.replace("if(dist(e,player)<230)hitPlayer(4000)","if(inRay301(player,{x:e.x,y:e.y,a:c.a},200,75))hitPlayer(4000)")
n=n.replace("if(Math.hypot(player.x-c.x,player.y-c.y)<140)hitPlayer(4000)","e.impact306={x:c.x,y:c.y,t:.3};if(shockHits306(c,player))hitPlayer(4000)")
n=n.replace("if(c.t>=c.max)e.cast305=null", "if(c.t>=c.max){e.cast305=null;e.cd=c.kind==='shock'?1.9:1.6;}")
n=n.replace("e.shield305=1.8;e.cds.shield=9", "e.shield305=1.2;e.cds.shield=12")
n=n.replace("e.shield305=Math.max(0,e.shield305-dt)","e.shield305=Math.max(0,e.shield305-dt);if(e.impact306)e.impact306.t=Math.max(0,e.impact306.t-dt)")
n=n.replace("(form305()?.55:.15)","(form305()?.75:.25)")
n=n.replace("if(s.kind==='eyes'&&s.t<.65)","if(false&&s.kind==='eyes')").replace('*620*dt','*460*dt')
n=n.replace("ctx.ellipse(c.x,c.y,140,50,0,0,Math.PI*2);ctx.stroke();", "ctx.fillStyle='#ffc75b22';ctx.ellipse(c.x,c.y,125,75,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(c.x,c.y,125,75,0,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,c.t/(c.max*.84)));ctx.stroke();")
# Explicitly distinguish the scripted opening from the winnable second round.
n=n.replace("text193(missionPanel305.querySelector('p'),text)","text193(missionPanel305.querySelector('p'),stage==='round1'?T305('PRIMER ASALTO: resiste las destransformaciones. El asalto decisivo se gana con Diamante AF.','ROUND ONE: survive the forced reversions. Win the decisive round with Diamondhead AF.','PRIMEIRA RODADA: resista às destransformações. Vença a rodada decisiva com Diamante AF.','İLK TUR: zorunlu dönüş bitişlerine dayan. Belirleyici turu Elmas Kafa AF ile kazan.'):text)")
(r/'candidate/mission306.js').write_text(n)
s=s.replace(m,n)
s=s.replace("rows=key==='cast'?6:8","rows=key==='cast306'?3:key==='cast'?6:8")
s=s.replace("im.src='expansion305/'+key+(key==='hologram'?'.png':'.webp')","im.src=key==='cast306'?'expansion306/cast.webp':'expansion305/'+key+(key==='hologram'?'.png':'.webp')")
ext="""
// Revision306: reference outfits preserve existing actor paths and badge handoff.
const castBefore306=castActor305;castActor305=function(row,x,y,pose=0,h=155){const replacement={1:0,2:1,4:2}[row];if(row===4&&trial305()&&mission305.stage==='badge')pose=mission305.t<3?1:mission305.t<7?2:0;return replacement===undefined?castBefore306(row,x,y,pose,h):tile305(ctx,'cast306',replacement,pose,x,y,h);};
function shockHits306(c,o){return ((o.x-c.x)/125)**2+((o.y-c.y)/75)**2<=1;}
const visibleBefore306=actorVisible200;actorVisible200=function(a,...rest){return a.kind==='player'&&trial305()&&['shatter','badge','rebuild'].includes(mission305.stage)?false:visibleBefore306(a,...rest);};
"""
s=s.replace('const drawFrameBefore299=draw;',ext+'\nconst drawFrameBefore299=draw;').replace('2.40.0','2.40.1')
(r/'candidate/game.js').write_text(s)
e=(r/'base305-game-entry147.html').read_text().replace('2.40.0','2.40.1').replace('game.js?v=305','game.js?v=306');(r/'candidate/game-entry147.html').write_text(e)
