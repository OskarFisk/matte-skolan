(()=>{
  let wrongCount=0, helpCount=0, canvas,ctx,drawing=false;
  const $=s=>document.querySelector(s);
  const escapeHTML=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function mountTools(){
    const card=$('.problem-card'); if(!card || card.dataset.tools) return;
    card.dataset.tools='1';
    const box=document.createElement('section'); box.className='study-tools';
    box.innerHTML=`<div class="draw-head"><div><b>✍️ Lös här</b><span> Rita uträkningen, figuren eller dina steg.</span></div><button class="secondary" id="clear-draw">Rensa</button></div><canvas id="math-canvas" width="900" height="300"></canvas><div class="draw-actions"><span>🖊️ Rita med mus, touch eller penna</span><button class="primary ai-btn" id="ai-help">🤖 AI-hjälp <b id="help-count">3</b>/3</button></div><div id="ai-panel" class="ai-panel" hidden></div>`;
    card.appendChild(box); canvas=box.querySelector('canvas'); ctx=canvas.getContext('2d'); setupCanvas();
    box.querySelector('#clear-draw').onclick=clearCanvas;
    box.querySelector('#ai-help').onclick=aiHelp;
  }
  function setupCanvas(){
    const ratio=Math.max(1,window.devicePixelRatio||1); const r=canvas.getBoundingClientRect();
    canvas.width=Math.round(r.width*ratio); canvas.height=Math.round(r.height*ratio); ctx.scale(ratio,ratio); ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=3;
    const pos=e=>{const p=e.touches?.[0]||e;const r=canvas.getBoundingClientRect();return{x:p.clientX-r.left,y:p.clientY-r.top}};
    const start=e=>{e.preventDefault();drawing=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)};
    const move=e=>{if(!drawing)return;e.preventDefault();const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()};
    const end=()=>drawing=false;
    canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',end);
  }
  function clearCanvas(){if(!canvas)return;ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)}
  function tutorText(){
    const c=window.state?.current||{}; const q=String(c.q||'');
    if(/%/.test(q)) return 'Börja med att skriva upp 100 %. Vid rabatt: räkna hur många procent som är kvar. Vid ökning: lägg till ökningen. Skriv gärna stegen i rutan ovan.';
    if(/x/.test(q)||/ekvation/i.test(q)) return 'Målet är att få x ensamt. Gör samma räkneoperation på båda sidor. Om x har en faktor framför sig, dividera båda leden med den faktorn.';
    if(/[√^]/.test(q)) return 'Titta på exponenten eller roten. En potens betyder upprepad multiplikation, och en kvadratrot frågar vilket tal som multiplicerat med sig självt ger talet under roten.';
    if(/[\/]/.test(q)) return 'För bråk: försök hitta en gemensam nämnare. För addition och subtraktion måste nämnarna bli lika innan du räknar ihop täljarna.';
    if(/area|rektangel|cm|m/.test(q)) return 'Skriv formeln först och fyll sedan i talen. För en rektangels area använder du längd · bredd. Kontrollera också enheten.';
    return 'Dela upp problemet i små steg. Skriv vad du vet, vilken räkneoperation som behövs och gör sedan ett steg i taget. Använd ledtråden också om du fastnar.';
  }
  function aiHelp(){
    if(helpCount>=3){toastAI('🚫 Du har använt alla 3 AI-hjälpningar för det här felaktiga svaret. Försök själv nu!');return}
    helpCount++; const panel=$('#ai-panel'); panel.hidden=false;
    const stages=['Första ledtråden: ','Andra ledtråden: ','Sista ledtråden: '];
    panel.innerHTML=`<div class="ai-orb">🤖</div><div><b>MatteAI</b><p>${stages[helpCount-1]}${escapeHTML(tutorText())}</p><small>Hjälp ${helpCount}/3 för detta fel svar.</small></div>`;
    panel.animate([{opacity:0,transform:'translateY(12px) scale(.97)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
  function toastAI(t){let x=$('#toast');if(x){x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1900)}}
  function resetForProblem(){wrongCount=0;helpCount=0;setTimeout(()=>{mountTools();const p=$('#ai-panel');if(p)p.hidden=true;const c=$('#help-count');if(c)c.textContent='3';},20)}
  const oldNext=window.nextProblem;
  if(typeof oldNext==='function') window.nextProblem=function(){oldNext();resetForProblem()};
  const oldCheck=window.check;
  if(typeof oldCheck==='function') window.check=function(){
    const input=$('#answer'); const before=input?.value?.trim()||''; const expected=window.state?.current?.ans; const got=Number(before.replace(',','.').trim());
    const ok=before!==''&&Number.isFinite(got)&&Number.isFinite(expected)&&Math.abs(got-expected)<.011;
    oldCheck();
    if(!ok && before!==''){wrongCount++;setTimeout(()=>mountTools(),20)}
    if(ok){setTimeout(()=>resetForProblem(),80)}
  };
  const observer=new MutationObserver(()=>mountTools()); observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(mountTools,50)); setTimeout(mountTools,150);
})();
