'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,8);
const clone=o=>JSON.parse(JSON.stringify(o));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

const IC={
 pages:'M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6',
 sections:'M4 8V5h16v3M4 16v3h16v-3M4 10h16v4H4z',
 elements:'M5 5h14v14H5zM10 10h4v4h-4z',
 design:'M4 20l1-4L16 5l3 3L8 19zM14 7l3 3',
 hidden:'M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM4 4l16 16',
 gear:'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
 eye:'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
 link:'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
 lock:'M7 11V8a5 5 0 0110 0v3M5 11h14v10H5z',
 trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5',
 copy:'M8 8h11v12H8zM5 16V4h11',
 up:'M6 15l6-6 6 6',
 arrup:'M12 20V5M5.500 11.500L12 5l6.500 6.500',
 arrdown:'M12 4v15M5.500 12.500L12 19l6.500-6.500',
 down:'M6 9l6 6 6-6',
 undo:'M9 7L4 12l5 5M4 12h10a5 5 0 010 10h-3',
 redo:'M15 7l5 5-5 5M20 12H10a5 5 0 000 10h3',
 desktop:'M3 5h18v12H3zM9 21h6M12 17v4',
 mobile:'M7 3h10v18H7zM11 18h2',
 tablet:'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z|M12 18h.01',
 image:'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M9 9.5h.01',
 gallery:'M3 4h8v7H3zM13 4h8v7h-8zM3 13h8v7H3zM13 13h8v7h-8z',
 slide:'M7 5h10v14H7zM3 8v8M21 8v8',
 close:'M5 5l14 14M19 5L5 19',
 plus:'M12 5v14M5 12h14',
 map:'M9 4l6 2 5-2v14l-5 2-6-2-5 2V6zM9 4v14M15 6v14',
 video:'M3 6h13v12H3zM16 10l5-3v10l-5-3',
 form:'M5 4h14v16H5zM8 9h8M8 13h8M8 17h4',
 code:'M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14',
 doc:'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h4',
 btn:'M3 8h18v8H3zM9 12h6',
 btnicon:'M12 4a8 8 0 100 16 8 8 0 000-16zM12 9v6M9 12h6',
 btntext:'M5 8h14M5 12h14M5 16h8',
 btnti:'M3 8h18v8H3zM7 12h6M16 12h2',
 social:'M6 12h.01M18 6h.01M18 18h.01M8 11l8-4M8 13l8 4',
 shape:'M4 4h8v8H4zM16 8a4 4 0 100 8 4 4 0 000-8zM8 14l4 7H4z',
 rect:'M4 6h16v12H4z',
 circle:'M12 4a8 8 0 100 16 8 8 0 000-16z',
 triangle:'M12 4l9 16H3z',
 line:'M4 12h16',
 front:'M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5',
 back:'M12 21l9-4.5-9-4.5-9 4.5zM3 12l9-4.5 9 4.5M3 7.5L12 3l9 4.5',
 alignl:'M4 6h16M4 10h10M4 14h16M4 18h10',
 alignc:'M4 6h16M7 10h10M4 14h16M7 18h10',
 alignr:'M4 6h16M10 10h10M4 14h16M10 18h10',
 save:'M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6',
 rocket:'M12 3c4 2 6 6 5 11l-3 3h-4l-3-3c-1-5 1-9 5-11zM9 17l-2 4M15 17l2 4M12 9.5h.01',
 star:'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
 heart:'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
 home:'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8|M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
 phone:'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
 mail:'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z|m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
 pin:'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0|M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
 check:'M20 6 9 17l-5-5',
 key:'M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z|M16 7.5a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0',
 bed:'M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8|M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4|M12 4v6|M2 18h20',
 bath:'M10 4 8 6|M17 19v2|M2 12h20|M7 19v2|M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5',
 arrow:'M5 12h14|m12 5 7 7-7 7',
 user:'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2|M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
 whatsapp:'M4 20l1.3-4.2A8 8 0 1112 20a8 8 0 01-3.8-1zM9 9c0 3 3 6 6 6l1-1.5-2-1-1 .7c-1-.4-1.800-1.200-2.200-2.200l.7-1-1-2z',
 fence:'M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z|M6 8h4|M6 18h4|m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z|M14 8h4|M14 18h4|m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z',
 door:'M13 4h3a2 2 0 0 1 2 2v14|M2 20h3|M13 20h9|M10 12v.01|M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z',
 leaf:'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z|M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
 growth:'M22 7L13.5 15.5L8.5 10.5L2 17|M16 7L22 7L22 13',
 ok:'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0|m9 12 2 2 4-4',
 sofa:'M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3|M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z|M4 18v2|M20 18v2|M12 4v9',
 handshake:'m11 17 2 2a1 1 0 1 0 3-3|m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4|m21 3 1 11h-2|M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3|M3 4h8',
 car:'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2|M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0|M9 17h6|M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
 building:'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z|M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2|M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2|M10 6h4|M10 10h4|M10 14h4|M10 18h4',
 tree:'m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z|M12 22v-3',
 sun:'M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0|M12 2v2|M12 20v2|m4.93 4.93 1.41 1.41|m17.66 17.66 1.41 1.41|M2 12h2|M20 12h2|m6.34 17.66-1.41 1.41|m19.07 4.93-1.41 1.41',
 clock:'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0|M12 6L12 12L16 14',
 shield:'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z|m9 12 2 2 4-4',
 euro:'M4 10h12|M4 14h9|M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2',
 ruler:'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z|m14.5 12.5 2-2|m11.5 9.5 2-2|m8.5 6.5 2-2|m17.5 15.5 2-2',
 calendar:'M8 2v4|M16 2v4|M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2z|M3 10h18',
 chat:'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
 camera:'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z|M9 13a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
 thumb:'M7 10v12|M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z',
 percent:'M19 5L5 19|M4 6.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0|M15 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0',
 wifi:'M12 20h.01|M2 8.82a15 15 0 0 1 20 0|M5 12.859a10 10 0 0 1 14 0|M8.5 16.429a5 5 0 0 1 7 0',
 snow:'M2 12L22 12|M12 2L12 22|m20 16-4-4 4-4|m4 8 4 4-4 4|m16 4-4 4-4-4|m8 20 4-4 4 4',
 pool:'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1|M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1|M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
 search:'M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0|m21 21-4.3-4.3',
 award:'m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526|M6 8a6 6 0 1 0 12 0a6 6 0 1 0 -12 0',
};
const svg=(n,s=18,sw=1.8)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(IC[n]||IC.star).split('|').map(d=>`<path d="${d}"/>`).join('')}</svg>`;
const ICON_CHOICES=['home','key','building','door','sofa','bed','bath','car','tree','leaf','sun','pool','wifi','snow','fence','ruler','euro','percent','handshake','shield','award','growth','thumb','ok','check','heart','star','phone','mail','chat','pin','clock','calendar','camera','search','user','arrow','whatsapp'];
const NETS={facebook:['f','Facebook'],instagram:['ig','Instagram'],x:['X','X'],youtube:['yt','YouTube'],linkedin:['in','LinkedIn'],whatsapp:['wa','WhatsApp'],tiktok:['tt','TikTok'],telegram:['tg','Telegram']};

const SOC={
 facebook:{bg:'#1877f2',g:'<path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>'},
 instagram:{bg:'linear-gradient(45deg,#f9a03f,#e1306c 55%,#833ab4)',g:'<path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>'},
 x:{bg:'#111111',g:'<path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>'},
 youtube:{bg:'#ff0000',g:'<path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'},
 linkedin:{bg:'#0a66c2',g:'<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'},
 whatsapp:{bg:'#25d366',g:'<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>'},
 tiktok:{bg:'#111111',g:'<path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>'},
 telegram:{bg:'#26a5e4',g:'<path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>'}
};
const SOCOL={facebook:'#1877f2',youtube:'#ff0000',linkedin:'#0a66c2',whatsapp:'#25d366',telegram:'#26a5e4'};
const soLogo=(n,s,dark)=>{
 const g=(SOC[n]||SOC.instagram).g;
 if(n==='instagram')return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><defs><linearGradient id="sog" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#feda75"/><stop offset=".3" stop-color="#fa7e1e"/><stop offset=".55" stop-color="#d62976"/><stop offset=".8" stop-color="#962fbf"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs><g style="color:url(#sog)" fill="url(#sog)">${g.replace(/currentColor/g,'url(#sog)')}</g></svg>`;
 if(n==='tiktok')return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><g style="color:#25f4ee" transform="translate(-.9 -.7)">${g}</g><g style="color:#fe2c55" transform="translate(.9 .7)">${g}</g><g style="color:${dark}">${g}</g></svg>`;
 return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><g style="color:${SOCOL[n]||dark}">${g}</g></svg>`;
};
const soIcon=(n,s)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${(SOC[n]||SOC.instagram).g}</svg>`;
const FONTS=[
 {id:'poppins',n:'Poppins',f:"'Poppins',sans-serif",g:'Poppins:wght@400;600;700'},
 {id:'montserrat',n:'Montserrat',f:"'Montserrat',sans-serif",g:'Montserrat:wght@400;600;700'},
 {id:'raleway',n:'Raleway',f:"'Raleway',sans-serif",g:'Raleway:wght@400;600;700'},
 {id:'oswald',n:'Oswald',f:"'Oswald',sans-serif",g:'Oswald:wght@400;600;700'},
 {id:'bebas',n:'Bebas Neue',f:"'Bebas Neue',sans-serif",g:'Bebas+Neue'},
 {id:'josefin',n:'Josefin Sans',f:"'Josefin Sans',sans-serif",g:'Josefin+Sans:wght@400;600;700'},
 {id:'quicksand',n:'Quicksand',f:"'Quicksand',sans-serif",g:'Quicksand:wght@400;600;700'},
 {id:'worksans',n:'Work Sans',f:"'Work Sans',sans-serif",g:'Work+Sans:wght@400;600;700'},
 {id:'dmsans',n:'DM Sans',f:"'DM Sans',sans-serif",g:'DM+Sans:wght@400;600;700'},
 {id:'nunito',n:'Nunito Sans',f:"'Nunito Sans',sans-serif",g:'Nunito+Sans:wght@400;600;700'},
 {id:'roboto',n:'Roboto',f:"'Roboto',sans-serif",g:'Roboto:wght@400;500;700'},
 {id:'opensans',n:'Open Sans',f:"'Open Sans',sans-serif",g:'Open+Sans:wght@400;600;700'},
 {id:'lato',n:'Lato',f:"'Lato',sans-serif",g:'Lato:wght@400;700'},
 {id:'playfair',n:'Playfair Display',f:"'Playfair Display',serif",g:'Playfair+Display:wght@600;700'},
 {id:'cormorant',n:'Cormorant Garamond',f:"'Cormorant Garamond',serif",g:'Cormorant+Garamond:wght@500;700'},
 {id:'abril',n:'Abril Fatface',f:"'Abril Fatface',serif",g:'Abril+Fatface'},
 {id:'merri',n:'Merriweather',f:"'Merriweather',serif",g:'Merriweather:wght@400;700'},
 {id:'lora',n:'Lora',f:"'Lora',serif",g:'Lora:wght@400;600'},
 {id:'source',n:'Source Serif 4',f:"'Source Serif 4',serif",g:'Source+Serif+4:wght@400;600'},
 {id:'pacifico',n:'Pacifico (manuscrita)',f:"'Pacifico',cursive",g:'Pacifico'},
 {id:'dancing',n:'Dancing Script (manuscrita)',f:"'Dancing Script',cursive",g:'Dancing+Script:wght@400;700'},
 {id:'system',n:'Sistema (sin descarga)',f:"system-ui,sans-serif",g:''}
];
const PAIRS={mod:['Moderna','poppins','dmsans'],ele:['Elegante','playfair','lora'],cla:['Clásica','montserrat','nunito'],fue:['Con fuerza','oswald','opensans']};
const fnt=id=>FONTS.find(x=>x.id===id)||FONTS[0];
const gfUrl=ids=>{const g=[...new Set(ids)].map(i=>fnt(i).g).filter(Boolean);return g.length?'https://fonts.googleapis.com/css2?'+g.map(x=>'family='+x).join('&')+'&display=swap':''};
const LBL={logo:'Logo',menu:'Menú de páginas',img:'Imagen',gallery:'Galería',slider:'Slide de imágenes',icon:'Icono',h1:'Título 1',h2:'Título 2',h3:'Título 3',p:'Párrafo',btn:'Botón',btnicon:'Botón con icono',btntext:'Botón de texto',btnti:'Botón texto e icono',social:'Redes sociales',social1:'Red social',shape:'Forma',map:'Mapa',video:'Vídeo',form:'Formulario',doc:'Documento',reviews:'Opiniones de Google',html:'HTML'};


const D0={c1:'#0f6e8c',c2:'#e0a030',bg:'#ffffff',ink:'#1f2937',fh:'poppins',fb:'dmsans',hs:100,ps:100,r:10};
const DEF={
 img:{w:40,h:260,src:'ph:0',fit:'cover',r:0,alt:'Imagen'},
 gallery:{w:84,h:320,imgs:['ph:0','ph:1','ph:2'],cols:3,r:8,gap:8},
 slider:{w:84,h:360,imgs:['ph:0','ph:1','ph:2'],r:8},
 icon:{w:8,h:80,icon:'star',color:'',badge:true},
 h1:{w:70,h:0,text:'Título principal',fs:48,color:'',align:'left',b:true},
 h2:{w:60,h:0,text:'Título de sección',fs:34,color:'',align:'left',b:true},
 h3:{w:40,h:0,text:'Subtítulo',fs:24,color:'',align:'left',b:true},
 p:{w:50,h:0,text:'Escribe aquí tu texto. Haz doble clic para editarlo directamente en la página.',fs:17,color:'',align:'left',b:false},
 btn:{w:22,h:52,text:'Botón',bgc:'',color:'',r:10,fs:16},
 btnicon:{w:6,h:56,icon:'arrow',bgc:'',color:'',r:999},
 btntext:{w:16,h:40,text:'Saber más',color:'',fs:16},
 btnti:{w:24,h:52,text:'Llamar',icon:'phone',bgc:'',color:'',r:10,fs:16},
 logo:{w:24,h:50,lh:38,name:true,color:''},
 menu:{w:58,h:44,fs:15,style:'pill',dir:'row',align:'right',color:''},
 social:{w:30,h:52,sz:44,style:'circle',nets:[{n:'facebook',u:''},{n:'instagram',u:''},{n:'youtube',u:''}],bgc:'',color:''},
 social1:{w:5,h:44,style:'circle',nets:[{n:'instagram',u:''}],bgc:'',color:''},
 shape:{w:20,h:140,shape:'rect',fill:'c2',r:12},
 map:{w:60,h:320,q:'Plaza de España, Madrid'},
 video:{w:60,h:340,url:''},
 form:{w:46,h:400,ff:'',fz:15,fld:'m',fcols:1,fields:['Nombre','Correo electrónico','Teléfono','Mensaje'],btn:'Enviar',action:''},
 doc:{w:36,h:84,text:'Dossier informativo.pdf'},
 reviews:{w:84,h:0,rating:'5,0',count:'',url:'',items:[{n:'Nombre del cliente',r:5,t:'Escribe aquí la opinión de tu cliente tal como aparece en tu ficha de Google.',d:'Fecha'},{n:'Nombre del cliente',r:5,t:'Escribe aquí la opinión de tu cliente tal como aparece en tu ficha de Google.',d:'Fecha'},{n:'Nombre del cliente',r:4,t:'Escribe aquí la opinión de tu cliente tal como aparece en tu ficha de Google.',d:'Fecha'}]},
 html:{w:50,h:160,code:'<div style="padding:20px;text-align:center">Tu código HTML aquí</div>'}
};
function mk(t,over={}){
 const [base,shape]=t.split(':');
 const e={id:uid(),t:base,x:8,y:40,hid:false,op:1,z:1,float:false,fx:'br',link:{k:'none',v:'',nt:true},...clone(DEF[base]),...over};
 if(shape)e.shape=shape;
 return e;
}
const mkSec=(name,h,els,bg='',bgi='')=>({id:uid(),name,hidden:false,h,bg,bgi,els});
const mkPage=(name,sections,id)=>({id:id||uid(),name,hidden:false,sections});

const PRESETS={
 blank:['En blanco','Sección vacía',()=>mkSec('Sección en blanco',320,[])],
 hero:['Portada','Título, texto y botón sobre color',()=>mkSec('Portada',480,[mk('h1',{x:8,y:120,w:62,text:'Tu título aquí',color:'#ffffff'}),mk('p',{x:8,y:230,w:50,text:'Una frase corta que explique lo que ofreces.',color:'#ffffff'}),mk('btn',{x:8,y:320,text:'Ver más',bgc:'c2',color:'#1f2937'})],'c1')],
 text:['Texto','Título y párrafo',()=>mkSec('Texto',300,[mk('h2',{x:8,y:50}),mk('p',{x:8,y:130,w:60})])],
 gallery:['Galería','Título y galería de fotos',()=>mkSec('Galería',600,[mk('h2',{x:8,y:40,text:'Galería'}),mk('gallery',{x:8,y:120,w:84,h:420,imgs:['ph:0','ph:1','ph:2','ph:3','ph:4','ph:5']})])],
 contact:['Contacto','Formulario y mapa',()=>mkSec('Contacto',560,[mk('h2',{x:8,y:40,text:'Contacto'}),mk('form',{x:8,y:110,w:40}),mk('map',{x:52,y:110,w:40,h:400})])],
 footer:['Pie de página','Redes y aviso legal',()=>mkSec('Pie de página',170,[mk('social',{x:8,y:36}),mk('p',{x:8,y:104,w:70,fs:14,color:'#ffffff',text:'© 2026 Tu empresa. Todos los derechos reservados.'})],'ink')]
};

const makeHeader=()=>({id:'hdr',name:'Cabecera',locked:true,hidden:false,sticky:false,h:84,bg:'bg',bgi:'',ov:0,els:[mk('logo',{x:3,y:18,w:30,h:48}),mk('menu',{x:38,y:20,w:59,h:44,align:'right'}),mk('btn',{x:78,y:16,w:19,h:48,text:'Contacto',hid:true})]});
const makeFooter=()=>{const L='#e5e7eb';return {id:'ftr',name:'Pie de página',locked:true,hidden:false,h:340,bg:'ink',bgi:'',ov:0,els:[
 mk('logo',{x:5,y:40,w:42,h:50,color:'#ffffff'}),
 mk('p',{x:5,y:106,w:36,h:0,color:L,fs:15,text:'Tu agencia de confianza para comprar, vender o alquilar tu vivienda.'}),
 mk('social',{x:5,y:190,w:40,h:52,style:'brand',sz:38}),
 mk('h3',{x:52,y:40,w:20,h:0,color:'#ffffff',fs:17,text:'Páginas'}),
 mk('menu',{x:52,y:84,w:20,h:140,style:'text',dir:'col',align:'left',color:L}),
 mk('h3',{x:76,y:40,w:20,h:0,color:'#ffffff',fs:17,text:'Contacto'}),
 mk('p',{x:76,y:84,w:21,h:0,color:L,fs:15,text:'600 000 000\ninfo@tuagencia.com\nTu calle, 1 · Tu ciudad'}),
 mk('p',{x:5,y:285,w:90,h:0,color:'#9ca3af',fs:14,text:'© '+new Date().getFullYear()+' Tu empresa. Todos los derechos reservados.'})
]}};
function tplBlank(){
 return {title:'Mi web',desc:'',menu:true,logo:{on:true,src:'',h:38,name:true},design:clone(D0),pages:[mkPage('Inicio',[PRESETS.hero[2]()],'inicio')]};
}
function tplInmo(){
 const hero=mkSec('Portada',520,[
  mk('h1',{x:8,y:130,w:62,text:'Encuentra el hogar que estabas buscando',color:'#ffffff',fs:50}),
  mk('p',{x:8,y:300,w:50,text:'Te acompañamos en la compra, venta y alquiler de tu vivienda.',color:'#ffffff',fs:19}),
  mk('btn',{x:8,y:390,w:22,h:56,text:'Ver propiedades',bgc:'c2',color:'#1f2937',link:{k:'page',v:'props',nt:false}}),
  mk('btnicon',{x:90,y:0,w:6.5,h:66,r:999,hfx:'zoom',icon:'whatsapp',bgc:'#25d366',color:'#ffffff',float:true,fx:'br',link:{k:'url',v:'https://wa.me/34600000000',nt:true}})
 ],'c1','ph:14');hero.ov=40;
 const feat=mkSec('Por qué elegirnos',410,[
  mk('h2',{x:8,y:40,text:'Por qué elegirnos'}),
  mk('icon',{x:8,y:120,icon:'key'}),mk('h3',{x:8,y:210,w:26,text:'Visitas sin compromiso'}),mk('p',{x:8,y:290,w:26,fs:16,text:'Organizamos las visitas cuando mejor te venga.'}),
  mk('icon',{x:37,y:120,icon:'home'}),mk('h3',{x:37,y:210,w:26,text:'Valoración gratuita'}),mk('p',{x:37,y:290,w:26,fs:16,text:'Conoce el precio real de tu vivienda en 48 horas.'}),
  mk('icon',{x:66,y:120,icon:'check'}),mk('h3',{x:66,y:210,w:26,text:'Gestión completa'}),mk('p',{x:66,y:290,w:26,fs:16,text:'Nos ocupamos de la documentación y de los trámites.'})
 ]);
const homes=mkSec('Últimas viviendas',470,[
  mk('h2',{x:8,y:40,text:'Últimas viviendas'}),
  mk('img',{x:8,y:120,w:26,h:200,src:'ph:5',r:10}),mk('h3',{x:8,y:336,w:26,text:'Chalet con jardín'}),mk('p',{x:8,y:376,w:26,fs:16,text:'4 hab · 3 baños · 385.000 €'}),
  mk('img',{x:37,y:120,w:26,h:200,src:'ph:6',r:10}),mk('h3',{x:37,y:336,w:26,text:'Piso reformado'}),mk('p',{x:37,y:376,w:26,fs:16,text:'3 hab · 2 baños · 245.000 €'}),
  mk('img',{x:66,y:120,w:26,h:200,src:'ph:8',r:10}),mk('h3',{x:66,y:336,w:26,text:'Ático con terraza'}),mk('p',{x:66,y:376,w:26,fs:16,text:'2 hab · 2 baños · 310.000 €'})
 ]);
 const props=mkSec('Propiedades destacadas',620,[
  mk('h2',{x:8,y:40,text:'Propiedades destacadas'}),
  mk('slider',{x:8,y:120,w:84,h:380,imgs:['ph:0','ph:1','ph:2','ph:3','ph:4']}),
  mk('btntext',{x:8,y:530,w:28,text:'Pedir más información',link:{k:'page',v:'contacto',nt:false}})
 ]);
 const about=[
  mkSec('Quiénes somos',560,[
   mk('h1',{x:8,y:60,w:44,text:'Quiénes somos',fs:44}),
   mk('p',{x:8,y:150,w:42,text:'Somos una agencia familiar con más de quince años en el sector inmobiliario. Acompañamos a cada cliente desde la primera visita hasta la entrega de llaves, con trato cercano y precios claros.'}),
   mk('p',{x:8,y:310,w:42,text:'Nuestro equipo conoce cada barrio y trabaja para que encuentres una vivienda que encaje con tu vida y tu presupuesto.'}),
   mk('btn',{x:8,y:430,w:24,h:54,text:'Hablemos',link:{k:'page',v:'contacto',nt:false}}),
   mk('img',{x:56,y:60,w:36,h:430,src:'ph:13',r:12})
  ]),
  mkSec('Nuestros valores',440,[
   mk('h2',{x:8,y:40,text:'Nuestros valores'}),
   mk('icon',{x:8,y:120,icon:'heart'}),mk('h3',{x:8,y:210,w:26,text:'Cercanía'}),mk('p',{x:8,y:290,w:26,fs:16,text:'Te escuchamos y te explicamos cada paso sin tecnicismos.'}),
   mk('icon',{x:37,y:120,icon:'check'}),mk('h3',{x:37,y:210,w:26,text:'Transparencia'}),mk('p',{x:37,y:290,w:26,fs:16,text:'Honorarios claros desde el primer día, sin letra pequeña.'}),
   mk('icon',{x:66,y:120,icon:'key'}),mk('h3',{x:66,y:210,w:26,text:'Experiencia'}),mk('p',{x:66,y:290,w:26,fs:16,text:'Más de 500 viviendas gestionadas en la zona.'})
  ]),
  mkSec('Equipo',560,[
   mk('h2',{x:8,y:40,text:'Nuestro equipo'}),
   mk('img',{x:8,y:120,w:26,h:280,src:'ph:10',r:12}),mk('h3',{x:8,y:420,w:26,text:'Lucía Fernández'}),mk('p',{x:8,y:458,w:26,fs:16,text:'Dirección'}),
   mk('img',{x:37,y:120,w:26,h:280,src:'ph:11',r:12}),mk('h3',{x:37,y:420,w:26,text:'Andrés Ramos'}),mk('p',{x:37,y:458,w:26,fs:16,text:'Ventas y alquileres'}),
   mk('img',{x:66,y:120,w:26,h:280,src:'ph:12',r:12}),mk('h3',{x:66,y:420,w:26,text:'Marta Gil'}),mk('p',{x:66,y:458,w:26,fs:16,text:'Atención al cliente'})
  ])
 ];
 return {title:'Casa Verde Inmuebles',desc:'Plantilla de ejemplo para una agencia inmobiliaria',menu:true,logo:{on:true,src:'',h:38,name:true},design:clone(D0),pages:[
  mkPage('Inicio',[hero,feat,homes],'inicio'),
  mkPage('Propiedades',[props,PRESETS.gallery[2]()],'props'),
  mkPage('Quiénes somos',[...about],'nosotros'),
  mkPage('Contacto',[PRESETS.contact[2]()],'contacto')
 ]};
}


/* ===== Plantillas de web completas ===== */
const heroSec=(t,sub,btn,link,bgi,ov,o={})=>{
 const s=mkSec('Portada',o.h||520,[
  mk('h1',{x:8,y:o.y||130,w:o.w||62,text:t,color:'#ffffff',fs:o.fs||50,align:o.align||'left'}),
  mk('p',{x:8,y:(o.y||130)+185,w:o.pw||50,text:sub,color:'#ffffff',fs:19,align:o.align||'left'}),
  ...(btn?[mk('btn',{x:8,y:(o.y||130)+275,w:24,h:56,text:btn,bgc:o.bb||'c2',color:o.bc||'#1f2937',link:{k:'page',v:link,nt:false}})]:[])
 ],'c1',bgi);s.ov=ov;return s;
};
function tplBase(title,design,pages,opt={}){
 const S0={title,desc:opt.desc||'',menu:true,logo:{on:true,src:'',h:38,name:true},design:Object.assign(clone(D0),design),pages};
 S0.header=makeHeader();S0.footer=makeFooter();
 if(opt.noMenu)S0.header.hidden=true;
 if(opt.foot){const ps=S0.footer.els.filter(e=>e.t==='p');if(ps[0])ps[0].text=opt.foot;}
 return S0;
}
function tplLujo(){
 const S0=tplBase('Residencial Alta',{c1:'#a8864f',c2:'#1c1917',bg:'#fbf9f5',ink:'#1c1917',fh:'cormorant',fb:'lora',hs:110,r:2},[
  mkPage('Inicio',[heroSec('Viviendas singulares, trato exclusivo','Selección privada de propiedades excepcionales en las mejores zonas.','Ver colección','props','ph:3',45,{align:'left',fs:54,bb:'c1',bc:'#ffffff'}),SEC.props3(),SEC.quotes(),SEC.cta_photo()],'inicio'),
  mkPage('Colección',[SEC.t_center(),SEC.props3(),SEC.props_slide()],'props'),
  mkPage('La firma',[SEC.about_us(),SEC.team()],'nosotros'),
  mkPage('Contacto',[SEC.contact_info(),SEC.contact_form()],'contacto')
 ],{foot:'Asesoramiento inmobiliario privado y de confianza.'});
 S0.footer.bg='c2';return S0;
}
function tplAgente(){
 const hero=mkSec('Presentación',540,[
  mk('h1',{x:8,y:90,w:48,text:'Hola, soy tu agente inmobiliario de confianza',fs:44}),
  mk('p',{x:8,y:330,w:44,text:'Te acompaño en todo el proceso de compra o venta de tu casa. Sin prisas, sin letra pequeña y con respuestas claras.'}),
  mk('btn',{x:8,y:430,w:26,h:56,text:'Hablamos',link:{k:'page',v:'inicio',nt:false}}),
  mk('img',{x:58,y:50,w:34,h:440,src:'ph:10',r:14})
 ]);
 return tplBase('Tu Nombre · Agente inmobiliario',{c1:'#2a5d9f',c2:'#f59e0b',bg:'#ffffff',ink:'#1f2937',fh:'montserrat',fb:'nunito',r:14},[
  mkPage('Inicio',[hero,SEC.counters(),SEC.props3(),SEC.quotes(),SEC.contact_form()],'inicio')
 ],{noMenu:true,foot:'Agente inmobiliario independiente. Pide tu valoración gratuita.'});
}
function tplObra(){
 const hero=heroSec('Tu nuevo hogar, ya en marcha','Promoción de viviendas de 2 y 3 dormitorios con garaje, trastero y zonas comunes.','Quiero información','inicio','ph:7',45,{fs:52,bb:'c2',bc:'#ffffff'});
 return tplBase('Residencial Nuevo',{c1:'#0b3d6b',c2:'#ff7a1a',bg:'#ffffff',ink:'#14202e',fh:'oswald',fb:'opensans',r:6},[
  mkPage('Promoción',[hero,SEC.counters(),SEC.cards3(),SEC.gal3(),SEC.faq(),SEC.contact_form()],'inicio')
 ],{noMenu:true,foot:'Promoción de obra nueva. Infórmate sin compromiso.'});
}
function tplVacacional(){
 return tplBase('Casas del Sol',{c1:'#e0742c',c2:'#0f8b8d',bg:'#fffaf4',ink:'#2b2118',fh:'quicksand',fb:'nunito',hs:105,r:18},[
  mkPage('Inicio',[heroSec('Tu escapada, a un paso del mar','Apartamentos y casas para unas vacaciones sin complicaciones.','Ver alojamientos','props','ph:1',35,{bb:'c1',bc:'#ffffff'}),SEC.cards3(),SEC.gal3(),SEC.quotes()],'inicio'),
  mkPage('Alojamientos',[SEC.t_center(),SEC.props3(),SEC.search()],'props'),
  mkPage('Contacto',[SEC.contact_info(),SEC.contact_form()],'contacto')
 ],{foot:'Alquiler vacacional con trato cercano y reserva directa.'});
}
const TPLS=[
 ['inmo','Inmobiliaria clásica','Cuatro páginas: inicio, propiedades, quiénes somos y contacto',['#0f6e8c','#e0a030','#ffffff'],()=>tplInmo()],
 ['lujo','Inmobiliaria de lujo','Estilo elegante, tipografía con serifa y tonos dorados',['#a8864f','#1c1917','#fbf9f5'],()=>tplLujo()],
 ['agente','Agente independiente','Una sola página personal, directa y con formulario',['#2a5d9f','#f59e0b','#ffffff'],()=>tplAgente()],
 ['obra','Promoción de obra nueva','Una página para captar contactos de una promoción',['#0b3d6b','#ff7a1a','#ffffff'],()=>tplObra()],
 ['vac','Alquiler vacacional','Colores cálidos, alojamientos y contacto',['#e0742c','#0f8b8d','#fffaf4'],()=>tplVacacional()],
 ['blank','Web en blanco','Empieza de cero con una portada',['#0f6e8c','#e0a030','#ffffff'],()=>tplBlank()]
];
