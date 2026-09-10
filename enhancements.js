(()=>{
  const originalCheck=window.check;
  if(typeof originalCheck!=='function') return;

  const removeOverlay=id=>document.getElementById(id)?.remove();
  const fadeRemove=el=>{if(!el)return;el.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-in'}).finished.catch(()=>{}).finally(()=>el.remove())};

  const showWrong=()=>{
    removeOverlay('wrong-overlay');
    const overlay=document.createElement('div');
    overlay.id='wrong-overlay'; overlay.className='wrong-overlay';
    overlay.innerHTML=`<div class="cat-card" role="status" aria-live="polite"><span class="cat">😹</span><div class="try-again">TRY AGAIN!</div><div class="try-small">Du är nära — tänk ett steg till 💪</div><div class="meme-bars"></div></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click',()=>fadeRemove(overlay));
    setTimeout(()=>fadeRemove(overlay),1700);
  };

  const showWin=()=>{
    removeOverlay('celebration-overlay');
    const overlay=document.createElement('div');
    overlay.id='celebration-overlay'; overlay.className='celebration-overlay good';
    overlay.innerHTML=`<div class="celebration-card"><div class="celebration-title">🎉 RÄTT SVAR! +10 XP 🎉</div><video class="rick-frame" src="rickroll.mp4" title="Rickroll celebration" autoplay muted playsinline preload="auto"></video><div class="celebration-sub">Legendariskt! Klicka utanför eller vänta 3 sekunder ⚡</div></div>`;
    document.body.appendChild(overlay);
    const video=overlay.querySelector('.rick-frame');
    video.currentTime=0;
    const play=()=>video.play().catch(()=>{});
    play();
    video.addEventListener('loadeddata',play,{once:true});
    overlay.addEventListener('click',e=>{if(e.target===overlay)fadeRemove(overlay)});
    setTimeout(()=>{video.pause();fadeRemove(overlay)},3000);
  };

  window.check=function(){
    const input=document.querySelector('#answer');
    const before=input?.value?.trim()||'';
    if(!before){
      input?.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:180});
      return originalCheck();
    }
    originalCheck();
    const feedback=document.querySelector('#feedback');
    const correct=!!feedback?.querySelector('.good');
    if(correct){
      input?.classList.remove('answer-shake'); input?.classList.add('answer-win');
      setTimeout(()=>input?.classList.remove('answer-win'),700);
      showWin();
    }else{
      input?.classList.add('answer-shake'); setTimeout(()=>input?.classList.remove('answer-shake'),350);
      showWrong();
    }
  };

  const bg=document.createElement('div');
  bg.className='math-bg'; bg.setAttribute('aria-hidden','true');
  bg.innerHTML='<i></i><i></i><i></i><i></i>';
  document.body.prepend(bg);
})();
