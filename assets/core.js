/* ============ الاتصال بقاعدة البيانات ============ */
const SB_URL='https://nqknqogtistvsuypbxsi.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xa25xb2d0aXN0dnN1eXBieHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MzI2NDIsImV4cCI6MjEwOTIwODY0Mn0.gcYcB41PB2gUYBtiJQ8V5_TIodPaFYAGrYntWmMs61Y';
const ERR_AR={bad_code:'الرمز غير صحيح',locked:'هذا اليوم معتمد، ولا يعدِّله إلا القائدة',not_owner:'هذه الحلقة ليست من حلقاتكِ',taken:'أخذت هذه الحلقة مشرفة أخرى قبلكِ',no_name:'اختاري اسمكِ أولًا',short:'الرمز قصير جدًا',too_big:'البيانات أكبر من المسموح',net:'تعذَّر الاتصال، تأكَّدي من الإنترنت وحاولي مرَّة أخرى'};
async function rpc(fn,args){
  let r;try{r=await fetch(SB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(args||{})})}catch(e){throw new Error(ERR_AR.net)}
  const j=await r.json().catch(()=>null);
  if(!r.ok){const m=(j&&j.message)||'net';throw new Error(ERR_AR[m]||ERR_AR.net)}
  return j;
}
function lsGet(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

/* ============ الحساب (يُحسب هنا ويُرسل ناتجه للقاعدة) ============ */
function cStamp(n){return n>=5?{k:'gold',t:'ختم ذهبي',c:'#e9c46a'}:n>=4?{k:'silver',t:'ختم فضِّي',c:'#cfd6e6'}:n>=3?{k:'bronze',t:'ختم نحاسي',c:'#c98a5a'}:{k:'none',t:'بلا ختم',c:'#6b6788'}}
function blankC(){return {att:{},nisab:{},indiv:{},group:0,riddle:0,teacher:false,supervisor:false}}
function blankH(){return {att:{},nisab:{},play:{},help:{},shield:false}}
function cSteps(p,girls,th,day){p=Object.assign(blankC(),p||{});th=(th||90)/100;
  const pres=girls.filter(n=>p.att[n]==='on'||p.att[n]==='late'),on=girls.filter(n=>p.att[n]==='on'),nis=pres.filter(n=>p.nisab[n]);
  const r={water:girls.length>0&&pres.length/girls.length>=th,speed:pres.length>0&&on.length/pres.length>=th,food:pres.length>0&&nis.length/pres.length>=th,safe:p.group===2,guide:day==='thu'?!!p.supervisor:!!(p.teacher&&p.supervisor),
    info:{water:`${AR(pres.length)} من ${AR(girls.length)}`,speed:`${AR(on.length)} من ${AR(pres.length)}`,food:`${AR(nis.length)} من ${AR(pres.length)}`}};
  r.n=C_STEPS.filter(s=>r[s.k]).length;return r}
function stepsOf(day){return day==='thu'?C_STEPS_THU:C_STEPS}
function attLbl(day){return day==='thu'?ATT_LBL.thu:ATT_LBL.def}
function cGems(p,girls){if(!p)return 0;p=Object.assign(blankC(),p);return girls.filter(n=>p.indiv&&p.indiv[n]&&p.att[n]!=='abs').length+(p.riddle===2?1:0)}
function hGems(p,kids){if(!p)return 0;return kids.filter(n=>p.play&&p.play[n]).length}
function cIndivState(p,girls){if(!p)return 0;p=Object.assign(blankC(),p);const pres=girls.filter(n=>p.att[n]==='on'||p.att[n]==='late'),d=pres.filter(n=>p.indiv[n]).length;return d===0?0:(d>=pres.length&&pres.length?2:1)}
function kPts(p,n){if(!p)return 0;p=Object.assign(blankH(),p);let s=0;if(p.att[n]==='on')s+=1;else if(p.att[n]==='late')s+=.5;if(p.nisab[n])s+=1;if(p.play[n])s+=1;return s}
function hHoney(p,kids){return kids.length?kids.reduce((a,k)=>a+kPts(p,k),0)/(kids.length*3):0}
function kStage(t){let s=0;H_STAGE_AT.forEach((v,i)=>{if(t>=v)s=i});return s}
const PETALS=['#ffcfa8','#b9ecd2','#bfe3ff','#ffb6cb','#ffc94d'];

/* ============ يوم الأسبوع والمحطات ============ */
function weekIdx(){const t=new Date(),s=new Date(EV_START+'T00:00:00');const d=Math.floor((new Date(t.getFullYear(),t.getMonth(),t.getDate())-new Date(s.getFullYear(),s.getMonth(),s.getDate()))/864e5);return d<0?-1:d>4?5:d}
function dayDate(i){const s=new Date(EV_START+'T00:00:00');s.setDate(s.getDate()+i);return s.toLocaleDateString('ar',{day:'numeric',month:'long'})}
function stationOf(steps){return Math.min(4,Math.floor((steps||0)/5))}
function totalSteps(c){return DAYS.reduce((a,d)=>a+((c.days&&c.days[d])?c.days[d].s:0),0)}
function totalGems(c){return DAYS.reduce((a,d)=>a+((c.days&&c.days[d])?(c.days[d].g||0):0),0)}
function totalHoney(c){return DAYS.reduce((a,d)=>a+((c.days&&c.days[d])?c.days[d].h:0),0)/5}
function lastClosedDay(list){for(let i=4;i>=0;i--){if(list.some(c=>c.days&&c.days[DAYS[i]]))return DAYS[i]}return null}

/* ============ رسوم تعتمد على الحالة ============ */
function seal(i,st,stamp,id){const d=DAYS[i],gem=C[d].gem;id=id||('s'+d+Math.random().toString(36).slice(2,6));
  return `<svg class="seal" viewBox="-30 -30 60 60" aria-hidden="true"><defs><radialGradient id="${id}" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".35" stop-color="${gem}"/><stop offset="1" stop-color="#0c0b26"/></radialGradient></defs>
  <path d="M0 -28 L7 -17 L20 -20 L17 -7 L28 0 L17 7 L20 20 L7 17 L0 28 L-7 17 L-20 20 L-17 7 L-28 0 L-17 -7 L-20 -20 L-7 -17Z" fill="${stamp?stamp.c:'#c9a45c'}" ${st==='todo'?'opacity=".55"':''}/>
  <circle r="15" fill="url(#${id})"/>${st==='done'?`<path d="M-6 0 l4 5 l9-10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`:`<text y="6" text-anchor="middle" font-family="Aref Ruqaa,serif" font-size="17" fill="#fff">${AR(i+1)}</text>`}</svg>`}
const MAP_PTS=[[78,372],[128,272],[238,196],[278,132],[306,62]];
/* خريطة السباق: على كل محطة عدد القوافل الواصلة إليها */
function raceMap(counts,mineIdx){
  const pts=MAP_PTS;let path=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<5;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i];path+=` Q${(x0+x1)/2+18} ${(y0+y1)/2+10} ${x1} ${y1}`}
  const nodes=DAYS.map((d,i)=>{const [x,y]=pts[i],s=C[d],n=counts[i]||0,lx=i===0?x+24:x<200?x+24:x-32,anchor=x<200||i===0?'start':'end',mine=i===mineIdx;
    return `<g class="node" role="button" tabindex="0" aria-label="${s.place}: ${AR(n)} قافلة" onclick="openStation(${i})" onkeydown="if(event.key==='Enter')openStation(${i})">
     ${mine?`<circle cx="${x}" cy="${y}" r="24" fill="none" stroke="#f3dfa8" stroke-width="2" class="pulse"/>`:''}
     <circle cx="${x}" cy="${y}" r="17" fill="${n?'#e9c46a':'#1c1a4d'}" stroke="#e9c46a" stroke-width="2"/>
     ${n?`<text x="${x}" y="${y+5}" text-anchor="middle" font-size="${n>99?11:14}" font-weight="700" fill="#1c1a4d">${AR(n)}</text>`:''}
     <text x="${lx}" y="${y-4}" text-anchor="${anchor}" font-family="Aref Ruqaa, Amiri, serif" font-size="17" fill="#f3dfa8">${s.place}</text>
     <text x="${lx}" y="${y+14}" text-anchor="${anchor}" font-size="11.5" fill="#b5b0d3">${n===0?'لا قوافل بعد':n===1?'قافلة واحدة':n===2?'قافلتان':AR(n)+' قافلة'}</text></g>`}).join('');
  const cp=mineIdx>=0?pts[mineIdx]:null;
  return `<svg viewBox="0 0 360 430" direction="ltr" style="direction:ltr" role="img" aria-label="خريطة سباق القوافل">
  <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1a50"/><stop offset="1" stop-color="#14123f"/></linearGradient>
  <pattern id="dn" width="60" height="26" patternUnits="userSpaceOnUse"><path d="M0 20 q15-10 30 0 t30 0" fill="none" stroke="#e9c46a" stroke-opacity=".06" stroke-width="1.2"/></pattern></defs>
  <rect width="360" height="430" fill="url(#mg)"/><rect width="360" height="430" fill="url(#dn)"/>
  <path d="M0 0 H34 C26 120 46 240 30 430 H0Z" fill="#0d1a3e"/><text x="18" y="250" transform="rotate(-90 18 250)" text-anchor="middle" font-size="10.5" fill="#8fa6d8">المحيط الأطلسي</text>
  <path d="M200 120 q30-30 80-24 q40 6 60 -10 L360 0 V160 q-40-10-70 10 q-40 20-90 -50z" fill="#2a2462" opacity=".55"/><text x="330" y="190" text-anchor="end" font-size="11" fill="#b5b0d3" opacity=".8">هضبة آدرار</text>
  <g transform="translate(300 380)"><circle r="20" fill="none" stroke="#e9c46a" stroke-opacity=".5"/><path d="M0 -24 L5 0 L0 24 L-5 0Z" fill="#e9c46a" opacity=".8"/><text y="-28" text-anchor="middle" font-size="11" fill="#e9c46a">ش</text></g>
  <path d="${path}" fill="none" stroke="rgba(233,196,106,.14)" stroke-width="10" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#e9c46a" stroke-width="2" stroke-dasharray="4 6"/>${nodes}
  ${cp?`<g transform="translate(${cp[0]+16} ${cp[1]-50}) scale(.7)" fill="#f3dfa8">${camel()}</g>`:''}</svg>`}
/* قرص العسل الكبير: كل حلقة خليَّة */
function honeycomb(list,mineId){
  const per=3,s=50,w=s*Math.sqrt(3),rows=Math.ceil(list.length/per),W=per*w+w/2+10,H=rows*s*1.5+s*.6+10;
  let g='';list.forEach((c,i)=>{const r=Math.floor(i/per),col=i%per,x=w/2+5+col*w+(r%2?w/2:0),y=s+5+r*s*1.5,pct=Math.round(totalHoney(c)*100),mine=c.id===mineId;
    const pts=[];for(let k=0;k<6;k++){const a=Math.PI/180*(60*k-30);pts.push((x+(s-3)*Math.cos(a)).toFixed(1)+','+(y+(s-3)*Math.sin(a)).toFixed(1))}
    const top=y-(s-3)+((s-3)*2)*(1-pct/100);
    g+=`<g><clipPath id="hc${c.id}"><polygon points="${pts.join(' ')}"/></clipPath><polygon points="${pts.join(' ')}" fill="#fffbf0"/>
    <rect x="${x-s}" y="${top.toFixed(1)}" width="${s*2}" height="${s*2}" fill="url(#honeyG)" clip-path="url(#hc${c.id})"/>
    <polygon points="${pts.join(' ')}" fill="none" stroke="${mine?'#ff9f43':'#ffd59a'}" stroke-width="${mine?5:3}"/>
    <text x="${x}" y="${y-2}" text-anchor="middle" font-family="Baloo Bhaijaan 2,Tajawal,sans-serif" font-weight="800" font-size="13" fill="#5a3f8e">${esc(c.name)}</text>
    <text x="${x}" y="${y+16}" text-anchor="middle" font-family="Baloo Bhaijaan 2,Tajawal,sans-serif" font-weight="800" font-size="12" fill="#ff8a1f">${AR(pct)}٪</text></g>`});
  return `<svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" direction="ltr" style="direction:ltr;width:100%;height:auto" role="img" aria-label="قرص العسل الكبير"><defs><linearGradient id="honeyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#ffb84d"/></linearGradient></defs>${g}</svg>`}
function gardenWeek(){
  const X=[312,244,178,112,46],Y=[210,170,214,168,206],cur=weekIdx();
  let path=`M${X[0]} ${Y[0]+16}`;for(let i=1;i<5;i++)path+=` Q${(X[i-1]+X[i])/2} ${(Y[i-1]+Y[i])/2+40} ${X[i]} ${Y[i]+16}`;
  const spots=DAYS.map((d,i)=>{const st=i<cur?'done':i===cur?'cur':'todo',stage=st==='done'?4:st==='cur'?2:0;
    const art=d==='thu'?`<g transform="translate(-26 -30) scale(.78)">${jarSvg(st==='done'?15:st==='cur'?7:2)}</g>`:flowerStage(stage,H[d].petal).replace(/<svg[^>]*>/,'<g>').replace('</svg>','</g>');
    return `<g class="spot" role="link" tabindex="0" aria-label="${DAY_AR[d]}: ${H[d].title}" onclick="go('hive-${d}')" onkeydown="if(event.key==='Enter')go('hive-${d}')" transform="translate(${X[i]-30} ${Y[i]-52})">
    ${st==='cur'?'<circle cx="30" cy="40" r="34" fill="#fff" opacity=".55"/>':''}<g transform="translate(30 30) scale(.82)">${art}</g>
    <rect x="-4" y="76" width="68" height="22" rx="11" fill="#fff" opacity=".92"/><text x="30" y="92" text-anchor="middle" font-family="Baloo Bhaijaan 2,Tajawal,sans-serif" font-weight="800" font-size="12" fill="#5a3f8e">${DAY_AR[d]}</text></g>`}).join('');
  const bp=cur>=0?[X[cur],Y[cur]]:null;
  return `<svg viewBox="0 0 360 300" direction="ltr" style="direction:ltr" role="img" aria-label="حديقة الأسبوع"><defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ecff"/><stop offset="1" stop-color="#eefaff"/></linearGradient></defs>
  <rect width="360" height="300" fill="url(#gs)"/><circle cx="58" cy="52" r="26" fill="#fff3a8"/><circle cx="58" cy="52" r="38" fill="#fff3a8" opacity=".35"/>
  <g fill="#fff"><ellipse cx="250" cy="48" rx="34" ry="12"/><ellipse cx="236" cy="40" rx="16" ry="14"/><ellipse cx="262" cy="38" rx="20" ry="16"/><ellipse cx="150" cy="78" rx="26" ry="9" opacity=".9"/></g>
  <path d="M0 160 C80 120 160 150 220 130 C280 112 330 130 360 120 V300 H0Z" fill="#c7f1d9"/><path d="M0 200 C90 170 170 200 250 180 C310 166 340 178 360 172 V300 H0Z" fill="#aee8c8"/>
  <path d="${path}" fill="none" stroke="#fffbf0" stroke-width="12" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#ffd59a" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>
  ${spots}${bp?`<g transform="translate(${bp[0]+12} ${bp[1]-92}) scale(.42)">${bee().replace(/<svg[^>]*>/,'<g>').replace(/<\/svg>$/,'</g>')}</g>`:''}</svg>`}

/* ============ النافذة والقصاصات والمؤثرات ============ */
let popCb=null;
function popup(kind,art,title,body,btn,cb){const p=$('#pop');p.className='on '+kind;popCb=cb||null;
  p.innerHTML=`<div class="card" role="dialog" aria-modal="true" aria-labelledby="popT">${art}<h3 id="popT">${title}</h3><p>${body}</p><button class="${kind==='c'?'btn-c':'btn-h'}" onclick="closePop()">${btn||'حسنًا'}</button></div>`;
  setTimeout(()=>{const b=p.querySelector('button');if(b)b.focus()},50);if(kind==='h')confetti()}
function closePop(){const p=$('#pop');p.className='';const cb=popCb;popCb=null;if(cb)cb()}
let confettiParts=[];
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const cols=['#ffb6cb','#ffc94d','#b9ecd2','#bfe3ff','#dccdff','#ffcfa8'];
  for(let i=0;i<70;i++)confettiParts.push({x:innerWidth/2+(Math.random()-.5)*120,y:innerHeight*.35,vx:(Math.random()-.5)*7,vy:-Math.random()*8-3,c:pick(cols),r:3+Math.random()*4,life:90+Math.random()*40,s:Math.random()<.5})}
function startFx(){const c=$('#fx'),x=c.getContext('2d');let W,H,P=[];const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);P=[];const n=Math.round(W*H/7000);for(let i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,r:.4+Math.random()*1.3,p:Math.random()*6.28,s:.5+Math.random()*1.4,v:.05+Math.random()*.12})}
  function draw(t){x.clearRect(0,0,W,H);const th=document.body.className;
    if(th==='t-caravan'||th==='t-home'){for(const s of P){x.globalAlpha=still?.6:.25+.75*(.5+.5*Math.sin(t/1000*s.s+s.p));x.fillStyle=s.r>1.3?'#f3dfa8':'#fff';x.beginPath();x.arc(s.x,s.y*.75,s.r*.8,0,6.283);x.fill()}}
    else if(th==='t-hive'){const cols=['#ffc94d','#ffb6cb','#bfe3ff','#dccdff'];P.forEach((s,i)=>{if(!still){s.y-=s.v;s.x+=Math.sin(t/1500+s.p)*.2;if(s.y<-4){s.y=H+4;s.x=Math.random()*W}}if(i%3)return;x.globalAlpha=.5+.4*Math.sin(t/900*s.s+s.p);x.fillStyle=cols[i%4];x.beginPath();x.arc(s.x,s.y,s.r*1.4,0,6.283);x.fill()})}
    x.globalAlpha=1;confettiParts=confettiParts.filter(p=>p.life-->0);for(const p of confettiParts){p.vy+=.18;p.x+=p.vx;p.y+=p.vy;x.fillStyle=p.c;if(p.s){x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill()}else x.fillRect(p.x,p.y,p.r*1.6,p.r)}
    requestAnimationFrame(draw)}
  size();requestAnimationFrame(draw);addEventListener('resize',size)}
