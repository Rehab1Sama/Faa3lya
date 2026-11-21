/* ============ صفحة المشرفات والقائدة ============ */
let AUTH=lsGet('ev-sup')||{code:'',name:'',leader:false};
let NAMES=null,MY=null,LEAD=null,BUSY=false,EDIT=null,SAVE_STATE='',saveTimer=null,leadTab='circles',leadFilter='all',nameFilter='',availFilter='';
function setTheme(t){document.body.className='t-'+t;$('#clouds').classList.toggle('hide',t!=='hive')}
function studentsUrl(h){return location.href.split('#')[0].replace(/mushrifa\.html$/,'index.html').replace(/\/$/,'/index.html')+(h?'#'+h:'')}
function persist(){lsSet('ev-sup',AUTH)}
function logout(){AUTH={code:'',name:'',leader:false};persist();NAMES=MY=LEAD=null;go('');render()}
function cBar(back,crumb){return `<div class="c-bar"><button class="c-back" onclick="${back}">→ رجوع</button><span class="c-crumb">${crumb||''}</span></div>`}
function hBar(back,crumb){return `<div class="h-bar"><button class="h-back" onclick="${back}">→ رجوع</button><span class="h-crumb">${crumb||''}</span></div>`}
async function guard(fn){if(BUSY)return;BUSY=true;try{await fn()}catch(e){toast(e.message);if(e.message===ERR_AR.bad_code&&AUTH.code){BUSY=false;logout();return}}finally{BUSY=false}}

/* ---------- الدخول ---------- */
function vLogin(){setTheme('caravan');
  return `<div class="login c-panelbox"><h1 class="c-title" style="font-size:2.3rem">لوحة المشرفات</h1><p class="c-sub">قافلة شِنقيط وخليَّة سنا</p>
  <form onsubmit="event.preventDefault();doLogin()"><div class="fld"><label for="code" style="color:var(--c-muted)">الرمز</label><input id="code" type="password" inputmode="numeric" autocomplete="off" placeholder="اكتبي الرمز الذي وصلكِ" style="background:#fff"></div>
  <button class="btn-c" style="margin-top:12px" type="submit">دخول</button></form></div>`}
async function doLogin(){const code=$('#code').value.trim();if(!code){toast('اكتبي الرمز أولًا');return}
  await guard(async()=>{try{LEAD=await rpc('ev_leader',{p_code:code,p_action:'state',p_args:{}});AUTH={code,name:'',leader:true};persist();go('leader');render();return}catch(e){if(e.message!==ERR_AR.bad_code)throw e}
    NAMES=await rpc('ev_sup_names',{p_code:code});AUTH={code,name:'',leader:false};persist();render()})}
function vNames(){setTheme('caravan');const f=nameFilter.trim(),list=(NAMES||[]).filter(n=>!f||n.includes(f));
  return `${cBar('logout()','')}<h1 class="c-title" style="font-size:2.2rem">من أنتِ؟</h1><p class="c-sub">اختاري اسمكِ لتظهر حلقاتكِ</p>
  <label class="sr" for="nf">ابحثي عن اسمكِ</label><input id="nf" class="mine-sel" placeholder="ابحثي عن اسمكِ" value="${esc(nameFilter)}" oninput="nameFilter=this.value;const p=this.selectionStart;render();const e=$('#nf');e.focus();e.setSelectionRange(p,p)">
  <div class="names">${list.map(n=>`<button onclick="pickName(${JSON.stringify(n).replace(/"/g,'&quot;')})">${esc(n)}</button>`).join('')||'<p class="c-sub">لا يوجد اسم مطابق</p>'}</div>
  <details class="c-panelbox" style="margin-top:14px"><summary style="cursor:pointer;color:var(--c-gold-hi)">اسمي غير موجود في القائمة</summary><p class="c-sub">اكتبي اسمكِ، ثم أضيفي حلقاتكِ من «الحلقات المتاحة».</p>
  <input id="newName" class="mine-sel" placeholder="اسمكِ الكامل"><button class="btn-c" onclick="const v=$('#newName').value.trim();if(v.length<3)toast('اكتبي اسمكِ كاملًا');else pickName(v)">متابعة</button></details>`}
async function pickName(n){AUTH.name=n;persist();await loadMy();go('')}
async function loadMy(){await guard(async()=>{MY=await rpc('ev_my',{p_code:AUTH.code,p_name:AUTH.name})});render()}

/* ---------- حلقاتي ---------- */
function dayDots(c){return `<div class="dots">${DAYS.map(d=>{const e=c.entries[d];return `<span class="dot ${e?(e.c?'ok':'draft'):''}" title="${DAY_AR[d]}">${DAY_SHORT[d]}</span>`}).join('')}</div>`}
function vMine(){setTheme('caravan');if(!MY)return `<div class="c-panelbox">جاري تحميل حلقاتكِ…</div>`;
  const wi=weekIdx(),today=wi>=0?DAYS[wi]:'sun',f=availFilter.trim(),av=MY.available.filter(c=>!f||c.name.includes(f)||String(c.track).includes(f));
  return `<div class="c-bar"><button class="c-back" onclick="logout()">خروج</button><span class="c-crumb">${esc(AUTH.name)}</span></div>
  <h1 class="c-title" style="font-size:2.3rem">حلقاتي</h1><p class="c-sub">النقطة الخضراء يوم معتمد، والصفراء يوم محفوظ لم يُعتمد بعد.</p>
  <div class="mylist">${MY.mine.map(c=>`<a class="mycircle ${c.kind}" href="#c-${c.id}-${today}"><span><b>${esc(c.name)}</b><small>${c.kind==='kids'?'خليَّة سنا':'قافلة شِنقيط'}، مسار ${esc(c.track)}، ${AR(c.students.length)} ${c.kind==='kids'?'نحلة':'بنت'}</small></span>${dayDots(c)}</a>`).join('')||'<div class="c-panelbox">لا توجد حلقات باسمكِ بعد. أضيفيها من الحلقات المتاحة.</div>'}</div>
  <h2 class="c-sec">الحلقات المتاحة</h2>
  ${MY.available.length?`<input class="mine-sel avail-search" aria-label="ابحثي في الحلقات المتاحة" placeholder="ابحثي باسم الحلقة أو المسار" value="${esc(availFilter)}" oninput="availFilter=this.value;const p=this.selectionStart;render();const e=document.querySelector('.avail-search');if(e){e.focus();e.setSelectionRange(p,p)}">
  <div class="mylist">${av.map(c=>`<div class="mycircle avail"><span><b>${esc(c.name)}</b><small>${c.kind==='kids'?'أطفال':'فتيات'}، مسار ${esc(c.track)}</small></span><button class="pill-add" onclick="claim(${c.id},${JSON.stringify(c.name).replace(/"/g,'&quot;')})">أضيفيها لحلقاتي</button></div>`).join('')}</div>`:'<p class="c-sub">كل الحلقات لها مشرفات.</p>'}
  <button class="btn-c ghost" style="margin-top:16px;color:var(--c-gold-hi)" onclick="loadMy()">حدِّثي</button>`}
let claimAsk=null;
async function claim(id,name){if(claimAsk!==id){claimAsk=id;toast(`اضغطي مرَّة ثانية لإضافة «${name}»`);setTimeout(()=>{if(claimAsk===id)claimAsk=null},3000);return}claimAsk=null;
  await guard(async()=>{await rpc('ev_claim',{p_code:AUTH.code,p_name:AUTH.name,p_circle:id});toast('أُضيفت الحلقة')});await loadMy()}

/* ---------- محرِّر اليوم ---------- */
function circleById(id){return MY&&MY.mine.find(c=>c.id===id)}
function openEditor(id,day){const c=circleById(id);if(!c)return null;
  if(!EDIT||EDIT.id!==id||EDIT.day!==day){const e=c.entries[day];EDIT={id,day,p:JSON.parse(JSON.stringify(e?e.p:(c.kind==='kids'?blankH():blankC()))),closed:!!(e&&e.c)};
    const b=c.kind==='kids'?blankH():blankC();for(const k in b)if(EDIT.p[k]===undefined)EDIT.p[k]=b[k];SAVE_STATE=e?'saved':''}
  return c}
function payloadFor(c,d){if(EDIT&&EDIT.id===c.id&&EDIT.day===d)return EDIT.p;const e=c.entries[d];return e?e.p:null}
function scheduleSave(){SAVE_STATE='pending';updSaveLabel();clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveNow(false),700)}
function updSaveLabel(){const el=$('#saveLbl');if(el)el.innerHTML=saveLabel()}
function saveLabel(){return SAVE_STATE==='pending'?'جاري الحفظ…':SAVE_STATE==='saved'?'محفوظ ✓':SAVE_STATE==='error'?'لم يُحفظ. <button class="linkbtn" onclick="saveNow(false)">أعيدي المحاولة</button>':''}
function calc(c){const th=MY.threshold||90;if(c.kind==='kids')return{steps:0,honey:hHoney(EDIT.p,c.students),gems:hGems(EDIT.p,c.students)};const st=cSteps(EDIT.p,c.students,th,EDIT.day);return{steps:st.n,honey:0,gems:cGems(EDIT.p,c.students),st}}
async function saveNow(close){const c=circleById(EDIT.id);if(!c)return;clearTimeout(saveTimer);const r=calc(c);
  try{await rpc('ev_save',{p_code:AUTH.code,p_name:AUTH.name,p_circle:c.id,p_day:EDIT.day,p_payload:EDIT.p,p_steps:r.steps,p_honey:Math.round(r.honey*1000)/1000,p_gems:r.gems,p_closed:!!close});
    c.entries[EDIT.day]={p:JSON.parse(JSON.stringify(EDIT.p)),s:r.steps,h:r.honey,g:r.gems,c:!!close};SAVE_STATE='saved';if(close)EDIT.closed=true;updSaveLabel();return true}
  catch(e){SAVE_STATE='error';updSaveLabel();toast(e.message);if(e.message===ERR_AR.locked){EDIT.closed=true;render()}return false}}
function edit(fn){if(EDIT.closed){toast('هذا اليوم معتمد، ولا يعدِّله إلا القائدة');return}fn(EDIT.p);scheduleSave();render()}
function daySeg(c,cls){return `<div class="${cls}">${DAYS.map(d=>{const e=c.entries[d];return `<button class="${EDIT.day===d?'on':''} ${e&&e.c?'ok':''}" onclick="go('c-${c.id}-${d}')">${DAY_AR[d]}</button>`}).join('')}</div>`}
async function approve(){const c=circleById(EDIT.id);if(!await saveNow(true))return;const i=DAYS.indexOf(EDIT.day);
  if(c.kind==='kids'){const pct=Math.round(hHoney(EDIT.p,c.students)*100);popup('h',jarSvg(Math.round(pct*15/100)).replace('width="70" height="88"','width="110" height="110"'),`اعتُمد يوم ${DAY_AR[EDIT.day]}`,`امتلأت خليَّة «${esc(c.name)}» اليوم ${AR(pct)}٪. ${pick(H_CHEERS)}`,'رائع!')}
  else{const n=c.entries[EDIT.day].s,sp=cStamp(n);popup('c',seal(i,'done',sp).replace('class="seal"','width="110" height="110"'),`${sp.t} لمحطة ${C[EDIT.day].place}`,`${AR(n)} خطوات من ٥. ${pick(C_CHEERS)}.`,'متابعة')}
  render()}
let approveAsk=false;
function askApprove(){if(!approveAsk){approveAsk=true;toast('بعد الاعتماد لا تعدِّلين اليوم. اضغطي مرَّة ثانية للتأكيد');setTimeout(()=>approveAsk=false,3500);return}approveAsk=false;approve()}

function vEditor(id,day){const c=openEditor(id,day);if(!c)return `<div class="c-panelbox">هذه الحلقة ليست في قائمتكِ. <button class="btn-c" onclick="go('')">حلقاتي</button></div>`;
  return c.kind==='kids'?vHiveEd(c):vCaravanEd(c)}
function lockNote(cls){return EDIT.closed?`<div class="${cls} lock">هذا اليوم معتمد. لتعديله تواصلي مع القائدة.</div>`:''}
function vCaravanEd(c){setTheme('caravan');const p=EDIT.p,girls=c.students,st=cSteps(p,girls,MY.threshold,EDIT.day),i=DAYS.indexOf(EDIT.day),tot=DAYS.reduce((a,d)=>a+(c.entries[d]&&c.entries[d].c?c.entries[d].s:0),0),L=attLbl(EDIT.day),S=C[EDIT.day],gemsToday=cGems(p,girls),gemsAll=DAYS.reduce((a,d)=>a+(d===EDIT.day?gemsToday:cGems(payloadFor(c,d),girls)),0);
  const scribe=n=>DAYS.every(d=>{const q=payloadFor(c,d);return !!(q&&q.indiv&&q.indiv[n])});
  const roster=girls.map((n,k)=>{const a=p.att[n]||'';return `<div class="girl"><div class="top"><span class="nm">${esc(n)}${scribe(n)?cBadgeSvg('indiv',true).replace('<svg ','<svg class="mini-b" '):''}</span></div><div class="ctl">
    <button class="pill ${a==='on'?'on ok':''}" onclick="cAtt(${k},'on')">${L[0]}</button><button class="pill ${a==='late'?'on warn':''}" onclick="cAtt(${k},'late')">${L[1]}</button><button class="pill ${a==='abs'?'on off':''}" onclick="cAtt(${k},'abs')">${L[2]}</button>
    <button class="pill ${p.nisab[n]?'on ok':''}" onclick="cTog('nisab',${k})">${L[3]}</button><button class="pill ${p.indiv[n]?'on ok':''}" onclick="cTog('indiv',${k})">${S.indiv.t}</button></div></div>`}).join('');
  const cyc=(v,k,labels)=>`<button class="cyc s${v}" onclick="edit(x=>x.${k}=((x.${k}||0)+1)%3)">${labels[v||0]}</button>`;
  const easy=i===4?tot+(EDIT.closed?0:st.n)>=20:st.n>=4;
  return `${cBar("go('')",esc(c.name))}
  <div class="st-head" style="margin-bottom:6px">${seal(i,EDIT.closed?'done':'cur',EDIT.closed?cStamp(st.n):null)}<div><div class="place">محطة ${C[EDIT.day].place}</div><h1 style="font-size:2rem">${esc(c.name)}</h1><div class="goal">مسار ${esc(c.track)}، ${AR(girls.length)} بنت</div></div></div>
  ${cardsBox(c,EDIT.day)}
  ${daySeg(c,'dayseg')}<div class="save-lbl" id="saveLbl">${saveLabel()}</div>${lockNote('c-panelbox')}
  <div class="cp" style="margin-top:10px">
  <div class="folio"><div class="illum"><span>البنات</span></div><div class="in"><div class="bulk"><button class="pill" onclick="cAll()">الكل في الوقت وأتممن النصاب</button></div><div class="roster">${roster}</div></div></div>
  <div class="folio"><div class="illum"><span>مهام المحطة</span></div><div class="in">
   <div class="sa"><span class="ck">١</span><span><b>مهمَّة فردية: ${S.indiv.t}</b><span>${esc(S.indiv.x)} كل بنت تنجزها تكسب القافلة كنزًا.</span></span>${stateChip(['todo','doing','done'][cIndivState(p,girls)])}</div>
   <div class="sa" style="margin-top:6px"><span class="ck">٢</span><span><b>مهمَّة جماعية: ${S.group.t}</b><span>${esc(S.group.x)}<br>${esc(S.group.done)}</span><details class="refbox"><summary>مرجع المشرفة للتحقُّق</summary>${S.group.ref}</details></span>${cyc(p.group,'group',['لم تبدأ','قيد الإنجاز','مكتملة'])}</div>
   <div class="sa" style="margin-top:6px"><span class="ck">٣</span><span><b>لغز المحطة</b><span>${esc(S.riddle.q)}</span><details class="refbox"><summary>الجواب الصحيح</summary><p>${S.riddle.a}</p></details></span>${cyc(p.riddle,'riddle',['لم يُحلَّ','قيد المحاولة','حُلَّ'])}</div>
   ${EDIT.day==='thu'?'':`<label class="tg" style="margin-top:8px"><input type="checkbox" ${p.teacher?'checked':''} ${EDIT.closed?'disabled':''} onchange="edit(x=>x.teacher=${!p.teacher})"><span><b>الدليلة</b><span>حضرت المعلمة في وقتها</span></span></label>`}
   <label class="tg" ${EDIT.day==='thu'?'style="margin-top:8px"':''}><input type="checkbox" ${p.supervisor?'checked':''} ${EDIT.closed?'disabled':''} onchange="edit(x=>x.supervisor=${!p.supervisor})"><span><b>الحارسة</b><span>${EDIT.day==='thu'?'نشرتُ رسالة يوم الوصول، وتابعتُ المراجعات':'أدَّيتُ مهامي اليومية'}</span></span></label>
   <p style="margin-top:8px">كنوز اليوم: <b>${AR(gemsToday)}</b>، كنوز القافلة في الأسبوع: <b>${AR(gemsAll)}</b></p></div></div>
  <div class="folio"><div class="illum"><span>خطوات المحطة</span></div><div class="in"><div class="steps-auto">${stepsOf(EDIT.day).map(s=>`<div class="sa ${st[s.k]?'y':''}"><span class="ck">${st[s.k]?'✓':'·'}</span><span><b>${s.name}</b><span>${s.what}</span></span><em>${st.info[s.k]||''}</em></div>`).join('')}</div>
   <p style="margin-top:10px">خطوات اليوم: <b>${AR(st.n)} من ٥</b>، ${cStamp(st.n).t}، ${i<4?'غدًا':'الختام'}: <span class="chip-road ${easy?'chip-easy':'chip-hard'}">${i<4?(easy?'الطريق السهل':'الطريق الصعب'):(easy?'وصلنا شِنقيط':'وصلنا بعد العشاء')}</span></p>
   ${EDIT.closed?'':`<button class="btn-c" style="margin-top:10px" onclick="askApprove()">اعتمدي المحطة وامنحي الختم</button>`}</div></div>
  <div class="c-panelbox progress-c"><div class="cap">مجموع القافلة المعتمد</div><div class="big">${AR(tot)} <small>من ٢٥ خطوة</small></div></div>
  <div class="folio"><div class="illum"><span>رسالة القروب</span></div><div class="in"><pre class="msg">${esc(cMsg(c,st))}</pre><button class="btn-c" onclick="copyText(cMsg(circleById(${c.id}),cSteps(EDIT.p,circleById(${c.id}).students,MY.threshold,EDIT.day)))">انسخي الرسالة</button></div></div></div>`}
function cAtt(k,v){const c=circleById(EDIT.id),n=c.students[k];edit(p=>{p.att[n]=p.att[n]===v?'':v;if(p.att[n]==='abs'){p.nisab[n]=false;p.indiv[n]=false}})}
function cTog(f,k){const c=circleById(EDIT.id),n=c.students[k];edit(p=>{p[f][n]=!p[f][n];if(p[f][n]&&(!p.att[n]||p.att[n]==='abs'))p.att[n]='on'})}
function cAll(){const c=circleById(EDIT.id);edit(p=>c.students.forEach(n=>{if(p.att[n]!=='abs'&&p.att[n]!=='late')p.att[n]='on';if(p.att[n]!=='abs')p.nisab[n]=true}))}
function cMsg(c,st){const i=DAYS.indexOf(EDIT.day),tot=DAYS.reduce((a,d)=>a+(c.entries[d]&&c.entries[d].c?c.entries[d].s:0),0)+(EDIT.closed?0:st.n);
  const next=i<4?`caravan-${DAYS[i+1]}-${st.n>=4?'easy':'hard'}`:(tot>=20?'caravan-end-arrived':'caravan-end-late');
  const girls=c.students,doers=girls.filter(n=>EDIT.p.indiv&&EDIT.p.indiv[n]&&EDIT.p.att[n]!=='abs'),scribes=EDIT.day==='thu'?girls.filter(n=>DAYS.every(d=>{const q=payloadFor(c,d);return !!(q&&q.indiv&&q.indiv[n])})):[],gems=cGems(EDIT.p,girls);
  return `قافلة ${c.name} 🌿\nمحطة ${C[EDIT.day].place}، مساء ${DAY_AR[EDIT.day]}\n\n${stepsOf(EDIT.day).map(s=>`${st[s.k]?'✓':'✗'} ${s.name} (${s.what})${st.info[s.k]?' '+st.info[s.k]:''}`).join('\n')}\n\nخطوات اليوم: ${AR(st.n)} من ٥ (${cStamp(st.n).t})\nمجموع القافلة: ${AR(tot)} من ٢٥\nكنوز اليوم: ${AR(gems)}${doers.length?`\nأنجزن «${C[EDIT.day].indiv.t}»: ${doers.join('، ')}`:''}${EDIT.p.riddle===2?'\nحللنا لغز المحطة ✓':''}${scribes.length?`\nوسام «صاحبة المخطوطة»: ${scribes.join('، ')} ♥`:''}\n\n${i<4?`فصل الغد (${st.n>=4?'الطريق السهل':'الطريق الصعب'}):`:(tot>=20?'وصلت قافلتنا شِنقيط ♥':'وصلت قافلتنا شِنقيط بعد العشاء 🌿')}\n${studentsUrl(next)}\n\nسباق القوافل:\n${studentsUrl('caravan')}`}

function vHiveEd(c){setTheme('hive');const p=EDIT.p,kids=c.students,i=DAYS.indexOf(EDIT.day),KL=EDIT.day==='thu'?['شاركت في وقتها','شاركت بعده','لم تشارك']:['في الوقت','متأخِّرة','غائبة'];
  const rare=n=>DAYS.filter(d=>{const q=payloadFor(c,d);return q&&q.play&&q.play[n]}).length;
  const tot=n=>DAYS.reduce((a,d)=>a+kPts(payloadFor(c,d),n),0);
  const rows=kids.map((n,k)=>{const a=p.att[n]||'',t=tot(n),s=kStage(t);return `<div class="kidrow"><div class="top">${flowerStage(s,PETALS[s])}<span><span class="nm">${esc(n)}</span><br><span class="lv">${H_LEVELS[s]}، ${H_STAGES[s]}</span></span><span class="pts">${AR(t)} قطرة${rare(n)?`<br><small style="color:#ff7fa8">${AR(rare(n))} زهرة نادرة</small>`:''}${rare(n)>=5?kBadgeSvg('play',true).replace('<svg ','<svg class="mini-b" '):''}</span></div>
    <div class="ctl"><button class="kb ${a==='on'?'on':''}" onclick="hAtt(${k},'on')">${KL[0]}</button><button class="kb ${a==='late'?'on late':''}" onclick="hAtt(${k},'late')">${KL[1]}</button><button class="kb ${a==='abs'?'on abs':''}" onclick="hAtt(${k},'abs')">${KL[2]}</button>
    <button class="kb ${p.nisab[n]?'on star':''}" onclick="hTog('nisab',${k})">النصاب</button><button class="kb ${p.play[n]?'on pink':''}" onclick="hTog('play',${k})">سنَّة اليوم</button><button class="kb ${p.help[n]?'on blue':''}" onclick="hTog('help',${k})">ساعدت صاحبتها</button></div></div>`}).join('');
  const pct=Math.round(hHoney(p,kids)*100),week=Math.round(DAYS.reduce((a,d)=>a+(d===EDIT.day?hHoney(p,kids):(c.entries[d]&&c.entries[d].c?c.entries[d].h:0)),0)/5*100);
  const jars=EDIT.day==='thu'?`<div class="puffy" style="padding:18px"><h3>جرَّات العسل</h3><div class="jars">${kids.map(n=>`<div class="jar">${jarSvg(tot(n))}<b>${esc(n)}</b><span>${AR(tot(n))} من ١٥ قطرة</span></div>`).join('')}</div><button class="btn-h pink" style="margin-top:12px" onclick="confetti();popup('h',bee(),'حفلة عسل ${esc(c.name).replace(/'/g,'')}!','مبارك لكل نحلة اجتهادها 🌸','شكرًا يا نحلات')">ابدئي احتفال الأسبوع</button></div>`:'';
  return `${hBar("go('')",esc(c.name))}
  <div class="hd-head">${flowerStage(EDIT.closed?4:2,H[EDIT.day].petal,'flowerbig')}<div><div class="d">${DAY_AR[EDIT.day]}، ${H[EDIT.day].title}</div><h1 style="font-size:2rem">${esc(c.name)}</h1><span class="goalpill">مسار ${esc(c.track)}، ${AR(kids.length)} نحلة</span></div></div>
  ${cardsBox(c,EDIT.day)}
  ${daySeg(c,'hdays')}<div class="save-lbl" id="saveLbl">${saveLabel()}</div>${lockNote('puffy')}
  <div class="hp" style="margin-top:10px">
  <div class="puffy"><h3>النحلات</h3><p style="font-size:.9rem;color:#8a6cbf;font-weight:700">قطرة للحضور في الوقت (ونصف للمتأخِّرة)، وقطرة للنصاب، وقطرة لسنَّة اليوم، وسنَّة اليوم تمنح الطفلة زهرة نادرة أيضًا.</p><div class="refbox" style="background:#fff6e0;margin-bottom:8px"><b>سنَّة اليوم:</b> ${H[EDIT.day].play} <small>(${H[EDIT.day].src})</small></div><div class="bulk"><button class="kb" onclick="hAll()">الكل في الوقت وأتممن النصاب</button></div>${rows}</div>
  <div class="puffy"><label class="tg" style="cursor:pointer"><input type="checkbox" ${p.shield?'checked':''} ${EDIT.closed?'disabled':''} onchange="edit(x=>x.shield=${!p.shield})" style="accent-color:#ff9f43"><span><b>حارستا الخليَّة</b><span style="color:#8a6cbf">للمتابعة فقط، لا يؤثِّر في عسل الأطفال</span></span></label></div>
  <div class="board"><div style="font-weight:800;color:#8a6cbf">خليَّة</div><div class="nm">${esc(c.name)}</div><div class="meter"><i style="width:${pct}%"></i></div><div style="font-weight:800">عسل ${DAY_AR[EDIT.day]}: ${AR(pct)}٪، الأسبوع: ${AR(week)}٪</div>
   <div class="flowers">${kids.map(n=>{const s=kStage(tot(n));return `<div class="fl">${flowerStage(s,PETALS[s])}${esc(n)}</div>`}).join('')}</div></div>
  ${EDIT.closed?'':`<button class="btn-h" onclick="askApprove()">اعتمدي يوم ${DAY_AR[EDIT.day]}</button>`}
  ${jars}
  <div class="puffy"><h3>رسالة القروب</h3><pre class="msg">${esc(hMsg(c))}</pre><button class="btn-h" onclick="copyText(hMsg(circleById(${c.id})))">انسخي الرسالة</button></div></div>`}
function stageWatch(n,fn){const c=circleById(EDIT.id),tot=()=>DAYS.reduce((a,d)=>a+kPts(payloadFor(c,d),n),0),b=kStage(tot());fn();const a=kStage(tot());
  if(a>b)setTimeout(()=>popup('h',flowerStage(a,PETALS[a]),`${esc(n)} صارت «${H_LEVELS[a]}»`,`${pick(H_CHEERS)} زهرتها الآن ${H_STAGES[a]}.`,'رائع!'),60)}
function hAtt(k,v){const c=circleById(EDIT.id),n=c.students[k];if(EDIT.closed){toast('هذا اليوم معتمد');return}stageWatch(n,()=>edit(p=>{p.att[n]=p.att[n]===v?'':v;if(p.att[n]==='abs'){p.nisab[n]=false;p.play[n]=false;p.help[n]=false}}))}
function hTog(f,k){const c=circleById(EDIT.id),n=c.students[k];if(EDIT.closed){toast('هذا اليوم معتمد');return}stageWatch(n,()=>edit(p=>{p[f][n]=!p[f][n];if(p[f][n]&&(!p.att[n]||p.att[n]==='abs'))p.att[n]='on'}))}
function hAll(){const c=circleById(EDIT.id);edit(p=>c.students.forEach(n=>{if(p.att[n]!=='abs'&&p.att[n]!=='late')p.att[n]='on';if(p.att[n]!=='abs')p.nisab[n]=true}))}
function hMsg(c){const p=EDIT.p,kids=c.students,i=DAYS.indexOf(EDIT.day),pct=Math.round(hHoney(p,kids)*100);
  const full=kids.filter(n=>kPts(p,n)>=3),gold=kids.filter(n=>p.att[n]==='on'),play=kids.filter(n=>p.play[n]),help=kids.filter(n=>p.help[n]),garden=EDIT.day==='thu'?kids.filter(n=>DAYS.every(d=>{const q=payloadFor(c,d);return q&&q.play&&q.play[n]})):[];
  let m=`خليَّة ${c.name} 🌸\n${H[EDIT.day].title}، مساء ${DAY_AR[EDIT.day]}\n\nامتلأت خليَّتنا اليوم ${AR(pct)}٪`;
  if(full.length)m+=`\nيوم كامل بثلاث قطرات: ${full.join('، ')}`;if(gold.length)m+=`\nالزهرة الذهبية: ${gold.join('، ')}`;if(play.length)m+=`\nزهرة نادرة (سنَّة اليوم): ${play.join('، ')}`;if(garden.length)m+=`\nوسام «بستان السنَّة»: ${garden.join('، ')} ♥`;if(help.length)m+=`\nرقصة النحل: ${help.join('، ')}`;
  m+=i<4?`\n\nحكاية الغد:\n${studentsUrl('hive-'+DAYS[i+1])}`:'\n\nامتلأت خليَّتنا، ومبارك لكل نحلة جرَّتها 🌸';return m+`\n\nقرص العسل الكبير:\n${studentsUrl('hive')}`}

/* ---------- القائدة ---------- */
async function loadLead(){await guard(async()=>{LEAD=await rpc('ev_leader',{p_code:AUTH.code,p_action:'state',p_args:{}})});render()}
async function leadDo(action,args,msg){await guard(async()=>{await rpc('ev_leader',{p_code:AUTH.code,p_action:action,p_args:args||{}});if(msg)toast(msg)});await loadLead()}
let reopenAsk=null;
function reopen(id,d){const k=id+d;if(reopenAsk!==k){reopenAsk=k;toast('اضغطي مرَّة ثانية لإلغاء اعتماد اليوم');setTimeout(()=>{if(reopenAsk===k)reopenAsk=null},3000);return}reopenAsk=null;leadDo('reopen',{circle:id,day:d},'أُلغي الاعتماد')}
function vLeader(){setTheme('caravan');if(!LEAD)return `<div class="c-panelbox">جاري التحميل…</div>`;
  const owners=[...new Set(LEAD.circles.map(c=>c.owner).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ar'));
  const list=LEAD.circles.filter(c=>leadFilter==='all'||c.kind===leadFilter);
  const closedCount=d=>LEAD.circles.filter(c=>c.days[d]&&c.days[d].c).length;
  let body='';
  if(leadTab==='circles')body=`<div class="c-panelbox"><b style="color:var(--c-gold-hi)">اعتماد الليلة</b><div class="dayrow">${DAYS.map(d=>`<div><b>${AR(closedCount(d))}</b><span>${DAY_AR[d]}</span></div>`).join('')}</div><p class="c-sub">عدد الحلقات المعتمدة في كل يوم من ${AR(LEAD.circles.length)}</p></div>
   <div class="seg-l">${[['all','الكل'],['girls','الفتيات'],['kids','الأطفال']].map(([k,t])=>`<button class="${leadFilter===k?'on':''}" onclick="leadFilter='${k}';render()">${t}</button>`).join('')}</div>
   <div class="lead-list">${list.map(c=>`<div class="lead-row"><div class="top"><span><b>${esc(c.name)}</b><small>${c.kind==='kids'?'أطفال':'فتيات'}، ${esc(c.track)}</small></span>
     <select aria-label="مشرفة ${esc(c.name)}" onchange="leadDo('reassign',{circle:${c.id},owner:this.value},'حُفظ')"><option value="" ${!c.owner?'selected':''}>متاحة</option>${owners.map(o=>`<option ${o===c.owner?'selected':''}>${esc(o)}</option>`).join('')}</select></div>
     <div class="dots">${DAYS.map(d=>{const e=c.days[d];return `<button class="dot ${e?(e.c?'ok':'draft'):''}" ${e&&e.c?`onclick="reopen(${c.id},'${d}')" title="اضغطي لإلغاء الاعتماد"`:'disabled'}>${DAY_SHORT[d]}</button>`}).join('')}</div></div>`).join('')}</div>
   <p class="c-sub">النقطة الخضراء يوم معتمد، واضغطيها مرَّتين لإلغاء اعتماده. ومن القائمة تنقلين الحلقة لمشرفة أخرى أو تعيدينها متاحة.</p>`;
  else if(leadTab==='settings')body=`<div class="c-panelbox"><div class="fld"><label style="color:var(--c-muted)">النسبة المطلوبة لتحقيق الخطوة في القافلة</label><select onchange="leadDo('threshold',{value:+this.value},'حُفظت النسبة')" style="background:#fff">${[80,90,100].map(v=>`<option value="${v}" ${LEAD.threshold===v?'selected':''}>${AR(v)}٪</option>`).join('')}</select></div></div>
   <div class="c-panelbox" style="margin-top:12px"><b style="color:var(--c-gold-hi)">تغيير رمز المشرفات</b><input id="nsc" class="mine-sel" inputmode="numeric" placeholder="الرمز الجديد، ٤ أرقام فأكثر"><button class="btn-c" onclick="const v=$('#nsc').value.trim();if(v.length<4)toast('الرمز قصير');else leadDo('sup_code',{value:v},'تغيَّر رمز المشرفات')">غيِّري الرمز</button></div>
   <div class="c-panelbox" style="margin-top:12px"><b style="color:var(--c-gold-hi)">تغيير رمز القائدة</b><input id="nlc" class="mine-sel" inputmode="numeric" placeholder="الرمز الجديد، ٦ أرقام فأكثر"><button class="btn-c" onclick="const v=$('#nlc').value.trim();if(v.length<6)toast('الرمز قصير');else{leadDo('leader_code',{value:v},'تغيَّر رمزكِ، احفظيه');AUTH.code=v;persist()}">غيِّري رمزي</button></div>
   <div class="c-panelbox" style="margin-top:12px"><b style="color:var(--c-gold-hi)">تحديث الحلقات من موقع المقرأة</b><p class="c-sub">يجلب الحلقات الجديدة وأسماء الطالبات المحدَّثة، ولا يغيِّر المشرفة المسجَّلة لأي حلقة ولا نتائجها.</p><button class="btn-c dark" onclick="leadDo('sync',{},'تمَّ التحديث')">حدِّثي الحلقات</button></div>`;
  else body=`<div class="c-panelbox log">${LEAD.log.map(l=>`<div><b>${esc(l.who)}</b> ${esc(l.action)}${l.circle?'، '+esc(l.circle):''}${l.day?'، '+DAY_AR[l.day]:''}<small>${new Date(l.at).toLocaleString('ar',{weekday:'long',hour:'numeric',minute:'2-digit'})}</small></div>`).join('')||'<p class="c-sub">لا يوجد شيء بعد</p>'}</div>`;
  return `<div class="c-bar"><button class="c-back" onclick="logout()">خروج</button><span class="c-crumb">لوحة القائدة</span></div><h1 class="c-title" style="font-size:2.3rem">لوحة القائدة</h1>
  <div class="switch three">${[['circles','الحلقات'],['settings','الإعدادات'],['log','السجل']].map(([k,t])=>`<button class="${leadTab===k?'on':''}" onclick="leadTab='${k}';render()">${t}</button>`).join('')}</div>${body}
  <button class="btn-c ghost" style="margin-top:14px;color:var(--c-gold-hi)" onclick="loadLead()">حدِّثي</button>`}

/* ---------- التوجيه ---------- */
let lastHash=null;
function render(){const h=location.hash.replace('#','');let html,m;const keep=h===lastHash,sy=scrollY;
  if(!AUTH.code)html=vLogin();
  else if(AUTH.leader){if(!LEAD){loadLead();html='<div class="c-panelbox">جاري التحميل…</div>'}else html=vLeader()}
  else if(!AUTH.name){if(!NAMES){guard(async()=>{NAMES=await rpc('ev_sup_names',{p_code:AUTH.code});render()}).catch(()=>{});html='<div class="c-panelbox">جاري التحميل…</div>'}else html=vNames()}
  else if((m=h.match(/^c-(\d+)-(sun|mon|tue|wed|thu)$/))){if(!MY){loadMy();html='<div class="c-panelbox">جاري التحميل…</div>'}else html=vEditor(+m[1],m[2])}
  else{if(!MY){loadMy();html='<div class="c-panelbox">جاري التحميل…</div>'}else html=vMine()}
  $('#app').innerHTML=html;scrollTo(0,keep?sy:0);lastHash=h}
addEventListener('hashchange',()=>{if(EDIT&&SAVE_STATE==='pending')saveNow(false);render()});
$('#pop').addEventListener('click',e=>{if(e.target.id==='pop')closePop()});
addEventListener('beforeunload',e=>{if(SAVE_STATE==='pending'){saveNow(false);e.preventDefault()}});
render();startFx();

function cardsBox(c,day){const cd=cardsOf(c,day),hive=cd&&cd.set==='khaliya';
  if(!cd)return '';
  const one=(src,lbl,nm)=>`<figure class="card-fig"><img src="${src}" alt="بطاقة ${lbl} يوم ${DAY_AR[day]}" loading="lazy"><figcaption>${lbl} ${DAY_AR[day]}</figcaption><div class="card-acts"><button class="${hive?'btn-h':'btn-c'}" onclick="shareCard('${src}','${nm}')">أرسليها</button><a class="${hive?'btn-h':'btn-c'} ghost" href="${src}" download="${nm}">حمِّليها</a></div></figure>`;
  const inner=`<div class="card-grid">${one(cd.t,'تحضير',`تحضير-${DAY_AR[day]}.jpg`)}${one(cd.k,'ختام',`ختام-${DAY_AR[day]}.jpg`)}</div>`;
  return hive?`<div class="puffy"><h3>بطاقات اليوم</h3>${inner}</div>`:`<div class="folio"><div class="illum"><span>بطاقات اليوم</span></div><div class="in">${inner}</div></div>`}
async function shareCard(src,name){try{const r=await fetch(src);const b=await r.blob();const f=new File([b],name,{type:'image/jpeg'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(e){if(e&&e.name==='AbortError')return}
  const a=document.createElement('a');a.href=src;a.download=name;document.body.appendChild(a);a.click();a.remove()}

