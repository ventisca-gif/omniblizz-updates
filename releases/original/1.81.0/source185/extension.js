// Original1.81 / rev185: exact ship Power Level rewards and directional sprite cleanup.
const gokuBefore185=goku180;
goku180=function(row,frame,x,y,h,flip=false,c=ctx,isPlayer=false){
  // Rows0..3 already contain front/back/right/left artwork; never mirror a directional row.
  return gokuBefore185(row,frame,x,y,h,row>=0&&row<=3?false:flip,c,isPlayer);
};
function trainingPose185(){
  resetInput();saiRun167.phase=0;saiRun167.action=null;saiRun167.charging=false;
  player.moving=false;player.dx=player.face<0?-1:1;player.dy=0;
  player.walkDir64=player.dx<0?'left':'right';
}
const startExerciseBefore185=exerciseStart184;
exerciseStart184=function(...a){const out=startExerciseBefore185(...a);if(out){saiRun167.phase=0;player.moving=false;player.walkDir64='right';}return out;};
const cancelExerciseBefore185=exerciseCancel184;
exerciseCancel184=function(...a){const out=cancelExerciseBefore185(...a);if(out)trainingPose185();return out;};
const tickExerciseBefore185=exerciseTick184;
exerciseTick184=function(dt){const prior=run184.exercise,out=tickExerciseBefore185(dt);if(prior&&!run184.exercise){trainingPose185();persistGame();}return out;};
const updateBefore185=saiUpdate167;
saiUpdate167=function(dt){const active=here184()&&started&&!paused&&!cinematic&&!document.hidden,out=updateBefore185(dt);if(active&&toastTime>0){toastTime=Math.max(0,toastTime-clamp(dt,0,.1));if(!toastTime)$('#toast').classList.remove('show');}return out;};
const newsBefore185=updateLog23;
updateLog23=function(...a){newsBefore185(...a);$('#dialogeyebrow').textContent='OMNIBLIZZ ORIGINAL · 1.81';const p=document.createElement('p');p.setAttribute('data-no-i18n','');p.textContent=C184('Corregido: cada serie completada en la nave aumenta exactamente70Power Level. La animación izquierda ya no se invierte; terminar o cancelar ejercicios limpia la postura y los controles.','Fixed: each completed ship set adds exactly70Power Level. Left-facing animation is no longer mirrored; completing or cancelling exercises resets pose and inputs.','Corrigido: cada série concluída na nave aumenta exatamente70Power Level. A animação esquerda não é mais invertida; concluir ou cancelar exercícios limpa a postura e os controles.','Düzeltildi: gemide tamamlanan her set tam70Power Level verir. Sola bakan animasyon artık ters çevrilmez; egzersizi bitirmek veya iptal etmek duruşu ve girdileri sıfırlar.');$('#dialogbody').prepend(p);};
readyLog23=function(){if(logFirst23||!ready)return;logFirst23=true;if(localStorage.getItem('omni-seen-update')!=='1.81'){updateLog23();localStorage.setItem('omni-seen-update','1.81');}};
if(location.search.includes('qa=1'))window.__v185={eval:s=>eval(s)};
