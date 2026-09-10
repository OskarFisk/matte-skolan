(()=>{
  let helpCount=0,canvas,ctx,drawing=false;
  const $=s=>document.querySelector(s);
  const escapeHTML=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function question(){return $('.question')?.textContent||''}
  function mountTools(){
    const card=$('.problem-card'); if(!card||card.dataset.tools)return;
    card.dataset.tools='1';
    const box=document.createElement('section');box.className='study-tools';
    box.innerHTML=`<div class="draw-head"><div><b>✍️ Lös här</b><span> Rita uträkningen, figuren eller dina steg.</span></div><button class="secondary" id="clear-draw">Rensa</button></div><canvas id="math-canvas"></canvas><div class="draw-actions"><span>🖊️ Mus • touch • penna</span><button class="primary ai-btn" id="ai-help">🤖 MatteAI <b id="help-count">0/3</b></button></div><div id="ai-panel" class="ai-panel" hidden></div>`;
    card.appendChild(box);canvas=box.querySelector('canvas');ctx=canvas.getContext('2d');setupCanvas();
    box.querySelector('#clear-draw').onclick=clearCanvas;box.querySelector('#ai-help').onclick=aiHelp;
  }
  function setupCanvas(){
    const ratio=Math.max(1,devicePixelRatio||1),r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*ratio);canvas.height=Math.round(r.height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=3;
    canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture?.(e.pointerId);drawing=true;const r=canvas.getBoundingClientRect();ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top)});
    canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const r=canvas.getBoundingClientRect();ctx.lineTo(e.clientX-r.left,e.clientY-r.top);ctx.stroke()});
    canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);
  }
  function clearCanvas(){if(canvas)ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)}
  function tutorText(){
    const q=question();
    if(/%/.test(q))return 'Första steget: tänk på 100 %. Vid rabatt räknar du hur många procent som är kvar. Vid ökning lägger du till ökningen.';
    if(/x|ekvation/i.test(q))return 'Målet är att få x ensamt. Gör samma operation på båda sidor. Om x har en faktor framför sig, dividera båda leden med den.';
    if(/[√^]/.test(q))return 'Tänk på vad en potens betyder eller vilket tal som multiplicerat med sig självt ger talet under roten.';
    if(/[\/]/.test(q))return 'Vid bråk: hitta en gemensam nämnare innan du adderar eller subtraherar.';
    if(/area|rektangel|cm|m/.test(q))return 'Skriv formeln först. För en rektangels area använder du längd · bredd och kontrollerar enheten.';
    return 'Dela upp uppgiften i små steg. Skriv vad du vet, välj räkneoperation och kontrollera resultatet.';
  }
  function aiHelp(){
    if(helpCount>=3){toast('🚫 3/3 AI-hjälpningar använda för detta fel svar. Nu är det din tur!');return}
    helpCount++;const p=$('#ai-panel');p.hidden=false;
    const stages=['Starta här: ','Nästa steg: ','Sista ledtråden: '];
    p.innerHTML=`<div class="ai-orb">🤖</div><div><b>MatteAI</b><p>${stages[helpCount-1]}${escapeHTML(tutorText())}</p><small>AI-hjälp ${helpCount}/3 för detta fel svar.</small></div>`;
    const b=$('#ai-help');b.innerHTML=`🤖 MatteAI <b>${helpCount}/3</b>`;p.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'})
  }
  function toast(t){const x=$('#toast');if(x){x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1900)}}
  function reset(){helpCount=0;setTimeout(()=>{mountTools();const p=$('#ai-panel');if(p)p.hidden=true;const b=$('#ai-help');if(b)b.innerHTML='🤖 MatteAI <b>0/3</b>'},30)}
  const oldNext=window.nextProblem;if(typeof oldNext==='function')window.nextProblem=function(){oldNext();reset()};
  const oldCheck=window.check;if(typeof oldCheck==='function')window.check=function(){const input=$('#answer'),before=input?.value?.trim()||'';const q=question();oldCheck();if(before){setTimeout(()=>{const feedback=$('#feedback')?.textContent||'';if(/Inte riktigt|försök igen/i.test(feedback)){mountTools();const p=$('#ai-panel');if(p)p.hidden=true}else if(/Rätt/i.test(feedback))reset()},20)}};
  new MutationObserver(()=>mountTools()).observe(document.body,{childList:true,subtree:true});setTimeout(mountTools,100);
})();
