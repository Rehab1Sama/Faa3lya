/* ============ صفحة الطالبات: عرض فقط ============ */
let PUB=null,PUB_ERR=null,openSt=-1;
let MINE=lsGet('ev-mine')||{girls:null,kids:null};
function setTheme(t){document.body.className='t-'+t;$('#clouds').classList.toggle('hide',t!=='hive')}
async function loadPub(){PUB_ERR=null;try{PUB=await rpc('ev_public',{})}catch(e){PUB_ERR=e.message}render()}
function girlsList(){return PUB?PUB.circles.filter(c=>c.kind==='girls'):[]}
function kidsList(){return PUB?PUB.circles.filter(c=>c.kind==='kids'):[]}
function setMine(kind,id){MINE[kind]=id?+id:null;lsSet('ev-mine',MINE);render()}
function stateOfDay(i){const w=weekIdx();return i<w?'done':i===w?'cur':'todo'}
function loadingBox(cls){return PUB_ERR?`<div class="${cls}" style="padding:16px;margin-bottom:14px"><b>${PUB_ERR}</b><button class="${cls==='puffy'?'btn-h':'btn-c'}" style="margin-top:10px" onclick="loadPub()">أعيدي المحاولة</button></div>`:`<div class="${cls}" style="padding:16px;margin-bottom:14px">جاري تحميل النتائج…</div>`}
function circleSelect(kind,list){const cur=MINE[kind];const tracks=[...new Set(list.map(c=>c.track))];
  return `<label class="sr" for="mine-${kind}">اختاري حلقتكِ</label><select id="mine-${kind}" class="mine-sel" onchange="setMine('${kind}',this.value)"><option value="">اختاري حلقتكِ</option>${tracks.map(t=>`<optgroup label="مسار ${esc(t)}">${list.filter(c=>c.track===t).map(c=>`<option value="${c.id}" ${cur===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</optgroup>`).join('')}</select>`}

function vHome(){setTheme('home');$('#app').classList.add('home');
  return `<div class="home-head"><div><b>مقرأة سنا الآي</b><span>رحلتان من الأحد إلى الخميس</span></div></div>
  <div class="home-grid">
   <a class="door door-c" href="#caravan">${cHeroScene(240).replace('<svg ','<svg class="art" ')}<div class="txt"><span class="who">للفتيات</span><h2>قافلة شِنقيط</h2><p>سباق القوافل على طريق القوافل القديم، من نواكشوط إلى مدينة المخطوطات. كل حلقة قافلة، ولا تتقدَّم إلا إذا التزمت بناتها كلهن.</p><span class="go">ادخلي السباق ←</span></div></a>
   <a class="door door-h" href="#hive">${gardenWeek().replace('<svg ','<svg class="art" ')}<div class="txt"><span class="who">للأطفال</span><h2>خليَّة سنا</h2><p>قرص عسل كبير، كل حلقة خليَّة فيه، تمتلئ عسلًا كلما حضرت نحلاتها في الوقت وأتممن نصابهن.</p><span class="go">ادخلي الحديقة ←</span></div></a>
  </div>`}

/* ---------- القافلة ---------- */
function cBar(back,crumb){return `<div class="c-bar"><button class="c-back" onclick="go('${back}')">→ رجوع</button><span class="c-crumb">${crumb||''}</span></div>`}
function openStation(i){openSt=openSt===i?-1:i;render();setTimeout(()=>{const e=document.getElementById('stlist');if(e)e.scrollIntoView({behavior:'smooth',block:'nearest'})},50)}
function board(title,rows,fmt){return `<div class="c-panelbox"><b style="font-family:var(--f-ruqaa);font-size:1.25rem;color:var(--c-gold-hi);font-weight:400">${title}</b>
  ${rows.length?`<ol class="board-c">${rows.map((c,i)=>`<li class="${c.id===MINE.girls?'me':''}"><span class="rk">${AR(i+1)}</span><span class="nm">${esc(c.name)}<small>${esc(c.track)}</small></span><span class="vl">${fmt(c)}</span></li>`).join('')}</ol>`:'<p class="c-sub">تظهر هنا بعد اعتماد أول محطة</p>'}</div>`}
function vCaravan(){setTheme('caravan');
  const list=girlsList();let body='';
  if(!PUB)body=loadingBox('c-panelbox');
  else{
    const counts=[0,0,0,0,0];list.forEach(c=>counts[stationOf(totalSteps(c))]++);
    const sorted=[...list].sort((a,b)=>totalSteps(b)-totalSteps(a)||a.name.localeCompare(b.name,'ar'));
    const me=list.find(c=>c.id===MINE.girls);
    let mineCard='';
    if(me){const t=totalSteps(me),rank=sorted.filter(c=>totalSteps(c)>t).length+1,ahead=[...sorted].reverse().find(c=>totalSteps(c)>t),st=stationOf(t);
      mineCard=`<div class="c-panelbox mine-card"><div class="c-sub">قافلة</div><div class="c-title" style="font-size:2.2rem">${esc(me.name)}</div>
      <div class="mine-stats"><div><b>${AR(t)}</b><span>خطوة من ٢٥</span></div><div><b>${AR(rank)}</b><span>الترتيب من ${AR(list.length)}</span></div><div><b>${AR(totalGems(me))}</b><span>كنز</span></div></div><p class="c-sub" style="margin-top:8px">موقعها الآن: ${t>=20?'وصلت شِنقيط':C[DAYS[st]].place}</p>
      <p class="c-sub" style="margin-top:8px">${ahead?`أمامكِ قافلة «${esc(ahead.name)}» بفارق ${(g=>g===1?'خطوة واحدة':g===2?'خطوتين':AR(g)+' خطوات')(totalSteps(ahead)-t)}. الحقي بها!`:(t>0?'قافلتكِ في المقدِّمة، حافظي على مكانها 🌿':'ابدئي الرحلة مع قافلتكِ اليوم 🌿')}</p>
      <div class="stamps">${DAYS.map((d,i)=>{const x=me.days[d];return `<div>${seal(i,x?'done':'todo',x?cStamp(x.s):null)}<span>${x?cStamp(x.s).t:DAY_AR[d]}</span></div>`}).join('')}</div></div>`}
    const ld=lastClosedDay(list);
    const golden=c=>DAYS.filter(d=>c.days[d]&&c.days[d].s>=5).length;
    const tracks=[...new Set(list.map(c=>c.track))].map(t=>{const cs=list.filter(c=>c.track===t);return{t,avg:cs.reduce((a,c)=>a+totalSteps(c),0)/cs.length,n:cs.length}}).sort((a,b)=>b.avg-a.avg);
    const stList=openSt>=0?`<div class="c-panelbox" id="stlist" style="margin-top:10px"><b style="color:var(--c-gold-hi)">القوافل في ${C[DAYS[openSt]].place}</b>${list.filter(c=>stationOf(totalSteps(c))===openSt).sort((a,b)=>totalSteps(b)-totalSteps(a)).map(c=>`<div class="st-row ${c.id===MINE.girls?'me':''}"><span>${esc(c.name)}<small>، ${esc(c.track)}</small></span><b>${AR(totalSteps(c))}</b></div>`).join('')||'<p class="c-sub">لا قوافل هنا الآن</p>'}</div>`:'';
    body=`<h2 class="c-sec">قافلتي</h2>${circleSelect('girls',list)}${mineCard}
    <h2 class="c-sec">خريطة السباق</h2>
    <div class="map">${raceMap(counts,me?stationOf(totalSteps(me)):-1)}<div class="legend"><span>الرقم على كل محطة عدد القوافل الواصلة إليها. اضغطي المحطة لتري أسماءها.</span></div></div>${stList}
    <h2 class="c-sec">لوحات الشرف</h2><div class="boards four">
    ${board('الطليعة',sorted.filter(c=>totalSteps(c)>0).slice(0,5),c=>AR(totalSteps(c))+' خطوة')}
    ${board(ld?`الأكثر تقدُّمًا يوم ${DAY_AR[ld]}`:'الأكثر تقدُّمًا اليوم',ld?[...list].filter(c=>c.days[ld]).sort((a,b)=>b.days[ld].s-a.days[ld].s||totalSteps(b)-totalSteps(a)).slice(0,5):[],c=>AR(c.days[ld].s)+' من ٥')}
    ${board('أغنى القوافل كنوزًا',[...list].filter(c=>totalGems(c)>0).sort((a,b)=>totalGems(b)-totalGems(a)||totalSteps(b)-totalSteps(a)).slice(0,5),c=>AR(totalGems(c))+' كنز')}
    ${board('الأختام الذهبية',[...list].filter(c=>golden(c)>0).sort((a,b)=>golden(b)-golden(a)||totalSteps(b)-totalSteps(a)).slice(0,5),c=>AR(golden(c))+' ختم')}
    </div>
    <h2 class="c-sec">سباق الركبان</h2><div class="c-panelbox">${tracks.map(x=>`<div class="trk"><span>ركب ${esc(x.t)}<small>، ${AR(x.n)} قافلة</small></span><i><b style="width:${Math.round(x.avg/25*100)}%"></b></i><em>${AR(Math.round(x.avg*10)/10)}</em></div>`).join('')}<p class="c-sub" style="margin-top:6px">متوسط خطوات قوافل كل مسار</p></div>`;
  }
  const stations=DAYS.map((d,i)=>{const s=C[d],st=stateOfDay(i);return `<li><a class="st ${st==='cur'?'cur':''}" href="#${d==='sun'?'caravan-sun':'caravan-'+d+'-easy'}">${seal(i,st)}<span><span class="place">${DAY_AR[d]}، ${s.place}</span><br><span class="name">${s.title}</span><br><span class="goal">${s.goal}</span></span>${st==='cur'?'<span class="state s-doing">اليوم</span>':''}</a></li>`}).join('');
  return `${cBar('','للفتيات')}
  <div class="c-hero">${cHeroScene(250)}<div class="over"><h1 class="c-title">قافلة شِنقيط</h1></div></div>
  <p class="c-sub" style="margin:-4px 0 14px">كل حلقة قافلة: المعلمة دليلتها، والمشرفة حارستها. وكل مساء تقطع القافلة خطوات بقدر التزامها، والطريق إلى شِنقيط ٢٥ خطوة. من تبلغ ٢٠ خطوة تصل شِنقيط.</p>
  <div class="band"></div>${body}
  <h2 class="c-sec">محطات الطريق</h2><ol class="stations">${stations}</ol>
  <h2 class="c-sec">بمَ تتقدَّم القافلة؟</h2>
  <div class="c-panelbox rulebox"><dl>${C_STEPS.map(s=>`<dt>${s.name}</dt><dd>${s.what}: ${s.hint}</dd>`).join('')}</dl><p class="c-sub" style="margin-top:10px">يوم الخميس يوم مراجعة: يصير الحضور مشاركةً في المراجعة، والموعد مراجعةً قبل انتهاء وقت الحلقة، و«الدليلة والحارسة» متابعةَ المشرفة.</p><p class="c-sub">كل بند يتحقَّق خطوة. خمس خطوات في المحطة ختم ذهبي، وأربع فضِّي، وثلاث نحاسي. وكل مهمَّة فردية تنجزها بنت، وكل لغز يُحلُّ، كنزٌ لقافلتها.</p></div>
  <button class="btn-c ghost" style="margin-top:16px;color:var(--c-gold-hi)" onclick="loadPub()">حدِّثي النتائج</button>`}
function vStation(d,path){setTheme('caravan');
  const s=C[d],i=DAYS.indexOf(d),rid=s.riddle,text=d==='sun'?s.one:s[path];
  const roads=d==='sun'?'':`<div class="roads"><button class="${path==='easy'?'on':''}" onclick="go('caravan-${d}-easy')">الطريق السهل</button><button class="${path==='hard'?'on':''}" onclick="go('caravan-${d}-hard')">الطريق الصعب</button><span class="hint">تنشر المشرفة النسخة التي حدَّدتها خطوات قافلتكِ أمس</span></div>`;
  const prevH=i>0?(i===1?'caravan-sun':`caravan-${DAYS[i-1]}-easy`):'',nextH=i<4?`caravan-${DAYS[i+1]}-easy`:'caravan-end-arrived';
  return `${cBar('caravan','قافلة شِنقيط')}
  <div class="steps5">${DAYS.map((_,k)=>`<i class="${k<i?'done':k===i?'cur':''}"></i>`).join('')}</div>
  <div class="st-head">${seal(i,'cur')}<div><div class="place">المحطة ${AR(i+1)} من ٥، ${s.place}، ${DAY_AR[d]} ${dayDate(i)}</div><h1>${s.title}</h1><div class="goal">هدف اليوم: ${s.goal}</div></div></div>
  <div class="announce">${s.announce}</div>${roads}
  <div class="folio"><div class="illum"><span>${d==='sun'?'الفصل الأول':path==='easy'?'الطريق السهل':'الطريق الصعب'}</span></div><div class="in"><p class="story">${text}</p></div></div>
  <div class="discover">${discoverIcon()}<b>صندوق المحطة</b><div id="disc" class="hide" style="margin-top:6px">${s.discover.x}</div><button class="reveal" onclick="const e=document.getElementById('disc');e.classList.toggle('hide');this.textContent=e.classList.contains('hide')?'افتحي الصندوق':'أغلقي الصندوق'">افتحي الصندوق</button></div>
  <div class="folio"><div class="illum"><span>لغز المحطة</span></div><div class="in">${rid.ayah?`<div class="quran">«${rid.ayah}»</div>`:''}<p class="q">${rid.q}</p><p class="c-sub" style="margin-top:6px;color:#6d5a44">أرسلن الجواب في قروب الحلقة قبل نهاية اليوم، فإن كان صحيحًا كسبت قافلتكِ كنزًا.</p>${weekIdx()>i?`<button class="reveal" onclick="this.nextElementSibling.classList.toggle('hide')">أظهري الجواب</button><div class="note hide">${rid.a}</div>`:''}</div></div>
  <div class="tasks"><div class="task-c"><div class="h"><b>مهمَّة فردية: ${s.indiv.t}</b><span class="state s-doing">كنز لقافلتكِ</span></div><p>${s.indiv.x}</p><p class="c-sub" style="margin-top:4px">فائدتها: ${s.indiv.f}</p></div>
  <div class="task-c group"><div class="h"><b>مهمَّة جماعية: ${s.group.t}</b></div><p>${s.group.x}</p><p style="margin-top:4px;opacity:.85">${s.group.done} وتمنح القافلة خطوة «الأمان».</p></div></div>
  ${weekIdx()>i?`<div class="folio"><div class="illum"><span>ثمرة المحطة</span></div><div class="in fruit"><b>${s.fruit.t}</b>${s.fruit.x}</div></div>`:`<p class="c-sub" style="text-align:center;margin-bottom:12px">ثمرة المحطة تظهر هنا بعد انتهاء يومها</p>`}
  <div class="c-nav">${prevH?`<button onclick="go('${prevH}')">→ ${C[DAYS[i-1]].place}</button>`:''}<button onclick="go('${nextH}')">${i<4?C[DAYS[i+1]].place:'رسالة الختام'} ←</button></div>`}
function vEnd(kind){setTheme('caravan');const e=C_END[kind];
  return `${cBar('caravan','قافلة شِنقيط')}<div class="c-hero">${cHeroScene(220)}<div class="over"><h1 class="c-title">${e.title}</h1></div></div>
  <div class="roads"><button class="${kind==='arrived'?'on':''}" onclick="go('caravan-end-arrived')">٢٠ خطوة فأكثر</button><button class="${kind==='late'?'on':''}" onclick="go('caravan-end-late')">أقل من ٢٠ خطوة</button></div>
  <div class="folio"><div class="illum"><span>فصل الختام</span></div><div class="in"><p class="story">${e.text}</p></div></div>
  <div class="folio"><div class="illum"><span>رسالة القافلة</span></div><div class="in"><p class="story">${C_FINAL.text}</p><div class="quran" style="text-align:center;margin-top:8px">«${C_FINAL.hadith}»</div><p style="text-align:center;color:#8d6a2f">${C_FINAL.src}</p></div></div>`}

/* ---------- الخليَّة ---------- */
function hBar(back,crumb){return `<div class="h-bar"><button class="h-back" onclick="go('${back}')">→ رجوع</button><span class="h-crumb">${crumb||''}</span></div>`}
function vHive(){setTheme('hive');
  const list=kidsList();let body='';
  if(!PUB)body=loadingBox('puffy');
  else{const me=list.find(c=>c.id===MINE.kids);const all=Math.round(list.reduce((a,c)=>a+totalHoney(c),0)/Math.max(1,list.length)*100);
    body=`<h2 class="h-sec">${jarSvg(10).replace('width="70" height="88"','width="28" height="34"')}خليَّتي</h2>${circleSelect('kids',list)}
    ${me?`<div class="board" style="margin-bottom:14px"><div style="font-weight:800;color:#8a6cbf">خليَّة</div><div class="nm">${esc(me.name)}</div><div class="meter"><i style="width:${Math.round(totalHoney(me)*100)}%"></i></div><div style="font-weight:800">امتلأت ${AR(Math.round(totalHoney(me)*100))}٪، ${AR(totalGems(me))} زهرة نادرة</div>
      <div class="stamps kids">${DAYS.map(d=>{const x=me.days[d];return `<div>${flowerStage(x?(x.h>=.85?4:x.h>=.6?3:x.h>=.3?2:1):0,H[d].petal)}<span>${DAY_AR[d]}</span></div>`}).join('')}</div></div>`:''}
    <h2 class="h-sec">${bee().replace('class="bee ','style="width:30px;height:30px" class="')}قرص العسل الكبير</h2>
    <div class="puffy" style="padding:12px">${honeycomb(list,MINE.kids)}<p style="text-align:center;font-weight:800;color:#8a6cbf">عسل كل الخلايا معًا: ${AR(all)}٪</p></div>`}
  return `${hBar('','للأطفال')}
  <div class="h-hero"><div><h1 class="h-title">خليَّة <span>سنا</span></h1><p class="h-sub">كل حلقة خليَّة في قرص العسل الكبير. تمتلئ خليَّتكِ كلما حضرت نحلاتها في الوقت وأتممن نصابهن وتحدِّي يومهن.</p></div>${bee()}</div>
  <h2 class="h-sec">${flowerStage(4,'#ffb6cb')}حديقة الأسبوع</h2><div class="garden">${gardenWeek()}</div>
  ${body}
  <h2 class="h-sec">${flowerStage(3,'#dccdff')}أيام الخليَّة</h2>
  <div class="days-h">${DAYS.map((d,i)=>{const st=stateOfDay(i);return `<a class="day-h puffy" href="#hive-${d}">${d==='thu'?jarSvg(12):flowerStage(st==='done'?4:st==='cur'?2:0,H[d].petal)}<span class="d">${DAY_AR[d]}</span><span class="t">${H[d].title}</span>${st==='cur'?'<span class="state s-doing" style="margin-top:4px">اليوم</span>':''}</a>`}).join('')}</div>
  <button class="btn-h ghost" style="margin-top:16px" onclick="loadPub()">حدِّثي النتائج</button>`}
function vHiveDay(d){setTheme('hive');const h=H[d],i=DAYS.indexOf(d);
  return `${hBar('hive','خليَّة سنا')}
  <div class="hd-head">${d==='thu'?jarSvg(14).replace('width="70" height="88"','class="flowerbig" width="86" height="86"'):flowerStage(4,h.petal,'flowerbig')}<div><div class="d">اليوم ${AR(i+1)}، ${DAY_AR[d]}</div><h1>${h.title}</h1><span class="goalpill">هدفنا: ${h.goal}</span></div></div>
  <div class="say">${bee()}<div class="bubble puffy">${h.announce}</div></div>
  <div class="storyh puffy"><span class="lbl">حكاية سنا</span><p>${h.story}</p>${h.ayah?`<div class="quran">«${h.ayah}»</div><small>${h.ayahRef}</small>`:''}</div>
  <div class="cardrow"><div class="kidtask kt-main">${flowerStage(4,'#fff')}<div><b>مهمَّة اليوم</b><p>${h.main}</p></div></div><div class="kidtask kt-play">${kBadgeSvg('play',true)}<div><b>سنَّة اليوم: زهرة نادرة</b><p>${h.play}</p><span style="font-size:.85rem;color:#8a6cbf;font-weight:700">${h.src}</span></div></div></div>
  <div class="h-nav">${i>0?`<button onclick="go('hive-${DAYS[i-1]}')">→ ${DAY_AR[DAYS[i-1]]}</button>`:''}${i<4?`<button onclick="go('hive-${DAYS[i+1]}')">${DAY_AR[DAYS[i+1]]} ←</button>`:''}</div>`}

/* ---------- التوجيه ---------- */
function showTrans(d){const el=$('#trans'),s=C[d],i=DAYS.indexOf(d);el.innerHTML=`<div class="box">${transScene()}<div class="k">المحطة ${AR(i+1)} من ٥</div><h2>${s.place}</h2><small>${s.title}، اضغطي للمتابعة</small></div>`;el.classList.add('on');clearTimeout(showTrans._t);showTrans._t=setTimeout(()=>el.classList.remove('on'),matchMedia('(prefers-reduced-motion: reduce)').matches?600:2000)}
let lastHash=null;
function render(){const h=location.hash.replace('#','');let m,html;$('#app').classList.remove('home');const keep=h===lastHash,sy=scrollY;
  if(!h)html=vHome();else if(h==='caravan')html=vCaravan();else if(h==='caravan-sun')html=vStation('sun');
  else if((m=h.match(/^caravan-(mon|tue|wed|thu)-(easy|hard)$/)))html=vStation(m[1],m[2]);else if((m=h.match(/^caravan-end-(arrived|late)$/)))html=vEnd(m[1]);
  else if(h==='hive')html=vHive();else if((m=h.match(/^hive-(sun|mon|tue|wed|thu)$/)))html=vHiveDay(m[1]);else html=vHome();
  $('#app').innerHTML=html;const dm=h.match(/^caravan-(sun|mon|tue|wed|thu)/),pd=lastHash&&lastHash.match(/^caravan-(sun|mon|tue|wed|thu)/);
  if(dm&&lastHash!==null&&(!pd||pd[1]!==dm[1]))showTrans(dm[1]);scrollTo(0,keep?sy:0);lastHash=h}
addEventListener('hashchange',()=>{openSt=-1;render()});
$('#trans').addEventListener('click',()=>$('#trans').classList.remove('on'));
$('#pop').addEventListener('click',e=>{if(e.target.id==='pop')closePop()});
render();loadPub();startFx();
