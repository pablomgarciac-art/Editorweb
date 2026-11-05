/* ===== SEO por página + publicación en ZIP ===== */
const seoS=()=>(S.seo=S.seo||{domain:'',img:'',type:'RealEstateAgent',name:'',tel:'',addr:''});
const seoP=p=>(p.seo=p.seo||{t:'',d:'',slug:'',img:'',noidx:false});
const slugify=t=>(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'pagina';
const pgList=()=>S.pages.filter(p=>!p.hidden);
function pgSlugs(){const used={},out={};pgList().forEach((p,i)=>{let s=i===0?'index':slugify(seoP(p).slug||p.name);if(i&&s==='index')s='inicio';const b=s;let n=2;while(used[s])s=b+'-'+n++;used[s]=1;out[p.id]=s});return out}
const seoDom=()=>{let d=(seoS().domain||'').trim().replace(/\/+$/,'');if(d&&!/^https?:\/\//i.test(d))d='https://'+d;return d};
function seoOf(p){const i=pgList().findIndex(x=>x.id===p.id),q=seoP(p);
 return{t:(q.t||'').trim()||(i<=0?S.title:p.name+' | '+S.title),d:(q.d||'').trim()||S.desc||'',img:(q.img||'').trim()||(seoS().img||'').trim(),noidx:!!q.noidx,custom:!!(q.t||'').trim()}}
function seoChecks(p){const o=seoOf(p),L=[];
 const h1=p.sections.filter(s=>!s.hidden).reduce((n,s)=>n+s.els.filter(e=>!e.hid&&e.t==='h1').length,0);
 L.push(o.t.length>=25&&o.t.length<=60?{ok:1,m:`Título con buena longitud (${o.t.length} caracteres)`}:{ok:0,m:o.t.length<25?`Título corto (${o.t.length}). Lo ideal son 25–60 caracteres, con la palabra clave (ej. «Pisos en venta en Madrid»)`:`Título largo (${o.t.length}). Google lo cortará; máximo 60`});
 L.push(o.d.length>=70&&o.d.length<=160?{ok:1,m:`Descripción con buena longitud (${o.d.length})`}:{ok:0,m:o.d.length<70?`Descripción corta (${o.d.length}). Lo ideal son 70–160 caracteres`:`Descripción larga (${o.d.length}). Google la cortará; máximo 160`});
 L.push(h1===1?{ok:1,m:'Tiene un único título principal (Título 1)'}:{ok:0,m:h1===0?'Falta un «Título 1» en la página. Google lo usa como tema principal':`Hay ${h1} elementos «Título 1». Deja solo uno por página`});
 L.push(o.img?{ok:1,m:'Tiene imagen para compartir en redes'}:{ok:0,m:'Sin imagen para compartir en WhatsApp y redes (pon una dirección de imagen)'});
 return L}
const seoScore=p=>{const L=seoChecks(p);return Math.round(L.filter(x=>x.ok).length/L.length*100)};
const scoreCls=n=>n>=100?'g':n>=50?'a':'r';

/* ----- HTML de cada página ----- */
function buildPageHTML(p){
 const sl=pgSlugs(),pgs=pgList(),me=sl[p.id],home=me==='index',o=seoOf(p),dom=seoDom(),sx=seoS();
 exportPg=p.id;
 const nav=S.header&&!S.header.hidden?secHTML(S.header,0,false):'',foot=S.footer&&!S.footer.hidden?secHTML(S.footer,0,false):'';
 let all=nav+`<main class="page on" id="p-${p.id}">${p.sections.filter(s=>!s.hidden).map(s=>secHTML(s,0,false)).join('')}</main>`+foot;
 exportPg=null;
 const secPg={};pgs.forEach(q=>q.sections.forEach(s=>{secPg[s.id]=q.id}));
 all=all.replace(/href="#p-([^"]+)"/g,(m,id)=>sl[id]?`href="${sl[id]==='index'?'index.html':sl[id]+'.html'}"`:m).replace(/href="#s-([^"]+)"/g,(m,id)=>{const q=secPg[id];return q&&q!==p.id?`href="${sl[q]}.html#s-${id}"`:m});
 const css=`*{box-sizing:border-box}body{margin:0}.site{min-height:100vh}.site .sec{overflow:hidden}.page{display:none}.page.on{display:block}`+SITE_CSS+HFCSS+`@media(max-width:900px){${mobRules('.site')}}@media(min-width:721px) and (max-width:900px){${tabRules('.site')}}`;
 const canon=dom?dom+(home?'/':'/'+me+'.html'):'';
 const ids=[S.design.fh,S.design.fb];[S.header,S.footer,...S.pages.flatMap(q=>q.sections)].forEach(s=>s&&s.els.forEach(e=>{if(e.ff)ids.push(e.ff)}));const fu=gfUrl(ids);
 const m=(k,v,a)=>v?`<meta ${a||'name'}="${k}" content="${esc(v)}">\n`:'';
 const imgAbs=o.img&&!/^https?:/i.test(o.img)&&dom?dom+'/'+o.img.replace(/^\//,''):o.img;
 const ld={"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":S.title,...(dom?{"url":dom+'/'}:{})},home||sx.name?{"@type":sx.type||"RealEstateAgent","name":sx.name||S.title,...(dom?{"url":dom+'/'}:{}),...(sx.tel?{"telephone":sx.tel}:{}),...(sx.addr?{"address":{"@type":"PostalAddress","streetAddress":sx.addr}}:{}),...(imgAbs?{"image":imgAbs}:{})}:{"@type":"WebPage","name":o.t,"description":o.d,...(canon?{"url":canon}:{})}]};
 return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.t)}</title>
${m('description',o.d)}${m('robots',o.noidx?'noindex,follow':'index,follow')}${canon?`<link rel="canonical" href="${esc(canon)}">\n`:''}${m('og:type','website','property')}${m('og:locale','es_ES','property')}${m('og:site_name',S.title,'property')}${m('og:title',o.t,'property')}${m('og:description',o.d,'property')}${m('og:url',canon,'property')}${m('og:image',imgAbs,'property')}${m('twitter:card',imgAbs?'summary_large_image':'summary')}${m('twitter:title',o.t)}${m('twitter:description',o.d)}${m('twitter:image',imgAbs)}${fu?`<link rel="stylesheet" href="${fu}">\n`:''}<script type="application/ld+json">${JSON.stringify(ld).replace(/</g,'\\u003c')}<\/script>
<style>${css}</style>
</head>
<body>
<div class="site" style="${vars()}">
${all}
</div>
<script>(${siteBoot.toString()})();<\/script>
</body>
</html>`;
}
function buildFiles(){
 const sl=pgSlugs(),dom=seoDom(),F=[];
 pgList().forEach(p=>F.push({name:sl[p.id]+'.html',data:buildPageHTML(p),p}));
 const base=dom||'https://tudominio.com',today=new Date().toISOString().slice(0,10);
 F.push({name:'sitemap.xml',data:`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+pgList().filter(p=>!seoOf(p).noidx).map(p=>`  <url><loc>${esc(base+(sl[p.id]==='index'?'/':'/'+sl[p.id]+'.html'))}</loc><lastmod>${today}</lastmod></url>`).join('\n')+`\n</urlset>\n`});
 F.push({name:'robots.txt',data:`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`});
 return F}

/* ----- ZIP (sin compresión) ----- */
function crc32(u){let t=crc32.t;if(!t){t=crc32.t=[];for(let n=0,c;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}}let r=-1;for(let i=0;i<u.length;i++)r=t[(r^u[i])&255]^(r>>>8);return(r^-1)>>>0}
function makeZip(files){
 const enc=new TextEncoder(),parts=[],cen=[];let off=0;
 files.forEach(f=>{const nm=enc.encode(f.name),d=enc.encode(f.data),crc=crc32(d);
  const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(12,0x21,true);lh.setUint32(14,crc,true);lh.setUint32(18,d.length,true);lh.setUint32(22,d.length,true);lh.setUint16(26,nm.length,true);
  parts.push(new Uint8Array(lh.buffer),nm,d);
  const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(14,0x21,true);ch.setUint32(16,crc,true);ch.setUint32(20,d.length,true);ch.setUint32(24,d.length,true);ch.setUint16(28,nm.length,true);ch.setUint32(42,off,true);
  cen.push(new Uint8Array(ch.buffer),nm);off+=30+nm.length+d.length});
 const cl=cen.reduce((a,b)=>a+b.length,0),e=new DataView(new ArrayBuffer(22));
 e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cl,true);e.setUint32(16,off,true);
 return new Blob([...parts,...cen,new Uint8Array(e.buffer)],{type:'application/zip'})}
function downloadZip(){
 const F=pubFiles&&pubFiles.length?pubFiles:buildFiles(),b=makeZip(F),a=document.createElement('a');
 a.href=URL.createObjectURL(b);a.download=(slugify(S.title)||'web')+'.zip';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Descargando el ZIP. Si no baja, usa «Copiar» en cada archivo')}

/* ----- Ventana SEO ----- */
function seoBody(p){
 const q=seoP(p),o=seoOf(p),s=seoS(),sl=pgSlugs(),home=sl[p.id]==='index';
 return `<div class="seocols"><div class="seoc">
 <div class="dg">Esta página</div>
 <div class="f"><label>Título (SEO) <span class="cnt" id="cT"></span></label><input type="text" data-seo="t" value="${esc(q.t)}" placeholder="${esc(o.t)}"></div>
 <div class="f"><label>Descripción <span class="cnt" id="cD"></span></label><textarea data-seo="d" rows="2" placeholder="${esc(o.d)}">${esc(q.d)}</textarea></div>
 <div class="row2">${home?`<div class="f"><label>Dirección (URL)</label><input type="text" value="index.html" disabled><small class="hint">Inicio = raíz de tu web</small></div>`:`<div class="f"><label>Dirección (URL)</label><input type="text" data-seo="slug" value="${esc(q.slug)}" placeholder="${esc(slugify(p.name))}"><small class="hint">Quedará como <b>${esc(sl[p.id])}.html</b></small></div>`}
 <div class="f"><label>Imagen al compartir (https://…)</label><input type="text" data-seo="img" value="${esc(q.img)}" placeholder="${esc(s.img||'https://tuweb.com/imagen.jpg')}"></div></div>
 <label class="ck"><input type="checkbox" data-seo="noidx"${q.noidx?' checked':''}> No mostrar esta página en Google (noindex)</label>
 <div class="dg">Datos de toda la web</div>
 <div class="row2"><div class="f"><label>Dirección de tu web (dominio)</label><input type="text" data-seos="domain" value="${esc(s.domain)}" placeholder="https://www.mitienda.com"></div>
 <div class="f"><label>Imagen por defecto al compartir</label><input type="text" data-seos="img" value="${esc(s.img)}" placeholder="https://…/portada.jpg"></div></div>
 <div class="row3"><div class="f"><label>Empresa</label><input type="text" data-seos="name" value="${esc(s.name)}" placeholder="${esc(S.title)}"></div>
 <div class="f"><label>Teléfono</label><input type="text" data-seos="tel" value="${esc(s.tel)}" placeholder="+34 600 000 000"></div>
 <div class="f"><label>Dirección postal</label><input type="text" data-seos="addr" value="${esc(s.addr)}" placeholder="Calle, nº, ciudad"></div></div>
 </div><div class="seoc">
 <div class="dg">Así se ve en Google</div><div class="gp" id="seoPrev"></div>
 <div class="dg">Revisión</div><ul class="chk" id="seoChk"></ul>
 <small class="hint">El dominio sirve para el mapa del sitio y los enlaces canónicos. Empresa, teléfono y dirección se publican como datos estructurados de inmobiliaria.</small>
 </div></div>`}
function seoLive(){
 const p=S.pages.find(x=>x.id===ui.seoPg);if(!p)return;const o=seoOf(p),sl=pgSlugs(),dom=seoDom()||'tudominio.com';
 const cut=(t,n)=>t.length>n?t.slice(0,n-1).trimEnd()+'…':t;
 const g=$('#seoPrev');if(g)g.innerHTML=`<div class="gu">${esc(dom.replace(/^https?:\/\//,''))} › ${esc(sl[p.id]==='index'?'':sl[p.id])}</div><div class="gt">${esc(cut(o.t,60))}</div><div class="gd">${esc(cut(o.d||'Sin descripción',160))}</div>`;
 const set=(id,n,lo,hi)=>{const e=$(id);if(e){e.textContent=n+' / '+hi;e.className='cnt '+(n>=lo&&n<=hi?'g':'r')}};
 set('#cT',o.t.length,25,60);set('#cD',o.d.length,70,160);
 const c=$('#seoChk');if(c)c.innerHTML=seoChecks(p).map(x=>`<li class="${x.ok?'ok':'no'}">${svg(x.ok?'check':'close',16)}<span>${esc(x.m)}</span></li>`).join('');
 const sc=$('#seoScore');if(sc){const n=seoScore(p);sc.textContent=n+'%';sc.className='sc '+scoreCls(n)}}
function openSeo(id){
 const pg=pgList();if(!pg.length)return;
 ui.seoPg=pg.find(x=>x.id===id)?id:(pg.find(x=>x.id===ui.pageId)||pg[0]).id;
 const p=S.pages.find(x=>x.id===ui.seoPg);
 $('#modal').innerHTML=`<div class="card seo" role="dialog" aria-label="SEO"><div class="seohd"><h2>SEO y buscadores <span class="sc" id="seoScore"></span></h2>
 <label class="seosel">Página <select id="seoPg">${pg.map(x=>`<option value="${x.id}"${x.id===ui.seoPg?' selected':''}>${esc(x.name)} · ${seoScore(x)}%</option>`).join('')}</select></label></div>
 <div id="seoBody">${seoBody(p)}</div>
 <div class="row" style="margin-top:14px;justify-content:flex-end"><button class="b pri" data-act="seodone" style="flex:none;min-width:160px">Listo</button></div></div>`;
 $('#modal').hidden=false;seoLive()}
$('#modal').addEventListener('input',ev=>{const t=ev.target;
 if(t.dataset.seo){const p=S.pages.find(x=>x.id===ui.seoPg);if(!p)return;seoP(p)[t.dataset.seo]=t.type==='checkbox'?t.checked:t.value;commit();seoLive()}
 else if(t.dataset.seos){seoS()[t.dataset.seos]=t.value;commit();seoLive()}});
$('#modal').addEventListener('change',ev=>{if(ev.target.id==='seoPg'){ui.seoPg=ev.target.value;const p=S.pages.find(x=>x.id===ui.seoPg);$('#seoBody').innerHTML=seoBody(p);seoLive()}});
