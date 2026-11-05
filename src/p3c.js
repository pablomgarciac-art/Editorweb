/* ===== Estado, historial y guardado ===== */
let hist=[],fut=[],cur='',lastT=0,saveT=null,dragType=null,upTarget=null,savedAt=null,dirtyFlag=false,toastT=null;
const KEY='ewv-proyecto-v1';
const curPage=()=>S.pages.find(p=>p.id===ui.pageId&&!p.hidden)||S.pages.find(p=>!p.hidden)||S.pages[0];
const hfS=()=>[S.header,S.footer].filter(Boolean);
const findSec=id=>{for(const s of hfS())if(s.id===id)return {s,p:null};for(const p of S.pages){const s=p.sections.find(s=>s.id===id);if(s)return {s,p}}return null};
const findEl=id=>{for(const s of hfS()){const e=s.els.find(e=>e.id===id);if(e)return {e,s,p:null}}for(const p of S.pages)for(const s of p.sections){const e=s.els.find(e=>e.id===id);if(e)return {e,s,p}}return null};
const secBottom=s=>s.els.reduce((m,e)=>Math.max(m,e.y+(e.h||(e.t==='reviews'?420:70))),0);
const grow=s=>{const need=secBottom(s)+30;if(need>s.h)s.h=need};

function commit(hard){
 const now=JSON.stringify(S);if(now===cur)return;
 const t=Date.now();
 if(hard||t-lastT>700){hist.push(cur);if(hist.length>60)hist.shift();fut=[]}
 cur=now;lastT=t;markDirty();
}
function markDirty(){dirtyFlag=true;renderBar();clearTimeout(saveT);saveT=setTimeout(()=>save(false),700)}
function save(manual){
 try{localStorage.setItem(KEY,JSON.stringify({S,pageId:ui.pageId}));savedAt=new Date();dirtyFlag=false}catch(err){if(manual)toast('Este navegador no permite guardar. Usa la copia del proyecto en Configuración.')}
 renderBar();if(manual&&!dirtyFlag)toast('Cambios guardados');
}
function undo(){if(!hist.length)return;fut.push(cur);S=JSON.parse(hist.pop());cur=JSON.stringify(S);fixSel();markDirty();renderAll()}
function redo(){if(!fut.length)return;hist.push(cur);S=JSON.parse(fut.pop());cur=JSON.stringify(S);fixSel();markDirty();renderAll()}
function fixSel(){if(ui.elId&&!findEl(ui.elId))ui.elId=null;if(ui.secId&&!findSec(ui.secId))ui.secId=null;if(!S.pages.find(p=>p.id===ui.pageId))ui.pageId=S.pages[0].id}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}
function loadProject(p){S=p;S.logo=S.logo||{on:true,src:'',h:38,name:true};const d=S.design=S.design||clone(D0);if(!d.fh){const pr=PAIRS[d.font]||PAIRS.mod;d.fh=pr[1];d.fb=pr[2]}let mi=0;const fixI=q=>(typeof q==='string'&&q.startsWith('data:image/svg+xml'))?'ph:'+(mi++%PHN):q;S.pages.forEach(p=>p.sections.forEach(s=>{s.bgi=fixI(s.bgi);if(/^ph:\d+$/.test(s.bgi||''))s.bgi='ph:14';s.els.forEach(e=>{if(e.src)e.src=fixI(e.src);if(e.imgs)e.imgs=e.imgs.map(fixI)})}));d.hs=d.hs||100;d.ps=d.ps||100;d.r=d.r==null?10:d.r;if(!S.header||!S.header.els)S.header=makeHeader();if(!S.footer||!S.footer.els){S.footer=makeFooter();S.pages.forEach(p=>{p.sections=p.sections.filter(s=>!(s.name==='Pie de página'&&s.els.length<=3))})}if(S.menu===false){S.header.hidden=true;S.menu=true}ui.pageId=S.pages[0].id;ui.secId=null;ui.elId=null;hist=[];fut=[];cur=JSON.stringify(S)}

/* ===== Barra superior y raíl ===== */
function renderBar(){
 const st=dirtyFlag?'Sin guardar':savedAt?'Guardado '+savedAt.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}):'';
 $('#bar').innerHTML=`<span class="brand"><i></i>Editor web</span>
 <div class="seg"><button class="b${ui.mode==='desktop'?' on':''}" data-act="mode" data-m="desktop" title="Vista de escritorio">${svg('desktop',16)}<span class="lbl">Escritorio</span></button><button class="b${ui.mode==='tablet'?' on':''}" data-act="mode" data-m="tablet" title="Vista de tablet">${svg('tablet',16)}<span class="lbl">Tablet</span></button><button class="b${ui.mode==='mobile'?' on':''}" data-act="mode" data-m="mobile" title="Vista móvil">${svg('mobile',16)}<span class="lbl">Móvil</span></button></div>${true?`<label class="pgsel" title="Tamaño de pantalla"><select id="devSel" aria-label="Dispositivo">${DEVS[ui.mode].map(d=>`<option value="${d[1]}"${d[1]===ui.w?' selected':''}>${d[1]>=9999?d[0]:d[1]+'px · '+d[0]}</option>`).join('')}</select></label>`:''}
 <label class="pgsel" title="Ir a otra página">${svg('pages',18)}<select id="pgSel" aria-label="Página">${S.pages.map(p=>`<option value="${p.id}"${p.id===curPage().id?' selected':''}${p.hidden?' disabled':''}>${esc(p.name)}${p.hidden?' (oculta)':''}</option>`).join('')}</select></label>
 <span class="sp"></span><span class="stat">${st}</span>
 <button class="b" data-act="undo" title="Deshacer (Ctrl+Z)"${hist.length?'':' disabled'}>${svg('undo',16)}</button>
 <button class="b" data-act="redo" title="Rehacer (Ctrl+Y)"${fut.length?'':' disabled'}>${svg('redo',16)}</button>
 <button class="b${ui.preview?' on':''}" data-act="preview">${svg('eye',16)}<span class="lbl">${ui.preview?'Seguir editando':'Vista previa'}</span></button>
 <button class="b" data-act="save">${svg('save',16)}<span class="lbl">Guardar</span></button>
 <button class="b pri" data-act="publish">${svg('rocket',16)}<span class="lbl">Publicar</span></button>`;
}
const RAIL=[['pages','Páginas'],['sections','Secciones'],['elements','Elementos'],['design','Diseño'],['hidden','Elementos ocultos'],['settings','Configuración de la Página Web']];
function renderRail(){
 $('#rail').innerHTML=RAIL.map(([k,l])=>`<button class="ri${ui.drawer&&ui.panel===k?' on':''}" data-act="panel" data-p="${k}">${svg(k==='settings'?'gear':k,34,1.5)}<span>${l}</span></button>`).join('');
}

/* ===== Cajón izquierdo ===== */
const hdr=t=>`<div class="dh">${t}<button class="ib" data-act="drawerclose" aria-label="Cerrar">${svg('close',20)}</button></div>`;
const GROUPS=[
 ['Imágenes',[['img','Imagen','image'],['gallery','Galería de imágenes','gallery'],['slider','Slide de imágenes','slide'],['icon','Icono','star']]],
 ['Texto',[['h1','Título 1','H1'],['h2','Título 2','H2'],['h3','Título 3','H3'],['p','Párrafo','btntext']]],
 ['Botones',[['btn','Botón','btn'],['btnicon','Botón con el icono','btnicon'],['btntext','Botón de texto','btntext'],['btnti','Botón texto e icono','btnti']]],
 ['Menú y logo',[['logo','Logo','image'],['menu','Menú de páginas','sections']]],
 ['Redes sociales',[['social','Redes en grupo','social'],['social1','Red social suelta','user']]],
 ['Formas y figuras',[['shape:rect','Rectángulo','rect'],['shape:circle','Círculo','circle'],['shape:triangle','Triángulo','triangle'],['shape:star','Estrella','star'],['shape:line','Línea','line']]],
 ['Interactivo',[['map','Mapa de localización','map'],['video','Vídeo','video'],['form','Formulario','form'],['doc','Documento','doc'],['reviews','Opiniones de Google','star'],['html','HTML suelto','code']]]
];
function dElements(){
 return hdr('Elementos')+`<p class="hint">Arrastra un elemento hasta una sección o pulsa sobre él para añadirlo a la sección activa.</p>`+GROUPS.map(([g,it])=>`<div class="dg">${g}</div><div class="tiles">${it.map(([t,l,i])=>`<div class="tile" draggable="true" data-type="${t}" data-act="addel" tabindex="0" role="button">${/^H\d$/.test(i)?`<span class="h">${i}</span>`:svg(i,26,1.5)}<span>${l}</span></div>`).join('')}</div>`).join('');
}
function dPages(){
 const cp=curPage();
 return hdr('Páginas')+`<p class="hint">La primera página es la de inicio. Pulsa el icono de página para editarla.</p>`+S.pages.map((p,i)=>`<div class="li big${p.id===cp.id?' on':''}${p.hidden?' off':''}">
 <button class="ib" data-act="selpage" data-id="${p.id}" title="Editar esta página">${svg('pages',21)}</button>
 <input type="text" data-pn="${p.id}" value="${esc(p.name)}" aria-label="Nombre de la página">
 <div class="acts"><button class="ib" data-act="pgup" data-id="${p.id}" title="Subir">${svg('arrup',19)}</button>
 <button class="ib" data-act="pgdown" data-id="${p.id}" title="Bajar">${svg('arrdown',19)}</button>
 <button class="ib" data-act="pghide" data-id="${p.id}" title="${p.hidden?'Mostrar':'Ocultar'}">${svg(p.hidden?'eye':'hidden',19)}</button>
 <button class="ib" data-act="pgdup" data-id="${p.id}" title="Duplicar">${svg('copy',19)}</button>
 <button class="ib" data-act="pgdel" data-id="${p.id}" title="Borrar">${svg('trash',19)}</button></div></div>`).join('')+`<button class="b pri" data-act="catpage" style="margin-top:8px">${svg('plus',16)}Añadir página</button>`;
}
const lockRow=s=>`<div class="li big${ui.secId===s.id?' on':''}${s.hidden?' off':''}">
 <button class="ib" data-act="selsec" data-id="${s.id}" title="Bloqueada: no se puede mover">${svg('lock',21)}</button>
 <div class="lab">${esc(s.name)}<small>Igual en todas las páginas · no se mueve</small></div>
 <div class="acts"><button class="ib" data-act="sechide" data-id="${s.id}" title="${s.hidden?'Mostrar':'Ocultar'}">${svg(s.hidden?'eye':'hidden',19)}</button><button class="b sm" data-act="selsec" data-id="${s.id}">Editar</button></div></div>`;
function dSections(){
 const pg=curPage();
 return hdr('Secciones')+`<p class="hint">Secciones de «${esc(pg.name)}». Cada una se ve delimitada por una línea de puntos.</p>`+lockRow(S.header)+pg.sections.map(s=>`<div class="li big${ui.secId===s.id?' on':''}${s.hidden?' off':''}">
 <button class="ib" data-act="selsec" data-id="${s.id}" title="Ir a la sección">${svg('sections',21)}</button>
 <input type="text" data-sn="${s.id}" value="${esc(s.name)}" aria-label="Nombre de la sección">
<div class="acts"> <button class="ib" data-act="secup" data-id="${s.id}" title="Subir">${svg('arrup',19)}</button>
 <button class="ib" data-act="secdown" data-id="${s.id}" title="Bajar">${svg('arrdown',19)}</button>
 <button class="ib" data-act="sechide" data-id="${s.id}" title="${s.hidden?'Mostrar':'Ocultar'}">${svg(s.hidden?'eye':'hidden',19)}</button>
 <button class="ib" data-act="secdel" data-id="${s.id}" title="Borrar">${svg('trash',19)}</button></div></div>`).join('')+lockRow(S.footer)+`<button class="b pri" data-act="catsec" style="margin-top:8px">${svg('plus',16)}Añadir sección</button><p class="hint">Elige entre modelos ya preparados: texto, imágenes, equipo, inmuebles, contacto y más.</p>`;
}
function dDesign(){
 const d=S.design;
 const c=(k,l)=>`<div class="f"><label>${l}</label><input type="color" data-d="${k}" value="${d[k]}"></div>`;
 const fo=cur=>FONTS.map(f=>`<option value="${f.id}" style="font-family:${f.f}"${f.id===cur?' selected':''}>${f.n}</option>`).join('');
 return hdr('Diseño')+`<div class="dg">Colores</div><div class="row">${c('c1','Principal')}${c('c2','Acento')}</div><div class="row">${c('bg','Fondo')}${c('ink','Texto')}</div>
 <div class="dg">Combinaciones de letra</div><div class="tiles">${Object.entries(PAIRS).map(([k,[n,h,b]])=>`<button class="tile" data-act="fontpair" data-k="${k}" style="cursor:pointer"><span style="font:700 20px ${fnt(h).f}">Aa</span><span>${n}</span></button>`).join('')}</div>
 <div class="dg">Tipografía de toda la web</div>
 <p class="hint">Elige una y se aplica a todos los textos, títulos, botones, menú y formularios. Después, en cualquier elemento suelto, puedes cambiarla con «Tipo de letra».</p>
 <div class="f"><label>Una sola tipografía para todo</label><select data-d="fall"><option value="">Elige una…</option>${fo(d.fh===d.fb?d.fh:'')}</select></div>
 <p class="hint">O combina dos distintas:</p>
 <div class="f"><label>Títulos</label><select data-d="fh">${fo(d.fh)}</select></div>
 <div class="f"><label>Texto y botones</label><select data-d="fb">${fo(d.fb)}</select></div>
 <div class="dg">Tamaño general</div>
 <div class="f"><label>Títulos (${d.hs}%)</label><input type="range" min="60" max="160" step="5" value="${d.hs}" data-d="hs"></div>
 <div class="f"><label>Texto y botones (${d.ps}%)</label><input type="range" min="60" max="160" step="5" value="${d.ps}" data-d="ps"></div>
 <div style="padding:14px;border:1px solid var(--line);border-radius:8px;background:#fff;color:#1f2937"><div style="font:700 ${Math.round(26*d.hs/100)}px/1.15 ${fnt(d.fh).f}">Así se verán los títulos</div><div style="margin-top:6px;font:400 ${Math.round(16*d.ps/100)}px/1.4 ${fnt(d.fb).f}">Y así el texto de los párrafos y botones.</div></div>
 <p class="hint">Estos tamaños se aplican a todos los textos. Si cambias el tamaño de un texto concreto en sus propiedades, ese texto se queda con su tamaño y deja de seguir el general.</p>
 <div class="dg">Esquinas</div><div class="f"><label>Redondeo de botones y menú (${d.r}px)</label><input type="range" min="0" max="40" value="${d.r}" data-d="r"></div>`;
}
function dHidden(){
 let h=hdr('Elementos ocultos')+`<p class="hint">Aquí están las páginas, secciones y elementos que ocultaste. No se publican hasta que los muestres de nuevo.</p>`,n=0;
 const row=(l,sub,act,id)=>{n++;return `<div class="li"><div class="lab">${esc(l)}<small>${esc(sub)}</small></div><button class="b sm" data-act="${act}" data-id="${id}">Mostrar</button></div>`};
 let a='',b='',c='';
 S.pages.forEach(p=>{if(p.hidden)a+=row(p.name,'Página','pghide',p.id);p.sections.forEach(s=>{if(s.hidden)b+=row(s.name,'Sección · '+p.name,'sechide',s.id);s.els.forEach(e=>{if(e.hid)c+=row(LBL[e.t]+(e.text?': '+e.text.slice(0,22):''),'Elemento · '+s.name+' · '+p.name,'elshow',e.id)})})});
 if(a)h+=`<div class="dg">Páginas</div>`+a;if(b)h+=`<div class="dg">Secciones</div>`+b;if(c)h+=`<div class="dg">Elementos</div>`+c;
 if(!n)h+=`<p class="hint">No hay nada oculto. Usa el icono del ojo tachado en una página, sección o elemento para ocultarlo.</p>`;
 return h;
}
function dSettings(){
 return hdr('Configuración de la Página Web')+`<div class="f"><label>Nombre del sitio</label><input type="text" data-site="title" value="${esc(S.title)}"></div>
 <div class="f"><label>Descripción (buscadores)</label><textarea data-site="desc">${esc(S.desc)}</textarea></div>
 <p class="hint">La cabecera y el pie de página se editan en el panel «Secciones» (arriba y abajo, con candado). El logo se usa en ambos.</p><div class="dg">Logo</div>
 <label class="ck"><input type="checkbox" data-logo="on"${S.logo.on!==false?' checked':''}> Mostrar logo en el menú</label>
 <div class="row" style="margin-bottom:10px"><button class="b sm" data-act="up" data-f="logo">${svg('image',14)}Subir mi logo</button><button class="b sm" data-act="rmlogo">Logo predeterminado</button></div>
 <label class="ck"><input type="checkbox" data-logo="name"${S.logo.name!==false?' checked':''}> Mostrar el nombre junto al logo</label>
 <div class="f"><label>Alto del logo (px)</label><input type="number" min="20" max="90" data-logo="h" value="${S.logo.h||38}"></div>
 <div class="dg">Fotos de ejemplo</div>
 <p class="hint">Sube varias fotos tuyas a la vez y sustituyen a las de ejemplo, en el orden en que aparecen en la web. Las fotos de personas del equipo se cambian una a una.</p>
 <button class="b sm" data-act="bulk">${svg('gallery',14)}Subir mis fotos</button>
 <div class="dg">Plantillas</div>
 <p class="hint">Cargar una plantilla sustituye tu web actual. Haz antes una copia del proyecto (más abajo) si quieres conservarla.</p>
 ${TPLS.map(t=>`<button class="pre tp${ui.tplArm===t[0]?' arm':''}" data-act="tpl" data-t="${t[0]}"><span class="sw">${t[3].map(x=>`<i style="background:${x}"></i>`).join('')}</span><b>${t[1]}</b><small>${ui.tplArm===t[0]?'Pulsa otra vez para sustituir tu web actual':t[2]}</small></button>`).join('')}
 <div class="dg">Copia del proyecto</div>
 <p class="hint">Guardar usa la memoria de este navegador. Para llevarte el proyecto a otro equipo, copia este texto y pégalo allí en «Importar».</p>
 <div class="f"><textarea class="code" readonly id="expJson" rows="4">${esc(JSON.stringify(S))}</textarea></div>
 <button class="b sm" data-act="copyjson">Copiar proyecto</button>
 <div class="f" style="margin-top:12px"><label>Importar</label><textarea class="code" id="impJson" rows="3" placeholder="Pega aquí un proyecto copiado"></textarea></div>
 <button class="b sm" data-act="impjson">Importar proyecto</button>`;
}
function renderDrawer(){
 $('#app').classList.toggle('dw',ui.drawer);
 if(!ui.drawer){$('#drawer').innerHTML='';return}
 const f={pages:dPages,sections:dSections,elements:dElements,design:dDesign,hidden:dHidden,settings:dSettings}[ui.panel];
 $('#drawer').innerHTML=`<div class="pin">${f()}</div>`;
}

/* ===== Panel de propiedades ===== */
const F=(l,h)=>`<div class="f"><label>${l}</label>${h}</div>`;
const inp=(k,v,t='text',x='')=>`<input type="${t}" data-k="${k}" data-t="${t==='number'?'n':'s'}" value="${esc(v)}" ${x}>`;
const colr=(k,v,fb)=>`<div class="row"><input type="color" data-k="${k}" data-t="s" value="${hexOf(v,fb)}"><button class="b sm" data-act="autocol" data-k="${k}">Auto</button></div>`;
const sel=(k,v,o,re)=>`<select data-k="${k}" data-t="s"${re?' data-re="1"':''}>${o.map(([a,b])=>`<option value="${a}"${a==v?' selected':''}>${b}</option>`).join('')}</select>`;
const chk=(k,v,l,re)=>`<label class="ck"><input type="checkbox" data-k="${k}" data-t="c"${re?' data-re="1"':''}${v?' checked':''}> ${l}</label>`;
const imgList=e=>e.imgs.map((s,i)=>`<div class="th"><img src="${esc(IS(s))}" alt=""><span>Imagen ${i+1}</span><button class="ib" data-act="rmimg" data-i="${i}" title="Quitar">${svg('close',16)}</button></div>`).join('')+`<div class="row"><button class="b sm" data-act="up" data-f="imgs">${svg('plus',14)}Subir foto</button></div><div class="f" style="margin-top:8px"><label>O añadir por enlace</label><div class="row"><input type="text" id="addurl" placeholder="https://…"><button class="b sm" data-act="addurl" style="flex:none">Añadir</button></div></div>`;

function elProps(f){
 const {e,s,p}=f;let h='';
 const sw=`<div class="row"><button class="b sm" data-act="eldup">${svg('copy',14)}Duplicar</button><button class="b sm" data-act="elhide">${svg('hidden',14)}Ocultar</button><button class="b sm dng" data-act="eldel">${svg('trash',14)}Borrar</button></div>`;
 h+=`<div class="dh">${LBL[e.t]}<button class="ib" data-act="propsclose" aria-label="Cerrar">${svg('close',20)}</button></div>${sw}<div style="height:14px"></div>`;
 if(TXT.includes(e.t)||['btn','btntext','btnti','doc'].includes(e.t))h+=F('Texto',`<textarea data-k="text" data-t="s" rows="${e.t==='p'?4:2}">${esc(e.text)}</textarea>`);
 if(TXT.includes(e.t)||['btn','btntext','btnti'].includes(e.t))h+=`<div class="row">${F('Tamaño letra',inp('fs',e.fs,'number','min="8" max="120"'))}${TXT.includes(e.t)?F('Alineación',sel('align',e.align,[['left','Izquierda'],['center','Centro'],['right','Derecha']])):''}</div>`;
 if(TXT.includes(e.t)||['btn','btntext','btnti'].includes(e.t))h+=F('Tipo de letra',sel('ff',e.ff||'',[['','La de tu web'],...FONTS.map(f=>[f.id,f.n])],1));
 if(e.fo)h+=`<button class="b sm" data-act="fsauto" style="margin-bottom:10px">Usar el tamaño general</button>`;
 if(TXT.includes(e.t))h+=chk('b',e.b,'Negrita');
 if(e.t==='icon')h+=chk('badge',e.badge,'Círculo suave de color detrás del icono',1);
 if(['icon','btnicon','btnti'].includes(e.t))h+=`<div class="f"><label>Icono · pulsa el que prefieras</label><div class="ipick">${ICON_CHOICES.map(i=>`<button type="button" class="ipk${e.icon===i?' on':''}" data-act="pickicon" data-i="${i}" aria-label="${i}">${svg(i,26)}</button>`).join('')}</div></div>`;
 if(['btn','btnicon','btnti','social','social1'].includes(e.t))h+=`<div class="row">${F('Fondo',colr('bgc',e.bgc,'c1'))}${F('Color',colr('color',e.color,'#ffffff'))}</div>`;
 else if(TXT.includes(e.t)||['icon','btntext'].includes(e.t))h+=F('Color',colr('color',e.color,e.t==='icon'||e.t==='btntext'?'c1':'ink'));
 if(e.t==='logo')h+=`<p class="hint">El logo se sube en Configuración de la Página Web.</p>`+F('Tamaño del logo (px)',inp('lh',e.lh||38,'number','min="16" max="120"'))+`<div class="dg">Nombre junto al logo</div>`+chk('name',e.name!==false,'Mostrar el nombre',1)+(e.name!==false?F('Texto del nombre',inp('nm',e.nm||'','text','placeholder="'+esc(S.title)+'"'))+`<div class="row">${F('Tamaño de letra',inp('nfs',e.nfs||18,'number','min="10" max="60"'))}${F('Color',colr('color',e.color,'c1'))}</div>`+F('Tipo de letra',sel('ff',e.ff||'',[['','La de tus títulos'],...FONTS.map(f=>[f.id,f.n])],1))+chk('nb',e.nb!==false,'Negrita',1):'');
 if(e.t==='menu')h+=F('Tamaño de letra',inp('fs',e.fs||15,'number','min="10" max="40"'))+F('Aspecto de los enlaces',sel('style',e.style||'pill',[['pill','Botón con fondo de color'],['line','Subrayado'],['text','Solo color de texto']],1))+F('Disposición',sel('dir',e.dir||'row',[['row','En una fila'],['col','En columna']],1))+F('Alineación',sel('align',e.align||'right',[['left','Izquierda'],['center','Centro'],['right','Derecha']],1))+F('Color de los enlaces',colr('color',e.color,'ink'))+F('Color al pasar el ratón (hover)',colr('hc',e.hc,'c1'));
 if(['btn','btnicon','btnti','btntext'].includes(e.t))h+=`<div class="dg">Borde</div><div class="row">${F('Grosor (px, 0 = sin borde)',inp('bw',e.bw||0,'number','min="0" max="12" data-re="1"'))}${F('Color del borde',colr('bc',e.bc,'c1'))}</div>`+(e.bw>0?F('Color del borde al pasar el ratón',colr('bch',e.bch,'c2')):'')+`<div class="dg">Al pasar el ratón</div><p class="hint">Cómo cambia el botón cuando el cliente pone el cursor encima. «Auto» = no cambia.</p><div class="row">${e.t==='btntext'?'':F('Fondo',colr('bgh',e.bgh,'c2'))}${F('Color del texto',colr('colorh',e.colorh,'#ffffff'))}</div>`+F('Efecto',sel('hfx',e.hfx||'none',[['none','Ninguno'],['lift','Se eleva con sombra'],['zoom','Crece un poco']],1));
 if(['btn','btnicon','btnti'].includes(e.t))h+=F('Redondeo',inp('r',e.r,'number','min="0" max="999"'));
 if(e.t==='img')h+=`<button class="b sm" data-act="up" data-f="src">${svg('image',14)}Subir foto</button>`+F('…o enlace de imagen',inp('src',(e.src.startsWith('data:')||e.src.startsWith('ph:'))?'':e.src,'text','placeholder="https://…"'))+`<p class="hint">Las imágenes por enlace se ven en la web publicada. Para verlas aquí, súbelas desde tu equipo.</p><div class="row">${F('Ajuste',sel('fit',e.fit,[['cover','Rellenar'],['contain','Completa']]))}${F('Redondeo',inp('r',e.r,'number','min="0" max="999"'))}</div>`+F('Texto alternativo',inp('alt',e.alt));
 if(e.t==='gallery')h+=F('Fotos',imgList(e))+`<div class="row">${F('Columnas',inp('cols',e.cols,'number','min="1" max="6"'))}${F('Redondeo',inp('r',e.r,'number','min="0"'))}</div>`;
 if(e.t==='slider')h+=F('Fotos del slide',imgList(e));
 if(e.t==='social'||e.t==='social1')h+=F('Estilo',sel('style',e.style||'circle',[['circle','Círculo de color'],['rounded','Cuadrado redondeado'],['plain','Solo icono'],['brand','Colores de cada red'],['logo','Logos originales (sin fondo)']]))+(e.t==='social'?F('Tamaño de los iconos (px)',inp('sz',e.sz||44,'number','min="28" max="80"')):'');
 if(e.t==='social')h+=`<div class="f"><label>Redes</label>${Object.entries(NETS).map(([k,[a,n]])=>{const x=e.nets.find(q=>q.n===k);return `<label class="ck"><input type="checkbox" data-act="net" data-n="${k}"${x?' checked':''}> ${n}</label>${x?`<input type="text" data-net="${k}" value="${esc(x.u)}" placeholder="Enlace de ${n}" style="margin:-2px 0 8px">`:''}`}).join('')}</div>`;
 if(e.t==='social1'){const x=e.nets[0]||{n:'instagram',u:''};h+=F('Red',`<select data-net1="n">${Object.entries(NETS).map(([k,[a,n]])=>`<option value="${k}"${k===x.n?' selected':''}>${n}</option>`).join('')}</select>`)+F('Enlace',`<input type="text" data-net1="u" value="${esc(x.u)}" placeholder="https://…">`)}
 if(e.t==='shape')h+=F('Forma',sel('shape',e.shape,[['rect','Rectángulo'],['circle','Círculo'],['triangle','Triángulo'],['star','Estrella'],['line','Línea']]))+F('Color',colr('fill',e.fill,'c2'))+(e.shape==='rect'?F('Redondeo',inp('r',e.r,'number','min="0"')):'');
 if(e.t==='map')h+=F('Dirección o lugar',inp('q',e.q))+`<p class="hint">El mapa real aparece en la web publicada.</p>`;
 if(e.t==='video')h+=F('Enlace del vídeo',inp('url',e.url,'text','placeholder="YouTube, Vimeo o .mp4"'));
 if(e.t==='form')h+=F('Tipo de letra',sel('ff',e.ff||'',[['','La de tu web'],...FONTS.map(f=>[f.id,f.n])],1))+`<div class="row">${F('Tamaño de letra',inp('fz',e.fz||15,'number','min="10" max="32"'))}${F('Tamaño de los campos',sel('fld',e.fld||'m',[['s','Pequeños'],['m','Medianos'],['l','Grandes']],1))}</div>`+F('Columnas',sel('fcols',e.fcols||1,[[1,'Una columna'],[2,'Dos columnas'],[3,'Tres columnas']],1))+F('Campos (uno por línea)',`<textarea data-lines="fields" rows="4">${esc(e.fields.join('\n'))}</textarea>`)+F('Texto del botón',inp('btn',e.btn))+F('Enviar a (dirección del servicio de formularios)',inp('action',e.action,'text','placeholder="https://formspree.io/f/…"'))+`<p class="hint">Sin dirección, el formulario solo muestra un mensaje de gracias.</p>`;
 if(e.t==='reviews')h+=`<div class="row">${F('Nota media',inp('rating',e.rating))}${F('Nº de opiniones',inp('count',e.count))}</div>`+F('Enlace a tu ficha de Google',inp('url',e.url,'text','placeholder="https://g.page/…"'))+F('Opiniones (una por línea)',`<textarea class="code" data-rev="1" rows="8">${esc(e.items.map(i=>[i.n,i.r,i.t,i.d].join(' | ')).join('\n'))}</textarea>`)+`<p class="hint">Formato: nombre | estrellas (1 a 5) | texto | fecha. Copia aquí las opiniones reales de tu ficha de Google, tal como aparecen. El texto de ejemplo hay que sustituirlo antes de publicar.</p>`;
 if(e.t==='html')h+=F('Código HTML',`<textarea class="code" data-k="code" data-t="s" rows="6">${esc(e.code)}</textarea>`);
 h+=`<div class="dg">Posición y tamaño</div><div class="row"><button class="b sm" data-act="alignl">${svg('alignl',16)}Izquierda</button><button class="b sm" data-act="alignc">${svg('alignc',16)}Centro</button><button class="b sm" data-act="alignr">${svg('alignr',16)}Derecha</button></div><div style="height:10px"></div><div class="row">${F('X (%)',inp('x',e.x,'number','step="0.5"'))}${F('Y (px)',inp('y',e.y,'number'))}</div><div class="row">${F('Ancho (%)',inp('w',e.w,'number','step="0.5"'))}${F('Alto (px, 0=auto)',inp('h',e.h,'number'))}</div>`;
 h+=F('Opacidad',`<input type="range" min="0.1" max="1" step="0.05" value="${e.op}" data-k="op" data-t="n">`);
 h+=`<div class="row"><button class="b sm" data-act="front">Traer delante</button><button class="b sm" data-act="back">Enviar atrás</button></div><div style="height:12px"></div>`;
 h+=chk('float',e.float,'Flotante (fijo en la pantalla al publicar)',1)+(e.float?F('Esquina',sel('fx',e.fx,[['br','Abajo derecha'],['bl','Abajo izquierda'],['tr','Arriba derecha'],['tl','Arriba izquierda']])):'');
 if(!NOLINK.includes(e.t)){
  h+=`<div class="dg">Enlace</div><button class="b sm" data-act="linkpop" style="width:100%;justify-content:center">${svg('link',16)}${linkSummary(e)}</button>`;
 }
 if(!s.locked)h+=`<div class="dg">Sección</div>`+F('Mover a',`<select data-mv="1">${S.pages.flatMap(q=>q.sections.map(x=>`<option value="${x.id}"${x.id===s.id?' selected':''}>${esc(q.name)} · ${esc(x.name)}</option>`)).join('')}</select>`);
 return h;
}
function secProps(f){
 const {s}=f;
 return `<div class="dh">${s.locked?esc(s.name):'Sección'}<button class="ib" data-act="propsclose" aria-label="Cerrar">${svg('close',20)}</button></div>`+(s.locked?'':F('Nombre',inp('name',s.name)))+F('Alto mínimo (px)',inp('h',s.h,'number','min="60"'))+F('Color de fondo',colr('bg',s.bg,'bg'))+`<button class="b sm" data-act="up" data-f="secbg">${svg('image',14)}Imagen de fondo</button>${s.bgi?` <button class="b sm dng" data-act="rmbg">Quitar imagen</button>`:''}<div class="dg">Vídeo de fondo</div><p class="hint">Se reproduce solo, sin sonido y en bucle, detrás de los elementos.</p>`+F('Enlace del vídeo',inp('bgv',(s.bgv&&!s.bgv.startsWith('data:'))?s.bgv:'','text','placeholder="YouTube, Vimeo o .mp4" data-re="1"'))+`<div class="row"><button class="b sm" data-act="upvid">${svg('video',14)}Subir un vídeo</button>${s.bgv?`<button class="b sm dng" data-act="rmvid">Quitar vídeo</button>`:''}</div>${s.bgv&&s.bgv.startsWith('data:')?'<p class="hint">Vídeo subido desde tu equipo.</p>':''}${(s.bgi||s.bgv)?`<div style="height:10px"></div>${F('Oscurecer el fondo (%)',inp('ov',s.ov||0,'number','min="0" max="90"'))}`:''}${s.locked?`<p class="hint" style="margin-top:14px">Esta sección está bloqueada: se ve igual en todas las páginas y no se puede mover ni borrar. Arrastra elementos desde «Elementos» para añadir lo que quieras.</p>${s.id==='hdr'?chk('sticky',s.sticky,'Mantener fija arriba al bajar la página',1):''}<div class="row"><button class="b sm" data-act="sechide" data-id="${s.id}">Ocultar</button></div>`:`<div class="dg">Copiar o mover a otra página</div>${F('Página de destino',`<select id="secTarget">${S.pages.map(q=>`<option value="${q.id}"${q.id!==f.p.id?'':' disabled'}>${esc(q.name)}${q.id===f.p.id?' (esta página)':''}${q.hidden?' (oculta)':''}</option>`).join('')}</select>`)}<div class="row"><button class="b sm" data-act="seccopy">${svg('copy',14)}Copiar</button><button class="b sm" data-act="secmove">${svg('arrow',14)}Mover</button></div><div class="dg">Esta sección</div><div class="row"><button class="b sm" data-act="secdup" data-id="${s.id}">Duplicar</button><button class="b sm" data-act="sechide" data-id="${s.id}">Ocultar</button><button class="b sm dng" data-act="secdel" data-id="${s.id}">Borrar</button></div>`}`;
}
const LKN={none:'Sin enlace',page:'Una de nuestras páginas',section:'Ir a una sección',url:'Web externa',mail:'Correo electrónico',tel:'Teléfono',doc:'Documento'};
function linkSummary(e){const l=e.link||{k:'none'};if(l.k==='none'||!l.v)return 'Añadir un enlace…';let d=l.v;if(l.k==='page'){const p=S.pages.find(q=>q.id===l.v);d=p?p.name:'(página no encontrada)'}else if(l.k==='section'){let n='(sección no encontrada)';S.pages.forEach(p=>p.sections.forEach(s=>{if(s.id===l.v)n=p.name+' · '+s.name}));d=n}else if(l.k==='doc'&&String(l.v).startsWith('data:'))d=l.name||'documento subido';return LKN[l.k]+': '+esc(String(d).slice(0,40))}
function renderProps(){
 const f=ui.elId&&findEl(ui.elId),g=!f&&ui.secId&&findSec(ui.secId);
 const open=!!(f||g)&&!ui.preview;
 $('#app').classList.toggle('pw',open);
 $('#props').innerHTML=open?`<div class="pin">${f?elProps(f):secProps(g)}</div>`:'';
}
function floatLayers(pg){
 const all=[S.header,...pg.sections.filter(s=>!s.hidden),S.footer].filter(s=>s&&!s.hidden).flatMap(s=>s.els).filter(e=>e.float&&!e.hid);
 if(!all.length)return '';
 const top=all.filter(e=>(e.fx||'br')[0]==='t'),bot=all.filter(e=>(e.fx||'br')[0]!=='t');
 return (top.length?`<div class="fl-layer fl-t">${top.map(e=>elHTML(e,true)).join('')}</div>`:'')+(bot.length?`<div class="fl-layer fl-b">${bot.map(e=>elHTML(e,true)).join('')}</div>`:'');
}
function renderCanvas(){
 const pg=curPage(),fr=$('#frame');
 const mob=isStack(),tb=mob&&ui.w>720;
 fr.className=(mob?'m':'')+(tb?' tb':'')+(ui.preview?' pv':'');fr.style.maxWidth=ui.w>=9999?'none':ui.w+'px';
 let st=$('#siteCss');if(!st){st=document.createElement('style');st.id='siteCss';document.head.appendChild(st)}
 st.textContent=SITE_CSS+HFCSS+mobRules('.site.m')+tabRules('.site.m.tb');
 const pgs=S.pages.filter(p=>!p.hidden);
 const secs=pg.sections.filter(s=>!s.hidden);
 fr.innerHTML=`<div class="site${mob?' m':''}${tb?' tb':''}" style="${vars()}">${S.header&&!S.header.hidden?secHTML(S.header,-1,true):''}${secs.map((s,i)=>secHTML(s,i,true)).join('')||`<div class="empty">Esta página no tiene secciones visibles. Añade una desde el panel «Secciones».</div>`}${S.footer&&!S.footer.hidden?secHTML(S.footer,-2,true):''}${floatLayers(pg)}</div>`;
}
function loadFonts(){const u=gfUrl(FONTS.map(f=>f.id));if(u&&!$('#gf')){const l=document.createElement('link');l.id='gf';l.rel='stylesheet';l.href=u;document.head.appendChild(l)}}
function renderAll(){renderBar();renderRail();renderDrawer();renderCanvas();renderProps()}
