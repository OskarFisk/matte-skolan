(()=>{
  const originalCheck=window.check;
  if(typeof originalCheck!=='function') return;

  const removeOverlay=(id)=>document.getElementById(id)?.remove();
  const showWrong=()=>{
    removeOverlay('wrong-overlay');
    const overlay=document.createElement('div');
    overlay.id='wrong-overlay'; overlay.className='wrong-overlay';
    overlay.innerHTML=`<div class="cat-card" role="status" aria-live="polite"><span class="cat">😹</span><div class="try-again">TRY AGAIN!</div><div class="try-small">Du är nära — tänk ett steg till 💪</div><div class="meme-bars"></div></div>`;
    document.body.appendChild(overlay);
    const close=()=>{overlay.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-in'}).finished.catch(()=>{}).finally(()=>overlay.remove())};
    overlay.addEventListener('click',close); setTimeout(close,1700);
  };
  const showWin=()=>{
    removeOverlay('celebration-overlay');
    const overlay=document.createElement('div');
    overlay.id='celebration-overlay'; overlay.className='celebration-overlay good';
    overlay.innerHTML=`<div class="celebration-card"><div class="celebration-title">🎉 RÄTT SVAR! +10 XP 🎉</div><iframe class="rick-frame" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&start=0&end=3&loop=1&playlist=dQw4w9WgXcQ" title="Celebration" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="celebration-sub">Legendariskt! Klicka för att stänga eller vänta 3 sekunder ⚡</div></div>`;
    document.body.appendChild(overlay);
    const close=()=>{overlay.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-in'}).finished.catch(()=>{}).finally(()=>overlay.remove())};
    overlay.addEventListener('click',(e)=>{if(e.target===overlay)close()}); setTimeout(close,3000);
  };

  window.check=function(){
    const input=document.querySelector('#answer');
    const before=input?.value?.trim()||'';
    if(!before){ input?.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:180}); return originalCheck(); }
    const expected=window.state?.current?.ans;
    const got=Number(before.replace(',','.').trim());
    const ok=Number.isFinite(got)&&Number.isFinite(expected)&&Math.abs(got-expected)<.011;
    originalCheck();
    if(ok){ input?.classList.remove('answer-shake'); input?.classList.add('answer-win'); setTimeout(()=>input?.classList.remove('answer-win'),700); showWin(); }
    else { input?.classList.add('answer-shake'); setTimeout(()=>input?.classList.remove('answer-shake'),350); showWrong(); }
  };

  // Add ambient math particles without changing the existing app structure.
  const bg=document.createElement('div'); bg.className='math-bg'; bg.setAttribute('aria-hidden','true');
  bg.innerHTML='<i></i><i></i><i></i><i></i>'; document.body.prepend(bg);
})();
