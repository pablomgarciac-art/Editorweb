/* ===== Marcadores de foto (sin servidor): fondo suave tipo foto desenfocada, icono y etiqueta ===== */
function scene(label,hue,kind){
 if(typeof document==='undefined')return '';
 const W=720,H=470,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,`hsl(${hue},22%,70%)`);g.addColorStop(1,`hsl(${hue+18},26%,36%)`);x.fillStyle=g;x.fillRect(0,0,W,H);
 let s=hue*7+3;const rnd=()=>(s=(s*9301+49297)%233280)/233280;
 for(let i=0;i<9;i++){const cx=rnd()*W,cy=rnd()*H,r=70+rnd()*150,b=x.createRadialGradient(cx,cy,0,cx,cy,r);const l=rnd()>.5?'255,255,255':'0,0,0';b.addColorStop(0,`rgba(${l},${.12+rnd()*.14})`);b.addColorStop(1,`rgba(${l},0)`);x.fillStyle=b;x.fillRect(0,0,W,H)}
 const f=x.createLinearGradient(0,H*.62,0,H);f.addColorStop(0,'rgba(0,0,0,0)');f.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=f;x.fillRect(0,0,W,H);
 x.fillStyle='rgba(255,255,255,.82)';x.strokeStyle='rgba(255,255,255,.82)';x.lineWidth=6;x.lineJoin='round';
 const cx=W/2,cy=H/2-24;
 if(kind==='n'){}
 else if(kind==='p'){x.beginPath();x.arc(cx,cy-18,34,0,7);x.fill();x.beginPath();x.arc(cx,cy+78,62,Math.PI,0);x.fill()}
 else{x.beginPath();x.roundRect(cx-60,cy-30,120,80,12);x.stroke();x.beginPath();x.arc(cx,cy+10,22,0,7);x.stroke();x.beginPath();x.roundRect(cx-24,cy-44,48,14,4);x.fill()}
 if(kind!=='n'){x.fillStyle='rgba(255,255,255,.92)';x.textAlign='center';x.textBaseline='alphabetic';x.font='600 20px system-ui,Arial,sans-serif';x.fillText('FOTO DE EJEMPLO',W/2,cy+120);x.font='400 19px system-ui,Arial,sans-serif';x.fillText(label,W/2,cy+148)}
 return c.toDataURL('image/jpeg',.8);
}
const PHN=15;
const PH=[['Fachada',200],['Salón',30],['Cocina',190],['Dormitorio',215],['Vista de la ciudad',245],['Chalet',130],['Piso reformado',20],['Cocina abierta',170],['Ático',260],['Casa con jardín',95],['Persona del equipo',210,'p'],['Persona del equipo',165,'p'],['Persona del equipo',35,'p'],['Nuestra oficina',225],['',205,'n']].map(([l,h,k])=>scene(l,h,k));
const IS=s=>{const m=/^ph:(\d+)$/.exec(s||'');return m?(PH[+m[1]%PHN]||''):(s||'')};
