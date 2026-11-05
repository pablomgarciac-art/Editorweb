/* ===== Render de la web (compartido por editor y publicación) ===== */
let S,ui={panel:'elements',drawer:true,pageId:null,secId:null,elId:null,mode:'desktop',w:1440,preview:false};
const DEVS={desktop:[['Compacto',1100],['Portátil',1280],['Escritorio',1440],['Pantalla grande',1680],['Todo el ancho',9999]],tablet:[['iPad vertical',768],['iPad Air / Pro 11″',834],['iPad Pro 12,9″ vertical',1024],['Tablet horizontal',1180]],mobile:[['Android pequeño',360],['iPhone SE',375],['iPhone 15',390],['Android normal (Pixel / Galaxy)',412],['iPhone Pro Max',430]]};
const isStack=()=>ui.mode!=='desktop'&&ui.w<=900;

const SITE_CSS=`
.site{font-family:var(--fb);color:var(--ink);background:var(--bg);line-height:1.5;position:relative}
.site *{box-sizing:border-box}
.site h1,.site h2,.site h3{font-family:var(--fh);margin:0;line-height:1.15}
.site .nav{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px 24px;background:var(--bg);border-bottom:1px solid rgba(127,127,127,.25)}
.site .nav .brand{display:flex;align-items:center;gap:10px;text-decoration:none}
.site .nav .brand img,.site .nav .brand svg{display:block;flex:none}
.site .nav b{font-family:var(--fh);font-size:18px;color:var(--c1)}
.site .nav nav{display:flex;gap:6px;flex-wrap:wrap}
.site .nav nav a{padding:6px 12px;border-radius:var(--r);color:var(--ink);text-decoration:none;font-weight:600;font-size:14px}
.site .nav nav a.on{background:var(--c1);color:#fff}
.site .sec{position:relative;width:100%;background-size:cover;background-position:center}
.site .e{position:absolute}
.site .lk{display:block;width:100%;height:100%;color:inherit;text-decoration:none}
.site .tx{white-space:pre-wrap;overflow-wrap:anywhere;outline:none}
.site .t-h1,.site .t-h2,.site .t-h3,.site .t-p{font-size:var(--fs)}
.site .bx{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:100%;font-weight:700;text-align:center;overflow:hidden;font-size:var(--fs,16px)}
.site .bdg{display:flex;align-items:center;justify-content:center;border-radius:50%;flex:none}
.site .bx.hv{transition:background-color .2s,border-color .2s,color .2s,transform .2s,box-shadow .2s}
.site .bx.hv-b:hover{background:var(--hb)!important}
.site .bx.hv-d:hover{border-color:var(--hd)!important}
.site .bx.hv-c:hover{color:var(--hc)!important}
.site .fl .bx,.site .fl-layer .bx{box-shadow:0 6px 20px rgba(0,0,0,.32)}
.site .bx.hv-lift:hover{transform:translateY(-3px);box-shadow:0 8px 18px rgba(0,0,0,.28)}
.site .bx.hv-zoom:hover{transform:scale(1.06)}
.site .t-btntext .bx{text-decoration:underline;text-underline-offset:5px}
.site .e img{width:100%;height:100%;display:block}
.site .gal{display:grid;gap:8px;width:100%;height:100%}
.site .gal img{min-height:0}
.site .sl{position:relative;width:100%;height:100%;overflow:hidden}
.site .sl img{position:absolute;inset:0;opacity:0;transition:opacity .5s;object-fit:cover}
.site .sl img.on{opacity:1}
.site .sl button{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;border:0;background:rgba(0,0,0,.5);color:#fff;font-size:20px;line-height:1;cursor:pointer;z-index:2}
.site .sl .pv{left:8px}.site .sl .nx{right:8px}
.site .sl .dots{position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:6px}
.site .sl .dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.5)}
.site .sl .dots i.on{background:#fff}
.site .so-g{display:flex;gap:12px;align-items:center;height:100%;flex-wrap:wrap}
.site .so{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;flex:none;transition:transform .15s,box-shadow .15s}
.site .so:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.25)}
.site .sh{width:100%;height:100%}
.site .ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:repeating-linear-gradient(45deg,rgba(127,127,127,.12) 0 10px,rgba(127,127,127,.2) 10px 20px);border:1px solid rgba(127,127,127,.4);border-radius:8px;font-size:13px;text-align:center;padding:8px;overflow:hidden}
.site .frm{font-family:var(--ff,var(--fb));font-size:var(--fz,15px);display:grid;grid-template-columns:repeat(var(--fc,1),minmax(0,1fr));align-content:start;gap:var(--fg,10px);width:100%;height:100%;padding:18px;border-radius:12px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.25);overflow:auto}
.site .frm label.wide,.site .frm button{grid-column:1/-1}
.site .frm label{font-size:calc(var(--fz,15px)*.92);font-weight:600;display:flex;flex-direction:column;gap:4px}
.site .frm input,.site .frm textarea{padding:var(--fp,9px 10px);font-size:var(--fz,15px);border:1px solid rgba(127,127,127,.5);border-radius:8px;font:inherit;background:var(--bg);color:var(--ink);width:100%}
.site .frm button{border:0;padding:calc(var(--fp-y,9px) + 2px) 11px;border-radius:var(--r);background:var(--c1);color:#fff;font-weight:700;font-size:var(--fz,15px);font-family:inherit;cursor:pointer}
.site .rv{display:flex;flex-direction:column;gap:18px}
.site .rv-h{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.site .rv-n{font:700 44px var(--fh);line-height:1}
.site .rv-s{color:#fbbc04;letter-spacing:2px;font-size:18px;line-height:1}
.site .rv-c{font-size:14px;opacity:.75;margin-top:6px}
.site .rv-l{margin-left:auto;padding:9px 16px;border-radius:var(--r);border:1px solid rgba(127,127,127,.5);color:var(--ink);text-decoration:none;font-weight:600;font-size:14px}
.site .rv-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.site .rv-i{padding:16px;border:1px solid rgba(127,127,127,.3);border-radius:12px;background:rgba(127,127,127,.06);display:flex;flex-direction:column;gap:8px}
.site .rv-t{display:flex;align-items:center;gap:10px}
.site .rv-a{width:36px;height:36px;border-radius:50%;background:var(--c1);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex:none}
.site .rv-t small{display:block;opacity:.65;font-size:12px}
.site .rv-i p{font-size:15px;margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
.site .doc{display:flex;align-items:center;gap:12px;width:100%;height:100%;padding:12px 16px;border:1px solid rgba(127,127,127,.4);border-radius:12px;background:rgba(127,127,127,.08)}
.site iframe,.site video{width:100%;height:100%;border:0;border-radius:8px;display:block;background:#000}
.site .fl{position:fixed!important;z-index:90!important;left:auto;top:auto;right:auto;bottom:auto}
.site .fl.br{right:20px;bottom:20px}.site .fl.bl{left:20px;bottom:20px}.site .fl.tr{right:20px;top:80px}.site .fl.tl{left:20px;top:80px}
`;
const HFCSS=`
.site .fl-layer{position:sticky;height:0;z-index:55;pointer-events:none}
.site .fl-layer .e{pointer-events:auto}
.site .fl-t{top:0}.site .fl-b{bottom:0}
#frame .site .fl-layer .e.fl{position:absolute!important}
.site .bgv{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none}
.site .bgf{container-type:size;overflow:hidden}
.site .bgf iframe{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:0;width:max(100cqw,177.78cqh);height:max(100cqh,56.25cqw)}
.site .bgo{position:absolute;inset:0;z-index:0;pointer-events:none}
.site .bgv-ed{position:absolute;left:10px;bottom:22px;z-index:1;display:flex;gap:6px;align-items:center;padding:5px 10px;border-radius:7px;background:rgba(0,0,0,.6);color:#fff;font:600 12px Inter,system-ui,sans-serif;pointer-events:none}
.site .sec.sticky{position:sticky;top:0;z-index:60}
.site .mn{display:flex;flex-wrap:wrap;gap:6px;align-items:center;height:100%}
.site .mn.mn-col{flex-direction:column;align-items:flex-start;gap:8px;height:auto}
.site .mn a{padding:7px 13px;border-radius:var(--r);color:var(--mc,var(--ink));text-decoration:none;font:600 var(--mfs,15px) var(--fb);white-space:nowrap}
.site .mn.mn-pill a.on{background:var(--c1);color:#fff}
.site .mn.mn-line a.on{box-shadow:inset 0 -3px 0 var(--c1)}
.site .mn.mn-text a.on{color:var(--mc,var(--c1));text-decoration:underline;font-weight:800}
.site .mn.mn-col a{padding:2px 0}
.site .mn .mnc,.site .mn .mnb{display:none}
.site .mn .mnl{display:contents}
.site .mn a{transition:background .15s,color .15s,box-shadow .15s}
.site .mn.mn-pill a:not(.on):hover{background:color-mix(in srgb,var(--mh,var(--c1)) 16%,transparent);color:var(--mh,var(--mc,var(--ink)))}
.site .mn.mn-pill a.on:hover{filter:brightness(1.1)}
.site .mn.mn-line a:hover{box-shadow:inset 0 -3px 0 var(--mh,var(--c1));color:var(--mh,var(--mc,var(--ink)))}
.site .mn.mn-text a:hover{color:var(--mh,var(--c1));text-decoration:underline}
.site .brand{display:flex;align-items:center;gap:10px;text-decoration:none;height:100%}
.site .brand b{font-family:var(--fh);font-size:18px;color:var(--c1)}
.site .brand img,.site .brand svg{display:block;flex:none}
`;
const mobRules=p=>`
${p} .mn:not(.mn-col){flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;height:auto!important;gap:0!important}
${p} .e.t-menu:has(.mn:not(.mn-col)){width:auto!important;min-width:46px;align-self:flex-end}
${p} .e.t-menu:has(.mn[data-al=left]){align-self:flex-start}
${p} .e.t-menu:has(.mn[data-al=center]){align-self:center}
${p} .e.t-menu:has(.mn:not(.mn-col) .mnc:checked){width:100%!important;align-self:stretch}
${p} .sec.locked{min-height:var(--sh,0)!important}
${p} .sec[data-s=hdr]{flex-direction:row!important;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 12px}
${p} .sec[data-s=hdr] .e.t-logo{width:auto!important;max-width:calc(100% - 70px)}
${p} .sec[data-s=hdr] .e.t-menu:has(.mn:not(.mn-col)){align-self:center}
${p} .sec[data-s=hdr] .e.t-menu:has(.mn[data-al=left]){order:-1}
${p} .sec[data-s=hdr] .e.t-menu:has(.mn:not(.mn-col) .mnc:checked){width:100%!important;order:2}
${p} .mn:not(.mn-col) .mnb{display:inline-flex;align-self:var(--mal,flex-start);align-items:center;justify-content:center;width:46px;height:42px;border-radius:var(--r);background:var(--c1);color:#fff;cursor:pointer}
${p} .mn:not(.mn-col) .mnl{display:none;flex-direction:column;gap:2px;margin-top:8px;padding:8px;background:var(--bg);border:1px solid rgba(0,0,0,.1);border-radius:calc(var(--r) + 4px);box-shadow:0 10px 28px rgba(0,0,0,.18);position:relative;z-index:20}
${p} .mn:not(.mn-col) .mnc:checked~.mnl{display:flex}
${p} .mn:not(.mn-col) .mnl a{padding:12px 14px!important;white-space:normal}
${p} .frm{grid-template-columns:1fr!important}
${p} .e.t-menu,${p} .e.t-logo{height:auto!important}
${p} .sec{min-height:0!important;display:flex;flex-direction:column;gap:16px;padding:20px 16px}
${p} .e{position:relative!important;left:auto!important;top:auto!important;width:100%!important;height:var(--h)!important;flex:none}
${p} .e.txt{height:auto!important}
${p} .e.fit{width:min(var(--wpx),100%)!important;align-self:center}
${p} .e[data-ma=l]{align-self:flex-start}${p} .e[data-ma=c]{align-self:center}${p} .e[data-ma=r]{align-self:flex-end}
${p} .e.fit[data-ma=l]{align-self:flex-start}${p} .e.fit[data-ma=c]{align-self:center}${p} .e.fit[data-ma=r]{align-self:flex-end}
${p} .e[data-ma=l] .tx{text-align:left!important}${p} .e[data-ma=c] .tx{text-align:center!important}${p} .e[data-ma=r] .tx{text-align:right!important}
${p} .e.fl{position:fixed!important;width:var(--wpx)!important}
${p} .t-h1,${p} .t-h2,${p} .t-h3{font-size:min(var(--fs),34px)}
${p} .t-p{font-size:min(var(--fs),18px)}
${p} .gal{grid-template-columns:repeat(2,1fr)!important}
`;
const tabRules=p=>`
${p} .sec{padding:28px 32px;gap:20px}
${p} .t-h1,${p} .t-h2,${p} .t-h3{font-size:min(var(--fs),44px)}
${p} .t-p{font-size:min(var(--fs),20px)}
${p} .gal{grid-template-columns:repeat(3,1fr)!important}
`;
const FIT=['icon','btnicon','btntext','btn','btnti','social','social1','shape'];
const NOLINK=['social','social1','html','form','map','video','reviews'];
const TXT=['h1','h2','h3','p'];

let mnN=0;
const col=v=>({c1:'var(--c1)',c2:'var(--c2)',ink:'var(--ink)',bg:'var(--bg)'}[v]||v||'');
const hexOf=(v,fb='#000000')=>{const m={c1:S.design.c1,c2:S.design.c2,ink:S.design.ink,bg:S.design.bg};let x=v||fb;x=m[x]||x;return /^#[0-9a-f]{6}$/i.test(x)?x:'#000000'};
const vars=()=>{const d=S.design;return `--c1:${d.c1};--c2:${d.c2};--bg:${d.bg};--ink:${d.ink};--fh:${fnt(d.fh).f};--fb:${fnt(d.fb).f};--r:${d.r}px`};
const effFs=e=>e.fo?(e.fs||16):Math.round((e.fs||16)*(['h1','h2','h3'].includes(e.t)?S.design.hs:S.design.ps)/100);
function urlOf(u){
 u=(u||'').trim();if(!u)return '#';
 if(/^(https?:|mailto:|tel:|#|\/)/i.test(u))return u;
 if(/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(u))return 'mailto:'+u;
 return 'https://'+u;
}
function linkAttrs(e){
 const l=e.link;if(!l||l.k==='none'||!l.v)return null;
 const v=String(l.v);
 if(l.k==='page')return `href="#p-${esc(v)}"`;
 if(l.k==='section')return `href="#s-${esc(v)}"`;
 if(l.k==='mail')return `href="mailto:${esc(v.replace(/^mailto:/i,'').trim())}"`;
 if(l.k==='tel')return `href="tel:${esc(v.replace(/^tel:/i,'').replace(/[^\d+]/g,''))}"`;
 if(l.k==='doc')return v.startsWith('data:')?`href="${esc(v)}" download="${esc(l.name||'documento')}"`:`href="${esc(urlOf(v))}" target="_blank" rel="noopener"`;
 return `href="${esc(urlOf(v))}"${l.nt?' target="_blank" rel="noopener"':''}`;
}
const linkBad=(e,pgs)=>{const l=e.link;if(!l||l.k==='none'||NOLINK.includes(e.t))return false;if(!l.v)return true;if(l.k==='page')return !pgs.find(q=>q.id===l.v);if(l.k==='section')return !pgs.some(q=>q.sections.some(s=>s.id===l.v&&!s.hidden));return false};
function embedUrl(u){
 let m=/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/.exec(u||'');
 if(m)return {k:'f',u:'https://www.youtube.com/embed/'+m[1]};
 m=/vimeo\.com\/(\d+)/.exec(u||'');
 if(m)return {k:'f',u:'https://player.vimeo.com/video/'+m[1]};
 if(/\.(mp4|webm|ogg)(\?|$)/i.test(u||''))return {k:'v',u};
 return u?{k:'f',u}:null;
}
const phBox=(ic,t,sub)=>`<div class="ph">${svg(ic,30)}<b>${t}</b><span>${esc(sub||'')}</span><small style="opacity:.7">Se verá en la web publicada</small></div>`;

const FF=e=>e.ff?`font-family:${fnt(e.ff).f};`:'';
const BD=e=>FF(e)+(e.bw>0?`border:${clamp(+e.bw,1,12)}px solid ${col(e.bc)||'currentColor'};box-sizing:border-box;`:'');
const HV=e=>{const bh=col(e.bgh),ch=col(e.colorh),bd=col(e.bch),fx=e.hfx||'none';return {c:(bh?' hv-b':'')+(ch?' hv-c':'')+(bd&&e.bw>0?' hv-d':'')+(fx!=='none'?' hv-'+fx:'')+((bh||ch||bd||fx!=='none')?' hv':''),s:(bh?`--hb:${bh};`:'')+(ch?`--hc:${ch};`:'')+(bd?`--hd:${bd};`:'')}};
function inner(e,ed){
 const c=col(e.color),bg=col(e.bgc),tx=esc(e.text);
 switch(e.t){
 case 'img':return `<img src="${esc(IS(e.src))}" alt="${esc(e.alt)}" style="object-fit:${e.fit};border-radius:${e.r}px" draggable="false">`;
 case 'gallery':return `<div class="gal" style="grid-template-columns:repeat(${e.cols},1fr);gap:${e.gap}px">${e.imgs.map(s=>`<img src="${esc(IS(s))}" alt="" draggable="false" style="object-fit:cover;border-radius:${e.r}px">`).join('')}</div>`;
 case 'slider':return `<div class="sl" style="border-radius:${e.r}px">${e.imgs.map((s,i)=>`<img src="${esc(IS(s))}" alt="" draggable="false"${i?'':' class="on"'}>`).join('')}<button class="pv" type="button" aria-label="Anterior">‹</button><button class="nx" type="button" aria-label="Siguiente">›</button><div class="dots">${e.imgs.map((s,i)=>`<i${i?'':' class="on"'}></i>`).join('')}</div></div>`;
 case 'icon':{const cc=c||'var(--c1)';if(e.badge){const d=clamp(e.h,24,200);return `<div class="bx" style="color:${cc}"><span class="bdg" style="width:${d}px;height:${d}px;background:color-mix(in srgb,${cc} 14%,transparent)">${svg(e.icon,Math.round(d*.5),1.9)}</span></div>`}return `<div class="bx" style="color:${cc}">${svg(e.icon,clamp(Math.round(e.h*.7),16,160),1.6)}</div>`}
 case 'h1':case 'h2':case 'h3':case 'p':return `<div class="tx" data-k="text" style="text-align:${e.align};${FF(e)}color:${c};font-weight:${e.b?700:400}">${tx}</div>`;
 case 'btn':return `<div class="bx${HV(e).c}" style="${HV(e).s}${BD(e)}background:${bg||'var(--c1)'};color:${c||'#fff'};border-radius:${e.r}px"><span class="tx" data-k="text">${tx}</span></div>`;
 case 'btnicon':return `<div class="bx${HV(e).c}" style="${HV(e).s}${BD(e)}background:${bg||'var(--c1)'};color:${c||'#fff'};border-radius:${e.r}px">${e.icon==='whatsapp'?soIcon('whatsapp',clamp(Math.round(e.h*.6),20,90)):svg(e.icon,clamp(Math.round(e.h*.5),16,56))}</div>`;
 case 'btntext':return `<div class="bx${HV(e).c}" style="${HV(e).s}${BD(e)}color:${c||'var(--c1)'}"><span class="tx" data-k="text">${tx}</span></div>`;
 case 'btnti':return `<div class="bx${HV(e).c}" style="${HV(e).s}${BD(e)}background:${bg||'var(--c1)'};color:${c||'#fff'};border-radius:${e.r}px">${svg(e.icon,20)}<span class="tx" data-k="text">${tx}</span></div>`;
 case 'logo':{const L=S.logo||{},h=clamp(e.lh||L.h||38,16,120);const m=L.on===false?'':(L.src?`<img src="${esc(L.src)}" alt="Logo" style="height:${h}px;width:auto">`:markSvg(h));const nm=e.name===false?'':`<b style="${c?`color:${c};`:''}${e.nfs?`font-size:${clamp(+e.nfs,10,60)}px;`:''}${FF(e)}${e.nb===false?'font-weight:400;':''}">${esc(e.nm||S.title)}</b>`;const pg0=(S.pages.find(p=>!p.hidden)||S.pages[0]).id;return ed?`<div class="brand">${m}${nm}</div>`:`<a class="brand" href="#p-${pg0}" data-p="${pg0}">${m}${nm}</a>`}
 case 'menu':{const pgs=S.pages.filter(p=>!p.hidden),cur=ed?curPage().id:pgs[0].id;return `<nav data-al="${e.align||'right'}" class="mn mn-${e.style||'pill'}${e.dir==='col'?' mn-col':''}" style="justify-content:${e.align==='left'?'flex-start':e.align==='center'?'center':'flex-end'};${e.dir==='col'&&e.align!=='left'?`align-items:${e.align==='center'?'center':'flex-end'};`:''}${c?`--mc:${c};`:''}${e.hc?`--mh:${col(e.hc)};`:''}--mfs:${clamp(+e.fs||15,10,40)}px;--mal:${e.align==='center'?'center':e.align==='left'?'flex-start':'flex-end'};">${(()=>{const k='mt'+(++mnN);return `<input type="checkbox" id="${k}" class="mnc" aria-hidden="true"><label for="${k}" class="mnb" aria-label="Abrir menú"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></label><div class="mnl">`})()}${pgs.map(p=>`<a href="#p-${p.id}" data-p="${p.id}"${p.id===cur?' class="on"':''}>${esc(p.name)}</a>`).join('')}</div></nav>`}
 case 'social':case 'social1':{
  const single=e.t==='social1',z=single?clamp(e.h,28,90):clamp(e.sz||44,28,80);
  const list=single?[e.nets[0]||{n:'instagram',u:''}]:e.nets;
  const mkA=n=>{
   const st=e.style||'circle',nm=(NETS[n.n]||['?','?'])[1];
   const sty=st==='logo'?'background:transparent':st==='plain'?`color:${c||'var(--c1)'};background:transparent`:st==='brand'?`color:#fff;background:${(SOC[n.n]||SOC.instagram).bg}`:`background:${bg||'var(--c1)'};color:${c||'#fff'}`;
   const rad=st==='rounded'?Math.round(z*.3):999;
   return `<a class="so" href="${esc(urlOf(n.u))}" target="_blank" rel="noopener" aria-label="${nm}" title="${nm}" style="width:${z}px;height:${z}px;border-radius:${rad}px;${sty}">${st==="logo"?soLogo(n.n,Math.round(z*.8),c||"#111"):soIcon(n.n,Math.round(z*(st==="plain"?.8:.54)))}</a>`;
  };
  return single?mkA(list[0]):`<div class="so-g">${list.map(mkA).join('')}</div>`;
 }
 case 'shape':{
  const f=col(e.fill)||'var(--c2)';
  if(e.shape==='line')return `<div style="height:100%;display:flex;align-items:center"><div style="width:100%;height:4px;background:${f};border-radius:4px"></div></div>`;
  const cp={triangle:'polygon(50% 0,100% 100%,0 100%)',star:'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}[e.shape];
  return `<div class="sh" style="background:${f};${cp?`clip-path:${cp}`:e.shape==='circle'?'border-radius:50%':`border-radius:${e.r}px`}"></div>`;
 }
 case 'map':return ed?phBox('map','Mapa',e.q):`<iframe loading="lazy" title="Mapa" src="https://www.google.com/maps?q=${encodeURIComponent(e.q)}&output=embed"></iframe>`;
 case 'video':{
  if(ed)return phBox('video','Vídeo',e.url||'Pega un enlace de YouTube, Vimeo o un .mp4');
  const v=embedUrl(e.url);if(!v)return phBox('video','Vídeo','Sin enlace');
  return v.k==='v'?`<video controls src="${esc(v.u)}"></video>`:`<iframe loading="lazy" title="Vídeo" allowfullscreen src="${esc(v.u)}"></iframe>`;
 }
 case 'form':{const SZ={s:['6px 8px',8,6,3],m:['9px 10px',10,9,3],l:['14px 14px',16,14,5]}[e.fld||'m'];const ffn=e.ff?fnt(e.ff).f:'';const fst=`--fz:${clamp(e.fz||15,10,32)}px;--fp:${SZ[0]};--fp-y:${SZ[2]}px;--fg:${SZ[1]}px;--fc:${clamp(+e.fcols||1,1,3)};${ffn?`--ff:${ffn};`:''}`;return `<form class="frm" style="${fst}" ${ed?'onsubmit="return false"':`data-f action="${esc(e.action)}" method="post"`}>${e.fields.map((f,i)=>{const ta=/mensaje|comentario|consulta/i.test(f),ty=/mail|correo/i.test(f)?'email':/tel/i.test(f)?'tel':'text';return `<label${ta?' class="wide"':''}>${esc(f)}${ta?`<textarea name="f${i}" rows="${SZ[3]}"${ed?' tabindex="-1"':''}></textarea>`:`<input name="f${i}" type="${ty}"${ed?' tabindex="-1"':''}>`}</label>`}).join('')}<button type="submit"${ed?' tabindex="-1"':''}>${esc(e.btn)}</button></form>`}
 case 'doc':return `<div class="doc">${svg('doc',30)}<div style="flex:1;min-width:0"><b class="tx" data-k="text">${tx}</b><div style="font-size:12px;opacity:.7">Documento · pulsa para abrir</div></div>${svg('arrow',18)}</div>`;
 case 'reviews':{
  const star=n=>'★'.repeat(n)+`<span style="opacity:.3">${'★'.repeat(5-n)}</span>`;
  const rt=clamp(Math.round(parseFloat(String(e.rating).replace(',','.'))||5),1,5);
  return `<div class="rv"><div class="rv-h"><div class="rv-n">${esc(e.rating)}</div><div><div class="rv-s">${star(rt)}</div><div class="rv-c">${e.count?esc(e.count)+' opiniones en Google':'Opiniones en Google'}</div></div>${e.url?`<a class="rv-l" href="${esc(urlOf(e.url))}" target="_blank" rel="noopener">Ver todas las opiniones</a>`:''}</div><div class="rv-g">${e.items.map(i=>`<div class="rv-i"><div class="rv-t"><span class="rv-a">${esc((i.n||'?').trim().charAt(0).toUpperCase())}</span><div><b>${esc(i.n)}</b><small>${esc(i.d)}</small></div></div><div class="rv-s">${star(clamp(i.r||5,1,5))}</div><p>${esc(i.t)}</p></div>`).join('')}</div></div>`}
 case 'html':return ed?phBox('code','HTML',(e.code||'').slice(0,80)):e.code;
 }
 return '';
}

function elHTML(e,ed){
 const sel=ed&&!ui.preview&&ui.elId===e.id;
 const fl=e.float;
 const cls=`e t-${e.t}${TXT.includes(e.t)||e.t==='reviews'?' txt':''}${FIT.includes(e.t)?' fit':''}${sel?' sel':''}${fl?' fl '+e.fx:''}`;
 const wpx=Math.round(e.w*11);
 let st=`--h:${e.h||60}px;--wpx:${wpx}px;--fs:${effFs(e)}px;`;
 st+=fl?`width:${wpx}px;height:${e.h||60}px;`:`left:${e.x}%;top:${e.y}px;width:${e.w}%;${e.h?`height:${e.h}px;`:''}`;
 if(e.op<1)st+=`opacity:${e.op};`;
 st+=`z-index:${e.z||1};`;
 let body=inner(e,ed);
 const la=NOLINK.includes(e.t)?null:linkAttrs(e);
 if(la)body=`<a class="lk" ${la}>${body}</a>`;
 let x='';
 if(sel){
  x=`<i class="hd" data-h="e"></i><i class="hd" data-h="s"></i><i class="hd" data-h="se"></i>
  <div class="etb${e.x+e.w/2>55?' r':''}"><button class="ib" data-act="alignl" title="Alinear a la izquierda">${svg('alignl',22)}</button><button class="ib" data-act="alignc" title="Centrar">${svg('alignc',22)}</button><button class="ib" data-act="alignr" title="Alinear a la derecha">${svg('alignr',22)}</button><span class="sep"></span><button class="ib" data-act="front" title="Traer al frente (por encima de otros elementos)">${svg('front',22)}</button><button class="ib" data-act="back" title="Enviar al fondo (por debajo de otros elementos)">${svg('back',22)}</button><span class="sep"></span>${NOLINK.includes(e.t)?'':`<button class="ib${e.link&&e.link.k!=='none'&&e.link.v?' on':''}" data-act="linkpop" title="Enlace: página, sección, web, correo, teléfono o documento">${svg('link',22)}</button>`}<button class="ib" data-act="elprops" title="Propiedades">${svg('gear',22)}</button><button class="ib" data-act="eldup" title="Duplicar">${svg('copy',22)}</button><button class="ib" data-act="elhide" title="Ocultar">${svg('hidden',22)}</button><button class="ib" data-act="eldel" title="Borrar">${svg('trash',22)}</button></div>`;
  if(e.float)x+=`<span class="fbadge">flotante</span>`;
 }
 const ma=e.ma||(FIT.includes(e.t)?(e.x+e.w/2<38?'l':e.x+e.w/2>62?'r':'c'):'');
 return `<div class="${cls}" data-id="${e.id}"${ma?` data-ma="${ma}"`:''} style="${st}">${body}${x}</div>`;
}
function bgvHTML(s,ed){
 if(!s.bgv)return '';
 const ov=s.ov?`<div class="bgo" style="background:rgba(10,25,40,${s.ov/100})"></div>`:'';
 if(ed)return `<div class="bgv-ed">${svg('video',16)} Vídeo de fondo · se ve en la web publicada</div>${ov}`;
 const em=s.bgv.startsWith('data:video')?{k:'v',u:s.bgv}:embedUrl(s.bgv);
 if(!em)return ov;
 if(em.k==='v')return `<video class="bgv" autoplay muted loop playsinline preload="auto" src="${esc(em.u)}"></video>${ov}`;
 let u=em.u;const yt=/youtube\.com\/embed\/([\w-]+)/.exec(u);
 u+=yt?`?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&modestbranding=1&playsinline=1&rel=0`:'?background=1&autoplay=1&muted=1&loop=1';
 return `<div class="bgv bgf"><iframe src="${esc(u)}" allow="autoplay; fullscreen" tabindex="-1" title="Vídeo de fondo" loading="lazy"></iframe></div>${ov}`;
}
function secHTML(s,i,ed){
 const els=readOrder(s.els.filter(e=>!e.hid&&!(ed&&e.float)));
 const bgs=(s.bg?`background-color:${col(s.bg)};`:'')+(s.bgi?`background-image:${s.ov&&!s.bgv?`linear-gradient(rgba(10,25,40,${s.ov/100}),rgba(10,25,40,${s.ov/100})),`:''}url('${esc(IS(s.bgi))}');`:'');
 const bar=ed&&!ui.preview&&s.locked?`<div class="sbar" data-sbar><span class="sname">${svg('lock',15)} ${esc(s.name)} · en todas las páginas</span><button class="ib" data-act="sechide" data-id="${s.id}" title="Ocultar">${svg('hidden',18)}</button></div>`:ed&&!ui.preview?`<div class="sbar" data-sbar><span class="sname" title="${esc(s.name)}">Sección: ${esc(s.name)}</span><button class="ib" data-act="secup" data-id="${s.id}" title="Subir">${svg('arrup',18)}</button><button class="ib" data-act="secdown" data-id="${s.id}" title="Bajar">${svg('arrdown',18)}</button><button class="ib" data-act="sechide" data-id="${s.id}" title="Ocultar sección">${svg('hidden',18)}</button><button class="ib" data-act="secdup" data-id="${s.id}" title="Duplicar en esta página">${svg('copy',18)}</button><button class="ib" data-act="secto" data-id="${s.id}" title="Copiar o mover a otra página">${svg('arrow',18)}</button><button class="ib" data-act="secdel" data-id="${s.id}" title="Borrar">${svg('trash',18)}</button></div>`:'';
 return `<section id="s-${s.id}" class="sec${s.sticky?' sticky':''}${s.locked?' locked':''}${ed&&ui.secId===s.id&&!ui.elId?' selsec':''}${ed&&!ui.preview&&ui.secId===s.id?' actsec':''}" data-s="${s.id}" style="min-height:${s.h}px;--sh:${s.h}px;${bgs}">${bgvHTML(s,ed&&!ui.preview?true:ed)}${els.map(e=>elHTML(e,ed)).join('')}${bar}${ed&&!ui.preview?`<div class="sgrip" data-grip="${s.id}" title="Arrastra para cambiar el alto de la sección"></div>`:''}</section>`;
}
/* Orden de lectura en móvil/tablet: lo ancho va en su sitio y lo que está en columnas se agrupa columna a columna (icono + título + texto) */
function readOrder(list){
 const L=list.slice().sort((a,b)=>a.y-b.y||a.x-b.x),out=[];let band=[];
 const flush=()=>{if(!band.length)return;const cols=[];
  band.forEach(e=>{const l=e.x,r=e.x+e.w;const c=cols.find(c=>Math.min(r,c.r)-Math.max(l,c.l)>0.4*Math.min(r-l,c.r-c.l));if(c){c.items.push(e);c.l=Math.min(c.l,l);c.r=Math.max(c.r,r)}else cols.push({l,r,items:[e]})});
  cols.sort((a,b)=>a.l-b.l).forEach(c=>c.items.forEach(e=>out.push(e)));band=[]};
 L.forEach(e=>{if(e.w>=60){flush();out.push(e)}else band.push(e)});flush();return out}
const markSvg=h=>`<svg viewBox="0 0 40 40" width="${h}" height="${h}" aria-hidden="true"><rect width="40" height="40" rx="10" fill="var(--c1)"/><path d="M8 21L20 10l12 11v11H8z" fill="#fff"/><rect x="17" y="23" width="6" height="9" fill="var(--c1)"/><path d="M26 6c5 0 8 3 8 8-5 0-8-3-8-8z" fill="var(--c2)"/></svg>`;
function brandHTML(){const L=S.logo||{on:true,h:38,name:true};const h=L.h||38;const m=L.on===false?'':(L.src?`<img src="${esc(L.src)}" alt="Logo" style="height:${h}px;width:auto">`:markSvg(h));return m+(L.name===false?'':`<b>${esc(S.title)}</b>`)}
function siteBoot(){
 var pages=[].slice.call(document.querySelectorAll('.page')),links=[].slice.call(document.querySelectorAll('.mn a'));
 function show(){var h=location.hash.slice(1),sc=null;if(h.indexOf('s-')===0){sc=document.getElementById(h);var pg=sc&&sc.closest('.page');h=pg?pg.id:''}var t=pages.filter(function(p){return p.id===h})[0]||(sc?pages.filter(function(p){return p.classList.contains('on')})[0]:null)||pages[0];pages.forEach(function(p){p.classList.toggle('on',p===t)});links.forEach(function(a){a.classList.toggle('on','p-'+a.dataset.p===t.id)});if(sc)sc.scrollIntoView();else window.scrollTo(0,0)}
 window.addEventListener('hashchange',show);show();links.forEach(function(a){a.addEventListener('click',function(){var c=a.closest('.mn').querySelector('.mnc');if(c)c.checked=false})});
 document.querySelectorAll('.sl').forEach(function(s){var im=s.querySelectorAll('img'),dt=s.querySelectorAll('.dots i'),i=0;function go(n){i=(n+im.length)%im.length;im.forEach(function(x,k){x.classList.toggle('on',k===i)});dt.forEach(function(x,k){x.classList.toggle('on',k===i)})}s.querySelector('.pv').onclick=function(){go(i-1)};s.querySelector('.nx').onclick=function(){go(i+1)};setInterval(function(){go(i+1)},5000)});
 document.querySelectorAll('form[data-f]').forEach(function(f){f.addEventListener('submit',function(ev){if(!f.getAttribute('action')){ev.preventDefault();f.innerHTML='<p style="padding:20px;font-weight:600">¡Gracias! Hemos recibido tu mensaje.</p>'}})});
}

function buildSite(){
 const pgs=S.pages.filter(p=>!p.hidden);
 const nav=S.header&&!S.header.hidden?secHTML(S.header,0,false):'',foot=S.footer&&!S.footer.hidden?secHTML(S.footer,0,false):'';
 const main=pgs.map((p,i)=>`<main class="page${i?'':' on'}" id="p-${p.id}">${p.sections.filter(s=>!s.hidden).map(s=>secHTML(s,0,false)).join('')}</main>`).join('\n');
 const css=`*{box-sizing:border-box}body{margin:0}.site{min-height:100vh}.site .sec{overflow:hidden}.page{display:none}.page.on{display:block}`+SITE_CSS+HFCSS+`@media(max-width:900px){${mobRules('.site')}}@media(min-width:721px) and (max-width:900px){${tabRules('.site')}}`;
 return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(S.title)}</title>
<meta name="description" content="${esc(S.desc)}">
${(()=>{const ids=[S.design.fh,S.design.fb];[S.header,S.footer,...S.pages.flatMap(p=>p.sections)].forEach(s=>s&&s.els.forEach(e=>{if(e.ff)ids.push(e.ff)}));const u=gfUrl(ids);return u?`<link rel="stylesheet" href="${u}">`:''})()}
<style>${css}</style>
</head>
<body>
<div class="site" style="${vars()}">
${nav}
${main}
${foot}
</div>
<script>(${siteBoot.toString()})();<\/script>
</body>
</html>`;
}
