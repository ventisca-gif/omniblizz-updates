const fs=require('fs'),vm=require('vm'),assert=require('assert');
const s=fs.readFileSync(process.argv[2],'utf8');
const start=s.indexOf('async function loadBootArt297('),end=s.indexOf('async function boot(){',start);
assert(start>=0&&end>start);
const helper=s.slice(start,end),listStart=s.indexOf('await loadBootArt297(',end)+'await loadBootArt297('.length,listEnd=s.indexOf(');ready=true;',listStart);
const entries=vm.runInNewContext(s.slice(listStart,listEnd));
async function scenario(mode,list=entries){let active=0,peak=0;const counts=new Map();const c={art:{},Image:class{set src(url){active++;peak=Math.max(peak,active);counts.set(url,(counts.get(url)||0)+1);queueMicrotask(()=>{active--;const bad=mode==='always'||mode==='once'&&counts.get(url)===1;if(bad)this.onerror();else this.onload();});}}};vm.createContext(c);vm.runInContext(helper,c);if(mode==='always')await assert.rejects(c.loadBootArt297(list));else{await c.loadBootArt297(list);assert.equal(Object.keys(c.art).length,list.length);}assert(peak<=6);assert.equal(active,0);for(const n of counts.values())assert(n<=2);return{mode,entries:list.length,peak,requests:[...counts.values()].reduce((a,b)=>a+b,0)};}
(async()=>{const scenarios=[];for(const mode of ['success','once','always'])scenarios.push(await scenario(mode));scenarios.push(await scenario('success',[]));console.log(JSON.stringify({passed:4,failed:0,scenarios},null,2));})().catch(e=>{console.error(e);process.exit(1)});
