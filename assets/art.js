/* أدوات ورسوم مشتركة */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),2000)}
function baseUrl(){return location.href.split('#')[0]}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('تمَّ النسخ')}catch(e){toast('حدِّدي النصَّ وانسخيه يدويًا')}}
function go(h){location.hash=h}
function setTheme(t){document.body.className='t-'+t;$('#clouds').classList.toggle('hide',t!=='hive')}
const STATE_AR={todo:'لم تبدأ',doing:'قيد الإنجاز',done:'مكتملة'};
const ST3=['todo','doing','done'];
function stateChip(s){return `<span class="state s-${s}">${STATE_AR[s]}</span>`}

/* ============================== رسوم القافلة ============================== */
const camelP='M2 22 q2-10 10-12 q4-8 10-2 q4-6 10 0 q6 0 8 4 l6-6 q3-2 4 1 l-2 4 q-3 4-6 6 q-2 4-6 5 l1 12 h-3 l-2-10 h-12 l-1 10 h-3 l0-11 q-3-1-4 0 l-1 11 h-3z';
function camel(f){return `<path d="${camelP}" fill="${f||'currentColor'}"/>`}
function minaret(c1,c2){c1=c1||'#7a4a2c';c2=c2||'#5c331c';return `<g><path d="M2 150 L6 26 H34 L38 150Z" fill="${c1}"/><path d="M6 44 H34 M5 62 H35 M5 80 H35 M4 98 H36 M4 116 H36 M3 134 H37" stroke="${c2}" stroke-width="2"/><rect x="17" y="50" width="6" height="12" rx="3" fill="#1b1230"/><rect x="17" y="86" width="6" height="12" rx="3" fill="#1b1230"/><rect x="3" y="18" width="34" height="10" fill="${c1}"/><path d="M3 18 L6 6 L9 18Z M14 18 L17 6 L20 18Z M20 18 L23 6 L26 18Z M31 18 L34 6 L37 18Z" fill="${c1}"/><g fill="#fbf3e2"><ellipse cx="6" cy="4" rx="2.6" ry="3.4"/><ellipse cx="17" cy="4" rx="2.6" ry="3.4"/><ellipse cx="23" cy="4" rx="2.6" ry="3.4"/><ellipse cx="34" cy="4" rx="2.6" ry="3.4"/></g></g>`}
function palm(f){return `<g fill="${f||'#120f2e'}"><path d="M10 60 q-2-26 2-44 q2 22 2 44z"/><path d="M12 16 q-14-6-22 4 q10-4 22-2z M12 16 q14-8 24 2 q-12-4-24 0z M12 16 q-6-12-18-10 q10 2 18 12z M12 16 q8-12 20-10 q-12 2-20 12z"/></g>`}
function ksar(x,y,s,f){return `<g transform="translate(${x} ${y}) scale(${s})" fill="${f}"><rect x="0" y="20" width="40" height="30"/><rect x="34" y="8" width="26" height="42"/><rect x="58" y="26" width="34" height="24"/><g fill="#0c0b26" opacity=".6"><rect x="8" y="30" width="4" height="7"/><rect x="42" y="18" width="4" height="7"/><rect x="70" y="34" width="4" height="7"/></g><path d="M34 8 l3-4 l3 4 l3-4 l3 4 l3-4 l3 4 l3-4 l3 4" fill="${f}"/></g>`}
function starsField(w,h,n,seed){let s='',r=seed||7;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};for(let i=0;i<n;i++)s+=`<circle cx="${(rnd()*w).toFixed(1)}" cy="${(rnd()*h).toFixed(1)}" r="${(.4+rnd()*1.1).toFixed(2)}" fill="#fff" opacity="${(.35+rnd()*.6).toFixed(2)}"/>`;return s}
function cHeroScene(h){h=h||250;const b=h;return `<svg viewBox="0 0 400 ${h}" preserveAspectRatio="xMidYMax slice" role="img" aria-label="قافلة تسير في الصحراء نحو مئذنة شِنقيط">
<defs><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0e2c"/><stop offset=".6" stop-color="#232064"/><stop offset="1" stop-color="#5a3f6e"/></linearGradient>
<radialGradient id="hm"><stop offset="0" stop-color="#f3dfa8" stop-opacity=".5"/><stop offset="1" stop-color="#f3dfa8" stop-opacity="0"/></radialGradient>
<linearGradient id="hd1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98a52"/><stop offset="1" stop-color="#7a5532"/></linearGradient>
<linearGradient id="hd2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2bd84"/><stop offset="1" stop-color="#b98a52"/></linearGradient></defs>
<rect width="400" height="${h}" fill="url(#hs)"/>${starsField(400,h*.6,46,11)}
<circle cx="86" cy="60" r="70" fill="url(#hm)"/><circle cx="86" cy="60" r="21" fill="#f6e4b2"/><circle cx="94" cy="55" r="18" fill="#1d1b55" opacity=".18"/>
${ksar(206,b-122,.95,'#3a2a4a')}${ksar(300,b-112,.75,'#33264a')}
<g transform="translate(262 ${b-170}) scale(.92)">${minaret('#6d4430','#4f2d1d')}</g>
<g transform="translate(184 ${b-108}) scale(.9)">${palm('#1b1638')}</g><g transform="translate(370 ${b-100}) scale(.8)">${palm('#1b1638')}</g>
<path d="M0 ${b-58} C70 ${b-86} 150 ${b-74} 220 ${b-56} C300 ${b-38} 350 ${b-58} 400 ${b-54} V${b} H0Z" fill="url(#hd1)"/>
<path d="M0 ${b-30} C90 ${b-52} 180 ${b-40} 250 ${b-26} C330 ${b-12} 370 ${b-26} 400 ${b-24} V${b} H0Z" fill="url(#hd2)"/>
<g transform="translate(40 ${b-92})" fill="#1d1208">${camel()}</g><g transform="translate(84 ${b-86}) scale(.88)" fill="#1d1208">${camel()}</g><g transform="translate(122 ${b-80}) scale(.76)" fill="#1d1208">${camel()}</g>
<path d="M20 ${b-58} q70 -10 140 4" stroke="#f3dfa8" stroke-width="1.4" stroke-dasharray="2 5" fill="none" opacity=".6"/></svg>`}
/* الخريطة: الغرب يسار والمحيط على الحافَّة اليسرى كما في الخرائط */
const C_BADGE_ICON={
 water:'<path d="M0 -12 C6 -4 9 1 9 5 a9 9 0 0 1 -18 0 c0-4 3-9 9-17z" fill="#7fd0e8"/>',
 speed:'<g fill="#f3dfa8"><path d="M-10 4 l8 -12 l2 8 l8 -2 l-8 12 l-2 -8z"/></g>',
 food:'<g fill="#e9a857"><ellipse cx="-4" cy="2" rx="5" ry="8" transform="rotate(-20 -4 2)"/><ellipse cx="5" cy="1" rx="5" ry="8" transform="rotate(20 5 1)"/></g>',
 safe:'<g fill="#f3dfa8"><circle cx="-5" cy="-2" r="5"/><circle cx="5" cy="-2" r="5"/><path d="M-12 10 q12-10 24 0z"/></g>',
 guide:'<path d="M0 -12 L3 -3 L12 -3 L5 3 L8 12 L0 6 L-8 12 L-5 3 L-12 -3 L-3 -3Z" fill="#f3dfa8"/>',
 riddle:'<g fill="none" stroke="#f3dfa8" stroke-width="2.4"><circle cx="-3" cy="-3" r="6"/><path d="M1 1 l9 9 M6 6 l3-3"/></g>',
 present:'<g fill="#f3dfa8"><path d="M-9 8 l9 -18 l9 18z"/></g>',
 ontime:'<g fill="none" stroke="#f3dfa8" stroke-width="2.2"><circle r="9"/><path d="M0 -5 v5 l4 3"/></g>',
 nisab:'<g fill="#f3dfa8"><rect x="-8" y="-9" width="16" height="18" rx="2"/><path d="M-5 -4 h10 M-5 0 h10 M-5 4 h6" stroke="#1c1a4d" stroke-width="1.5"/></g>',
 indiv:'<g fill="#f3dfa8"><path d="M0 9 C-14 0 -8 -12 0 -5 C8 -12 14 0 0 9z"/></g>',
};
function cBadgeSvg(k,on){return `<svg viewBox="-22 -22 44 44" aria-hidden="true"><circle r="20" fill="${on?'#2a2470':'#1c1a4d'}" stroke="${on?'#e9c46a':'#5f5a86'}" stroke-width="2"/><circle r="15.5" fill="none" stroke="${on?'#e9c46a':'#5f5a86'}" stroke-opacity=".5" stroke-dasharray="2 3"/>${C_BADGE_ICON[k]||''}</svg>`}
function discoverIcon(){return `<svg viewBox="-20 -20 40 40" aria-hidden="true"><rect x="-15" y="-9" width="30" height="20" rx="3" fill="#8d6a2f"/><rect x="-15" y="-13" width="30" height="7" rx="2" fill="#c9a45c"/><rect x="-3" y="-8" width="6" height="7" rx="1" fill="#f3dfa8"/></svg>`}
function transScene(){return `<svg viewBox="0 0 400 150" aria-hidden="true"><defs><linearGradient id="td" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8b47a"/><stop offset="1" stop-color="#8a6235"/></linearGradient></defs>
${starsField(400,80,30,3)}<path d="M0 104 C80 86 160 96 240 106 C320 116 360 100 400 102 V150 H0Z" fill="url(#td)"/>
<g class="walk"><g transform="translate(0 66)" fill="#120c06">${camel()}</g><g transform="translate(44 70) scale(.88)" fill="#120c06">${camel()}</g><g transform="translate(84 74) scale(.76)" fill="#120c06">${camel()}</g></g></svg>`}

/* ============================== رسوم الخليَّة (نحلة زخرفية بلا وجه) ============================== */
function bee(cls){return `<svg class="bee ${cls||''}" viewBox="-60 -56 120 112" aria-hidden="true"><g class="bee-bob">
<defs><linearGradient id="bb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset=".55" stop-color="#ffd24d"/><stop offset="1" stop-color="#ffb23e"/></linearGradient>
<linearGradient id="bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#d7ecff" stop-opacity=".75"/></linearGradient></defs>
<g class="wing"><ellipse cx="-6" cy="-26" rx="14" ry="21" transform="rotate(-30 -6 -26)" fill="url(#bw)" stroke="#b9dcff" stroke-width="2"/><path d="M-10 -34 q4 8 2 16" stroke="#cfe6ff" stroke-width="1.5" fill="none"/><circle cx="-12" cy="-38" r="2.2" fill="#ffc7da"/></g>
<g class="wing"><ellipse cx="16" cy="-24" rx="12" ry="18" transform="rotate(24 16 -24)" fill="url(#bw)" stroke="#b9dcff" stroke-width="2"/><path d="M18 -32 q-3 7 -2 14" stroke="#cfe6ff" stroke-width="1.5" fill="none"/><circle cx="20" cy="-34" r="2" fill="#b9ecd2"/></g>
<ellipse cx="2" cy="8" rx="40" ry="28" fill="url(#bb)" stroke="#ffb23e" stroke-width="3"/>
<path d="M-12 -18 q-8 26 0 52" stroke="#ffa53a" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
<path d="M10 -19 q8 27 0 54" stroke="#ffa53a" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
<path d="M-26 -6 q8 -6 16 -2" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
<path d="M42 10 l10 2 l-10 4z" fill="#ffb23e"/>
<path d="M-34 -10 q-10 -18 -6 -30" stroke="#ff9f43" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-40" cy="-41" r="4.5" fill="#ff8fb4"/>
<path d="M-28 -16 q-4 -18 4 -28" stroke="#ff9f43" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-24" cy="-45" r="4.5" fill="#a8d8ff"/>
<g fill="#ffc7da"><path d="M44 -30 l2 5 l5 2 l-5 2 l-2 5 l-2-5 l-5-2 l5-2z"/></g><g fill="#b9dcff"><path d="M-50 18 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6-4 l-4-1.6 l4-1.6z"/></g><g fill="#dccdff"><path d="M30 38 l1.4 3.5 l3.5 1.4 l-3.5 1.4 l-1.4 3.5 l-1.4-3.5 l-3.5-1.4 l3.5-1.4z"/></g>
</g></svg>`}
function sparkle(x,y,s,c){return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -6 l1.6 4.4 l4.4 1.6 l-4.4 1.6 l-1.6 4.4 l-1.6-4.4 l-4.4-1.6 l4.4-1.6z" fill="${c}"/>`}
function flowerStage(st,petal,cls){petal=petal||'#ffb6cb';
  const mound=`<ellipse cx="0" cy="34" rx="26" ry="9" fill="#9fe0bf"/><ellipse cx="-6" cy="31" rx="12" ry="4" fill="#c4f0d8"/>`;
  let g='';
  if(st===0)g=`${mound}<ellipse cx="0" cy="27" rx="6" ry="4.5" fill="#ffcfa8" stroke="#ffb07a" stroke-width="1.5"/>`;
  else{const stem=`<path d="M0 32 C-2 18 2 8 0 ${st===1?14:-2}" stroke="#5fc48f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M0 22 C-12 16 -16 22 -16 22 C-8 28 -2 26 0 22z" fill="#7fd9a8"/><path d="M0 18 C12 10 18 16 18 16 C10 24 2 22 0 18z" fill="#7fd9a8"/>`;
    if(st===1)g=`${mound}${stem}`;
    else if(st===2)g=`${mound}${stem}<path d="M0 -14 C-9 -6 -7 4 0 4 C7 4 9 -6 0 -14z" fill="${petal}" stroke="#fff" stroke-width="1.5"/>`;
    else{const n=st===3?5:8,R=st===3?9:13,pr=st===3?7:9;let pet='';for(let i=0;i<n;i++){const a=i/n*Math.PI*2;pet+=`<ellipse cx="${(Math.cos(a)*R).toFixed(1)}" cy="${(-6+Math.sin(a)*R).toFixed(1)}" rx="${pr}" ry="${pr*.75}" transform="rotate(${(a*180/Math.PI).toFixed(0)} ${(Math.cos(a)*R).toFixed(1)} ${(-6+Math.sin(a)*R).toFixed(1)})" fill="${petal}" stroke="#fff" stroke-width="1.2"/>`}
      g=`${mound}${stem}${pet}<circle cx="0" cy="-6" r="${st===3?6:8}" fill="#ffd24d" stroke="#ffb23e" stroke-width="2"/><circle cx="-2" cy="-8" r="2" fill="#fff" opacity=".8"/>${st===4?sparkle(-24,-20,1,'#ffc94d')+sparkle(24,-24,.8,'#a8d8ff')+sparkle(20,6,.6,'#ffb6cb'):''}`}}
  return `<svg class="${cls||''}" viewBox="-36 -40 72 84" aria-hidden="true">${g}</svg>`}
function jarSvg(p){const lvl=Math.min(1,p/15),top=86-lvl*58,id='j'+Math.random().toString(36).slice(2,7);
  return `<svg viewBox="0 0 80 100" width="70" height="88" aria-hidden="true"><defs><linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#ffb23e"/></linearGradient><clipPath id="${id}"><path d="M14 24 h52 q7 0 7 8 v52 q0 9-9 9 h-48 q-9 0-9-9 v-52 q0-8 7-8z"/></clipPath></defs>
  <rect x="18" y="8" width="44" height="13" rx="5" fill="#ffb6cb"/><rect x="22" y="11" width="10" height="3" rx="1.5" fill="#fff" opacity=".7"/>
  <path d="M14 24 h52 q7 0 7 8 v52 q0 9-9 9 h-48 q-9 0-9-9 v-52 q0-8 7-8z" fill="#fffbf0" stroke="#ffd59a" stroke-width="3"/>
  <rect x="0" y="${top}" width="80" height="100" fill="url(#${id}h)" clip-path="url(#${id})"/><path d="M18 34 v40" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/></svg>`}
const K_BADGE_ICON={
 golden:`<g transform="scale(.55)">${'<circle r="7" fill="#ffd24d"/>'}${[0,1,2,3,4].map(i=>{const a=i/5*Math.PI*2;return `<ellipse cx="${(Math.cos(a)*11).toFixed(1)}" cy="${(Math.sin(a)*11).toFixed(1)}" rx="7" ry="5" transform="rotate(${(a*57.3).toFixed(0)} ${(Math.cos(a)*11).toFixed(1)} ${(Math.sin(a)*11).toFixed(1)})" fill="#ffc94d"/>`}).join('')}<circle r="6" fill="#ffe9a8"/></g>`,
 noabs:'<path d="M0 9 C-14 0 -8 -12 0 -5 C8 -12 14 0 0 9z" fill="#ff8fb4"/>',
 play:'<path d="M0 -11 L3 -3 L11 -3 L5 2 L7 10 L0 5 L-7 10 L-5 2 L-11 -3 L-3 -3Z" fill="#a98bff"/>',
 help:'<g fill="#5fc48f"><path d="M-4 7 C-14 0 -10 -9 -4 -4 C2 -9 6 0 -4 7z"/><path d="M5 9 C-3 3 0 -5 5 -1 C10 -5 13 3 5 9z" fill="#7fd0f0"/></g>',
 jar:'<g><rect x="-6" y="-11" width="12" height="4" rx="1.5" fill="#ffb6cb"/><path d="M-8 -6 h16 q2 0 2 3 v12 q0 3-3 3 h-14 q-3 0-3-3 v-12 q0-3 2-3z" fill="#ffc94d"/></g>',
};
function kBadgeSvg(k,on){const bg={golden:'#fff3b0',noabs:'#ffe1ea',play:'#ece4ff',help:'#dff7ea',jar:'#ffefd6'}[k];return `<svg viewBox="-22 -22 44 44" aria-hidden="true"><circle r="20" fill="${on?bg:'#f1eef7'}" stroke="#fff" stroke-width="3"/>${K_BADGE_ICON[k]}${on?sparkle(14,-14,.7,'#ffc94d'):''}</svg>`}
