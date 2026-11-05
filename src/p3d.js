/* ===== Utilidades de edición ===== */
const setPath=(o,p,v)=>{const k=p.split('.');let t=o;for(let i=0;i<k.length-1;i++)t=t[k[i]]=t[k[i]]||{};t[k[k.length-1]]=v};
const swap=(a,i,d)=>{const j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]]};
const reid=o=>{o.id=uid();(o.sections||[]).forEach(s=>{s.id=uid();s.els.forEach(e=>e.id=uid())});(o.els||[]).forEach(e=>e.id=uid());return o};
const target=()=>ui.elId?(findEl(ui.elId)||{}).e:ui.secId?(findSec(ui.secId)||{}).s:null;
const isTyping=t=>t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

function pickSection(){
 const pg=curPage();
 const s=ui.secId&&pg.sections.find(x=>x.id===ui.secId&&!x.hidden);
 if(s)return s;
 let v=pg.sections.find(x=>!x.hidden);
 if(!v){v=PRESETS.blank[2]();pg.sections.push(v)}
 return v;
}
function addElement(t,secId,x,y){
 const s=secId?findSec(secId).s:pickSection();
 const e=mk(t);
 if(x==null){e.x=8;const b=secBottom(s);e.y=b?b+16:40}
 else{e.x=clamp(Math.round(x-e.w/2),0,100-e.w);e.y=Math.max(0,Math.round(y-20))}
 s.els.push(e);grow(s);
 ui.elId=e.id;ui.secId=s.id;
 if(innerWidth<=900)ui.drawer=false;
 commit(true);renderRail();renderDrawer();renderCanvas();renderProps();
 const n=$(`.e[data-id="${e.id}"]`);if(n)n.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function selectEl(id){
 const f=findEl(id);if(!f)return;
 ui.elId=id;ui.secId=f.s.id;
 if(innerWidth<=900)ui.drawer=false;
 renderRail();renderDrawer();renderCanvas();renderProps();
}
function moveEl(secId){
 const f=findEl(ui.elId),to=findSec(secId);if(!f||!to||to.s===f.s)return;
 f.s.els.splice(f.s.els.indexOf(f.e),1);to.s.els.push(f.e);grow(to.s);
 ui.secId=to.s.id;if(to.p)ui.pageId=to.p.id;commit(true);renderAll();
}
function readImg(file,cb){
 const r=new FileReader();
 r.onload=()=>{
  if(file.type==='image/svg+xml'||file.size<250000){cb(r.result);return}
  const im=new Image();
  im.onload=()=>{const sc=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};
  im.onerror=()=>cb(r.result);im.src=r.result;
 };
 r.readAsDataURL(file);
}
async function copyText(txt,ta){
 try{await navigator.clipboard.writeText(txt);toast('Copiado al portapapeles')}
 catch(err){if(ta){ta.focus();ta.select()}toast('Selecciona el texto y copia con Ctrl+C')}
}

/* ===== Publicar ===== */
function openPublish(){
 const html=buildSite(),pgs=S.pages.filter(p=>!p.hidden);
 let secs=0,bad=0,rvp=0;
 pgs.forEach(p=>p.sections.filter(s=>!s.hidden).forEach(s=>{secs++;s.els.filter(e=>!e.hid).forEach(e=>{if(e.t==='reviews'&&e.items.some(i=>/Nombre del cliente/.test(i.n)))rvp++;if(linkBad(e,pgs))bad++})}));
 $('#modal').innerHTML=`<div class="card" role="dialog" aria-label="Publicar"><h2>Publicar tu web</h2>
 <p class="hint">${pgs.length} página${pgs.length===1?'':'s'} · ${secs} secciones · ${Math.round(html.length/1024)} KB. Es un único archivo HTML que funciona en ordenador y móvil.</p>
 ${rvp?`<p style="color:var(--danger);font-weight:600">Hay opiniones de Google de ejemplo sin sustituir. Cámbialas por las reales antes de publicar.</p>`:''}
 ${bad?`<p style="color:var(--danger);font-weight:600">Hay ${bad} enlace${bad===1?'':'s'} sin destino válido (a una página oculta o vacío). Revísalos antes de publicar.</p>`:''}
 <ol style="padding-left:20px;margin:10px 0"><li>Copia el código.</li><li>Pégalo en un archivo llamado <b>index.html</b>.</li><li>Súbelo a tu hosting, o a Netlify o GitHub Pages.</li></ol>
 <textarea class="code" id="pubCode" readonly rows="9">${esc(html)}</textarea>
 <div class="row" style="margin-top:12px"><button class="b pri" data-act="copyhtml">Copiar código</button><button class="b" data-act="modalclose">Cerrar</button></div>
 <p class="hint">Los mapas, vídeos y el envío de formularios solo funcionan en la web ya publicada, no dentro del editor.</p></div>`;
 $('#modal').hidden=false;
}

/* ===== Acciones ===== */
function act(a,b){
 const id=b.dataset.id,pg=curPage();
 switch(a){
 case 'mode':ui.mode=b.dataset.m;ui.w=ui.mode==='desktop'?1100:(DEVS[ui.mode].find(d=>d[1]===ui.w)?ui.w:DEVS[ui.mode][ui.mode==='tablet'?0:1][1]);renderBar();renderCanvas();break;
 case 'undo':undo();break;
 case 'redo':redo();break;
 case 'preview':ui.preview=!ui.preview;if(ui.preview){ui.elId=null;ui.secId=null}renderAll();break;
 case 'save':save(true);break;
 case 'publish':openPublish();break;
 case 'modalclose':$('#modal').hidden=true;break;
 case 'copyhtml':copyText($('#pubCode').value,$('#pubCode'));break;
 case 'panel':if(ui.drawer&&ui.panel===b.dataset.p)ui.drawer=false;else{ui.panel=b.dataset.p;ui.drawer=true}renderRail();renderDrawer();break;
 case 'drawerclose':ui.drawer=false;renderRail();renderDrawer();break;
 case 'propsclose':ui.elId=null;ui.secId=null;renderCanvas();renderProps();break;
 case 'addel':addElement(b.dataset.type);break;
 /* páginas */
 case 'selpage':{const p=S.pages.find(x=>x.id===id);if(p.hidden){toast('Muestra la página para poder editarla');break}ui.pageId=id;ui.elId=null;ui.secId=null;renderAll();break}
 case 'pgup':case 'pgdown':{const i=S.pages.findIndex(x=>x.id===id);swap(S.pages,i,a==='pgup'?-1:1);commit(true);renderAll();break}
 case 'pghide':{const p=S.pages.find(x=>x.id===id);if(!p.hidden&&S.pages.filter(x=>!x.hidden).length<2){toast('Debe quedar al menos una página visible');break}p.hidden=!p.hidden;fixSel();if(S.pages.find(x=>x.id===ui.pageId).hidden)ui.pageId=S.pages.find(x=>!x.hidden).id;ui.elId=null;ui.secId=null;commit(true);renderAll();break}
 case 'pgdup':{const i=S.pages.findIndex(x=>x.id===id),c=reid(clone(S.pages[i]));c.name+=' (copia)';S.pages.splice(i+1,0,c);ui.pageId=c.id;commit(true);renderAll();break}
 case 'pgdel':{if(S.pages.length<2){toast('Debe haber al menos una página');break}S.pages=S.pages.filter(x=>x.id!==id);fixSel();ui.elId=null;ui.secId=null;commit(true);renderAll();toast('Página borrada. Ctrl+Z para deshacer');break}
 case 'pgadd':{const p=mkPage('Página nueva',[PRESETS.text[2]()]);S.pages.push(p);ui.pageId=p.id;ui.elId=null;ui.secId=null;commit(true);renderAll();break}
 /* secciones */
 case 'selsec':{const f=findSec(id);if(f.s.hidden){toast('Muestra la sección para editarla');break}if(f.p)ui.pageId=f.p.id;ui.secId=id;ui.elId=null;renderAll();const n=$(`.sec[data-s="${id}"]`);if(n)n.scrollIntoView({block:'start',behavior:'smooth'});break}
 case 'secup':case 'secdown':{const f=findSec(id);swap(f.p.sections,f.p.sections.indexOf(f.s),a==='secup'?-1:1);commit(true);renderAll();break}
 case 'sechide':{const f=findSec(id);f.s.hidden=!f.s.hidden;if(f.s.hidden&&ui.secId===id){ui.secId=null;ui.elId=null}commit(true);renderAll();break}
 case 'secdup':{const f=findSec(id),c=clone(f.s);c.id=uid();c.name+=' (copia)';c.els.forEach(e=>e.id=uid());f.p.sections.splice(f.p.sections.indexOf(f.s)+1,0,c);ui.secId=c.id;ui.elId=null;commit(true);renderAll();break}
 case 'secdel':{const f=findSec(id);f.p.sections.splice(f.p.sections.indexOf(f.s),1);if(ui.secId===id){ui.secId=null;ui.elId=null}commit(true);renderAll();toast('Sección borrada. Ctrl+Z para deshacer');break}
 case 'addsec':{const s=PRESETS[b.dataset.pre][2]();pg.sections.push(s);ui.secId=s.id;ui.elId=null;commit(true);renderAll();const n=$(`.sec[data-s="${s.id}"]`);if(n)n.scrollIntoView({block:'start',behavior:'smooth'});break}
 /* elementos */
 case 'linkpop':openLinkPop(b);break;
 case 'elprops':if(innerWidth<=900){$('#app').classList.add('pw')}break;
 case 'alignl':case 'alignc':case 'alignr':{const f=findEl(ui.elId);if(!f)break;if(isStack()){f.e.ma=a==='alignl'?'l':a==='alignc'?'c':'r';if(f.e.t==='menu')f.e.align=a==='alignl'?'left':a==='alignc'?'center':'right';commit(true);renderCanvas();renderProps();toast('Alineación guardada para tablet y móvil');break}f.e.x=a==='alignl'?4:a==='alignc'?Math.round((100-f.e.w)/2*2)/2:Math.max(0,Math.round((96-f.e.w)*2)/2);commit(true);renderCanvas();renderProps();break}
 case 'eldup':{const f=findEl(ui.elId),c=clone(f.e);c.id=uid();c.x=clamp(c.x+2,0,100-c.w);c.y+=24;f.s.els.push(c);grow(f.s);ui.elId=c.id;commit(true);renderCanvas();renderProps();break}
 case 'elhide':{const f=findEl(ui.elId);f.e.hid=true;ui.elId=null;commit(true);renderAll();toast('Elemento oculto. Lo encuentras en «Elementos ocultos»');break}
 case 'eldel':{const f=findEl(ui.elId);f.s.els.splice(f.s.els.indexOf(f.e),1);ui.elId=null;commit(true);renderCanvas();renderProps();toast('Elemento borrado. Ctrl+Z para deshacer');break}
 case 'elshow':{const f=findEl(id);f.e.hid=false;commit(true);renderAll();break}
 case 'front':{const f=findEl(ui.elId);f.e.z=Math.max(...f.s.els.map(x=>x.z||1))+1;commit(true);renderCanvas();break}
 case 'back':{const f=findEl(ui.elId);f.s.els.forEach(x=>{if(x!==f.e)x.z=(x.z||1)+1});f.e.z=1;commit(true);renderCanvas();break}
 case 'fontpair':{const pr=PAIRS[b.dataset.k];S.design.fh=pr[1];S.design.fb=pr[2];commit(true);renderDrawer();renderCanvas();break}
 case 'fsauto':{const o=target();o.fo=false;commit(true);renderCanvas();renderProps();break}
 case 'seccopy':case 'secmove':{
  const f=findSec(ui.secId),sel=$('#secTarget'),to=sel&&S.pages.find(x=>x.id===sel.value);
  if(!f||!to||to===f.p){toast('Elige otra página de destino');break}
  let s=f.s;
  if(a==='seccopy'){s=clone(f.s);s.id=uid();s.els.forEach(e=>e.id=uid())}
  else f.p.sections.splice(f.p.sections.indexOf(f.s),1);
  to.sections.push(s);ui.elId=null;ui.secId=s.id;
  if(!to.hidden)ui.pageId=to.id;
  commit(true);renderAll();
  const n=$(`.sec[data-s="${s.id}"]`);if(n)n.scrollIntoView({block:'start',behavior:'smooth'});
  toast((a==='seccopy'?'Sección copiada a «':'Sección movida a «')+to.name+'»'+(to.hidden?' (página oculta)':''));break}
 case 'secto':{const f=findSec(id);if(!f||!f.p)break;ui.secId=id;ui.elId=null;
  let m=$('#secpop');if(!m){m=document.createElement('div');m.id='secpop';document.body.appendChild(m)}
  m.innerHTML=`<div class="spt">«${esc(f.s.name)}» → otra página</div>`+S.pages.filter(q=>q.id!==f.p.id).map(q=>`<div class="spr"><span class="spn">${esc(q.name)}${q.hidden?' (oculta)':''}</span><button class="b sm" data-act="secpgo" data-m="c" data-sid="${id}" data-pg="${q.id}">Copiar</button><button class="b sm" data-act="secpgo" data-m="m" data-sid="${id}" data-pg="${q.id}">Mover</button></div>`).join('')+(S.pages.length<2?'<p class="hint">Crea otra página primero.</p>':'');
  const r=b.getBoundingClientRect();m.hidden=false;m.style.left=Math.max(8,Math.min(r.left,innerWidth-310))+'px';m.style.top=Math.min(r.bottom+6,innerHeight-m.offsetHeight-8)+'px';break}
 case 'secpgo':{const f=findSec(b.dataset.sid),to=S.pages.find(x=>x.id===b.dataset.pg);if(!f||!to)break;
  const cp=b.dataset.m==='c';let s=f.s;
  if(cp){s=clone(f.s);s.id=uid();s.els.forEach(e=>e.id=uid())}else f.p.sections.splice(f.p.sections.indexOf(f.s),1);
  to.sections.push(s);ui.elId=null;ui.secId=s.id;
  $('#secpop').hidden=true;
  if(!cp||!to.hidden)ui.pageId=to.id;
  commit(true);renderAll();
  const n=$(`.sec[data-s="${s.id}"]`);if(n)n.scrollIntoView({block:'start',behavior:'smooth'});
  toast((cp?'Sección copiada a «':'Sección movida a «')+to.name+'»');break}
 case 'catsec':openCatalog('sec');break;
 case 'catpage':openCatalog('page');break;
 case 'catgo':{const n=$('#cg'+b.dataset.i);if(n)n.scrollIntoView({block:'start',behavior:'smooth'});break}
 case 'catadd':catAdd(b.dataset.k);break;
 case 'rmlogo':S.logo.src='';commit(true);renderCanvas();renderDrawer();break;
 case 'bulk':$('#fileMulti').click();break;
 case 'pickicon':{const o=target();if(o){o.icon=b.dataset.i;commit(true);renderCanvas();renderProps()}break}
 case 'autocol':{const o=target();setPath(o,b.dataset.k,'');commit(true);renderCanvas();renderProps();break}
 case 'up':upTarget=b.dataset.f;$('#fileIn').click();break;
 case 'rmimg':{const e=target();if(e.imgs.length<2){toast('Deja al menos una imagen');break}e.imgs.splice(+b.dataset.i,1);commit(true);renderCanvas();renderProps();break}
 case 'addurl':{const v=$('#addurl').value.trim();if(!v)break;target().imgs.push(v);commit(true);renderCanvas();renderProps();break}
 case 'upvid':$('#fileVid').click();break;
 case 'rmvid':{const o=target();if(o){o.bgv='';commit(true);renderCanvas();renderProps()}break}
 case 'rmbg':{target().bgi='';commit(true);renderCanvas();renderProps();break}
 /* proyecto */
 case 'tpl':{const t=TPLS.find(x=>x[0]===b.dataset.t);if(!t)break;if(ui.tplArm!==t[0]){ui.tplArm=t[0];renderDrawer();clearTimeout(window.__tpT);window.__tpT=setTimeout(()=>{ui.tplArm=null;renderDrawer()},5000);break}ui.tplArm=null;loadProject(t[4]());markDirty();renderAll();toast('Plantilla cargada: '+t[1]);break}
 case 'copyjson':copyText(JSON.stringify(S),$('#expJson'));break;
 case 'impjson':{try{const o=JSON.parse($('#impJson').value);if(!o||!Array.isArray(o.pages)||!o.pages.length)throw 0;o.design=o.design||clone(D0);loadProject(o);markDirty();renderAll();toast('Proyecto importado')}catch(err){toast('No se pudo leer ese proyecto')}break}
 }
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-act]');
 if(b&&b.tagName!=='INPUT')act(b.dataset.act,b);
 if(ev.target.id==='modal')$('#modal').hidden=true;
});

/* ===== Lienzo: selección, arrastre, redimensionado ===== */
const frame=$('#frame');
function startDrag(ev,id,mode){
 const node=$(`.e[data-id="${id}"]`),f=findEl(id);if(!node||!f)return;
 const stage=$('#stage'),sc0=stage.scrollTop;
 const e=f.e,d={sx:ev.clientX,sy:ev.clientY,ox:e.x,oy:e.y,ow:e.w,oh:e.h||node.offsetHeight,W:node.parentElement.clientWidth,moved:false,cx:ev.clientX,cy:ev.clientY};
 let tgt=null;
 const secAt=(x,y)=>{node.style.pointerEvents='none';const el=document.elementFromPoint(x,y);node.style.pointerEvents='';return el&&el.closest?el.closest('.sec'):null};
 const apply=()=>{
  const dx=d.cx-d.sx,dy=d.cy-d.sy+(stage.scrollTop-sc0);
  if(!d.moved&&Math.hypot(dx,dy)<4)return;d.moved=true;
  if(mode==='move'){
   e.x=clamp(Math.round((d.ox+dx/d.W*100)*2)/2,0,100-e.w);e.y=Math.round(d.oy+dy);node.style.left=e.x+'%';node.style.top=e.y+'px';
   const s=secAt(d.cx,d.cy);$$('.dropt').forEach(n=>n!==s&&n.classList.remove('dropt'));
   if(s&&s.dataset.s!==f.s.id){s.classList.add('dropt');tgt=s}else{tgt=null}
  }else{
   if(mode.includes('e')){e.w=clamp(Math.round((d.ow+dx/d.W*100)*2)/2,3,100-e.x);node.style.width=e.w+'%'}
   if(mode.includes('s')){e.h=Math.max(20,Math.round(d.oh+dy));node.style.height=e.h+'px';node.style.setProperty('--h',e.h+'px')}
  }
 };
 let raf=0;
 const auto=()=>{
  const r=stage.getBoundingClientRect();let v=0;
  if(d.cy<r.top+70)v=-18;else if(d.cy>r.bottom-70)v=18;
  if(v&&d.moved){stage.scrollTop+=v;apply();raf=requestAnimationFrame(auto)}else raf=0;
 };
 const mv=m=>{d.cx=m.clientX;d.cy=m.clientY;apply();if(mode==='move'&&d.moved&&!raf)raf=requestAnimationFrame(auto)};
 const up=()=>{
  removeEventListener('pointermove',mv);removeEventListener('pointerup',up);cancelAnimationFrame(raf);
  $$('.dropt').forEach(n=>n.classList.remove('dropt'));
  if(!d.moved)return;
  if(mode==='move'&&tgt){
   const to=findSec(tgt.dataset.s);
   if(to&&to.s!==f.s){
    const nr=node.getBoundingClientRect(),sr=tgt.getBoundingClientRect();
    e.x=clamp(Math.round(((nr.left-sr.left)/sr.width*100)*2)/2,0,100-e.w);
    e.y=Math.max(0,Math.round(nr.top-sr.top));
    f.s.els.splice(f.s.els.indexOf(e),1);to.s.els.push(e);grow(to.s);
    ui.secId=to.s.id;ui.elId=e.id;commit(true);renderAll();toast('Elemento movido a «'+to.s.name+'»');return;
   }
  }
  e.y=Math.max(0,e.y);grow(f.s);commit(true);renderCanvas();renderProps();
 };
 addEventListener('pointermove',mv);addEventListener('pointerup',up);
}
frame.addEventListener('pointerdown',ev=>{
 if(ev.button!==0||ui.preview)return;
 const gr=ev.target.closest('.sgrip');
 if(gr){
  ev.preventDefault();const f=findSec(gr.dataset.grip);if(!f||(isStack()&&!f.s.locked))return;
  const s=f.s,sec=gr.parentElement,sy=ev.clientY,h0=s.h,minH=Math.max(40,secBottom(s));
  if(ui.secId!==s.id||ui.elId){ui.secId=s.id;ui.elId=null}
  sec.classList.add('growing');
  const mv=m=>{s.h=Math.max(minH,Math.round(h0+m.clientY-sy));sec.style.minHeight=s.h+'px'};
  const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);sec.classList.remove('growing');commit(true);renderAll()};
  addEventListener('pointermove',mv);addEventListener('pointerup',up);return;
 }
 if(ev.target.closest('.etb,.sbar'))return;
 if(ev.target.closest('[contenteditable=true]'))return;
 if(ev.target.closest('.sl button'))return;
 const el=ev.target.closest('.e');
 if(!el){
  const sec=ev.target.closest('.sec');
  if(sec){ui.secId=sec.dataset.s;ui.elId=null;if(innerWidth<=900)ui.drawer=false;renderRail();renderDrawer();renderCanvas();renderProps()}
  return;
 }
 const id=el.dataset.id,h=ev.target.closest('[data-h]');
 if(ui.elId!==id)selectEl(id);
 if(isStack())return;
 {const ff=findEl(id);if(ff&&ff.e.float&&!h)return}
 startDrag(ev,id,h?h.dataset.h:'move');
});
frame.addEventListener('click',ev=>{
 const a=ev.target.closest('a');
 const nav=ev.target.closest('.mn a,.brand');
 if(nav){ev.preventDefault();const mc=nav.closest&&nav.closest('.mn');if(mc&&ui.preview){const c=mc.querySelector('.mnc');if(c)c.checked=false}if(ui.preview&&nav.dataset.p){ui.pageId=nav.dataset.p;renderCanvas();$('#stage').scrollTop=0}return}
 if(a){
  const href=a.getAttribute('href')||'';
  if(href.startsWith('#p-')){ev.preventDefault();if(ui.preview){const p=S.pages.find(x=>x.id===href.slice(3)&&!x.hidden);if(p){ui.pageId=p.id;renderCanvas();$('#stage').scrollTop=0}}else toast('El enlace lleva a otra página. Compruébalo en Vista previa.')}
  else if(!ui.preview){ev.preventDefault()}
 }
 const sb=ev.target.closest('.sl button');
 if(sb){
  const sl=sb.closest('.sl'),im=[...sl.querySelectorAll('img')],dt=[...sl.querySelectorAll('.dots i')];
  let i=im.findIndex(x=>x.classList.contains('on'));i=(i+(sb.classList.contains('nx')?1:-1)+im.length)%im.length;
  im.forEach((x,k)=>x.classList.toggle('on',k===i));dt.forEach((x,k)=>x.classList.toggle('on',k===i));
 }
});
frame.addEventListener('dblclick',ev=>{
 if(ui.preview)return;
 const el=ev.target.closest('.e');if(!el)return;
 const t=el.querySelector('[data-k=text]');if(!t)return;
 t.contentEditable='true';t.focus();
 const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r);
 t.addEventListener('blur',()=>{
  const f=findEl(el.dataset.id);t.contentEditable='false';
  if(f){f.e.text=t.innerText.replace(/\n$/,'');commit(true)}
  renderCanvas();renderProps();
 },{once:true});
});
/* soltar elementos desde el cajón */
document.addEventListener('dragstart',ev=>{const t=ev.target.closest&&ev.target.closest('.tile');if(t){dragType=t.dataset.type;ev.dataTransfer.setData('text/plain',dragType);ev.dataTransfer.effectAllowed='copy'}});
document.addEventListener('dragend',()=>{dragType=null;$$('.dropt').forEach(n=>n.classList.remove('dropt'))});
frame.addEventListener('dragover',ev=>{if(!dragType)return;const s=ev.target.closest('.sec');if(!s)return;ev.preventDefault();$$('.dropt').forEach(n=>n!==s&&n.classList.remove('dropt'));s.classList.add('dropt')});
frame.addEventListener('drop',ev=>{
 if(!dragType)return;const s=ev.target.closest('.sec');if(!s)return;ev.preventDefault();
 const r=s.getBoundingClientRect(),t=dragType;dragType=null;
 addElement(t,s.dataset.s,(ev.clientX-r.left)/r.width*100,ev.clientY-r.top);
});

/* ===== Propiedades y cajón: entradas ===== */
function after(){commit();renderCanvas()}
function onProp(ev){
 const t=ev.target;
 if(t.dataset.site==='menu'){S.menu=t.checked;commit(true);renderCanvas();renderProps();return}
 if(t.dataset.logo==='h'){S.logo.h=clamp(parseInt(t.value)||38,20,90);commit();renderCanvas();return}
 const o=target();if(!o)return;
 if(t.dataset.mv){if(ev.type==='change')moveEl(t.value);return}
 if(t.dataset.rev){o.items=t.value.split('\n').map(l=>l.split('|').map(x=>x.trim())).filter(r=>r[0]).map(r=>({n:r[0],r:clamp(parseInt(r[1])||5,1,5),t:r.length>3?r.slice(2,-1).join(' | '):(r[2]||''),d:r.length>3?r[r.length-1]:''}));after();return}
 if(t.dataset.lines){o[t.dataset.lines]=t.value.split('\n').map(x=>x.trim()).filter(Boolean);after();return}
 if(t.dataset.net){const n=o.nets.find(x=>x.n===t.dataset.net);if(n)n.u=t.value;after();return}
 if(t.dataset.net1){const x=o.nets[0]||{n:'instagram',u:''};x[t.dataset.net1]=t.value;o.nets=[x];after();return}
 if(t.dataset.act==='net'){
  if(ev.type!=='change')return;
  const k=t.dataset.n,i=o.nets.findIndex(x=>x.n===k);
  if(t.checked&&i<0)o.nets.push({n:k,u:''});else if(!t.checked&&i>=0)o.nets.splice(i,1);
  commit(true);renderCanvas();renderProps();return;
 }
 const k=t.dataset.k;if(!k)return;
 const v=t.dataset.t==='n'?parseFloat(t.value):t.dataset.t==='c'?t.checked:t.value;
 if(t.dataset.t==='n'&&isNaN(v))return;
 setPath(o,k,v);
 if(k==='fs')o.fo=true;
 if(ui.elId&&(k==='y'||k==='h')){const f=findEl(ui.elId);if(f)grow(f.s)}
 if(ev.type==='change'&&t.dataset.re){commit(true);renderCanvas();renderProps();return}
 commit();renderCanvas();
 if(k==='name')renderDrawer();
}
$('#bar').addEventListener('change',ev=>{if(ev.target.id==='devSel'){ui.w=+ev.target.value;renderBar();renderCanvas();return}if(ev.target.id==='pgSel'){ui.pageId=ev.target.value;ui.elId=null;ui.secId=null;renderAll()}});
$('#props').addEventListener('input',onProp);
$('#props').addEventListener('change',onProp);
$('#drawer').addEventListener('input',ev=>{
 const t=ev.target;
 if(t.dataset.pn){const p=S.pages.find(x=>x.id===t.dataset.pn);if(p){p.name=t.value;commit();renderCanvas()}}
 else if(t.dataset.sn){const f=findSec(t.dataset.sn);if(f){f.s.name=t.value;commit();renderCanvas()}}
 else if(t.dataset.d==='fall'){if(t.value){S.design.fh=S.design.fb=t.value;commit();renderCanvas()}}
 else if(t.dataset.d){S.design[t.dataset.d]=['r','hs','ps'].includes(t.dataset.d)?+t.value:t.value;commit();renderCanvas()}
 else if(t.dataset.logo){S.logo[t.dataset.logo]=t.dataset.logo==='h'?clamp(+t.value||38,20,90):t.checked;commit();renderCanvas()}
 else if(t.dataset.site){S[t.dataset.site]=t.dataset.c?t.checked:t.value;commit();renderCanvas()}
});
$('#drawer').addEventListener('change',ev=>{if(['r','hs','ps','fh','fb','fall'].includes(ev.target.dataset.d))renderDrawer();if(ev.target.dataset.site==='title')renderCanvas()});
$('#fileIn').addEventListener('change',ev=>{
 const file=ev.target.files[0];ev.target.value='';if(!file||!upTarget)return;
 const what=upTarget;
 readImg(file,url=>{
  if(what==='logo'){S.logo.src=url;S.logo.on=true;commit(true);renderCanvas();renderDrawer();renderProps();return}
  const o=target();if(!o)return;
  if(what==='src')o.src=url;else if(what==='imgs')o.imgs.push(url);else if(what==='secbg')o.bgi=url;
  commit(true);renderCanvas();renderProps();
 });
});
$('#fileMulti').addEventListener('change',async ev=>{
 const files=[...ev.target.files];ev.target.value='';if(!files.length)return;
 const urls=await Promise.all(files.map(f=>new Promise(r=>readImg(f,r))));
 const map={};let n=0;
 const fx=q=>{const m=/^ph:(\d+)$/.exec(q||'');if(!m||(+m[1]>=10&&+m[1]<=12))return q;if(!(q in map))map[q]=urls[n++%urls.length];return map[q]};
 S.pages.forEach(p=>p.sections.forEach(s=>{s.bgi=fx(s.bgi);s.els.forEach(e=>{if(e.src)e.src=fx(e.src);if(e.imgs)e.imgs=e.imgs.map(fx)})}));
 commit(true);renderAll();toast('Fotos sustituidas');
});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&lpOpen){closeLinkPop();return}
 if(ev.key==='Escape'){$('#modal').hidden=true;return}
 if(isTyping(ev.target))return;
 const m=ev.ctrlKey||ev.metaKey;
 if(m&&ev.key.toLowerCase()==='z'){ev.preventDefault();ev.shiftKey?redo():undo();return}
 if(m&&ev.key.toLowerCase()==='y'){ev.preventDefault();redo();return}
 if(m&&ev.key.toLowerCase()==='s'){ev.preventDefault();save(true);return}
 if(!ui.elId||ui.preview)return;
 const f=findEl(ui.elId);if(!f)return;
 if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();act('eldel',document.body)}
 else if(m&&ev.key.toLowerCase()==='d'){ev.preventDefault();act('eldup',document.body)}
 else if(ev.key.startsWith('Arrow')){
  ev.preventDefault();const st=ev.shiftKey?10:1;
  if(ev.key==='ArrowLeft')f.e.x=clamp(f.e.x-st*.5,0,100-f.e.w);
  if(ev.key==='ArrowRight')f.e.x=clamp(f.e.x+st*.5,0,100-f.e.w);
  if(ev.key==='ArrowUp')f.e.y=Math.max(0,f.e.y-st);
  if(ev.key==='ArrowDown')f.e.y+=st;
  grow(f.s);commit();renderCanvas();renderProps();
 }
});

/* ===== Arranque ===== */
(function init(){
 let p=null,pid=null;
 try{const raw=localStorage.getItem(KEY);if(raw){const o=JSON.parse(raw);if(o&&o.S&&Array.isArray(o.S.pages)&&o.S.pages.length){p=o.S;pid=o.pageId}}}catch(err){}
 loadProject(p||tplInmo());
 S.flags=S.flags||{};
 if(!S.flags.badge){S.flags.badge=1;S.pages.forEach(p=>p.sections.forEach(s=>{if(/Por qué elegirnos|Nuestros valores/.test(s.name))s.els.forEach(e=>{if(e.t==='icon'&&e.badge==null)e.badge=true})}))}
 if(!S.flags.nosotros){S.flags.nosotros=1;const ix=S.pages.findIndex(x=>x.id==='props');if(ix>=0&&S.pages.some(x=>x.id==='contacto')&&!S.pages.some(x=>x.id==='nosotros')){S.pages.splice(ix+1,0,tplInmo().pages.find(x=>x.id==='nosotros'));if(p)markDirty()}}
 cur=JSON.stringify(S);
 if(pid&&S.pages.find(x=>x.id===pid&&!x.hidden))ui.pageId=pid;
 if(innerWidth<=900)ui.drawer=false;
 loadFonts();
 renderAll();
})();


/* ===== Ventanita de enlaces ===== */
const LKS=[['none','Sin enlace','close'],['page','Una página nuestra','pages'],['section','Una sección','sections'],['url','Web externa','link'],['mail','Correo','mail'],['tel','Teléfono','phone'],['doc','Documento','doc']];
let lpOpen=false;
function lpHTML(e){
 const l=e.link,pgs=S.pages;
 let f='';
 if(l.k==='page')f=F('Página de destino',`<select data-lkf="v">${pgs.map(q=>`<option value="${q.id}"${q.id===l.v?' selected':''}>${esc(q.name)}${q.hidden?' (oculta)':''}</option>`).join('')}</select>`);
 if(l.k==='section')f=F('Sección de destino',`<select data-lkf="v">${pgs.flatMap(q=>q.sections.filter(s=>!s.hidden).map(s=>`<option value="${s.id}"${s.id===l.v?' selected':''}>${esc(q.name)} · ${esc(s.name)}</option>`)).join('')}</select>`)+`<p class="hint">Al pulsar, la web lleva a esa parte de la página.</p>`;
 if(l.k==='url')f=F('Dirección web',`<input type="text" data-lkf="v" value="${esc(l.v||'')}" placeholder="https://www.tuweb.com">`)+`<label class="ck"><input type="checkbox" data-lkf="nt" data-c="1"${l.nt?' checked':''}> Abrir en una pestaña nueva</label>`;
 if(l.k==='mail')f=F('Correo electrónico',`<input type="text" data-lkf="v" value="${esc(l.v||'')}" placeholder="info@tuagencia.com">`);
 if(l.k==='tel')f=F('Teléfono',`<input type="text" data-lkf="v" value="${esc(l.v||'')}" placeholder="+34 600 000 000">`);
 if(l.k==='doc'){const up=String(l.v||'').startsWith('data:');f=`<button class="b sm" data-lk="doc">${svg('doc',14)}Subir un documento (PDF, Word…)</button>${up?`<p class="hint">Documento subido: <b>${esc(l.name||'documento')}</b></p>`:''}`+F('…o dirección del documento',`<input type="text" data-lkf="v" value="${up?'':esc(l.v||'')}" placeholder="https://…/catalogo.pdf">`)+`<p class="hint">Los documentos subidos aumentan el tamaño de la web. Mejor PDF ligeros.</p>`}
 return `<div class="lph"><b>Enlace de este elemento</b><button class="ib" data-lk="close" aria-label="Cerrar">${svg('close',18)}</button></div>
 <div class="lpk">${LKS.map(([k,n,ic])=>`<button class="lpb${l.k===k?' on':''}" data-lk="k" data-k="${k}">${svg(ic,20)}<span>${n}</span></button>`).join('')}</div>
 ${f?`<div class="lpf">${f}</div>`:''}
 <div class="lpa"><button class="b pri" data-lk="done">Listo</button></div>`;
}
function openLinkPop(anchor){
 const f=ui.elId&&findEl(ui.elId);if(!f)return;
 const e=f.e;if(!e.link)e.link={k:'none',v:'',nt:true};
 const pop=$('#linkpop');pop.innerHTML=lpHTML(e);pop.hidden=false;lpOpen=true;
 const r=anchor?anchor.getBoundingClientRect():{left:innerWidth/2-170,bottom:120,top:120};
 const w=360,left=clamp(r.left,8,innerWidth-w-8);
 pop.style.left=left+'px';pop.style.width=w+'px';pop.style.top='0px';
 let top=r.bottom+8;const hgt=pop.offsetHeight;if(top+hgt>innerHeight-8)top=Math.max(8,innerHeight-hgt-8);
 pop.style.top=top+'px';
}
function closeLinkPop(){const p=$('#linkpop');if(p){p.hidden=true}lpOpen=false;renderCanvas();renderProps()}
function fitLinkPop(){const p=$('#linkpop'),h=p.offsetHeight;let t=parseFloat(p.style.top)||0;if(t+h>innerHeight-8)t=Math.max(8,innerHeight-h-8);p.style.top=t+'px'}
function refreshLinkPop(){const f=ui.elId&&findEl(ui.elId);if(!f){closeLinkPop();return}$('#linkpop').innerHTML=lpHTML(f.e);fitLinkPop()}
$('#linkpop').addEventListener('click',ev=>{
 const b=ev.target.closest('[data-lk]');if(!b)return;
 const f=ui.elId&&findEl(ui.elId);if(!f)return;const e=f.e,l=e.link;
 const w=b.dataset.lk;
 if(w==='close'||w==='done'){closeLinkPop();return}
 if(w==='doc'){upTarget='doc';$('#fileDoc').click();return}
 if(w==='k'){
  const k=b.dataset.k;if(l.k===k)return;
  l.k=k;l.v='';l.name='';l.nt=(k==='url'||k==='doc');
  if(k==='page'){const p=S.pages.find(x=>!x.hidden);l.v=p?p.id:''}
  if(k==='section'){const s=curPage().sections.find(x=>!x.hidden);l.v=s?s.id:''}
  if(k==='none')l.nt=true;
  commit(true);refreshLinkPop();
 }
});
$('#linkpop').addEventListener('input',ev=>{const t=ev.target;if(!t.dataset.lkf)return;const f=ui.elId&&findEl(ui.elId);if(!f)return;f.e.link[t.dataset.lkf]=t.dataset.c?t.checked:t.value;if(t.dataset.lkf==='v')f.e.link.name='';commit()});
$('#linkpop').addEventListener('change',ev=>{const t=ev.target;if(t.dataset.lkf){const f=ui.elId&&findEl(ui.elId);if(f){f.e.link[t.dataset.lkf]=t.dataset.c?t.checked:t.value;commit(true)}}});
document.addEventListener('pointerdown',ev=>{if(!lpOpen)return;if(ev.target.closest('#linkpop,[data-act=linkpop]'))return;closeLinkPop()},true);
$('#fileDoc').addEventListener('change',ev=>{
 const file=ev.target.files[0];ev.target.value='';if(!file)return;
 if(file.size>3*1024*1024){toast('El documento pesa más de 3 MB. Usa uno más ligero o enlaza su dirección web.');return}
 const r=new FileReader();r.onload=()=>{const f=ui.elId&&findEl(ui.elId);if(!f)return;f.e.link={k:'doc',v:r.result,name:file.name,nt:true};commit(true);refreshLinkPop();toast('Documento añadido: '+file.name)};r.readAsDataURL(file);
});

$('#fileVid').addEventListener('change',ev=>{
 const file=ev.target.files[0];ev.target.value='';if(!file)return;
 if(file.size>4*1024*1024){toast('El vídeo pesa más de 4 MB. Enlaza uno de YouTube, Vimeo o una dirección .mp4.');return}
 const r=new FileReader();r.onload=()=>{const o=ui.secId&&(findSec(ui.secId)||{}).s;if(!o)return;o.bgv=r.result;commit(true);renderCanvas();renderProps();toast('Vídeo de fondo añadido')};r.readAsDataURL(file);
});


/* ===== Campos numéricos con − y + ===== */
function enhanceNum(root){
 root.querySelectorAll('input[type=number]:not([data-ns])').forEach(i=>{
  i.dataset.ns='1';
  const w=document.createElement('div');w.className='nstep';
  const mk2=(t,dd,l)=>{const b=document.createElement('button');b.type='button';b.className='nb';b.dataset.d=dd;b.textContent=t;b.setAttribute('aria-label',l);return b};
  i.parentNode.insertBefore(w,i);w.append(mk2('−',-1,'Menos'),i,mk2('+',1,'Más'));
 });
}
['#props','#drawer'].forEach(s=>{const n=$(s);new MutationObserver(()=>enhanceNum(n)).observe(n,{childList:true,subtree:true});enhanceNum(n)});
document.addEventListener('click',ev=>{
 const b=ev.target.closest('.nb');if(!b)return;
 const i=b.parentNode.querySelector('input');if(!i)return;
 const st=parseFloat(i.step)||1;let v=parseFloat(i.value);if(isNaN(v))v=0;
 v=Math.round((v+(+b.dataset.d)*st)*100)/100;
 if(i.min!=='')v=Math.max(v,parseFloat(i.min));if(i.max!=='')v=Math.min(v,parseFloat(i.max));
 i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));
});

document.addEventListener('pointerdown',ev=>{const m=$('#secpop');if(m&&!m.hidden&&!ev.target.closest('#secpop,[data-act=secto]'))m.hidden=true},true);
