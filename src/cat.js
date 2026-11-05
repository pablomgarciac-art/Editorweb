/* ===== Catálogo de secciones y páginas de ejemplo ===== */
const tx=(t,x,y,w,text,o={})=>mk(t,{x,y,w,text,...o});
const C={align:'center'};
const L1='Te acompañamos en cada paso, desde la primera visita hasta la entrega de llaves, con trato cercano y precios claros.';
const L2='Nuestro equipo conoce cada barrio y trabaja para que encuentres una vivienda que encaje con tu vida y tu presupuesto.';
const S3=[8,37,66];
const ovl=(s,n)=>{s.ov=n;return s};
const SEC={
 blank:()=>mkSec('Sección en blanco',320,[]),
 t_center:()=>mkSec('Título y texto centrado',320,[tx('h2',20,60,60,'Un título claro para tu sección',C),tx('p',20,150,60,L1,C)]),
 t_two:()=>mkSec('Dos columnas de texto',340,[tx('h2',8,50,60,'Título de la sección'),tx('p',8,140,40,L1,{fs:16}),tx('p',52,140,40,L2,{fs:16})]),
 t_three:()=>mkSec('Tres columnas de texto',380,[tx('h2',8,40,60,'Nuestros servicios'),...S3.flatMap(x=>[tx('h3',x,120,26,'Subtítulo'),tx('p',x,170,26,'Breve descripción del servicio, en dos o tres líneas.',{fs:16})])]),
 t_six:()=>mkSec('Seis bloques de texto',560,[tx('h2',8,40,60,'Lo que hacemos por ti'),...[120,330].flatMap(y=>S3.flatMap(x=>[tx('h3',x,y,26,'Subtítulo'),tx('p',x,y+50,26,'Breve descripción del servicio, en dos o tres líneas.',{fs:16})]))]),
 img_full:()=>mkSec('Imagen grande',460,[mk('img',{x:0,y:0,w:100,h:460,src:'ph:0',r:0})]),
 gal3:()=>PRESETS.gallery[2](),
 gal4:()=>mkSec('Galería de 4 columnas',420,[tx('h2',8,40,60,'Galería'),mk('gallery',{x:8,y:120,w:84,h:260,cols:4,imgs:['ph:1','ph:2','ph:3','ph:4']})]),
 slide:()=>mkSec('Slide de imágenes',560,[tx('h2',8,40,60,'Nuestros espacios'),mk('slider',{x:8,y:120,w:84,h:380,imgs:['ph:0','ph:1','ph:2','ph:3','ph:4']})]),
 img_left:()=>mkSec('Imagen a la izquierda y texto',460,[mk('img',{x:8,y:50,w:40,h:360,src:'ph:1',r:12}),tx('h2',54,80,38,'Un hogar pensado para ti'),tx('p',54,170,38,L1,{fs:16}),mk('btn',{x:54,y:320,w:22,h:52,text:'Saber más'})]),
 img_right:()=>mkSec('Texto e imagen a la derecha',460,[tx('h2',8,80,38,'Vende con tranquilidad'),tx('p',8,170,38,L2,{fs:16}),mk('btn',{x:8,y:320,w:22,h:52,text:'Pedir valoración'}),mk('img',{x:52,y:50,w:40,h:360,src:'ph:6',r:12})]),
 cards3:()=>mkSec('Tres tarjetas con foto',520,[tx('h2',8,40,60,'Tres formas de ayudarte'),...S3.flatMap((x,i)=>[mk('img',{x,y:120,w:26,h:200,src:['ph:5','ph:6','ph:8'][i],r:10}),tx('h3',x,336,26,['Comprar','Vender','Alquilar'][i]),tx('p',x,376,26,'Una frase corta que explique este servicio.',{fs:16})])]),
 about_us:()=>mkSec('Quiénes somos',560,[
  tx('h1',8,60,44,'Quiénes somos',{fs:44}),
  tx('p',8,150,42,'Somos una agencia familiar con más de quince años en el sector inmobiliario. Acompañamos a cada cliente desde la primera visita hasta la entrega de llaves.'),
  tx('p',8,310,42,L2),
  mk('btn',{x:8,y:430,w:24,h:54,text:'Hablemos'}),
  mk('img',{x:56,y:60,w:36,h:430,src:'ph:13',r:12})]),
 values:()=>mkSec('Nuestros valores',440,[tx('h2',8,40,60,'Nuestros valores'),
  ...[['heart','Cercanía','Te escuchamos y te explicamos cada paso sin tecnicismos.'],['check','Transparencia','Honorarios claros desde el primer día, sin letra pequeña.'],['key','Experiencia','Más de 500 viviendas gestionadas en la zona.']].flatMap(([ic,t,p],i)=>[mk('icon',{x:S3[i],y:120,icon:ic}),tx('h3',S3[i],210,26,t),tx('p',S3[i],290,26,p,{fs:16})])]),
 team:()=>mkSec('Nuestro equipo',560,[tx('h2',8,40,60,'Nuestro equipo'),
  ...[['Lucía Fernández','Dirección','ph:10'],['Andrés Ramos','Ventas y alquileres','ph:11'],['Marta Gil','Atención al cliente','ph:12']].flatMap(([n,r,s],i)=>[mk('img',{x:S3[i],y:120,w:26,h:280,src:s,r:12}),tx('h3',S3[i],420,26,n),tx('p',S3[i],458,26,r,{fs:16})])]),
 cta_color:()=>mkSec('Llamada a la acción',320,[tx('h2',15,70,70,'¿Hablamos de tu próxima vivienda?',{...C,color:'#ffffff'}),tx('p',25,150,50,'Cuéntanos qué buscas y te llamamos hoy mismo.',{...C,color:'#ffffff'}),mk('btn',{x:38,y:220,w:24,h:56,text:'Contactar',bgc:'c2',color:'#1f2937'})],'c1'),
 cta_photo:()=>ovl(mkSec('Banner con foto de fondo',400,[tx('h1',10,110,80,'Tu hogar empieza aquí',{...C,color:'#ffffff'}),mk('btn',{x:38,y:250,w:24,h:56,text:'Ver propiedades',bgc:'c2',color:'#1f2937'})],'c1','ph:14'),45),
 txt_btn:()=>mkSec('Texto y botón',320,[tx('h2',8,60,60,'Título con llamada a la acción'),tx('p',8,140,48,L1,{fs:16}),mk('btn',{x:8,y:240,w:22,h:54,text:'Quiero saber más'})]),
 props3:()=>mkSec('Panel de inmuebles',560,[tx('h2',8,40,60,'Inmuebles destacados'),...S3.flatMap((x,i)=>[mk('img',{x,y:120,w:26,h:200,src:['ph:5','ph:6','ph:8'][i],r:10}),tx('h3',x,336,26,['Chalet con jardín','Piso reformado','Ático con terraza'][i]),tx('p',x,376,26,['4 hab · 3 baños · 385.000 €','3 hab · 2 baños · 245.000 €','2 hab · 2 baños · 310.000 €'][i],{fs:16}),mk('btntext',{x,y:432,w:20,text:'Ver ficha'})])]),
 props_slide:()=>mkSec('Inmuebles en slide',560,[tx('h2',8,40,60,'Viviendas destacadas'),mk('slider',{x:8,y:120,w:84,h:380,imgs:['ph:5','ph:6','ph:7','ph:8','ph:9']})]),
 search:()=>mkSec('Buscador de vivienda',500,[tx('h2',8,40,60,'Encuentra tu vivienda'),mk('form',{x:8,y:130,w:46,h:330,fields:['Zona','Tipo de vivienda','Precio máximo'],btn:'Buscar'}),mk('img',{x:60,y:130,w:32,h:330,src:'ph:9',r:12})]),
 counters:()=>mkSec('Contadores',260,[...[[8,'500+','Viviendas vendidas'],[30,'15','Años de experiencia'],[52,'98%','Clientes satisfechos'],[74,'48 h','Valoración gratuita']].flatMap(([x,n,l])=>[tx('h1',x,60,18,n,{...C,color:'c1',fs:48}),tx('p',x,140,18,l,{...C,fs:16})])]),
 history:()=>mkSec('Nuestra historia',460,[tx('h2',8,40,60,'Nuestra historia'),...[['2009','Nacemos','Abrimos nuestra primera oficina con un equipo de tres personas.'],['2015','Crecemos','Ampliamos el equipo y empezamos a trabajar en toda la provincia.'],['2026','Hoy','Más de 500 familias han encontrado su hogar con nosotros.']].flatMap(([a,t,p],i)=>[tx('h1',S3[i],120,26,a,{color:'c1',fs:44}),tx('h3',S3[i],200,26,t),tx('p',S3[i],250,26,p,{fs:16})])]),
 greviews:()=>mkSec('Opiniones de Google',640,[tx('h2',8,40,84,'Opiniones de nuestros clientes en Google'),mk('reviews',{x:8,y:120,w:84})]),
 quotes:()=>mkSec('Opiniones de clientes',420,[tx('h2',8,40,60,'Lo que dicen nuestros clientes'),...[['“Nos explicaron cada paso y vendimos en un mes.”','Familia Ortega'],['“Trato cercano y muy profesional. Repetiríamos.”','Carmen y Luis'],['“Encontramos el piso que buscábamos sin agobios.”','Daniel Ruiz']].flatMap(([q,n],i)=>[tx('p',S3[i],130,26,q,{fs:19}),tx('h3',S3[i],270,26,n,{fs:18})])]),
 faq:()=>mkSec('Preguntas frecuentes',640,[tx('h2',8,40,60,'Preguntas frecuentes'),...[['¿Cuánto cuesta la valoración?','Es gratuita y sin compromiso. La tendrás en 48 horas.'],['¿Qué documentos necesito para vender?','Te enviamos un listado completo y te ayudamos a reunirlos.'],['¿Puedo visitar la vivienda sin cita?','Preferimos concertar cita para atenderte con tiempo.'],['¿Trabajáis con financiación?','Colaboramos con asesores hipotecarios de confianza.']].flatMap(([q,a],i)=>[tx('h3',8,120+i*120,80,q,{fs:22}),tx('p',8,165+i*120,80,a,{fs:16})])]),
 contact_form:()=>PRESETS.contact[2](),
 contact_info:()=>mkSec('Datos de contacto',360,[tx('h2',8,40,60,'Cómo encontrarnos'),...[['phone','Teléfono','+34 600 000 000'],['mail','Correo','hola@tuempresa.es'],['pin','Dirección','Calle Mayor 1, tu ciudad']].flatMap(([ic,t,p],i)=>[mk('icon',{x:S3[i],y:120,icon:ic}),tx('h3',S3[i],210,26,t),tx('p',S3[i],255,26,p,{fs:17})])]),
 video:()=>mkSec('Vídeo',560,[tx('h2',20,40,60,'Mira cómo trabajamos',C),mk('video',{x:20,y:120,w:60,h:380})]),
 docs:()=>mkSec('Documentos para descargar',360,[tx('h2',8,40,60,'Documentos para descargar'),mk('doc',{x:8,y:120,w:40,text:'Guía del comprador.pdf'}),mk('doc',{x:52,y:120,w:40,text:'Guía del vendedor.pdf'}),mk('doc',{x:8,y:230,w:40,text:'Tarifas de servicios.pdf'})]),
 foot_social:()=>PRESETS.footer[2](),
 foot_simple:()=>mkSec('Pie simple',120,[tx('p',10,44,80,'© 2026 Tu empresa · Aviso legal · Política de privacidad',{...C,fs:14,color:'#ffffff'})],'ink'),
 legal:()=>mkSec('Texto legal',720,[tx('h1',8,40,70,'Aviso legal',{fs:40}),tx('h3',8,130,80,'Datos del titular',{fs:22}),tx('p',8,170,80,'Titular: [nombre o razón social]. NIF: [NIF]. Domicilio: [dirección]. Correo electrónico: [correo]. Sustituye estos datos por los de tu empresa.',{fs:16}),tx('h3',8,300,80,'Condiciones de uso',{fs:22}),tx('p',8,340,80,'Escribe aquí las condiciones de uso del sitio web, la propiedad intelectual y la limitación de responsabilidad. Conviene que un profesional las revise.',{fs:16}),tx('h3',8,480,80,'Protección de datos',{fs:22}),tx('p',8,520,80,'Indica aquí el responsable del tratamiento, la finalidad, la base legal y cómo pueden los usuarios ejercer sus derechos.',{fs:16})])
};
const SEC_CATS=[
 ['En blanco',['blank']],['Texto',['t_center','t_two','t_three','t_six']],['Imágenes',['img_full','gal3','gal4','slide']],
 ['Texto e imágenes',['img_left','img_right','cards3']],['Sobre nosotros',['about_us','values','team']],['Panel publicitario',['cta_color','cta_photo']],
 ['Texto y botón',['txt_btn']],['Inmuebles',['props3','props_slide','search']],['Contadores',['counters']],['Historia',['history']],
 ['Opiniones de clientes',['quotes','greviews']],['Preguntas frecuentes',['faq']],['Contacto',['contact_form','contact_info']],
 ['Vídeo y documentos',['video','docs']],['Pie de página',['foot_social','foot_simple']],['Texto legal',['legal']]
];
/* [categoría, [[nombre de la variante, título de la página, secciones]]] */
const PAGE_CATS=[
 ['En blanco',[['Página vacía','Página nueva',['blank']]]],
 ['Quiénes somos',[['Presentación, valores y equipo','Quiénes somos',['about_us','values','team','cta_color','foot_social']],['Historia y cifras','Quiénes somos',['history','counters','team','foot_social']]]],
 ['Galería',[['Galería de fotos','Galería',['t_center','gal3','gal4','foot_social']],['Slide y galería','Galería',['slide','gal3','foot_social']]]],
 ['Preguntas frecuentes',[['Preguntas y respuestas','Preguntas frecuentes',['faq','cta_color','foot_social']]]],
 ['Servicios',[['Servicios con llamada a la acción','Servicios',['t_center','t_six','cta_photo','foot_social']]]],
 ['Contacto',[['Formulario y mapa','Contacto',['contact_form','foot_social']],['Datos de contacto y formulario','Contacto',['contact_info','contact_form','foot_simple']]]],
 ['Listado de inmuebles',[['Buscador e inmuebles destacados','Propiedades',['search','props3','props_slide','foot_social']]]],
 ['Conocer al equipo',[['Equipo y opiniones','Equipo',['team','quotes','foot_social']]]],
 ['Opiniones de clientes',[['Opiniones y contacto','Opiniones',['quotes','cta_color','foot_social']]]],
 ['Documentos y vídeo',[['Vídeo y descargas','Recursos',['video','docs','foot_simple']]]],
 ['Aviso legal',[['Texto legal','Aviso legal',['legal','foot_simple']]]]
];

let catKind='sec';
function openCatalog(kind){
 catKind=kind;
 const cats=kind==='sec'?SEC_CATS:PAGE_CATS;
 const pv=secs=>`<div class="pvx"><div class="site" style="${vars()}">${secs.map(s=>secHTML(s,0,true)).join('')}</div></div>`;
 const groups=cats.map((c,i)=>{
  const items=kind==='sec'
   ?c[1].map(k=>{const s=SEC[k]();return `<div class="catp" role="button" tabindex="0" data-act="catadd" data-k="${k}">${pv([s])}<span class="catadd">Añadir</span></div><p class="cap">${esc(s.name)}</p>`})
   :c[1].map((v,j)=>`<div class="catp" role="button" tabindex="0" data-act="catadd" data-k="${i}:${j}">${pv(v[2].map(k=>SEC[k]()))}<span class="catadd">Añadir</span></div><p class="cap">${esc(v[0])}</p>`);
  return `<div class="catg" id="cg${i}"><div class="cath2">${c[0]}</div>${items.join('')}</div>`;
 }).join('');
 $('#modal').innerHTML=`<div class="card cat" role="dialog" aria-label="${kind==='sec'?'Añadir sección':'Añadir página'}"><div class="cath"><h2>${kind==='sec'?'Añadir sección':'Añadir página'}</h2><button class="ib" data-act="modalclose" aria-label="Cerrar">${svg('close',24)}</button></div><div class="catb"><nav class="catn">${cats.map((c,i)=>`<button data-act="catgo" data-i="${i}">${c[0]}</button>`).join('')}</nav><div class="catr">${groups}</div></div></div>`;
 $('#modal').hidden=false;
 fitPreviews();
}
function fitPreviews(){
 if($('#modal').hidden)return;
 $$('#modal .pvx').forEach(b=>{
  const w=b.clientWidth,i=b.firstElementChild;if(!w)return;
  const s=w/1100;i.style.width='1100px';i.style.transformOrigin='0 0';i.style.transform=`scale(${s})`;
  b.style.height=Math.min(i.offsetHeight*s,catKind==='page'?520:9999)+'px';
 });
}
addEventListener('resize',fitPreviews);
function catAdd(k){
 const pg=curPage();
 if(catKind==='sec'){
  const s=SEC[k](),i=pg.sections.findIndex(x=>x.id===ui.secId);
  pg.sections.splice(i>=0?i+1:pg.sections.length,0,s);
  ui.secId=s.id;ui.elId=null;
  $('#modal').hidden=true;commit(true);renderAll();
  const n=$(`.sec[data-s="${s.id}"]`);if(n)n.scrollIntoView({block:'start',behavior:'smooth'});
 }else{
  const [i,j]=k.split(':').map(Number),v=PAGE_CATS[i][1][j];
  const p=mkPage(v[1],v[2].map(x=>SEC[x]()));
  const ix=S.pages.findIndex(x=>x.id===pg.id);
  S.pages.splice(ix+1,0,p);ui.pageId=p.id;ui.secId=null;ui.elId=null;
  $('#modal').hidden=true;commit(true);renderAll();$('#stage').scrollTop=0;
  toast('Página «'+p.name+'» añadida');
 }
}
