// JS Learning · main app (moved out of index.html in v72)
/* Firebase web configuration for the existing jslearning-2802b project. */
const firebaseConfig = {
  apiKey: "AIzaSyBKSb32A7ZXTus3-8W2gkGirM2bag5QTZw",
  authDomain: "jslearning-2802b.firebaseapp.com",
  projectId: "jslearning-2802b",
  storageBucket: "jslearning-2802b.firebasestorage.app",
  messagingSenderId: "610015243276",
  appId: "1:610015243276:web:a5bd85ec319b3703771229",
  measurementId: "G-K0W7TW89N1"
};
/* Only these approved Firebase Authentication UIDs may sign in.
   Access to saved data is also enforced by deployed Firestore rules. */
const ALLOWED_USER_UIDS=['Yk0WCbGfCOfiy7fnXqMgcfxjvze2','m6ybLppag7e9ky7UMVqnc80gwxA3','pt8WaB9gHuMU5U8qhtKTJCEHC0r1','CJOZImCPj4VieLsezwCytLOXVKP2'];
// Display names shown to a learner (greeting, sidebar) and used by the admin portal and emails. Add more as 'UID':'Name'.
const LEARNER_NAMES={'CJOZImCPj4VieLsezwCytLOXVKP2':'Jacq'}; window.JSL_NAMES=LEARNER_NAMES; let USER_NAME='';
/* Admin account: can unlock a learner's locked CISA study plan. */
const ADMIN_UID='Yk0WCbGfCOfiy7fnXqMgcfxjvze2';
/* ============================================================================================ */
import { GRC_V31 } from "./grc-v31.js"
import { uiConfirm, uiAlert } from './cisa/ui-dialog.js';
import { M, GLOSS, DIAG, GRC_PLUS } from './content/core-meta.js';
// v75: Technical lesson bodies (content/core.js) load when a module is opened; the index above has titles, quizzes and word counts.
let coreFull=false, coreLoading=null;
function loadCore(){ if(coreFull) return Promise.resolve(); if(!coreLoading) coreLoading=Promise.all([import('./content/core.js'),import('./content/tech-plus.js'),import('./content/tech-plus2.js'),import('./content/tech-plus3.js'),import('./content/tech-plus4.js'),import('./content/tech-plus5.js')]).then(([F,a,b,c,d,e])=>{ TECH_PLUS={...a.TECH_PLUS,...b.TECH_PLUS2,...c.TECH_PLUS3,...d.TECH_PLUS4,...e.TECH_PLUS5}; for(const fm of F.M){ const m=M.find(x=>x.id===fm.id); if(!m) continue; fm.ls.forEach((l,j)=>{ const L=m.lessons[j]; if(!L) return; L.blocks=l.blocks; L.b=lessonText(l.blocks); }); } coreFull=true; }).catch(e=>{coreLoading=null;throw e;}); return coreLoading; }
let TECH_PLUS={}; // lesson extras (simple words, visuals, GRC notes) load with the lesson bodies (v75)
import { AIC_META as AIC, AIC_LEVELS } from './content/aic-meta.js';
// v75: the AI Compliance lesson bodies (~950 KB) load on demand; a 190 KB index covers progress, lists, quizzes and search titles.
let aicFull=false, aicLoading=null;
function loadAIC(){ if(aicFull) return Promise.resolve(); if(!aicLoading) aicLoading=import('./content/ai-compliance.js').then(F=>{ for(const m of F.AIC){ const P=GRC_PLUS[m.id]; if(P){ P.ls=m.ls.map(l=>({t:l.t,blocks:l.blocks})); P.res=m.res; P.sum=m.sum; P.q=m.q; P.map=m.map||[]; } const G=GRC.find(x=>x.id===m.id); if(G) G.lessons=m.ls.map(l=>[l.t,'',l.ex||'']); } aicFull=true; }).catch(e=>{aicLoading=null;throw e;}); return aicLoading; }
import { renderAIC, isAICRoute, aicSubnav, aicWorkSummary, AIC_FLASH, aicReviewState } from './content/aic-work.js';
import { SEC_META } from './content/security-meta.js';
// v71: the Application Academy's full lessons (~1.2 MB) load on demand; a 23 KB index is enough for progress and search.
let SEC_ACADEMY=SEC_META, SEC_TEXTBOOK={}, secFull=false, secLoading=null;
function loadSec(){ if(secFull) return Promise.resolve(); if(!secLoading) secLoading=import('./content/security.js').then(M=>{SEC_ACADEMY=M.SEC_ACADEMY;SEC_TEXTBOOK=M.SEC_TEXTBOOK;secFull=true;}).catch(e=>{secLoading=null;throw e;}); return secLoading; }
import { initializeApp, deleteApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc, query, where, orderBy, onSnapshot, addDoc, updateDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
window.__p2cLoaded=true;
if('serviceWorker' in navigator && location.protocol==='https:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});

/* ---------------- content ---------------- */
const PROV = {aws:{n:'AWS',c:'c-aws',v:'--aws'}, az:{n:'Azure',c:'c-az',v:'--az'}, gcp:{n:'Google Cloud',c:'c-gcp',v:'--gcp'}, oci:{n:'Oracle OCI',c:'c-oci',v:'--oci'}};
const LV = [
  {n:1,name:'Network Foundations',tier:'Beginner',d:'How data moves: models, addressing, protocols and routing.'},
  {n:2,name:'Core Networking',tier:'Intermediate',d:'Security, load balancing, Linux tooling, BGP, DNS, TLS, IPv6 and advanced routing.'},
  {n:3,name:'Cloud Fundamentals',tier:'Intermediate',d:'Cloud models, identity, virtual networks, serverless networking and performance.'},
  {n:4,name:'Provider Deep Dives',tier:'Advanced',d:'AWS, Azure, Google Cloud and OCI in depth, plus global traffic, edge and DDoS.'},
  {n:5,name:'Expert Architecture',tier:'Expert',d:'Hybrid, multi-cloud, security, IaC, Kubernetes, automation, operations, SASE and case studies.'}
];
// Extended theory is maintained separately so GitHub/Firebase Hosting can serve it as a static asset.
// Existing lesson IDs, quizzes and saved Firebase progress remain unchanged.
function lessonText(bl){return (bl||[]).map(x=>Array.isArray(x.x)?x.x.join(' '):x.x).join(' ');}
M.forEach((m,i)=>{m.n=i+1; m.lessons=m.ls.map((l,j)=>({id:m.id+'-'+(j+1),t:l.t,blocks:l.blocks||[],tag:l.tag||m.p||null,b:l.blocks?lessonText(l.blocks):'',w:l.w||0})); m.qs=m.q.map((q,j)=>({id:m.id+'-q'+(j+1),t:q.t,o:q.o,a:q.a,x:q.x}));});

const ROSETTA = [
 ['Virtual network','VPC (regional)','Virtual Network, VNet (regional)','VPC (global)','Virtual Cloud Network, VCN (regional)'],
 ['Subnet scope','One availability zone','Regional, spans zones','Regional','Regional or one availability domain'],
 ['Reserved IPs per subnet','5','5','4','3'],
 ['Stateful instance firewall','Security group','Network security group (NSG)','VPC firewall rules / firewall policies','Network security group (NSG)'],
 ['Subnet-level filter','Network ACL (stateless)','NSG on the subnet','Hierarchical firewall policy','Security list (stateful or stateless)'],
 ['Internet access','Internet Gateway','Public IP / system route (no gateway object)','Default internet gateway route','Internet Gateway'],
 ['Outbound NAT','NAT Gateway','NAT Gateway','Cloud NAT','NAT Gateway'],
 ['Private access to provider services','Gateway and interface VPC endpoints','Private Endpoint / service endpoints','Private Google Access','Service Gateway'],
 ['Expose your service privately','PrivateLink endpoint service','Private Link service','Private Service Connect','Private endpoints'],
 ['Network-to-network','VPC peering','VNet peering','VPC Network Peering','Local peering via DRG'],
 ['Transit hub','Transit Gateway / Cloud WAN','Hub VNet / Virtual WAN','Network Connectivity Center','Dynamic Routing Gateway (DRG)'],
 ['BGP speaker','Virtual private gateway / Transit Gateway','VPN Gateway / Route Server','Cloud Router','DRG'],
 ['DNS','Route 53','Azure DNS / Private DNS zones','Cloud DNS','OCI DNS (private views)'],
 ['L4 load balancer','Network Load Balancer','Azure Load Balancer','Network Load Balancer (passthrough / proxy)','Network Load Balancer'],
 ['L7 load balancer','Application Load Balancer','Application Gateway','Application Load Balancer','Load Balancer (flexible)'],
 ['Global edge / CDN','CloudFront, Global Accelerator','Front Door','Global external ALB + Cloud CDN','OCI global DNS steering + LB'],
 ['WAF / DDoS','AWS WAF, Shield','Azure WAF, DDoS Protection','Cloud Armor','OCI WAF'],
 ['Managed firewall','AWS Network Firewall','Azure Firewall','Cloud NGFW','OCI Network Firewall'],
 ['Dedicated private link','Direct Connect','ExpressRoute','Dedicated / Partner Interconnect','FastConnect'],
 ['Site-to-site VPN','Site-to-Site VPN','VPN Gateway','HA VPN','Site-to-Site VPN'],
 ['Admin access without public IP','Systems Manager Session Manager','Azure Bastion','IAP TCP forwarding','OCI Bastion'],
 ['Path analysis','Reachability Analyzer','Network Watcher','Connectivity Tests','Network Path Analyzer'],
 ['Flow logs','VPC Flow Logs','VNet flow logs','VPC Flow Logs','VCN flow logs'],
 ['Kubernetes service','EKS','AKS','GKE','OKE']
];

const CERTS = [
 {k:'net',n:'Networking',c:'c-net',items:[['net1','CompTIA Network+','Beginner · vendor-neutral foundations'],['net2','Cisco CCNA','Intermediate · routing, switching, IP services']]},
 {k:'aws',n:'AWS',c:'c-aws',items:[['aws1','Cloud Practitioner','Foundational'],['aws2','Solutions Architect – Associate','Core design, includes VPC networking'],['aws3','Solutions Architect – Professional','Expert multi-account and hybrid design'],['aws4','Security – Specialty','Network security and segmentation focus']]},
 {k:'az',n:'Azure',c:'c-az',items:[['az1','AZ-900 Azure Fundamentals','Foundational'],['az2','AZ-104 Azure Administrator','Associate · includes VNets and NSGs'],['az3','AZ-700 Network Engineer Associate','Networking specialty track'],['az4','AZ-305 Solutions Architect Expert','Expert design']]},
 {k:'gcp',n:'Google Cloud',c:'c-gcp',items:[['gcp1','Cloud Digital Leader','Foundational'],['gcp2','Associate Cloud Engineer','Associate · hands-on operations'],['gcp3','Professional Cloud Network Engineer','Expert networking']]},
 {k:'oci',n:'Oracle OCI',c:'c-oci',items:[['oci1','OCI Foundations Associate','Foundational'],['oci2','OCI Architect Associate','Associate design'],['oci3','OCI Networking Professional','Expert networking']]}
];



/* ---------------- helpers ---------------- */
const blank=()=>({v:2,ls:{},qz:{},notes:{},cert:{},log:[],last:null,t:0,appAcademy:{},cisa:{}});
let S=blank();
const app=document.getElementById('app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=s=>esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/(^|[\s(“"'])\*([^*\s<][^*<\n]*?[^*\s<])\*(?=[\s.,;:!?)”"']|$)/g,'$1<em>$2</em>');
const TIPK={'Tip':'tip','Watch out':'warn','In the cloud':'cloud','Analogy':'ana'};
function renderVisual(b){
 if(b.k==='br')return `<aside class="ib-br"><b>From traditional GRC</b><div>${fmt(b.x)}</div></aside>`;
 if(b.k==='ap')return `<aside class="ib-ap"><b>${esc(b.t||'Apply it in an assessment')}</b>${b.x?`<div>${fmt(b.x)}</div>`:''}${b.s?`<ol>${b.s.map(x=>`<li>${fmt(x)}</li>`).join('')}</ol>`:''}</aside>`;
 if(b.k==='vis')return '';
 if(b.k==='h')return `<h5 class="ib-h">${fmt(b.x)}</h5>`;
 if(b.k==='gr')return `<aside class="ib-gr"><b>Why this matters for GRC</b><div>${fmt(b.x)}</div></aside>`;
 if(b.k==='simple')return `<aside class="ib-simple"><b>In simple words</b><p>${fmt(b.x)}</p></aside>`;
 if(b.k==='ex')return `<aside class="ib-ex"><b>${esc(b.t||'Example')}</b><div>${fmt(b.x)}</div></aside>`;
 if(b.k==='flow')return `<figure class="ib-flow${b.v?' v':''}">${b.t?`<figcaption>${esc(b.t)}</figcaption>`:''}<ol>${b.s.map((x,i)=>`<li><span class="n">${i+1}</span><b>${esc(x[0])}</b>${x[1]?`<small>${fmt(x[1])}</small>`:''}</li>`).join('')}</ol>${b.loop?`<div class="ib-loop">↻ ${fmt(b.loop)}</div>`:''}</figure>`;
 if(b.k==='cmp')return `<figure class="ib-cmp">${b.t?`<figcaption>${esc(b.t)}</figcaption>`:''}<div class="ib-scroll"><table><thead><tr>${b.h.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${b.r.map(r=>`<tr>${r.map((c,i)=>i?`<td>${fmt(c)}</td>`:`<th scope="row">${fmt(c)}</th>`).join('')}</tr>`).join('')}</tbody></table></div></figure>`;
 if(b.k==='cards')return `<div class="ib-cards">${b.c.map((c,i)=>`<div class="ib-card c${i%6}"><b>${esc(c[0])}</b><span>${fmt(c[1])}</span>${c[2]?`<em>${fmt(c[2])}</em>`:''}</div>`).join('')}</div>`;
 if(b.k==='fig')return `<figure class="ib-fig"><div class="ib-scroll">${b.svg}</div>${b.cap?`<figcaption>${fmt(b.cap)}</figcaption>`:''}</figure>`;
 return null;}
function renderBlocks(bl){return bl.map(b=>{const v=renderVisual(b);if(v!==null)return v;return b.k==='p'?`<p>${fmt(b.x)}</p>`:b.k==='ul'?`<ul class="pts">${b.x.map(x=>`<li>${fmt(x)}</li>`).join('')}</ul>`:b.k==='ol'?`<ol class="steps">${b.x.map(x=>`<li>${fmt(x)}</li>`).join('')}</ol>`:b.k==='code'?`<figure class="ex">${b.t?`<figcaption>${esc(b.t)}</figcaption>`:''}<pre><code>${esc(b.x)}</code></pre></figure>`:`<aside class="callout ${TIPK[b.kind]||'tip'}"><b>${esc(b.kind)}</b><span>${fmt(b.x)}</span></aside>`}).join('');}
const mins=l=>Math.max(1,Math.ceil((l.w||l.b.split(/\s+/).length)/150));
const openLessons=new Set();
const readPrefs=(()=>{try{return JSON.parse(localStorage.getItem('p2c-reader-prefs'))||{}}catch{return {}}})();
const bookmarks=(()=>{try{return new Set(JSON.parse(localStorage.getItem('p2c-bookmarks'))||[])}catch{return new Set()}})();
function storeReader(){try{localStorage.setItem('p2c-reader-prefs',JSON.stringify(readPrefs));localStorage.setItem('p2c-bookmarks',JSON.stringify([...bookmarks]))}catch{}}
function applyReader(){document.documentElement.style.setProperty('--reading-size',(readPrefs.font||16)+'px');document.documentElement.style.setProperty('--reading-width',(readPrefs.width||75)+'ch')}
applyReader();
function readerTools(){return `<div class="read-tools" aria-label="Reading preferences"><button type="button" id="smaller" aria-label="Smaller lesson font">A−</button><button type="button" id="larger" aria-label="Larger lesson font">A+</button><button type="button" id="readerWidth">${readPrefs.width===60?'Comfort width':'Wide reading'}</button><button type="button" id="allRead">Expand all lessons</button><span class="eyebrow">Reading settings saved on this device</span></div>`}
function lessonExtras(m,l,j){return '';}
function wireReader(id){
 document.getElementById('smaller')?.addEventListener('click',()=>{readPrefs.font=Math.max(14,(readPrefs.font||16)-1);storeReader();applyReader()});
 document.getElementById('larger')?.addEventListener('click',()=>{readPrefs.font=Math.min(23,(readPrefs.font||16)+1);storeReader();applyReader()});
 document.getElementById('readerWidth')?.addEventListener('click',()=>{readPrefs.width=readPrefs.width===60?75:60;storeReader();applyReader();document.getElementById('readerWidth').textContent=readPrefs.width===60?'Comfort width':'Wide reading'});
 document.getElementById('allRead')?.addEventListener('click',()=>{const m=M.find(x=>x.id===id);m.lessons.forEach(l=>openLessons.add(l.id));vModule(id,true)});
 app.querySelectorAll('[data-bookmark]').forEach(b=>b.onclick=()=>{const k=b.dataset.bookmark;bookmarks.has(k)?bookmarks.delete(k):bookmarks.add(k);storeReader();b.textContent=bookmarks.has(k)?'★ Bookmarked':'☆ Bookmark';b.setAttribute('aria-pressed',String(bookmarks.has(k))) });
 app.querySelectorAll('[data-reveal]').forEach(b=>b.onclick=()=>{const p=document.getElementById('reveal-'+b.dataset.reveal);p.hidden=!p.hidden;b.textContent=p.hidden?'Reveal explanation':'Hide explanation'});
}

const pad=n=>String(n).padStart(2,'0');
const chip=k=>k&&PROV[k]?`<span class="chip ${PROV[k].c}">${PROV[k].n}</span>`:'';
const tagsFor=m=>{const s=new Set(m.lessons.map(l=>l.tag).filter(Boolean)); if(s.has('all')) return '<span class="chip c-net">All 4 clouds</span>'; if(!s.size) return '<span class="chip c-net">Networking</span>'; return [...s].map(chip).join('');};
const CHECK='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function toast(t){document.querySelectorAll('.toast').forEach(x=>x.remove()); const el=document.createElement('div'); el.className='toast'; el.textContent=t; document.body.appendChild(el); setTimeout(()=>el.remove(),2000);}
function today(){return dayKey(new Date());}
function dayKey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}

/* ---------------- progress math ---------------- */
const modUnits=m=>m.lessons.length+m.qs.length;
const modDone=m=>m.lessons.filter(l=>S.ls[l.id]).length+m.qs.filter(q=>S.qz[q.id]===q.a).length;
const modPct=m=>Math.round(modDone(m)/modUnits(m)*100);
const modState=m=>{const p=modPct(m); return p>=100?'done':p>0?'prog':'off';};
function levelStats(n){const ms=M.filter(m=>m.lv===n); const u=ms.reduce((a,m)=>a+modUnits(m),0), d=ms.reduce((a,m)=>a+modDone(m),0); return {ms,u,d,p:u?Math.round(d/u*100):0,done:ms.filter(m=>modPct(m)===100).length};}
function overall(){const u=M.reduce((a,m)=>a+modUnits(m),0), d=M.reduce((a,m)=>a+modDone(m),0); return Math.round(d/u*100);}
function provStats(k){let t=0,d=0; M.forEach(m=>m.lessons.forEach(l=>{if(l.tag===k||l.tag==='all'){t++; if(S.ls[l.id]) d++;}})); return {t,d,p:t?Math.round(d/t*100):0};}
function nextUp(){
  const last=M.find(m=>m.id===S.last);
  const m=(last&&modPct(last)<100)?last:M.find(m=>modPct(m)<100);
  if(!m) return null;
  const l=m.lessons.find(l=>!S.ls[l.id]);
  return {m,what:l?l.t:'the checkpoint quiz'};
}
function minutesByDay(){const o={}; S.log.forEach(e=>{o[e.d]=(o[e.d]||0)+(+e.m||0);}); return o;}
function streak(){const by=minutesByDay(); let n=0; const d=new Date(); if(!by[dayKey(d)]) d.setDate(d.getDate()-1); while(by[dayKey(d)]){n++; d.setDate(d.getDate()-1);} return n;}
const correct=()=>M.flatMap(m=>m.qs).filter(q=>S.qz[q.id]===q.a).length;
const lessonsDone=()=>M.reduce((a,m)=>a+m.lessons.filter(l=>S.ls[l.id]).length,0);
const totalMins=()=>S.log.reduce((a,e)=>a+(+e.m||0),0);
const IC={
  first:'<rect x="4" y="7" width="16" height="11" rx="2"/><path d="M4 8l8 6 8-6"/>',
  l1:'<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  subnet:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  quiz:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  clouds:'<path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 10 4 4 0 0 0 7 18z"/>',
  streak:'<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-3 2-4.2 2-7 1.6 1 2.6 2.5 3 4 .2-2.6-.8-4.8 0-7z"/>',
  hours:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  expert:'<path d="M4 17l2-9 4 4 2-6 2 6 4-4 2 9z"/>',
  cert:'<circle cx="12" cy="9" r="5"/><path d="M9 13l-2 8 5-3 5 3-2-8"/>'
};
const BADGES=[
  ['first','First packet','Finish your first lesson',()=>lessonsDone()>=1],
  ['l1','Solid foundations','Complete Level 1',()=>levelStats(1).p===100],
  ['subnet','Subnet slicer','Complete IP Addressing & Subnetting',()=>modPct(M.find(m=>m.id==='m03'))===100],
  ['quiz','Sharp shooter','Answer 10 questions right',()=>correct()>=10],
  ['clouds','Cloud hopper','A lesson in each of the 4 clouds',()=>['aws','az','gcp','oci'].every(k=>M.some(m=>m.lessons.some(l=>l.tag===k&&S.ls[l.id])))],
  ['streak','Week warrior','Study 7 days in a row',()=>streak()>=7],
  ['hours','Ten hours in','Log 10 hours of study',()=>totalMins()>=600],
  ['expert','Cloud architect','Complete Level 5',()=>levelStats(5).p===100],
  ['cert','Certified','Earn a certification',()=>Object.keys(S.cert).length>0]
];
function updateTop(){const p=overall(); document.getElementById('topBar').style.width=p+'%'; document.getElementById('topPct').textContent=p+'%';}
function ringSVG(size,r,w,p,track,fill){const C=2*Math.PI*r,c=size/2; return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${track}" stroke-width="${w}"/><circle class="nf" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p/100)}" transform="rotate(-90 ${c} ${c})"/></svg>`;}

/* ---------------- dashboard ---------------- */
function vDashboard(){
  const p=overall(), nu=nextUp(), cl=nu?nu.m.lv:5, L=LV[cl-1];
  const hr=new Date().getHours(), greet=hr<5?'Late night session':hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  const who=(document.getElementById('who').textContent||'').split('@')[0].split(/[._\-0-9]/)[0];
  const nm=USER_NAME||(who?who.charAt(0).toUpperCase()+who.slice(1):'');
  const dateStr=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
  const doneMods=M.filter(m=>modPct(m)===100).length;
  const answered=M.flatMap(m=>m.qs).filter(q=>S.qz[q.id]!==undefined).length;
  const fresh=lessonsDone()===0&&correct()===0;
  const headline=fresh?'Your journey starts here':p===100?'Technical Academy complete':`Level ${cl} · ${L.name}`;
  const lede=fresh?`${M.length} modules take you from your first ping to multi-cloud architecture on AWS, Azure, Google Cloud and Oracle OCI.`:p===100?'Every technical module is finished. Pick a certification from Cert Paths and book it.':`${doneMods} of ${M.length} modules finished, ${lessonsDone()} lessons learned.`;
  const journey=LV.map(Lv=>{const s=levelStats(Lv.n),cur=Lv.n===cl&&p<100,done=s.p===100;
    return `<button class="flow-stage ${done?'flow-done':''} ${cur?'flow-current':''}" data-level="${Lv.n}" aria-label="Open level ${Lv.n}, ${esc(Lv.name)}, ${s.p} percent">
       <span class="flow-bubble" aria-hidden="true">${done?'✓':Lv.n}</span><span class="flow-copy"><strong>${esc(Lv.name)}</strong><small>${s.done}/${s.ms.length} modules · ${s.p}%</small></span></button>`;}).join('');
  const flowPct=Math.max(0,Math.min(100,p));
  const flowPath=`<svg class="flow-ribbon" viewBox="0 0 900 112" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="journey-ink" x1="0" x2="1"><stop offset="0" stop-color="#A1F2E4"/><stop offset=".5" stop-color="#F4D1FF"/><stop offset="1" stop-color="#FEE2B1"/></linearGradient></defs><path class="flow-rail" d="M60 57 C155 -5 214 -5 278 57 S415 119 482 57 S620 -5 687 57 S800 119 846 57"/><path class="flow-lit" d="M60 57 C155 -5 214 -5 278 57 S415 119 482 57 S620 -5 687 57 S800 119 846 57" style="stroke-dasharray:${Math.round(flowPct*10)} 1200"/><circle class="flow-traveler" r="6" fill="#FFF" stroke="#9EF0C0" stroke-width="3"><animateMotion dur="12s" repeatCount="indefinite" path="M60 57 C155 -5 214 -5 278 57 S415 119 482 57 S620 -5 687 57 S800 119 846 57"/></circle></svg>`;
  /* week chart: academy study log + workbook sessions, stacked */
  const byA=minutesByDay(), byW={}; bookEntries.forEach(e=>{const k=String(e.date||'').slice(0,10); byW[k]=(byW[k]||0)+(Number(e.minutes)||0);});
  const days=[]; for(let i=6;i>=0;i--){const d=new Date(); d.setDate(d.getDate()-i); const k=dayKey(d); days.push({l:d.toLocaleDateString(undefined,{weekday:'short'}).slice(0,3),a:byA[k]||0,w:byW[k]||0,t:i===0});}
  const wk=days.reduce((s,d)=>s+d.a+d.w,0), top=Math.ceil(Math.max(60,...days.map(d=>d.a+d.w))*1.18/30)*30;
  const bars=days.map((d,i)=>{const x=34+i*62, ha=d.a/top*96, hw=d.w/top*96, tot=d.a+d.w, y=112-ha-hw;
    return `${tot?`${ha?`<rect class="bar-a" x="${x}" y="${112-ha}" width="38" height="${ha}" rx="5"/>`:''}${hw?`<rect class="bar-w" x="${x}" y="${112-ha-hw}" width="38" height="${hw}" rx="5"/>`:''}<text class="v" x="${x+19}" y="${y-6}" text-anchor="middle">${tot}</text>`:`<rect x="${x}" y="110" width="38" height="2" rx="1" fill="var(--line)"/>`}<text class="${d.t?'today-l':''}" x="${x+19}" y="134" text-anchor="middle">${esc(d.l)}</text>`;}).join('');
  const inprog=M.filter(m=>modState(m)==='prog');
  const shelf=(inprog.length?inprog:M.filter(m=>modState(m)==='off')).slice(0,3);
  const earned=BADGES.filter(b=>b[3]()).length;
  const grcTotal=GRC.reduce((a,c)=>a+c.lessons.length,0), grcDone=Object.entries(grcState).filter(([k,v])=>AIC_KEY.test(k)&&v&&v.done).length, grcP=grcTotal?Math.round(grcDone/grcTotal*100):0;
  const secProgress=secOverall();
  const wbMins=bookEntries.reduce((a,e)=>a+(Number(e.minutes)||0),0), lastE=bookEntries[0];
  const allMins=totalMins()+wbMins;
  const cz=S.cisa||{}, cplan=(cz.plans&&cz.plans[cz.planMode||'normal'])||{}, examD=cplan.examDate||(cz.planMode==='relaxed'?'2027-01-29':'2027-01-13'), todayK=dayKey(new Date());
  const cDays=Math.max(0,Math.round((new Date(examD+'T12:00:00')-new Date(todayK+'T12:00:00'))/864e5));
  const examLabel=new Date(examD+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
  const cDue=Object.values(cz.mistakes||{}).filter(x=>x&&!x.x&&x.d<=todayK).length, cTopics=Object.values(cz.complete||{}).filter(Boolean).length;
  const K=(c,ic,b,s)=>`<div class="kpi" style="--c:var(${c})"><span class="kpi-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span><div><b>${b}</b><span>${s}</span></div></div>`;
  app.innerHTML=`<div class="view">
  <section class="view-head ed-head"><span class="eyebrow">${esc(dateStr)}</span><h2>${greet}${nm?', '+esc(nm):''}</h2></section>
  <section class="ed-card ed-hero">
    <div class="ed-hero-main">
      <span class="ed-kicker">${fresh?'Start here':nu?'Continue learning':'Technical Academy complete'}</span>
      <h3 class="ed-title">${nu?esc(nu.m.t):'Every module finished'}</h3>
      <p class="ed-sub">${nu?`Module ${pad(nu.m.n)} · next: ${esc(nu.what)}`:'Pick a certification from Cert Paths and book it.'}</p>
      ${nu?`<span class="d3-bar ed-bar"><i style="width:${modPct(nu.m)}%"></i></span>`:''}
      <div class="ed-actions">${nu?`<a class="btn primary" href="#${nu.m.id}">${fresh?'Start module 01':'Continue lesson'} →</a>`:''}<a class="btn" href="#courses">All modules</a></div>
    </div>
    <a class="ed-ring" href="#courses" aria-label="Technical Academy ${p} percent">${ringSVG(180,80,14,p,'rgba(10,37,64,.07)','#0A84FF')}<span><b>${p}%</b><small>Technical</small></span></a>
  </section>
  <h3 class="ed-sect">Today <span>${esc(new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'}))}</span></h3>
  <div id="goalSlot"><section class="ed-card rd-card rd-goal"><div class="rd-load">Loading your daily goal…</div></section></div>
  <div id="coachSlot"></div>
  ${todayCardHTML()}
  <h3 class="ed-sect">Exam readiness <span>CISA · ${cDays} days to go</span></h3>
  <div class="rd-grid" id="readySlot"><section class="ed-card rd-card"><div class="rd-load">Checking your exam pace…</div></section><section class="ed-card rd-card"><div class="rd-load">Finding your weak spots…</div></section></div>
  <h3 class="ed-sect">Your academies</h3>
  <div class="ed-acads">${[['#courses','--ok','<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5 6.6 17M12 11.5l5.4 5.5"/></svg>','Technical Academy',p,`${lessonsDone()} of ${M.reduce((n,m)=>n+m.lessons.length,0)} lessons`],
           ['#grc','--signal','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>','AI Compliance Academy',grcP,`${grcDone} of ${grcTotal} lessons`],
           ['#appsec','--accent-3','<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 14l-2 2 2 2M16 14l2 2-2 2"/></svg>','Application Academy',secProgress.p,`${secProgress.read} lessons read`],
           ['#cisa','--accent','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7l9-4 9 4-9 4-9-4zM6 10v6c4 3 8 3 12 0v-6"/></svg>','CISA Hub',Math.round(cTopics/60*100),`${cTopics} of 60 topics`]].map(([h,c,ic,n,pp,sub])=>`<a class="ed-card ed-acad" href="${h}" style="--c:var(${c})"><span class="ed-acad-top"><span class="d3-ic">${ic}</span><span class="ed-acad-n">${n}</span><span class="ed-acad-p">${pp}%</span></span><span class="d3-bar"><i style="width:${pp}%"></i></span><span class="ed-acad-s">${sub}</span></a>`).join('')}</div>
  <details class="ed-more" id="dashMore"><summary><span>More stats</span><small>Last 7 days · learning path · cloud mastery · achievements</small></summary><div class="ed-more-body">
  ${weekCardHTML()}
  <h3 class="ed-sect">Learning path <span>Technical Academy levels</span></h3>
  <section class="ed-card ed-path"><div class="d3-levels">${LV.map(Lv=>{const st=levelStats(Lv.n),cur=Lv.n===cl&&p<100;return `<button type="button" class="d3-level ${cur?'on':''}" data-level="${Lv.n}" aria-label="Open level ${Lv.n}, ${esc(Lv.name)}, ${st.p} percent"><span class="d3-lv-k">${pad(Lv.n)} · ${esc(Lv.tier)}</span><strong>${esc(Lv.name)}</strong><span class="d3-bar"><i style="width:${st.p}%"></i></span><span class="d3-lv-m">${st.done}/${st.ms.length} modules</span></button>`;}).join('')}</div></section>
  <div class="dash-grid">
    <div class="panel week"><div class="panel-h"><h3>This week</h3><span class="eyebrow">${(wk/60).toFixed(1)} h studied</span></div>
      <svg viewBox="0 0 470 142" role="img" aria-label="Minutes studied on each of the last 7 days"><line class="grid" x1="20" x2="462" y1="16" y2="16"/><text x="20" y="11">${top} min</text><line x1="20" x2="462" y1="112" y2="112" stroke="var(--line)"/>${bars}</svg>
      <div class="legend"><span><i style="background:var(--accent)"></i>Academy study log</span><span><i style="background:var(--accent-2);opacity:.75"></i>Workbook sessions</span></div></div>
    <div class="panel"><div class="panel-h"><h3>Cloud mastery</h3><span class="eyebrow">lessons learned</span></div>
      <div class="prov">${Object.keys(PROV).map(k=>{const s=provStats(k); return `<div class="prov-row"><span class="mono-badge" style="background:var(${PROV[k].v})">${PROV[k].n.slice(0,2).toUpperCase()}</span><div><div class="nm"><b>${PROV[k].n}</b><span>${s.d} of ${s.t}</span></div><div class="track"><i style="width:${s.p}%;background:var(${PROV[k].v})"></i></div></div><span class="n">${s.p}%</span></div>`;}).join('')}</div></div>
  </div>
  <div class="sect-title"><h3>Achievements</h3><span class="eyebrow">${earned} of ${BADGES.length} earned</span></div>
  <div class="badges">${BADGES.map(([k,n,d,t])=>{const on=t(); return `<div class="badge ${on?'on':'off'}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg></span><div><b>${n}</b><span>${on?'Earned':d}</span></div></div>`;}).join('')}</div>
  </div></details>
  </div>`;
  app.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>go('courses',+b.dataset.level));
  { const dm=document.getElementById('dashMore'); if(dm){ try{ dm.open=localStorage.getItem('p2c-dash-more')==='1'; }catch(e){} dm.addEventListener('toggle',()=>{ try{ localStorage.setItem('p2c-dash-more',dm.open?'1':'0'); }catch(e){} }); } }
  wireToday();
  fillReadiness();
}

/* ---------------- courses ---------------- */
function card(m){const st=modState(m), p=modPct(m); return `<a class="mcard ${st}" href="#${m.id}">
  <div class="row"><span class="num">MODULE ${pad(m.n)}</span><span class="pill ${st}">${st==='done'?'Complete':st==='prog'?p+'%':'Not started'}</span></div>
  <h4>${esc(m.t)}</h4><p>${esc(m.goal)}</p>
  <div class="chips">${tagsFor(m)}</div>
  <div class="foot"><span>${m.lessons.length} lessons · ${m.qs.length} questions</span><span>≈ ${m.h} h</span></div>
  <div class="bar"><i style="width:${p}%"></i></div></a>`;}
let fProv='all', fQ='';
function vCourses(){
  const tl=M.reduce((a,m)=>a+m.lessons.length,0), tq=M.reduce((a,m)=>a+m.qs.length,0);
  app.innerHTML=`<div class="view">
  <div class="view-head"><div class="eyebrow">Courses</div><h2>Five levels, beginner to expert</h2><p class="lede">${M.length} modules, ${tl} lessons and ${tq} checkpoint questions. Work through them in order, or filter to one cloud.</p></div>
  <div class="filters">
    ${[['all','All'],['net','Networking'],['aws','AWS'],['az','Azure'],['gcp','Google Cloud'],['oci','OCI']].map(([k,n])=>`<button class="fbtn" data-f="${k}" aria-pressed="${fProv===k}">${n}</button>`).join('')}
    <input class="search" id="q" type="search" placeholder="Search lessons and terms" value="${esc(fQ)}" aria-label="Search lessons and terms">
  </div>
  <div id="toc"></div></div>`;
  const resetBtn=document.createElement('button');resetBtn.className='btn small';resetBtn.textContent='Start new technical learning attempt';resetBtn.style.marginBottom='14px';app.querySelector('#toc').before(resetBtn);
  resetBtn.onclick=async()=>{if(!(await uiConfirm('Start a fresh technical course attempt? Completion and quiz progress will restart, but your lesson notes and study log will remain. A history backup is saved in this browser.')))return;const k='p2c-technical-history-'+(v3uid||'local');let hist=[];try{hist=JSON.parse(localStorage.getItem(k)||'[]')}catch{}hist.push({at:new Date().toISOString(),lessons:S.ls,quizzes:S.qz});localStorage.setItem(k,JSON.stringify(hist));S.ls={};S.qz={};save();vCourses();};
  drawToc();
  app.querySelectorAll('.fbtn').forEach(b=>b.onclick=()=>{fProv=b.dataset.f; app.querySelectorAll('.fbtn').forEach(x=>x.setAttribute('aria-pressed',x===b)); drawToc();});
  document.getElementById('q').oninput=e=>{fQ=e.target.value; drawToc();};
}
function drawToc(){
  const q=fQ.trim().toLowerCase();
  const match=m=>{
    if(fProv==='net'&&m.lv>2) return false;
    if(!['all','net'].includes(fProv)&&!m.lessons.some(l=>l.tag===fProv||l.tag==='all')) return false;
    if(!q) return true;
    return (m.t+' '+m.goal+' '+m.terms.join(' ')+' '+m.lessons.map(l=>l.t+' '+l.b).join(' ')).toLowerCase().includes(q);
  };
  const html=LV.map(L=>{const ms=M.filter(m=>m.lv===L.n&&match(m)); if(!ms.length) return ''; const s=levelStats(L.n); return `
    <section class="lv-sec" id="lv-${L.n}">
      <div class="lv-head"><span class="lv-num">${pad(L.n)}</span><div><div class="eyebrow">Level ${L.n} · ${L.tier}</div><h3>${L.name}</h3><p>${esc(L.d)}</p></div>
        <div class="lvp"><div class="track"><i style="width:${s.p}%;background:var(--ok)"></i></div><div>${s.done}/${s.ms.length} modules · ${s.p}%</div></div></div>
      <div class="cards">${ms.map(card).join('')}</div>
    </section>`;}).join('');
  document.getElementById('toc').innerHTML=html||'<p class="empty">No modules match that search.</p>';
}

/* ---------------- module ---------------- */
function vModule(id,keepY){
  const m=M.find(x=>x.id===id); if(!m){go('courses'); return;}
  if(S.last!==id){S.last=id; save();}
  const L=LV[m.lv-1], p=modPct(m), i=M.indexOf(m), prev=M[i-1], next=M[i+1];
  const nRight=m.qs.filter(q=>S.qz[q.id]===q.a).length, nAns=m.qs.filter(q=>S.qz[q.id]!==undefined).length;
  app.innerHTML=`<div class="${keepY?'':'view'}">
  <section class="mhero">
    <div>
      <div class="crumb"><a href="#courses">Courses</a> / Level ${m.lv} · ${L.name} / Module ${pad(m.n)}</div>
      <h2>${esc(m.t)}</h2><p class="goal">${esc(m.goal)}</p>
      <div class="meta">${tagsFor(m)}<span class="pill">${L.tier}</span><span class="pill">${m.lessons.length} lessons</span><span class="pill">≈ ${m.h} h</span></div>
    </div>
    <div class="mring">${ringSVG(84,34,8,p,'rgba(255,255,255,.22)','#fff')}<div><b>${p}%</b><span>${modDone(m)} of ${modUnits(m)} done</span></div></div>
    <div class="segs" aria-hidden="true">${m.lessons.map(l=>`<i class="${S.ls[l.id]?'on':''}"></i>`).join('')}${m.qs.map(q=>`<i class="qs ${S.qz[q.id]===q.a?'on':''}"></i>`).join('')}</div>
  </section>
  <div class="readbar" aria-hidden="true"><i id="readbar"></i></div>${readerTools()}<div class="mbody">
    <div>
      ${DIAG[m.id]?`<section class="msect bigpic" id="s-big"><div class="h"><h3>The big picture</h3><span class="eyebrow">tap each step</span></div><p class="bp-t">${esc(DIAG[m.id].t)}</p><div class="flow" role="group" aria-label="${esc(DIAG[m.id].t)}">${DIAG[m.id].s.map((x,i)=>`${i?'<span class="farrow" aria-hidden="true"></span>':''}<button class="fstep" type="button" data-fs="${i}" aria-pressed="${i===0}"><span class="fn">${i+1}</span><span class="fl">${esc(x[0])}</span></button>`).join('')}</div><div class="fdesc" id="fdesc" aria-live="polite"><b>${esc(DIAG[m.id].s[0][0])}</b><span>${fmt(DIAG[m.id].s[0][1])}</span></div></section>`:''}
      <section class="msect" id="s-lessons"><div class="h"><h3>Lessons</h3><span class="eyebrow">${m.lessons.filter(l=>S.ls[l.id]).length} of ${m.lessons.length} learned</span></div>
        <div class="timeline">${m.lessons.map((l,j)=>{const on=!!S.ls[l.id]; return `<article class="lesson ${on?'on':''}" id="L-${l.id}">
          <span class="lnode">${on?CHECK:j+1}</span>
          <div class="lcard"><div class="ln">Lesson ${m.n}.${j+1} · ${mins(l)} min read ${l.tag&&l.tag!=='all'&&!m.p?chip(l.tag):''}</div><h4>${esc(l.t)}</h4>
            ${on&&!openLessons.has(l.id)?`<div class="lfoot"><button class="learn" data-ls="${l.id}" aria-pressed="true">${CHECK} Learned</button><button class="linkbtn" data-open="${l.id}">Review lesson</button></div>`:`<div class="lbody">${renderBlocks([...((TECH_PLUS[m.id]||[])[j]?.pre||[]),...l.blocks.filter(b=>!b.th)])}${renderBlocks((TECH_PLUS[m.id]||[])[j]?.post||[])}${l.blocks.some(b=>b.th)?`<details class="deeper think"><summary>Think it through: mental model, scenario and design reasoning</summary><div class="inner">${renderBlocks(l.blocks.filter(b=>b.th))}</div></details>`:''}${lessonExtras(m,l,j)}</div>
            <div class="lfoot"><button class="learn" data-ls="${l.id}" aria-pressed="${on}">${on?CHECK+' Learned':CHECK+' Mark as learned'}</button><button class="bm" data-bookmark="${l.id}" aria-pressed="${bookmarks.has(l.id)}">${bookmarks.has(l.id)?'★ Bookmarked':'☆ Bookmark'}</button>${on?`<button class="linkbtn" data-close="${l.id}">Collapse</button>`:''}</div>`}</div></article>`;}).join('')}</div>
      </section>
      <section class="msect" id="s-sum"><div class="h"><h3>Key takeaways</h3><span class="eyebrow">module ${pad(m.n)}</span></div><ul class="takeaways">${m.sum.map(x=>`<li>${fmt(x)}</li>`).join('')}</ul></section>
      <section class="msect" id="s-quiz"><div class="h"><h3>Checkpoint</h3><span class="eyebrow">${nAns?`${nRight} of ${m.qs.length} correct`:`${m.qs.length} questions`}</span></div>
        ${m.qs.map((q,j)=>{const a=S.qz[q.id], done=a!==undefined; return `<div class="q"><p><span>Q${j+1}</span>${esc(q.t)}</p><div class="opts">${q.o.map((o,k)=>`<button class="opt ${done&&k===q.a?'right':''} ${done&&k===a&&a!==q.a?'wrong':''}" data-q="${q.id}" data-k="${k}" ${done?'disabled':''}><span class="ltr">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>${done?`<div class="explain"><span><b>${a===q.a?'Correct.':'Not quite.'}</b> ${esc(q.x)}</span>${a!==q.a?`<button class="linkbtn" data-retry="${q.id}">Try again</button>`:''}</div>`:''}</div>`;}).join('')}
      </section>
      ${p===100?`<div class="done-banner"><div><b>Module ${pad(m.n)} complete</b><span>${next?`Next: ${pad(next.n)} ${esc(next.t)}`:'That was the final module.'}</span></div>${next?`<a class="btn primary" href="#${next.id}">Start next module →</a>`:`<a class="btn primary" href="#certs">See cert paths →</a>`}</div>`:''}
      <section class="msect" id="s-notes"><div class="h"><h3>Notes</h3><span class="eyebrow">saved automatically</span></div><textarea class="notes" id="notes-${m.id}" placeholder="Key points, commands to remember, questions to revisit…">${esc(S.notes[m.id]||'')}</textarea></section>
      <nav class="pager">${prev?`<a class="btn" href="#${prev.id}">← ${pad(prev.n)} ${esc(prev.t)}</a>`:'<span></span>'}${next?`<a class="btn" href="#${next.id}">${pad(next.n)} ${esc(next.t)} →</a>`:''}</nav>
    </div>
    <aside class="mside">
      <div class="panel outline-panel"><h5>In this module</h5><div class="outline">${DIAG[m.id]?'<button data-jump="s-big"><i></i>The big picture</button>':''}${m.lessons.map((l,j)=>`<button class="${S.ls[l.id]?'on':''}" data-jump="L-${l.id}"><i></i>${m.n}.${j+1} ${esc(l.t)}</button>`).join('')}<button data-jump="s-sum"><i></i>Key takeaways</button><button class="${nRight===m.qs.length?'on':''}" data-jump="s-quiz"><i></i>Checkpoint</button><button data-jump="s-notes"><i></i>Notes</button></div></div>
      <div class="panel"><h5>Key terms · tap for meaning</h5><div class="terms">${m.terms.map(t=>`<button type="button" class="termbtn" data-term="${esc(t)}">${esc(t)}</button>`).join('')}</div><p class="termdef" id="termdef" aria-live="polite" hidden></p></div>
      <div class="panel"><h5>Official reading</h5><ul>${m.res.map(r=>`<li><a href="${r[1]}" target="_blank" rel="noopener">${esc(r[0])}</a></li>`).join('')}</ul></div>
      <div class="panel"><h5>Log study time</h5><div class="field"><select id="qmin" aria-label="Minutes">${[15,30,45,60,90,120].map(v=>`<option value="${v}" ${v===45?'selected':''}>${v} min</option>`).join('')}</select><button class="btn small" id="qlog">Add to log</button></div></div>
    </aside>
  </div></div>`;
  wireReader(id);
  app.querySelectorAll('[data-fs]').forEach(b=>b.onclick=()=>{const st=DIAG[m.id].s[+b.dataset.fs];app.querySelectorAll('[data-fs]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const d=document.getElementById('fdesc');d.innerHTML=`<b>${esc(st[0])}</b><span>${fmt(st[1])}</span>`;});
  app.querySelectorAll('[data-term]').forEach(b=>b.onclick=()=>{const t=b.dataset.term,p=document.getElementById('termdef');const on=b.getAttribute('aria-pressed')==='true';app.querySelectorAll('[data-term]').forEach(x=>x.setAttribute('aria-pressed','false'));if(on){p.hidden=true;return;}b.setAttribute('aria-pressed','true');p.hidden=false;p.innerHTML=`<b>${esc(t)}</b> ${esc(GLOSS[t]||'Defined in this module.')}`;});
  const rerender=()=>{const y=window.scrollY; vModule(id,true); window.scrollTo(0,y);};
  const done=fn=>{const before=modPct(m); fn(); save(); rerender(); if(before<100&&modPct(m)===100) toast('Module '+pad(m.n)+' complete');};
  app.querySelectorAll('[data-ls]').forEach(b=>b.onclick=()=>{const k=b.dataset.ls, was=!!S.ls[k];
    done(()=>{if(was) delete S.ls[k]; else {S.ls[k]=1; openLessons.delete(k);}});
    if(!was){const idx=m.lessons.findIndex(l=>l.id===k), nx=m.lessons.slice(idx+1).find(l=>!S.ls[l.id]); const el=document.getElementById(nx?'L-'+nx.id:'s-quiz'); if(el) el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}});
  app.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{openLessons.add(b.dataset.open); rerender();});
  app.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{openLessons.delete(b.dataset.close); rerender(); const el=document.getElementById('L-'+b.dataset.close); if(el) el.scrollIntoView({block:'start'});});
  app.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>done(()=>{S.qz[b.dataset.q]=+b.dataset.k;}));
  app.querySelectorAll('[data-retry]').forEach(b=>b.onclick=()=>done(()=>{delete S.qz[b.dataset.retry];}));
  app.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{const el=document.getElementById(b.dataset.jump); if(el) el.scrollIntoView({behavior:'smooth',block:'start'});});
  let nt; document.getElementById('notes-'+m.id).oninput=e=>{const v=e.target.value; if(v) S.notes[m.id]=v; else delete S.notes[m.id]; clearTimeout(nt); nt=setTimeout(save,700);};
  document.getElementById('qlog').onclick=()=>{const v=+document.getElementById('qmin').value; S.log.unshift({d:today(),m:v,mod:m.id}); S.log=S.log.slice(0,400); save(); toast('Logged '+v+' min');};
}

/* ---------------- cross-module knowledge explorer ---------------- */
let exploreQ='', glossLetter='';
function vExplore(){
 const all=M.flatMap(m=>m.lessons.map((l,i)=>({m,l,i})));
 const termIndex=M.flatMap(m=>m.terms.map(t=>({term:t,m}))).filter((o,i,a)=>a.findIndex(v=>v.term.toLowerCase()===o.term.toLowerCase())===i).sort((a,b)=>a.term.localeCompare(b.term,undefined,{sensitivity:'base'}));
 const letters=[...new Set(termIndex.map(o=>/[a-z]/i.test(o.term[0])?o.term[0].toUpperCase():'#'))];
 app.innerHTML=`<section class="view"><div class="view-head"><div class="eyebrow">Knowledge explorer</div><h2>Explore & Glossary</h2><p class="lede">Search every lesson, or browse ${termIndex.length} terms with plain-English definitions. Bookmarked lessons appear here when the search is empty.</p></div><input id="globalQuery" type="search" placeholder="Search DNS, routing, IAM, BGP, risk…" value="${esc(exploreQ)}" aria-label="Search all learning content"><div class="az" role="group" aria-label="Glossary letters"><button type="button" data-letter="" aria-pressed="${!glossLetter}">All</button>${letters.map(L=>`<button type="button" data-letter="${L}" aria-pressed="${glossLetter===L}">${L}</button>`).join('')}</div><div id="exploreResults"></div></section>`;
 const draw=()=>{const q=exploreQ.trim().toLowerCase();
  const lessons=all.filter(({m,l})=>!q?bookmarks.has(l.id):(m.t+' '+l.t+' '+l.b).toLowerCase().includes(q)).slice(0,60);
  let terms=termIndex.filter(o=>!glossLetter||(glossLetter==='#'?!/[a-z]/i.test(o.term[0]):o.term[0].toUpperCase()===glossLetter));
  if(q) terms=terms.filter(o=>(o.term+' '+(GLOSS[o.term]||'')).toLowerCase().includes(q));
  document.getElementById('exploreResults').innerHTML=`<div class="sect-title"><h3>${q?'Matching lessons':'Your bookmarked lessons'}</h3><span class="eyebrow">${lessons.length} shown</span></div><div class="cards">${lessons.map(({m,l})=>`<a class="mcard" href="#${m.id}" data-target="${l.id}"><div class="num">${esc(m.t)}</div><h4>${esc(l.t)}</h4><p>${esc(l.b.replace(/\*\*/g,'').slice(0,150))}…</p></a>`).join('')||`<p class="empty">${q?'No lessons matched.':'No bookmarks yet. Use ☆ Bookmark under any lesson.'}</p>`}</div>
  <div class="sect-title"><h3>Glossary</h3><span class="eyebrow">${terms.length} terms</span></div><div class="term-grid">${terms.map(({term,m})=>`<div class="term-entry"><b>${esc(term)}</b><p>${esc(GLOSS[term]||'')}</p><a href="#${m.id}">Learn it in ${pad(m.n)} · ${esc(m.t)} →</a></div>`).join('')||'<p class="empty">No terms match.</p>'}</div>`;};
 draw();
 document.getElementById('globalQuery').oninput=e=>{exploreQ=e.target.value;draw()};
 app.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>{glossLetter=b.dataset.letter;app.querySelectorAll('[data-letter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();});
 app.addEventListener('click',e=>{let el=e.target.closest('[data-target]');if(el){openLessons.add(el.dataset.target);setTimeout(()=>document.getElementById('L-'+el.dataset.target)?.scrollIntoView({block:'start'}),80)}},{once:true});
}

/* ---------------- rosetta ---------------- */
function vRosetta(){
  app.innerHTML=`<div class="view">
  <div class="view-head"><div class="eyebrow">Cloud Rosetta</div><h2>One concept, four names</h2><p class="lede">The same networking building block as each provider names it. Learn the concept once, then translate. Keep this open while you work through Levels 3 and 4.</p></div>
  <div class="tscroll"><table><thead><tr><th>Concept</th><th><span class="dot" style="background:var(--aws)"></span>AWS</th><th><span class="dot" style="background:var(--az)"></span>Azure</th><th><span class="dot" style="background:var(--gcp)"></span>Google Cloud</th><th><span class="dot" style="background:var(--oci)"></span>Oracle OCI</th></tr></thead>
  <tbody>${ROSETTA.map(r=>`<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="note">Providers rename and add services often. When a name here does not match the console, check the provider’s networking documentation linked inside each deep-dive module.</p></div>`;
}

/* ---------------- subnet calculator ---------------- */
const ip2n=s=>{const p=s.split('.').map(Number); if(p.length!==4||p.some(x=>!Number.isInteger(x)||x<0||x>255)) return null; return ((p[0]<<24)>>>0)+(p[1]<<16)+(p[2]<<8)+p[3];};
const n2ip=n=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
let snIn='10.20.0.0/16', snSplit=24;
function vSubnets(){
  app.innerHTML=`<div class="view">
  <div class="view-head"><div class="eyebrow">Subnet Calculator</div><h2>Slice any IPv4 block</h2><p class="lede">Type a block to see its range, the binary split between network and host bits, usable addresses in each cloud, and how it divides into smaller subnets.</p></div>
  <div class="sn-grid">
    <div class="panel"><label class="eyebrow" for="cidr">IPv4 block</label><div class="field" style="margin-top:6px"><input id="cidr" value="${esc(snIn)}" spellcheck="false" autocomplete="off"></div><div id="snOut"></div></div>
    <div class="panel"><div class="eyebrow">Usable addresses per subnet</div><div id="snCloud"></div></div>
  </div>
  <div class="panel" style="margin-top:16px"><div class="field"><span class="eyebrow">Split into</span><select id="split" aria-label="New prefix"></select><span id="splitInfo" class="mono" style="color:var(--muted)"></span></div><div id="splitOut" style="margin-top:12px"></div></div></div>`;
  const inp=document.getElementById('cidr'); inp.oninput=()=>{snIn=inp.value; calc();};
  document.getElementById('split').onchange=e=>{snSplit=+e.target.value; calc();};
  calc();
}
function calc(){
  const out=document.getElementById('snOut'), cl=document.getElementById('snCloud'), sp=document.getElementById('splitOut'), sel=document.getElementById('split'), si=document.getElementById('splitInfo');
  const mt=snIn.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/); const ip=mt?ip2n(mt[1]):null, p=mt?+mt[2]:-1;
  if(ip===null||p<0||p>32){out.innerHTML='<p class="err">Enter a block like 10.0.0.0/16: four numbers from 0 to 255, then / and a prefix from 0 to 32.</p>'; cl.innerHTML=''; sp.innerHTML=''; sel.innerHTML=''; si.textContent=''; return;}
  const mask=p===0?0:(0xFFFFFFFF<<(32-p))>>>0, net=(ip&mask)>>>0, size=2**(32-p), bc=net+size-1;
  const bin=n2ip(net).split('.').map(o=>(+o).toString(2).padStart(8,'0')).join('');
  const bits=bin.split('').map((b,i)=>`<span class="${i<p?'n':'h'}">${b}</span>${(i%8===7&&i<31)?'.':''}`).join('');
  const priv=(net>=ip2n('10.0.0.0')&&bc<=ip2n('10.255.255.255'))||(net>=ip2n('172.16.0.0')&&bc<=ip2n('172.31.255.255'))||(net>=ip2n('192.168.0.0')&&bc<=ip2n('192.168.255.255'));
  out.innerHTML=`<dl class="kv"><dt>Network</dt><dd>${n2ip(net)}/${p}${net!==ip?' <span style="color:var(--signal)">(normalised)</span>':''}</dd><dt>Range</dt><dd>${n2ip(net)} – ${n2ip(bc)}</dd><dt>Subnet mask</dt><dd>${n2ip(mask)}</dd><dt>Wildcard</dt><dd>${n2ip((~mask)>>>0)}</dd><dt>Addresses</dt><dd>${size.toLocaleString()}</dd><dt>Classic usable</dt><dd>${p>=31?size:(size-2).toLocaleString()}</dd><dt>RFC 1918</dt><dd>${priv?'Yes, private':'No, not a private range'}</dd></dl><div class="bits" aria-label="Binary">${bits}</div>`;
  const clouds=[['aws',5,16,28,'VPC and subnet: /16 to /28'],['az',5,2,29,'Smallest subnet /29'],['gcp',4,8,29,'Smallest IPv4 subnet /29'],['oci',3,16,30,'VCN and subnet: /16 to /30']];
  cl.innerHTML=`<dl class="kv">${clouds.map(([k,r,mn,mx,nt])=>{const ok=p>=mn&&p<=mx; return `<dt><span class="dot" style="background:var(${PROV[k].v})"></span>${PROV[k].n}</dt><dd>${ok?(size-r).toLocaleString()+' usable <span style="color:var(--muted)">(−'+r+')</span>':'<span style="color:var(--bad)">/'+p+' not allowed</span>'}<br><span style="color:var(--muted);font-family:var(--f-body);font-size:12.5px">${nt}</span></dd>`;}).join('')}</dl>`;
  const opts=[]; for(let n=p+1;n<=Math.min(32,p+16);n++) opts.push(n);
  if(!opts.length){sel.innerHTML=''; si.textContent='A /32 cannot be split'; sp.innerHTML=''; return;}
  if(!opts.includes(snSplit)) snSplit=opts.includes(24)?24:opts[Math.min(2,opts.length-1)];
  sel.innerHTML=opts.map(n=>`<option value="${n}" ${n===snSplit?'selected':''}>/${n}</option>`).join('');
  const cnt=2**(snSplit-p), each=2**(32-snSplit), show=Math.min(cnt,64);
  si.textContent=`${cnt.toLocaleString()} subnets × ${each.toLocaleString()} addresses`;
  let rows=''; for(let i=0;i<show;i++){const s=net+i*each; rows+=`<tr><td class="mono">${i+1}</td><td class="mono">${n2ip(s)}/${snSplit}</td><td class="mono">${n2ip(s)} – ${n2ip(s+each-1)}</td><td class="mono">${Math.max(0,each-5).toLocaleString()}</td></tr>`;}
  sp.innerHTML=`<div class="tscroll"><table><thead><tr><th>#</th><th>Subnet</th><th>Range</th><th>AWS / Azure usable</th></tr></thead><tbody>${rows}</tbody></table></div>${cnt>show?`<p class="empty">Showing the first ${show} of ${cnt.toLocaleString()}.</p>`:''}`;
}

/* ---------------- certs ---------------- */
function vCerts(){
  app.innerHTML=`<div class="view">
  <div class="view-head"><div class="eyebrow">Cert Paths</div><h2>Certification roadmap</h2><p class="lede">Each column runs from foundational to expert. Tick a certification when you pass it. The networking track pairs with Levels 1–2; the cloud tracks with Levels 3–5.</p></div>
  <div class="cert-cols">${CERTS.map(c=>`<div class="cert-col"><h3><span class="chip ${c.c}" style="border:0;padding:0"></span>${c.n}</h3>${c.items.map(([id,n,d])=>`<div class="cert ${S.cert[id]?'on':''}"><button class="check" data-cert="${id}" aria-pressed="${!!S.cert[id]}" aria-label="Mark ${esc(n)} earned">${CHECK}</button><div><b>${esc(n)}</b><span>${esc(d)}</span></div></div>`).join('')}</div>`).join('')}</div>
  <p class="note">AWS retired the Advanced Networking – Specialty exam; its last exam date was 25 August 2026. For deep AWS networking, the Solutions Architect – Professional and Security – Specialty exams are the usual next steps. Exam codes and versions change, so confirm on the vendor’s site before you book.</p></div>`;
  app.querySelectorAll('[data-cert]').forEach(b=>b.onclick=()=>{const k=b.dataset.cert; if(S.cert[k]) delete S.cert[k]; else S.cert[k]=1; b.setAttribute('aria-pressed',!!S.cert[k]); b.parentElement.classList.toggle('on',!!S.cert[k]); save();});
}

/* ---------------- log ---------------- */
function vLog(){
  const by=minutesByDay(), end=new Date(), start=new Date(end); start.setDate(start.getDate()-(7*17-1)-end.getDay());
  let cells=''; const d=new Date(start), tk=today();
  while(d<=end){const k=dayKey(d), m=by[k]||0; cells+=`<i class="${m>=90?'l3':m>=45?'l2':m>0?'l1':''} ${k===tk?'today':''}" title="${k}: ${m} min"></i>`; d.setDate(d.getDate()+1);}
  const week=Object.entries(by).filter(([k])=>(end-new Date(k+'T00:00'))/864e5<7).reduce((a,[,v])=>a+v,0);
  app.innerHTML=`<div class="view">
  <div class="view-head"><div class="eyebrow">Study Log</div><h2>Consistency beats cramming</h2><p class="lede">Log each session. The grid shows the last 17 weeks; darker squares mean longer sessions.</p></div>
  <div class="stats" style="margin:0 0 16px"><div class="stat"><b>${streak()}</b><span>Day streak</span></div><div class="stat"><b>${(week/60).toFixed(1)}h</b><span>Last 7 days</span></div><div class="stat"><b>${(totalMins()/60).toFixed(1)}h</b><span>All time</span></div><div class="stat"><b>${S.log.length}</b><span>Sessions</span></div></div>
  <div class="panel" style="margin-bottom:16px"><div class="heat" aria-label="Study activity grid">${cells}</div></div>
  <div class="panel">
    <form class="log-form" id="lf">
      <label for="ld">Date<input type="date" id="ld" value="${today()}" max="${today()}"></label>
      <label for="lm">Minutes<input type="number" id="lm" min="5" max="600" step="5" value="45" style="width:90px"></label>
      <label for="lmod" style="flex:1 1 220px;min-width:0">Module<select id="lmod" style="width:100%">${M.map(m=>`<option value="${m.id}" ${m.id===S.last?'selected':''}>${pad(m.n)} ${esc(m.t)}</option>`).join('')}</select></label>
      <button class="btn primary" type="submit">Log session</button>
    </form>
    <div class="tscroll" style="margin-top:16px;box-shadow:none">${S.log.length?`<table class="rtable stack"><thead><tr><th>Date</th><th>Module</th><th>Time</th><th class="actions"></th></tr></thead><tbody>${S.log.slice(0,60).map((e,i)=>{const m=M.find(x=>x.id===e.mod); return `<tr><td class="date">${esc(e.d)}</td><td data-k="main"><span class="ttl">${m?esc(m.t):'—'}</span>${m?`<span class="sub">Module ${pad(m.n)} · Level ${m.lv}</span>`:''}</td><td class="num">${+e.m} min</td><td class="actions"><button class="iconbtn danger" data-del="${i}">Remove</button></td></tr>`;}).join('')}</tbody><tfoot><tr><td colspan="2">${S.log.length} session${S.log.length===1?'':'s'}${S.log.length>60?' (latest 60 shown)':''}</td><td class="num">${(totalMins()/60).toFixed(1)} h</td><td></td></tr></tfoot></table>`:'<p class="empty" style="padding:20px">No sessions yet. Log your first one above, or use "Add to log" inside any module.</p>'}</div>
  </div></div>`;
  document.getElementById('lf').onsubmit=e=>{e.preventDefault(); const mm=+document.getElementById('lm').value; if(!mm||mm<1) return; S.log.unshift({d:document.getElementById('ld').value||today(),m:mm,mod:document.getElementById('lmod').value}); S.log.sort((a,b)=>a.d<b.d?1:-1); S.log=S.log.slice(0,400); save(); vLog();};
  app.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{S.log.splice(+b.dataset.del,1); save(); vLog();});
}


/* ===== V3: separate persistent academies and per-entry workbook ===== */
const GRC = [
 {id:'g01',name:'Governance, Risk and Compliance Foundations',lessons:[
  ['Governance, Risk and Compliance Explained','Governance defines direction and accountability; risk management handles uncertainty affecting objectives; compliance means meeting applicable obligations. They work together but are not interchangeable. In a bank, the board establishes risk appetite, management implements policies and the compliance function helps evaluate regulatory obligations.','Example: A company adopts a cloud service. Governance approves the strategy, risk management identifies exposure to outages and data leakage, and compliance determines applicable legal and contractual obligations. Evidence includes approved policies, risk assessments and management reporting.'],
  ['Policies, Standards, Procedures and Guidelines','A policy defines management intent and mandatory expectations. Standards provide enforceable requirements, procedures set out repeatable steps and guidelines offer recommended approaches. Clear ownership, approval, periodic review and exception management keep documents effective.','Example: An access control policy mandates least privilege; a standard specifies multifactor authentication; a procedure explains how joiner/mover/leaver tickets are processed.'],
  ['Controls: Preventive, Detective and Corrective','Preventive controls reduce the likelihood of undesirable events. Detective controls identify conditions or events; corrective controls restore normal operation. Controls can be manual or automated and should have clear owners, scope, frequency and evidence.','Example: Approval before granting privileged access is preventive; access monitoring is detective; revocation of inappropriate privileges is corrective.'] ]},
 {id:'g02',name:'Risk Management and Risk Registers',lessons:[
  ['Understanding Inherent and Residual Risk','Inherent risk represents exposure before considering relevant controls. Residual risk reflects exposure after those controls are considered. Ratings depend on the organization’s approved methodology: likelihood, impact, time horizon and effectiveness cannot be assumed to be universally numeric.','Scenario: A payment platform has a significant outage exposure. Redundant infrastructure and recovery arrangements reduce risk, but dependency on a common network provider leaves residual risk.'],
  ['Risk Identification and Treatment','Risk statements identify a cause, event and possible consequence. Treatment choices normally include mitigation, avoidance, transfer or acceptance within delegated authority. Assign a risk owner and document decisions, deadlines and reassessments.','Scenario: A third-party provider stores sensitive records. Record the confidentiality exposure, existing contractual/technical controls, gaps, mitigation owner and accepted residual risk.'],
  ['Risk Registers and Reporting','A useful risk register includes ID, business process, threat/event, assets, inherent assessment, controls, residual assessment, treatment, accountable owner, due date and review status. Metrics and escalation rules make it useful to decision makers.','Example: A quarterly review finds an overdue remediation. The owner explains exposure and escalation occurs under the approved risk acceptance policy.'] ]},
 {id:'g03',name:'Information Security Frameworks',lessons:[
  ['ISO 27001 and ISO 27002','ISO/IEC 27001 defines requirements for an information security management system including organizational context, leadership, risk planning, support, operation, performance evaluation and improvement. ISO/IEC 27002 provides implementation guidance for security controls. Certification evaluates the management system against the relevant requirements and scope.','Scenario: An organization selects controls based on a risk assessment, documents applicability and evaluates its ISMS through audits and management review.'],
  ['NIST Cybersecurity Framework','NIST CSF 2.0 organizes outcomes through Govern, Identify, Protect, Detect, Respond and Recover. It is a risk management framework, not a prescriptive checklist or automatic compliance certification. Profiles help compare current and target practices.','Scenario: A cloud migration team maps desired outcomes to its cloud identity, monitoring and recovery activities and defines prioritized improvements.'],
  ['PCI DSS and Control Applicability','PCI DSS establishes security requirements for defined payment-card environments. Scoping matters: connected-to and security-impacting systems may affect the assessment. Validation mechanisms depend on an organization’s role and its applicable program.','Scenario: A merchant documents cardholder data flows, evaluates segmentation and demonstrates evidence for requirements that apply to its environment.'] ]},
 {id:'g04',name:'IT General Controls and Access Governance',lessons:[
  ['Identity Lifecycle and Access Reviews','Access governance covers onboarding, changes, leavers, authorization, privileged access and periodic certification. Access should have a documented owner and business justification. Periodic review effectiveness depends on accurate populations, appropriate reviewers and evidence of remediation.','Scenario: A reviewer finds an inactive contractor with privileged cloud access. The organization documents investigation, removal and root cause.'],
  ['Change Management Controls','A reliable change process evaluates need, risks, testing, authorization, segregation, deployment, rollback and post-implementation review. Emergency changes may use an expedited but documented process.','Scenario: A production firewall rule is changed without authorization. Review logs, approvals and exceptions to determine scope and operating effectiveness.'],
  ['Audit Evidence and Testing','A control can be well designed yet fail in operation. Auditors evaluate control purpose, ownership, evidence completeness, period coverage and representative samples consistent with audit methodology. Screenshots alone can omit important context.','Scenario: An access review marked completed has no user population, decision record or remediation trail, so evidence is insufficient to conclude effectiveness.'] ]},
 {id:'g05',name:'Business Continuity and Third-Party Risk',lessons:[
  ['Business Impact Analysis and Recovery Objectives','A BIA identifies critical processes, dependencies and impacts over time. RTO is the targeted maximum time to resume a service after disruption; RPO defines the maximum targeted data-loss interval measured backward from an incident. These targets need practical validation.','Scenario: Banking operations require rapid restoration. Compare documented objectives with recovery exercises and actual dependencies.'],
  ['Vendor Due Diligence and Continuous Monitoring','Third-party risk assessment considers service criticality, data access, concentration, subcontractors, financial resilience, security assurance and exit feasibility. A vendor certificate is evidence, not a replacement for evaluating applicability and scope.','Scenario: Two important services depend on the same cloud region. Review concentration risk and contractual recovery commitments.'],
  ['Cloud Shared Responsibility','The cloud provider and customer have different responsibilities that vary by service model. Provider assurance does not automatically prove the customer has configured identity, logging or data protection correctly.','Scenario: A managed database provider secures underlying infrastructure while the customer remains responsible for appropriate access and data handling.'] ]},
 {id:'g06',name:'Advanced GRC Case Studies',lessons:[
  ['Assessing a Cloud Migration','Start with business objectives, asset and data classification, applicable obligations, architecture and vendor dependencies. Identify material risks and control owners. Evaluate access, logging, encryption, availability and contractual evidence before risk sign-off.','Scenario: A regulated enterprise moves customer records to cloud storage. Track residency obligations, keys, access approvals, third parties and recovery objectives.'],
  ['Evaluating a Regulatory Finding','Distinguish the observed condition from its root cause, risk exposure and corrective action. A good action plan contains an accountable owner, measurable deliverables, evidence and validation approach.','Scenario: A recurring access recertification failure requires process ownership and automated population controls, not merely one-off account removals.'],
  ['Reporting to Senior Management','Good GRC reporting distinguishes facts, assumptions and open questions. Summarize the affected business process, residual exposure, control deficiencies, treatment options and requested decisions using clear risk language.','Scenario: A critical vendor lacks a tested exit plan. Present potential customer impact, mitigations, timeline and decision required from the risk committee.'] ]}
];
/* The GRC academy is replaced by the AI Compliance Academy (content/ai-compliance.js).
   Old GRC progress stays in Firestore under its own keys (g01-l01…) and is simply not shown. */
void GRC_V31; GRC.length=0; for(const k of Object.keys(GRC_PLUS)) delete GRC_PLUS[k];
for(const m of AIC){ GRC.push({id:m.id,name:m.name,lv:m.lv,lessons:m.ls.map(l=>[l.t,'',l.ex||''])}); GRC_PLUS[m.id]={name:m.name,goal:m.goal,res:m.res||[],ls:m.ls.map(l=>({t:l.t,blocks:l.blocks})),sum:m.sum||[],q:m.q||[],map:m.map||[],lv:m.lv}; }
const AIC_KEY=/^a[ib]\d\d-l\d\d$/;
let v3uid=null, grcState={}, bookEntries=[];
const v3safe=esc;
const v3store=()=>{if(v3uid){localStorage.setItem('p2c-v3-'+v3uid,JSON.stringify({grcState,bookEntries}));}};
async function loadV3(uid){
 v3uid=uid;grcState={};bookEntries=[];
 try{const x=JSON.parse(localStorage.getItem('p2c-v3-'+uid)||'{}');grcState=x.grcState||{};bookEntries=x.bookEntries||[];}catch{}
 try{
  const [a,b]=await Promise.all([getDocs(collection(fdb,'users',uid,'grcProgress')),getDocs(collection(fdb,'users',uid,'studyEntries'))]);
  const localG=grcState, seenG=new Set(), upG=[]; grcState={...localG};
  a.forEach(d=>{const rv=d.data(), lv=localG[d.id]; seenG.add(d.id); if(lv&&(lv._t||0)>(rv._t||0)){grcState[d.id]=lv; upG.push(d.id);} else grcState[d.id]=rv;});
  for(const k of Object.keys(localG)) if(!seenG.has(k)&&localG[k]&&localG[k]._t) upG.push(k);
  for(const k of upG){try{await setDoc(doc(fdb,'users',uid,'grcProgress',k),grcState[k])}catch(e){}}
  const remote={};b.forEach(d=>{remote[d.id]={...d.data(),id:d.id}});
  bookEntries=[...Object.values(remote),...bookEntries.filter(e=>!remote[e.id])].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  v3store();const h=location.hash.slice(1);if(!h||h==='dashboard'||h==='grc'||h==='workbook'||h==='insights'||/^a[ib]\d\d$/.test(h)||/^aic-/.test(h))route();
 }catch(e){console.warn('V3 offline local data',e)}
}
async function saveGRC(id,body){body={...body,_t:Date.now()};grcState[id]=body;v3store();aicPushSummary();if(v3uid&&fdb)try{await setDoc(doc(fdb,'users',v3uid,'grcProgress',id),body)}catch(e){console.warn('GRC sync failed',e)}}
function aicToolsStrip(){const W=aicWorkSummary(grcState),ck=Object.values(W.checks),best=ck.length?Math.round(ck.reduce((a,c)=>a+c.best,0)/ck.length):null,cs=Object.values(W.cases).filter(c=>c.done===c.of).length;
 const T=[['aic-guides','Assessment guides','How inventories, risk and impact assessments, vendor reviews, audits and the SoA work, with worked examples.',W.guides+' of '+W.guidesTotal+' studied'],['aic-cases','Case studies','6 realistic situations with full explanations.',cs+' of '+W.casesTotal+' studied'],['aic-checks','Knowledge checks','Short untimed question sets by topic.',best!=null?'Average best '+best+'%':'Check your understanding'],['aic-library','Library','Official sources with what to read in each.',W.lib+' of '+W.libTotal+' read'],['aic-watch','What’s changing','Key dates for EU, UAE and India rules.','Verified Nov 2026'],['aic-glossary','Glossary','Plain-language AI terms.',AIC_FLASH.length+' terms']];
 return `<section class="aw-tools"><div class="aw-tools-h"><h3>Go deeper</h3><p>Guides, case studies and references to build on the course.</p></div><div class="aw-tools-g">${T.map(([h,t,d,m])=>`<a href="#${h}" class="aw-tool"><b>${t}</b><span>${d}</span><em>${m}</em></a>`).join('')}</div></section>`;}
function aicReviewDue(){try{return aicReviewState(grcState,GRC_PLUS).filter(x=>x.isDue).length;}catch(e){return 0;}}
function aicReviewStrip(){const n=aicReviewDue();return n?`<a class="aw-review" href="#aic-review"><b>${n} module${n===1?'':'s'} ready for review</b><span>A 3-minute refresh of what you finished — it helps you remember.</span><em>Start review →</em></a>`:'';}
let aicSumT=null;function aicPushSummary(){clearTimeout(aicSumT);aicSumT=setTimeout(()=>{if(!dbRef||IS_ADMIN)return;if(!remoteReady){aicPushSummary();return};try{const W=aicWorkSummary(grcState);const tot=GRC.reduce((a,c)=>a+c.lessons.length,0),dn=Object.entries(grcState).filter(([k,v])=>AIC_KEY.test(k)&&v&&v.done).length;S.aic={lessons:dn,total:tot,guides:W.guides,guidesTotal:W.guidesTotal,cases:W.cases,casesTotal:W.casesTotal,checks:W.checks,lib:W.lib,libTotal:W.libTotal,at:new Date().toISOString()};save();}catch(e){console.warn(e)}},2500);}
function vGRC(){
 const total=GRC.reduce((a,c)=>a+c.lessons.length,0), completed=Object.entries(grcState).filter(([k,v])=>AIC_KEY.test(k)&&v&&v.done).length, p=total?Math.round(completed/total*100):0;
 const modPct=m=>{const n=m.lessons.length,d=m.lessons.filter((l,j)=>grcState[m.id+'-l'+String(j+1).padStart(2,'0')]?.done).length;return n?Math.round(d/n*100):0;};
 const card=m=>{const n=m.lessons.length,pp=modPct(m),P=GRC_PLUS[m.id];return `<a class="mcard ${pp===100?'done':pp?'prog':''}" href="#${m.id}"><div class="row"><span class="num">${m.id.toUpperCase()} · ${n} LESSONS${P?' · '+P.q.length+' QUESTIONS':''}</span><span class="pill ${pp===100?'done':pp?'prog':''}">${pp===100?'Complete':pp?pp+'%':'Not started'}</span></div><h4>${v3safe(m.name)}</h4><p>${v3safe(P?.goal||'')}</p>${P&&P.map&&P.map.length?`<div class="aic-tags">${P.map.slice(0,3).map(t=>`<span>${v3safe(t)}</span>`).join('')}</div>`:''}<div class="bar"><i style="width:${pp}%"></i></div></a>`;};
 const levels=AIC_LEVELS.map(L=>{const ms=GRC.filter(m=>m.lv===L.lv);if(!ms.length)return '';const n=ms.reduce((a,m)=>a+m.lessons.length,0),d=ms.reduce((a,m)=>a+m.lessons.filter((l,j)=>grcState[m.id+'-l'+String(j+1).padStart(2,'0')]?.done).length,0),lp=n?Math.round(d/n*100):0;
   return `<section class="aic-level lv${L.lv}" id="aic-lv${L.lv}"><header class="aic-lh"><span class="aic-badge lv${L.lv}">${v3safe(L.tag)}</span><div><h3>${v3safe(L.name)}</h3><p>${v3safe(L.blurb)}</p></div><div class="aic-lp"><b>${lp}%</b><span>${d}/${n} lessons</span></div></header><div class="cards">${ms.map(card).join('')}</div></section>`;}).join('');
 const nextM=GRC.find(m=>modPct(m)<100);
 app.innerHTML=`<div class="view">${aicSubnav('grc')}<section class="cockpit grc-hero aic-hero"><div class="hero-top"><div><div class="eyebrow">Independent academy · Beginner to Hero</div><h1>AI Compliance Academy</h1><p class="lede2">How AI works, the laws and standards that govern it (EU AI Act, NIST AI RMF, ISO/IEC 42001, GDPR, UAE and India), and how to assess, audit and lead an AI governance programme. Built for GRC professionals; mapped to the IAPP AIGP body of knowledge and ISO/IEC 42001.</p><div class="next">${nextM?`<a class="btn" href="#${nextM.id}">${completed?'Continue':'Start'}: ${v3safe(nextM.name)} →</a>`:''}<button class="btn ghost" id="grcReset" type="button">Start a new attempt</button></div><nav class="aic-jump" aria-label="Levels">${AIC_LEVELS.map(L=>`<button type="button" data-lvjump="${L.lv}">${v3safe(L.tag==='Basics'?'How AI works':L.tag+' · '+L.name)}</button>`).join('')}</nav></div><div class="ring-big">${ringSVG(148,62,12,p,'rgba(255,255,255,.22)','#fff')}<div class="ring-lbl"><b>${p}%</b><span>${completed}/${total} read</span></div></div></div></section>
 ${aicReviewStrip()}${aicToolsStrip()}
 ${levels}</div>`;
 app.querySelectorAll('[data-lvjump]').forEach(b=>b.onclick=()=>document.getElementById('aic-lv'+b.dataset.lvjump)?.scrollIntoView({behavior:'smooth',block:'start'}));
 document.getElementById('grcReset').onclick=async()=>{if(!(await uiConfirm('Your earlier completion dates are kept in your history; lesson ticks and quiz answers start again.',{title:'Start a new AI Compliance attempt?',ok:'Start again'})))return;const stamp=new Date().toISOString();for(const [id,v] of Object.entries(grcState)){if(!/^a[ib]\d\d-/.test(id))continue;if(v&&v.done)await saveGRC(id,{done:false,attempt:(v.attempt||1)+1,prior:[...(v.prior||[]),{completedAt:v.completedAt||null,resetAt:stamp}].slice(-30)});else if(v&&v.ans!==undefined&&v.ans!==null)await saveGRC(id,{ans:null,retriedAt:stamp});}vGRC();};afterRoute();
}
function vGRCModule(id,keepY){const m=GRC.find(x=>x.id===id);if(!m)return vGRC();const P=GRC_PLUS[id];
 const keys=m.lessons.map((l,i)=>id+'-l'+String(i+1).padStart(2,'0')), done=keys.filter(k=>grcState[k]?.done).length;
 const qs=P?P.q:[], qk=j=>id+'-q'+(j+1), ans=j=>{const v=grcState[qk(j)]?.ans;return (v===null||v===undefined)?undefined:v;}, right=qs.filter((q,j)=>ans(j)===q.a).length, answered=qs.filter((q,j)=>ans(j)!==undefined).length;
 const units=m.lessons.length+qs.length, pct=Math.round((done+right)/Math.max(1,units)*100);
 const gi=GRC.indexOf(m), prev=GRC[gi-1], next=GRC[gi+1];
 app.innerHTML=`<div class="${keepY?'':'view'}"><section class="mhero"><div><div class="crumb"><a href="#grc">AI Compliance</a> / ${v3safe((AIC_LEVELS.find(L=>L.lv===P?.lv)||{}).tag||'')} / ${id.toUpperCase()}</div><h2>${v3safe(m.name)}</h2><p class="goal">${v3safe(P?.goal||'Theory, terminology and realistic business examples.')}</p><div class="meta"><span class="pill">${m.lessons.length} lessons</span>${qs.length?`<span class="pill">${qs.length} questions</span>`:''}${(P?.map||[]).map(t=>`<span class="pill">${v3safe(t)}</span>`).join('')}</div></div><div class="mring">${ringSVG(84,34,8,pct,'rgba(255,255,255,.22)','#fff')}<div><b>${pct}%</b><span>${done+right} of ${units} done</span></div></div><div class="segs" aria-hidden="true">${keys.map(k=>`<i class="${grcState[k]?.done?'on':''}"></i>`).join('')}${qs.map((q,j)=>`<i class="qs ${ans(j)===q.a?'on':''}"></i>`).join('')}</div></section>
 <div class="mbody"><div>
 <section class="msect"><div class="h"><h3>Lessons</h3><span class="eyebrow">${done} of ${m.lessons.length} read</span></div><div class="timeline">${m.lessons.map((l,i)=>{const k=keys[i],on=!!grcState[k]?.done,pl=P?.ls[i],sc=/^Real-world scenario/.test(pl?.t||l[0]);return `<article class="lesson ${on?'on':''} ${sc?'scen':''}" id="G-${k}"><span class="lnode">${on?CHECK:i+1}</span><div class="lcard"><div class="ln">${sc?'<span class="kind">Scenario</span>':''}Lesson ${i+1}</div><h4>${v3safe(pl?.t||l[0])}</h4><div class="lbody">${pl?renderBlocks(pl.blocks):`<p>${v3safe(l[1])}</p>`}${l[2]?`<aside class="callout cloud"><b>Real-world example</b><span>${v3safe(l[2])}</span></aside>`:''}</div><div class="lfoot"><button class="learn v3complete" data-key="${k}" aria-pressed="${on}">${on?CHECK+' Read':CHECK+' Mark as read'}</button></div></div></article>`;}).join('')}</div></section>
 ${P?`<section class="msect"><div class="h"><h3>Key takeaways</h3></div><ul class="takeaways">${P.sum.map(x=>`<li>${fmt(x)}</li>`).join('')}</ul></section>
 <section class="msect" id="g-quiz"><div class="h"><h3>Checkpoint</h3><span class="eyebrow">${answered?`${right} of ${qs.length} correct`:`${qs.length} questions`}</span></div>${qs.map((q,j)=>{const a=ans(j),dn=a!==undefined;return `<div class="q"><p><span>Q${j+1}</span>${esc(q.t)}</p><div class="opts">${q.o.map((o,k)=>`<button class="opt ${dn&&k===q.a?'right':''} ${dn&&k===a&&a!==q.a?'wrong':''}" data-gq="${j}" data-k="${k}" ${dn?'disabled':''}><span class="ltr">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>${dn?`<div class="explain"><span><b>${a===q.a?'Correct.':'Not quite.'}</b> ${esc(q.x)}</span>${a!==q.a?`<button class="linkbtn" data-gretry="${j}">Try again</button>`:''}</div>`:''}</div>`;}).join('')}</section>`:''}
 <nav class="pager">${prev?`<a class="btn" href="#${prev.id}">← ${v3safe(prev.name)}</a>`:'<span></span>'}${next?`<a class="btn" href="#${next.id}">${v3safe(next.name)} →</a>`:''}</nav>
 </div><aside class="mside"><div class="panel outline-panel"><h5>In this module</h5><div class="outline">${m.lessons.map((l,i)=>`<button class="${grcState[keys[i]]?.done?'on':''}" data-jump="G-${keys[i]}"><i></i>${i+1}. ${v3safe(P?.ls[i]?.t||l[0])}</button>`).join('')}${qs.length?'<button data-jump="g-quiz"><i></i>Checkpoint</button>':''}</div></div>${P&&P.res.length?`<div class="panel"><h5>Official reading</h5><ul>${P.res.map(r=>`<li><a href="${r[1]}" target="_blank" rel="noopener">${esc(r[0])}</a></li>`).join('')}</ul></div>`:''}</aside></div></div>`;
 const rer=()=>{const y=window.scrollY;vGRCModule(id,true);window.scrollTo(0,y);};
 app.querySelectorAll('.v3complete').forEach(b=>b.onclick=async()=>{const k=b.dataset.key;await saveGRC(k,{...(grcState[k]||{}),done:!grcState[k]?.done,completedAt:new Date().toISOString()});rer();});
 app.querySelectorAll('[data-gq]').forEach(b=>b.onclick=async()=>{await saveGRC(qk(+b.dataset.gq),{ans:+b.dataset.k,at:new Date().toISOString()});rer();});
 app.querySelectorAll('[data-gretry]').forEach(b=>b.onclick=async()=>{await saveGRC(qk(+b.dataset.gretry),{ans:null,retriedAt:new Date().toISOString()});rer();});
 app.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{const el=document.getElementById(b.dataset.jump);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});});
 if(!keepY)afterRoute();}
let wbQ='', wbSrc='all', wbSort={k:'date',dir:-1}, wbOpen=new Set(), wbFresh=null;
const SRC_C={ChatGPT:'--ok',YouTube:'--bad',Udemy:'--accent-2',Coursera:'--accent',Book:'--signal',Documentation:'--aws',Other:'--muted'};
function vWorkbook(){
 const mins=bookEntries.reduce((a,b)=>a+(Number(b.minutes)||0),0);
 const month=new Date().toISOString().slice(0,7), mMins=bookEntries.filter(e=>String(e.date||'').startsWith(month)).reduce((a,b)=>a+(Number(b.minutes)||0),0);
 const sources=[...new Set(bookEntries.map(e=>e.source||'Other'))].sort();
 const K=(c,ic,b,s)=>`<div class="kpi" style="--c:var(${c})"><span class="kpi-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${ic}</svg></span><div><b>${b}</b><span>${s}</span></div></div>`;
 app.innerHTML=`<div class="view"><section class="view-head"><span class="eyebrow">Private independent learning</span><h2>My Learning Workbook</h2><p class="lede">Track courses and topics studied anywhere, including ChatGPT, books, training platforms and documentation. Personal entries are stored separately from academy progress.</p></section>
 <div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">
  ${K('--accent','<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/>',bookEntries.length,'Study sessions')}
  ${K('--signal','<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',(mins/60).toFixed(1)+'h','Total study time')}
  ${K('--ok','<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',(mMins/60).toFixed(1)+'h','This month')}
  ${K('--accent-2','<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',new Set(bookEntries.map(e=>e.course)).size,'Learning areas')}
 </div>
 <details class="addcard" ${bookEntries.length?'':'open'}><summary><span class="plus" aria-hidden="true">+</span>Add a study session</summary><div class="addbody">
 <form id="v3form" class="wb-form">
  <label>Course or learning area<input required name="course" maxlength="120" placeholder="e.g. ISO 27001" list="wbCourses"></label>
  <label>Topic<input required name="topic" maxlength="160" placeholder="e.g. Risk treatment"></label>
  <label>Learning source<select name="source"><option>ChatGPT</option><option>YouTube</option><option>Udemy</option><option>Coursera</option><option>Book</option><option>Documentation</option><option>Other</option></select></label>
  <label>Study date<input required type="date" name="date" value="${today()}"></label>
  <label>Duration (minutes)<input required type="number" min="1" max="1440" name="minutes" value="30"></label>
  <label>Source URL (optional)<input name="url" type="url" placeholder="https://..."></label>
  <label class="full">What did you learn?<textarea name="notes" placeholder="Write your key learning points…" maxlength="10000"></textarea></label>
  <div class="full"><button class="btn primary" type="submit">Save study entry</button></div>
  <datalist id="wbCourses">${[...new Set(bookEntries.map(e=>e.course))].map(c=>`<option value="${v3safe(c)}">`).join('')}</datalist>
 </form></div></details>
 <section class="panel" style="margin-top:18px"><div class="panel-h"><h3>Study history</h3><button id="v3export" class="btn small">Export JSON</button></div>
  <div class="toolbar"><input class="search" id="wbQ" type="search" placeholder="Search course, topic or notes" value="${v3safe(wbQ)}" aria-label="Search study history"><select id="wbSrc" aria-label="Filter by source"><option value="all">All sources</option>${sources.map(s=>`<option ${s===wbSrc?'selected':''}>${v3safe(s)}</option>`).join('')}</select></div>
  <div class="tscroll" style="box-shadow:none"><table class="rtable stack" id="wbTable"><thead><tr>
   <th><button data-sort="date">Date ${wbSort.k==='date'?(wbSort.dir<0?'↓':'↑'):''}</button></th><th>Course · topic</th><th>Source</th><th><button data-sort="minutes">Time ${wbSort.k==='minutes'?(wbSort.dir<0?'↓':'↑'):''}</button></th><th>Notes</th><th class="actions"><span class="sr-only">Actions</span></th></tr></thead>
   <tbody id="wbBody"></tbody><tfoot id="wbFoot"></tfoot></table></div>
 </section></div>`;
 drawWB();
 document.getElementById('wbQ').oninput=e=>{wbQ=e.target.value;drawWB();};
 document.getElementById('wbSrc').onchange=e=>{wbSrc=e.target.value;drawWB();};
 app.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{const k=b.dataset.sort;wbSort=wbSort.k===k?{k,dir:-wbSort.dir}:{k,dir:-1};vWorkbook();});
 document.getElementById('v3form').onsubmit=async e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target));const id=crypto.randomUUID();const rec={...x,id,minutes:Number(x.minutes),createdAt:new Date().toISOString()};bookEntries.unshift(rec);bookEntries.sort((a,b)=>String(b.date).localeCompare(String(a.date)));wbFresh=id;v3store();let ok=true;try{await setDoc(doc(fdb,'users',v3uid,'studyEntries',id),rec)}catch(err){ok=false}vWorkbook();toast(ok?'Study session saved':'Saved on this device; sync failed');};
 document.getElementById('v3export').onclick=()=>{const blob=new Blob([JSON.stringify({version:3,exportedAt:new Date().toISOString(),entries:bookEntries,grcProgress:grcState},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='js-learning-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 afterRoute();
}
function drawWB(){
 const q=wbQ.trim().toLowerCase();
 let rows=bookEntries.filter(e=>(wbSrc==='all'||(e.source||'Other')===wbSrc)&&(!q||[e.course,e.topic,e.notes,e.source].join(' ').toLowerCase().includes(q)));
 rows=rows.slice().sort((a,b)=>wbSort.k==='minutes'?wbSort.dir*((Number(a.minutes)||0)-(Number(b.minutes)||0)):wbSort.dir*String(a.date).localeCompare(String(b.date)));
 const body=document.getElementById('wbBody'), foot=document.getElementById('wbFoot');
 if(!rows.length){body.innerHTML=`<tr><td colspan="6" class="empty" style="text-align:center;padding:28px">${bookEntries.length?'No sessions match your search.':'No sessions yet. Add your first study session above.'}</td></tr>`;foot.innerHTML='';return;}
 body.innerHTML=rows.map(e=>{const id=v3safe(e.id),n=String(e.notes||''),open=wbOpen.has(e.id),src=e.source||'Other';
  return `<tr class="${e.id===wbFresh?'fresh':''}"><td class="date">${v3safe(e.date)}</td><td data-k="main"><span class="ttl">${v3safe(e.course)}</span><span class="sub">${v3safe(e.topic)}</span></td><td><span class="src" style="--c:var(${SRC_C[src]||'--muted'})">${v3safe(src)}</span></td><td class="num">${Number(e.minutes)||0} min</td><td class="note-cell">${n?v3safe(n.length>90&&!open?n.slice(0,90)+'…':open?'':n):'<span style="opacity:.6">—</span>'}</td><td class="actions">${n.length>90||e.url?`<button class="iconbtn" data-more="${id}" aria-expanded="${open}">${open?'Less':'More'}</button> `:''}<button class="iconbtn danger v3delete" data-key="${id}" aria-label="Delete entry">Delete</button></td></tr>${open?`<tr class="detail"><td colspan="6">${v3safe(n)}${e.url&&/^https?:\/\//.test(e.url)?`\n<a href="${v3safe(e.url)}" rel="noopener noreferrer" target="_blank">Open learning resource ↗</a>`:''}</td></tr>`:''}`;}).join('');
 const tm=rows.reduce((a,e)=>a+(Number(e.minutes)||0),0);
 foot.innerHTML=`<tr><td colspan="3">${rows.length} session${rows.length===1?'':'s'}</td><td class="num">${(tm/60).toFixed(1)} h</td><td colspan="2"></td></tr>`;
 wbFresh=null;
 body.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>{const k=b.dataset.more;wbOpen.has(k)?wbOpen.delete(k):wbOpen.add(k);drawWB();});
 body.querySelectorAll('.v3delete').forEach(b=>b.onclick=async()=>{if(!(await uiConfirm('Delete this workbook entry?')))return;const id=b.dataset.key;bookEntries=bookEntries.filter(x=>x.id!==id);v3store();try{await deleteDoc(doc(fdb,'users',v3uid,'studyEntries',id))}catch(e){uiAlert('Refresh the page before continuing.',{title:'Couldn’t delete from the cloud'})}vWorkbook();});
}

/* V3.1: Read-only unified insights. No changes to legacy progress or Firebase schema. */
function vInsights(){
 const entries=bookEntries.slice();const total=entries.reduce((n,e)=>n+(Number(e.minutes)||0),0);
 const byCourse=new Map(),bySource=new Map(),byMonth=new Map();
 for(const e of entries){const mins=Math.max(0,Number(e.minutes)||0);const course=String(e.course||'Uncategorized');const source=String(e.source||'Other');const month=String(e.date||'').slice(0,7)||'Unknown';byCourse.set(course,(byCourse.get(course)||0)+mins);bySource.set(source,(bySource.get(source)||0)+mins);byMonth.set(month,(byMonth.get(month)||0)+mins);}
 const rows=(mp)=>[...mp].sort((a,b)=>b[1]-a[1]).slice(0,12).map(([name,min])=>`<tr><td>${v3safe(name)}</td><td class="mono">${(min/60).toFixed(1)} h</td></tr>`).join('');
 const grcDone=Object.entries(grcState).filter(([k,v])=>AIC_KEY.test(k)&&v&&v.done).length;
 const grcTotal=GRC.reduce((n,m)=>n+m.lessons.length,0);
 const completed=lessonsDone();
 app.innerHTML=`<section class="view-head"><span class="eyebrow">Personal learning</span><h2>Study Insights</h2><p class="lede">A read-only overview of independent studies and academy progress. Nothing here alters course completion or historical records.</p></section>
 <div class="stats" style="margin-bottom:16px"><div class="stat"><b>${entries.length}</b><span>External sessions</span></div><div class="stat"><b>${(total/60).toFixed(1)}h</b><span>External learning time</span></div><div class="stat"><b>${grcDone}/${grcTotal}</b><span>AI Compliance lessons read</span></div><div class="stat"><b>${secOverall().read}/${SEC_ACADEMY.reduce((a,m)=>a+m.lessons.length,0)}</b><span>Application lessons read</span></div><div class="stat"><b>${completed}</b><span>Technical lessons learned</span></div></div>
 <section class="sn-grid"><div class="panel"><h3>Independent hours by course</h3><div class="tscroll" style="margin-top:12px"><table><thead><tr><th>Course</th><th>Hours</th></tr></thead><tbody>${rows(byCourse)||'<tr><td colspan="2">No entries yet</td></tr>'}</tbody></table></div></div><div class="panel"><h3>Learning sources</h3><div class="tscroll" style="margin-top:12px"><table><thead><tr><th>Source</th><th>Hours</th></tr></thead><tbody>${rows(bySource)||'<tr><td colspan="2">No entries yet</td></tr>'}</tbody></table></div></div></section>
 <section class="panel" style="margin-top:16px"><div class="panel-h"><h3>Monthly learning time</h3></div><div class="tscroll"><table><thead><tr><th>Month</th><th>Hours</th></tr></thead><tbody>${[...byMonth].sort((a,b)=>b[0].localeCompare(a[0])).map(([m,n])=>`<tr><td>${v3safe(m)}</td><td>${(n/60).toFixed(1)} h</td></tr>`).join('')||'<tr><td colspan="2">No entries yet</td></tr>'}</tbody></table></div></section>
`;afterRoute();
}

/* ===== Application Academy: independent application-security learning track ===== */
/* V7: concept-first, textbook-style Web/Application Academy curriculum */
const secConceptTitle = (m,l,j) => String(j+1).padStart(2,'0')+' · '+l.t;
function secTextbook(m,l,j){
 const d=SEC_TEXTBOOK[`${m.id}:${j}`]; if(!d)return '';
 const h=(title)=>`<h5>${esc(title)}</h5>`;
 const chapters=(d.chapters||[]).map((c,i)=>`<section class="book-chapter">${h(c.heading)}${String(c.body).split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${fmt(p)}</p>`).join('')}</section>`).join('');
 const terms=(m.name+' '+l.t).split(/[,/&:–\-]/).map(s=>s.trim()).filter(Boolean).slice(0,3);
 const steps=d.workflow||[];
 const diagram=`<div class="book-flow" role="group" aria-label="${esc(m.name)}: conceptual workflow"><div class="book-flow-title"><span>HOW IT WORKS</span><span>Follow this process from first action to final result</span></div><div class="book-flow-line">${steps.map((st,i)=>`<div class="book-flow-node ${i===j%steps.length?'current':''}"><div class="book-flow-num">${i+1}</div><div class="book-flow-label">${esc(st)}</div></div>`).join('')}</div><p class="book-flow-caption">Example journey: ${esc(d.scenario)}. The highlighted step connects this lesson to the wider workflow.</p></div>`;
 const httpSample="POST /api/courses HTTP/1.1\nHost: academy.local\nContent-Type: application/json\nAccept: application/json\nCookie: sid=demo-session\n\n{\"title\":\"HTTP fundamentals\"}\n\nHTTP/1.1 201 Created\nLocation: /api/courses/42\nContent-Type: application/json\nCache-Control: no-store\n\n{\"id\":42,\"title\":\"HTTP fundamentals\"}";
 const request=m.id==='a16'&&j===0?`<div class="book-code"><strong>Complete request and response · fictional local application</strong><pre><code>${esc(httpSample)}</code></pre><p>The first section is the request. The blank line separates headers from JSON data. The second section is the response; 201 Created and Location indicate a newly created resource. Browser requests and responses are separate messages, shown together for learning.</p></div>`:'';
 const learnMap=`<div class="book-map" aria-label="Study sequence"><span class="book-map-step">1 · Meaning</span><span class="book-map-step">2 · Building blocks</span><span class="book-map-step">3 · Workflow</span><span class="book-map-step">4 · Real example</span><span class="book-map-step">5 · Testing at end</span></div>`;
 return `<div class="sec-textbook"><div class="book-banner"><span class="book-label">${esc(d.reading)} · ${esc(m.level)}</span><h4>Understand ${esc(l.t)} from first principles</h4><p>Start with what it is, why it exists and how it operates. Security/testing notes are intentionally saved for the very end of the lesson.</p>${learnMap}</div>
 <section class="book-chapter">${h('1. What is it and why does it exist?')}<p>${fmt(d.opening)}</p><p>${fmt(d.intro)}</p><p>Before memorizing terminology, ask three questions: <strong>Who initiates this action?</strong> <strong>What information travels or changes?</strong> <strong>What component makes the final decision?</strong> These questions turn an abstract definition into a clear mental model.</p></section>
 ${chapters}
 <section class="book-chapter book-glossary">${h('Important terms explained simply')}<dl>${(d.glossary||[]).map(([term,meaning])=>`<div><dt>${esc(term)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl><p>Notice how these terms refer to different responsibilities. Being able to tell them apart is essential before studying failures or security testing.</p></section>
 <section class="book-chapter">${h('The complete workflow — illustrated')}${diagram}<p>${fmt(d.closing)}</p></section>
 <section class="book-chapter">${h('Connect the idea to a realistic example')}<p><strong>Example situation:</strong> ${esc(d.scenario)}.</p><ol class="book-steps">${steps.map(st=>`<li>${esc(st)}. Explain what enters this stage, what comes out, and what the next component expects.</li>`).join('')}</ol>${request}<p>A useful learning habit is to redraw this same workflow without looking. Then explain it in plain words to someone who has never studied the technology. If you can identify the actors, messages and decisions, you have learned more than a memorized definition.</p></section>
 <section class="book-chapter book-summary">${h('What you should understand before testing')}<ul><li>Explain <strong>${esc(l.t)}</strong> in simple language, including its purpose and its surrounding technology.</li><li>Trace the sequence of components and identify where data is created, transformed, stored or displayed.</li><li>Distinguish the normal expected behavior from an error, configuration choice or failed dependency.</li><li>Describe the workflow using your own example, not only the example above.</li></ul></section>
 ${(d.reference||[]).length?`<div class="book-sources"><strong>Go further · official learning material</strong>${d.reference.map(u=>`<a target="_blank" rel="noopener noreferrer" href="${esc(u)}">${esc(new URL(u).hostname)} · reference ↗</a>`).join('')}</div>`:''}</div>`;
}
const SEC_LEVELS = [
 {name:'Beginner',desc:'Foundations: web technology and safe assessment methodology'},
 {name:'Intermediate',desc:'Core web application vulnerabilities and validation'},
 {name:'Advanced',desc:'Identity protocols, APIs, parsers, concurrency and proxy security'},
 {name:'Professional',desc:'Mobile, DevSecOps, source review, cloud and reporting'},
 {name:'Expert',desc:'Banking, multi-tenancy, vulnerability chains and independent assessments'}
];
function secDeep(m,l,j){
 const d=l.deep;if(!d)return '';
 return `<section class="sec-deep" aria-label="In-depth lesson explanation">
 <div class="sec-deep-heading"><span class="sec-deep-icon" aria-hidden="true">✦</span><div><small>IN-DEPTH EXPLANATION</small><h5>Understand it, then test it</h5></div></div>
 <div class="sec-deep-intro">${fmt(d.why)}</div>
 <h6>A worked, everyday example</h6><p>${fmt(d.story)}</p>
 <figure class="ex sec-code"><figcaption>Synthetic training example · ${esc(m.name)}</figcaption><pre><code>${esc(d.code)}</code></pre></figure>
 <h6>Follow the reasoning step by step</h6><ol class="sec-deep-steps">${d.steps.map(x=>`<li>${fmt(x)}</li>`).join('')}</ol>
 <div class="sec-compare"><div class="sec-compare-good"><strong>✓ Expected secure behavior</strong><p>${esc(d.compareGood)}</p></div><div class="sec-compare-bad"><strong>! What would be concerning</strong><p>${esc(d.compareBad)}</p></div></div>
 <div class="sec-pitfall">${fmt(d.pitfall)}</div>
 <details class="sec-knowledge"><summary>Check your understanding · reveal answer</summary><p>${fmt(d.challenge)}</p><p>${fmt(d.answer)}</p></details>
 </section>`;
}
const secKey=(m,kind,n)=>m.id+'-'+kind+String(n+1).padStart(2,'0');
const secState=()=>S.appAcademy||(S.appAcademy={});
const secLessonDone=(m,i)=>!!secState()[secKey(m,'l',i)];
const secLabDone=(m,i)=>!!secState()[secKey(m,'lab',i)];
const secQuizAnswer=(m,i)=>secState()[secKey(m,'q',i)];
const secScore=m=>{
 const read=m.lessons.filter((l,i)=>secLessonDone(m,i)).length;
 const labs=m.labs.filter((l,i)=>secLabDone(m,i)).length;
 const right=m.qs.filter((q,i)=>secQuizAnswer(m,i)===q.a).length;
 const total=m.lessons.length+m.labs.length+m.qs.length;
 return {done:read,read,labs,right,total,p:Math.round((read+labs+right)/total*100)};
};
function secOverall(){
 const total=SEC_ACADEMY.reduce((a,m)=>a+secScore(m).total,0);
 const done=SEC_ACADEMY.reduce((a,m)=>{const s=secScore(m);return a+s.read+s.labs+s.right},0);
 const read=SEC_ACADEMY.reduce((a,m)=>a+secScore(m).read,0);
 const labs=SEC_ACADEMY.reduce((a,m)=>a+secScore(m).labs,0);
 return {total,done,read,labs,p:Math.round(done/total*100)};
}
let secFilter='All';
let secSearch='';
function secCards(m,i){
 const s=secScore(m),n=SEC_ACADEMY.indexOf(m)+1;
 return `<a class="mcard ${s.p===100?'done':s.p?'prog':''}" href="#${m.id}"><div class="row"><span class="num">MODULE ${String(n).padStart(2,'0')} · ${esc(m.level)}</span><span class="pill ${s.p===100?'done':s.p?'prog':''}">${s.p===100?'Complete':s.p?s.p+'%':'Not started'}</span></div><h4>${esc(m.name)}</h4><p>${esc(m.goal)}</p><p class="sec-metrics">${m.lessons.length} lessons · ${m.labs.length} guided labs · ${m.qs.length} checks</p><div class="bar"><i style="width:${s.p}%"></i></div></a>`;
}
function vApplication(){
 const z=secOverall();
 const totalLessons=SEC_ACADEMY.reduce((a,m)=>a+m.lessons.length,0);
 const totalLabs=SEC_ACADEMY.reduce((a,m)=>a+m.labs.length,0);
 const totalQuiz=SEC_ACADEMY.reduce((a,m)=>a+m.qs.length,0);
 app.innerHTML=`<div class="view"><section class="cockpit appsec-hero"><div class="hero-top"><div><div class="eyebrow">APPLICATION ACADEMY · FIVE LEARNING LEVELS</div><h1>From beginner to expert</h1><p class="lede2">Start by understanding web and application technology from the ground up. Each lesson now teaches the underlying concepts, workflows and worked examples before placing security testing at the end. Follow the path through web, API, mobile, cloud, banking and AI.</p><div class="next"><a class="btn glow" href="#${SEC_ACADEMY.find(m=>secScore(m).p<100)?.id||'a01'}">${z.done?'Continue studying':'Begin the path'} →</a><span class="pill">${SEC_ACADEMY.length} modules · ${totalLessons} lessons · ${totalLabs} labs · ${totalQuiz} questions</span></div></div><div class="ring-big">${ringSVG(148,62,12,z.p,'rgba(255,255,255,.22)','#fff')}<div class="ring-lbl"><b>${z.p}%</b><span>${z.read} read · ${z.labs} labs</span></div></div></div></section>
 <div class="sec-overview"><div><b>${SEC_ACADEMY.length}</b><span>modules</span></div><div><b>${totalLessons}</b><span>lessons</span></div><div><b>${totalLabs}</b><span>guided labs</span></div><div><b>${totalQuiz}</b><span>checkpoints</span></div></div>
 <div class="sect-title" style="margin-top:25px"><h3>Your learning path</h3><span class="eyebrow">Practice only on owned or expressly authorized systems</span></div>
 <div class="sec-filter" aria-label="Filter academy"><div class="sec-level-tabs">${['All',...SEC_LEVELS.map(l=>l.name)].map(l=>`<button type="button" data-sec-level="${l}" class="${secFilter===l?'active':''}" aria-pressed="${secFilter===l}">${l==='All'?'All levels':l}</button>`).join('')}</div><label class="sec-search">Find a module <input type="search" id="secSearch" autocomplete="off" placeholder="Search modules, concepts, tools…" value="${esc(secSearch)}" /></label></div>
 <div id="secPath">${secRoadmap()}</div><div class="sec-references"><b>Learning references</b> · <a href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener noreferrer">OWASP WSTG 4.2</a> · <a href="https://asvs.owasp.org/" target="_blank" rel="noopener noreferrer">ASVS 5.0</a> · <a href="https://owasp.org/API-Security/" target="_blank" rel="noopener noreferrer">API Security</a> · <a href="https://mas.owasp.org/" target="_blank" rel="noopener noreferrer">MASVS / MASTG</a> · <a href="https://portswigger.net/web-security" target="_blank" rel="noopener noreferrer">Web Security Academy</a><p>Guided labs here are written practice instructions, not hosted vulnerable machines. Use your own controlled lab or the linked training resources.</p></div></div>`;
 app.querySelectorAll('[data-sec-level]').forEach(b=>b.onclick=()=>{secFilter=b.dataset.secLevel;app.querySelectorAll('[data-sec-level]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b))});document.getElementById('secPath').innerHTML=secRoadmap();});
 document.getElementById('secSearch').oninput=e=>{secSearch=e.target.value;document.getElementById('secPath').innerHTML=secRoadmap();};
 afterRoute();
}
function secRoadmap(){
 let count=0;
 const out=SEC_LEVELS.filter(l=>secFilter==='All'||secFilter===l.name).map((l,i)=>{
  const mods=SEC_ACADEMY.filter(m=>m.level===l.name&&(!secSearch.trim()||(m.name+' '+m.goal+' '+m.lessons.map(x=>x.t).join(' ')).toLowerCase().includes(secSearch.trim().toLowerCase())));
  if(!mods.length)return '';
  count+=mods.length;
  const all=SEC_ACADEMY.filter(m=>m.level===l.name);
  const completed=all.filter(m=>secScore(m).p===100).length;
  return `<section class="sec-stage"><div class="sec-stage-head"><span class="sec-stage-num">${SEC_LEVELS.indexOf(l)+1}</span><div><h3>${esc(l.name)} <small>· ${all.length} modules</small></h3><p>${esc(l.desc)}</p></div><span class="pill">${completed}/${all.length} completed</span></div><div class="cards">${mods.map(secCards).join('')}</div></section>`;
 }).join('');
 return out || '<div class="sec-no-results">No modules match this search. Try another keyword or level.</div>';
}
function vApplicationModule(id,keepY){
 const m=SEC_ACADEMY.find(x=>x.id===id);if(!m)return vApplication();
 const i=SEC_ACADEMY.indexOf(m),prev=SEC_ACADEMY[i-1],next=SEC_ACADEMY[i+1],s=secScore(m);
 const answered=m.qs.filter((q,j)=>secQuizAnswer(m,j)!==undefined&&secQuizAnswer(m,j)!==null).length;
 const doneLabs=m.labs.filter((l,j)=>secLabDone(m,j)).length;
 app.innerHTML=`<div class="${keepY?'':'view'}"><section class="mhero"><div><div class="crumb"><a href="#appsec">Application Academy</a> / ${esc(m.level)} / ${id.toUpperCase()}</div><h2>${esc(m.name)}</h2><p class="goal">${esc(m.goal)}</p><div class="meta"><span class="pill">${m.lessons.length} textbook lessons</span><span class="pill">${m.labs.length} guided labs</span><span class="pill">${m.qs.length} knowledge checks</span></div></div><div class="mring">${ringSVG(84,34,8,s.p,'rgba(255,255,255,.22)','#fff')}<div><b>${s.p}%</b><span>${s.read+s.labs+s.right} / ${s.total} complete</span></div></div><div class="segs" aria-hidden="true">${m.lessons.map((l,j)=>`<i class="${secLessonDone(m,j)?'on':''}"></i>`).join('')}${m.labs.map((l,j)=>`<i class="${secLabDone(m,j)?'on':''}"></i>`).join('')}${m.qs.map((q,j)=>`<i class="qs ${secQuizAnswer(m,j)===q.a?'on':''}"></i>`).join('')}</div></section>
 <div class="mbody"><div><section class="msect" id="sec-lessons"><div class="h"><h3>Learn how the technology works</h3><span class="eyebrow">${s.read} of ${m.lessons.length} read</span></div>
 <div class="read-tools" aria-label="Reading preferences"><button type="button" id="appSmaller">A−</button><button type="button" id="appLarger">A+</button><button type="button" id="appWidth">${readPrefs.width===60?'Comfort width':'Wide reading'}</button><span class="eyebrow">Preferences stay on this device</span></div>
 <div class="timeline">${m.lessons.map((l,j)=>{const k=secKey(m,'l',j),on=secLessonDone(m,j);return `<article class="lesson ${on?'on':''}" id="A-${k}"><span class="lnode">${on?CHECK:j+1}</span><div class="lcard"><div class="ln">Lesson ${j+1} of ${m.lessons.length}</div><h4>${esc(l.t)}</h4><div class="lbody">${secTextbook(m,l,j)}<section class="book-test-end"><div class="book-test-heading"><span>LAST SECTION · SECURITY & TESTING</span><h5>Once you understand it: how to verify security</h5><p>Keep the focus on concepts first. This optional final section contains the original security notes, examples and step-by-step guided verification for authorized environments.</p></div><details class="book-test-notes"><summary>Open security/testing walkthrough and field notes</summary><div class="book-test-content">${renderBlocks(l.blocks)}${secDeep(m,l,j)}</div></details></section></div><div class="lfoot"><button class="learn sec-complete" data-key="${k}" aria-pressed="${on}">${CHECK} ${on?'Read — undo':'Mark as read'}</button></div></div></article>`;}).join('')}</div></section>
 <section class="msect sec-lab-area" id="sec-labs"><div class="h"><h3>Guided practice labs</h3><span class="eyebrow">${doneLabs} of ${m.labs.length} completed</span></div><div class="sec-safety">Practice in a local sandbox or on an explicitly authorized system with synthetic users and data. Labs are guided tasks; no live target or automatic grader is provided.</div>
 ${m.labs.map((l,j)=>{const k=secKey(m,'lab',j),on=secLabDone(m,j);return `<article class="sec-lab" id="A-${k}"><div class="sec-lab-head"><span class="pill">LAB ${j+1}</span><h4>${esc(l.t)}</h4><span class="pill ${on?'done':''}">${on?'Completed':'Not completed'}</span></div><p>${esc(l.task)}</p><ol><li>Set up a safe, repeatable baseline in your own training environment and identify test identities or records.</li><li>Execute the scoped action: ${esc(l.task)}</li><li>Compare the result to the expected control: ${esc(l.focus)}</li><li>Save sanitized evidence, describe a positive and negative test, then record what you learned.</li></ol><label for="${k}-note">Lab notes (saved to your learning progress)</label><textarea id="${k}-note" data-sec-note="${k}" rows="3" maxlength="1800" placeholder="Observed behavior, evidence IDs, questions and remediation notes…">${esc(secState()[k+'-note']||'')}</textarea><div class="sec-lab-actions"><span class="sec-note-status" data-sec-note-status="${k}"></span><button class="learn sec-lab-done" data-key="${k}" aria-pressed="${on}">${CHECK} ${on?'Completed — undo':'Mark lab complete'}</button></div></article>`;}).join('')}</section>
 <section class="msect" id="appsec-quiz"><div class="h"><h3>Knowledge checkpoint</h3><span class="eyebrow">${answered} of ${m.qs.length} answered</span></div>${m.qs.map((q,j)=>{const a=secQuizAnswer(m,j),done=a!==undefined&&a!==null;return `<div class="q"><p><span>Q${j+1}</span>${esc(q.t)}</p><div class="opts">${q.o.map((o,k)=>`<button class="opt ${done&&k===q.a?'right':''} ${done&&k===a&&a!==q.a?'wrong':''}" data-secq="${j}" data-answer="${k}" ${done?'disabled':''}><span class="ltr">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>${done?`<div class="explain"><span><b>${a===q.a?'Correct.':'Not quite.'}</b> ${esc(q.x)}</span>${a!==q.a?`<button class="linkbtn" data-sec-retry="${j}">Try again</button>`:''}</div>`:''}</div>`;}).join('')}</section>
 <nav class="pager">${prev?`<a class="btn" href="#${prev.id}">← ${esc(prev.name)}</a>`:'<span></span>'}${next?`<a class="btn" href="#${next.id}">${esc(next.name)} →</a>`:'<a class="btn" href="#appsec">Academy overview →</a>'}</nav></div>
 <aside class="mside"><div class="panel outline-panel"><h5>In this module</h5><div class="outline">${m.lessons.map((l,j)=>`<button class="${secLessonDone(m,j)?'on':''}" data-sec-jump="A-${secKey(m,'l',j)}"><i></i>${j+1}. ${esc(l.t)}</button>`).join('')}<button data-sec-jump="sec-labs"><i></i>Guided practice (${m.labs.length})</button><button data-sec-jump="appsec-quiz"><i></i>Checkpoint (${m.qs.length})</button></div></div><div class="panel"><h5>Reference and next steps</h5><p>Review the linked verification standards and practice with a local lab environment.</p><a href="${esc(m.reference||'https://owasp.org/www-project-web-security-testing-guide/')}" target="_blank" rel="noopener noreferrer">Review the official guidance ↗</a><p class="sec-ref-note">Your completion markers, answers and notes sync with your existing Firebase learning progress when connected.</p></div></aside></div></div>`;
 const rer=()=>{const y=window.scrollY;vApplicationModule(id,true);window.scrollTo(0,y);};
 app.querySelectorAll('.sec-complete').forEach(b=>b.onclick=()=>{secState()[b.dataset.key]=!secState()[b.dataset.key];save();rer();});
 app.querySelectorAll('.sec-lab-done').forEach(b=>b.onclick=()=>{secState()[b.dataset.key]=!secState()[b.dataset.key];save();rer();});
 app.querySelectorAll('[data-secq]').forEach(b=>b.onclick=()=>{secState()[secKey(m,'q',+b.dataset.secq)]=+b.dataset.answer;save();rer();});
 app.querySelectorAll('[data-sec-retry]').forEach(b=>b.onclick=()=>{delete secState()[secKey(m,'q',+b.dataset.secRetry)];save();rer();});
 app.querySelectorAll('[data-sec-jump]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.secJump)?.scrollIntoView({behavior:'smooth',block:'start'}));
 app.querySelectorAll('[data-sec-note]').forEach(t=>t.oninput=()=>{secState()[t.dataset.secNote+'-note']=t.value;save();const status=app.querySelector(`[data-sec-note-status="${t.dataset.secNote}"]`);if(status)status.textContent='Saved';});
 document.getElementById('appSmaller').onclick=()=>{readPrefs.font=Math.max(14,(readPrefs.font||16)-1);storeReader();applyReader();};
 document.getElementById('appLarger').onclick=()=>{readPrefs.font=Math.min(23,(readPrefs.font||16)+1);storeReader();applyReader();};
 document.getElementById('appWidth').onclick=()=>{readPrefs.width=readPrefs.width===60?75:60;storeReader();applyReader();document.getElementById('appWidth').textContent=readPrefs.width===60?'Comfort width':'Wide reading';};
 if(!keepY)afterRoute();
}

/* ---------------- router ---------------- */
let CisaModule=null, AdminMod=null;
/* Version tag for on-demand modules, so a browser never mixes a new index.html with an old cached module. */
const APP_V='79';
function adminStop(){ try{ AdminMod&&AdminMod.unmountAdmin&&AdminMod.unmountAdmin(); }catch(e){} }
/* Admin account: a monitoring-only portal (learners, activity log, weekly and 2-week reports). */
async function vAdmin(ah){
  const sub=(ah||'admin').replace(/^admin-?/,'')||'overview';
  if(app.querySelector(':scope > .adm-portal')&&AdminMod&&AdminMod.showView){ AdminMod.showView(sub); return; }
  app.innerHTML='<div class="cisa-hub adm-portal"><section class="cisa-card">Loading admin portal…</section></div>';
  try{ const M=await import('./cisa/admin-portal.js?v='+APP_V); AdminMod=M; if(!IS_ADMIN||!dbRef) return; await M.mountAdmin({root:app,readLearners,readActivity,unlockLearner,fb:FB,view:sub,listBackups,readBackup,restoreBackup,selfTest,appVersion:APP_V,relockLearner,resetLearner}); }
  catch(e){ console.error('Admin portal failed',e); app.innerHTML='<div class="cisa-hub adm-portal"><section class="cisa-error">Unable to load the admin portal. Upload the whole <code>cisa/</code> folder alongside <code>index.html</code>.</section></div>'; }
}
async function vCisa(){
  app.innerHTML='<div class="cisa-hub"><section class="cisa-card">Loading CISA Certification Hub…</section></div>';
  try{
    if(!CisaModule) CisaModule=await import('./cisa/cisa-app.js?v='+APP_V);
    if(location.hash.replace('#','')!=='cisa'||!dbRef)return;
    await CisaModule.mount({root:app,read:()=>{const v=S.cisa||{};window.__cisaBase=jclone(v);return v;},write:(next)=>{const b=window.__cisaBase;S.cisa=b?merge3(b,next,S.cisa||{}):next;window.__cisaBase=jclone(next);save()},isAdmin:!!(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID),verifyAdmin,readLearners,unlockLearner,track:(w,a)=>actEvent(w,a),tab:window.__cisaTab||null,topic:window.__cisaTopic||null,section:window.__cisaSection||null}); window.__cisaTab=null; window.__cisaTopic=null; window.__cisaSection=null; window.__cisaWhere=CisaModule.where||null;
  }catch(e){console.error('CISA load failed',e);app.innerHTML='<div class="cisa-hub"><section class="cisa-error">Unable to load CISA Hub. Verify the whole <code>cisa/</code> directory was uploaded alongside <code>index.html</code>.</section></div>'}
}
const VIEWS={dashboard:vDashboard,courses:vCourses,grc:vGRC,appsec:vApplication,cisa:vCisa,workbook:vWorkbook,insights:vInsights,explore:vExplore,flash:vFlash,rosetta:vRosetta,subnets:vSubnets,certs:vCerts,log:vLog};
let pendingLevel=null;

/* ================= Today card, backup, flashcards, quick search ================= */
const FL_INT=[1,3,7,14,30];
function flashDeck(){const g=Object.keys(GLOSS).map(t=>({k:'g:'+t,front:t,back:GLOSS[t],deck:'Glossary'}));const c=(window.__cisaTopics||[]).map(t=>({k:'c:'+t.id,front:t.id+' · '+t.title,back:t.intro||'',deck:'CISA'}));const ai=AIC_FLASH.map(([t,d])=>({k:'ai:'+t,front:t,back:d,deck:'AI Compliance'}));return g.concat(ai,c);}
async function loadCisaTopics(){if(window.__cisaTopics)return window.__cisaTopics;try{const g=await (await fetch('cisa/data/manual-guide.json')).json();window.__manualSecs=g.chapters.flatMap(c=>c.parts.flatMap(p=>p.sections.flatMap(x=>[{id:x.id,title:x.title,page:x.page,ch:c.n},...(x.subs||[]).map(y=>({id:y.id,title:y.title,page:y.page,ch:c.n}))])));}catch(e){window.__manualSecs=[];}try{const r=await fetch('cisa/data/syllabus.json');const d=await r.json();window.__cisaTopics=d.domains.flatMap(x=>x.topics.map(t=>({id:t.id,title:t.title,intro:t.intro,domain:t.domain})));}catch(e){window.__cisaTopics=[];}return window.__cisaTopics;}
function flashState(){S.flash=S.flash||{};return S.flash;}
function flashStats(deckName){const F=flashState(),t=today(),deck=flashDeck().filter(c=>!deckName||deckName==='All'||c.deck===deckName);let due=0,learned=0,mastered=0;for(const c of deck){const r=F[c.k];if(!r)continue;learned++;if(r.x)mastered++;else if(r.d<=t)due++;}const newToday=(S.flashNew&&S.flashNew.d===t)?S.flashNew.n:0;const fresh=deck.filter(c=>!F[c.k]).length;return {total:deck.length,due,learned,mastered,fresh,newLeft:Math.max(0,Math.min(fresh,10-newToday))};}

/* ---------------- v71: daily goal, exam-readiness forecast, weak spots ---------------- */
const GOAL_MIN=30, GOAL_FLOOR=15; let actEvents=[]; let WeakMod=null, weakRefs=null, actDaysCache={at:0,uid:'',by:{}};
async function trackedMinutesByDay(){
  const uid=auth.currentUser&&auth.currentUser.uid; if(!uid||!fdb) return {};
  if(actDaysCache.uid===uid&&Date.now()-actDaysCache.at<120000) return actDaysCache.by;
  const by={}, ev=[];
  try{ const qs=await getDocs(collection(fdb,'activity',uid,'days')); qs.forEach(d=>{ if(!/^\d{4}-\d{2}-\d{2}$/.test(d.id)) return; const r=(d.data()||{}).r||{}; for(const x of Object.values(r)){ if(x&&x.k==='t') by[x.d||d.id]=(by[x.d||d.id]||0)+(+x.sec||0)/60; else if(x&&x.k==='e'&&/^Completed topic /.test(x.x||'')) ev.push({d:x.d||d.id,x:x.x}); } }); }catch(e){}
  actEvents=ev;
  for(const r of Object.values(typeof actPending==='object'&&actPending||{})) if(r&&r.k==='t'&&!(by[r.d]>0)) by[r.d]=(by[r.d]||0)+(+r.sec||0)/60;
  actDaysCache={at:Date.now(),uid,by}; return by;
}
// same rule as the nudge emails: tracked app time, or logged minutes if that is more
async function studyMinutesByDay(){
  const t=await trackedMinutesByDay(), l={};
  S.log.forEach(e=>{l[e.d]=(l[e.d]||0)+(+e.m||0);});
  ((S.cisa&&S.cisa.logs)||[]).forEach(e=>{const k=String(e.date||'').slice(0,10); l[k]=(l[k]||0)+(+e.minutes||0);});
  const o={}; for(const k of new Set([...Object.keys(t),...Object.keys(l)])) o[k]=Math.round(Math.max(t[k]||0,l[k]||0)); return o;
}
function goalCardHTML(by){
  const k=today(), m=by[k]||0, pc=Math.min(100,Math.round(m/GOAL_MIN*100));
  let st=0; const d=new Date(); if((by[dayKey(d)]||0)<GOAL_MIN) d.setDate(d.getDate()-1); while((by[dayKey(d)]||0)>=GOAL_MIN){st++; d.setDate(d.getDate()-1);}
  let best=0,run=0; const keys=Object.keys(by).sort(); let prev=null; for(const x of keys){ if(by[x]>=GOAL_MIN){ run=(prev&&Math.round((new Date(x)-new Date(prev))/864e5)===1)?run+1:1; prev=x; best=Math.max(best,run);} }
  const last3=[1,2,3].map(i=>{const z=new Date(); z.setDate(z.getDate()-i); return by[dayKey(z)]||0;}), avg3=Math.round(last3.reduce((a,b)=>a+b,0)/3);
  const week=[...Array(7)].map((_,i)=>{const z=new Date(); z.setDate(z.getDate()-6+i); const key=dayKey(z), v=by[key]||0; return `<i class="${v>=GOAL_MIN?'hit':v>=GOAL_FLOOR?'half':v>0?'low':''}" title="${esc(z.toLocaleDateString(undefined,{weekday:'short',day:'numeric'}))}: ${v} min"><span>${z.toLocaleDateString(undefined,{weekday:'narrow'})}</span></i>`;}).join('');
  const msg=m>=GOAL_MIN?'Goal reached today — great work. 🎉':m>0?`${GOAL_MIN-m} more minute${GOAL_MIN-m===1?'':'s'} to reach today’s goal.`:'Nothing yet today — start a 30-minute session.';
  const warn=avg3<GOAL_FLOOR?`<p class="rd-warn">Last 3 days: ${avg3} min a day on average — below the ${GOAL_FLOOR}-minute minimum.</p>`:'';
  return `<section class="ed-card rd-card rd-goal"><span class="ed-kicker">Daily goal</span><div class="rd-goal-body"><div class="rd-ring">${ringSVG(120,50,11,pc,'rgba(10,37,64,.08)',m>=GOAL_MIN?'#34C759':'#0A84FF')}<span><b>${m}</b><small>of ${GOAL_MIN} min</small></span></div>
   <div><h3 class="ed-title">${st} day streak 🔥</h3><p class="ed-sub">${msg}</p><div class="rd-week">${week}</div><p class="cisa-mini">Best streak ${best} day${best===1?'':'s'} · goal ${GOAL_MIN} min a day</p></div></div>${warn}</section>`;
}
function forecastCardHTML(f){
  const cls={ok:'ok',done:'ok',behind:'warn',late:'bad'}[f.status]||'ok', pc=Math.round(f.done/f.total*100);
  const ttl={ok:'On track for the exam',done:'Syllabus finished',behind:'Falling behind',late:'Not on track for the exam date'}[f.status];
  return `<section class="ed-card rd-card rd-fc rs-${cls}"><span class="ed-kicker">Exam-readiness forecast</span><h3 class="ed-title">${ttl}</h3><p class="ed-sub">${esc(f.msg)}</p>
   <span class="d3-bar ed-bar"><i style="width:${pc}%"></i></span><div class="rd-fc-row"><span><b>${f.done}/${f.total}</b> topics</span><span><b>${f.perWeek}</b> / week now</span><span><b>${f.needPerWeek}</b> / week needed</span><span><b>${f.daysLeft}</b> days to exam</span></div>
   <a class="btn" href="#cisa" data-cisa-tab="overview">Open study plan →</a></section>`;
}
function weakCardHTML(w){
  if(!w.enough&&!w.topics.length) return `<section class="ed-card rd-card"><span class="ed-kicker">Weak spots</span><h3 class="ed-title">Not enough answers yet</h3><p class="ed-sub">Take a practice quiz or a mock exam. After about 20 answered questions, your weakest CISA domains and topics show here.</p><a class="btn" href="#cisa" data-cisa-tab="mocks">Mock exams & practice →</a></section>`;
  const D=w.weakDomains.slice(0,2).map(d=>`<li><span class="rd-pct bad">${d.acc}%</span><span><b>Domain ${d.id}</b> · ${esc(d.name)}</span></li>`).join('');
  const T=w.topics.slice(0,4).map(t=>`<li><span class="rd-pct ${t.acc===null?'':t.acc<50?'bad':'warn'}">${t.acc===null?'—':t.acc+'%'}</span><span><b>${esc(t.id)}</b> · ${esc(t.title)}${t.mistakes?` <em>${t.mistakes} open mistake${t.mistakes===1?'':'s'}</em>`:''}</span></li>`).join('');
  return `<section class="ed-card rd-card rd-weak"><span class="ed-kicker">Weak spots</span><h3 class="ed-title">${w.weakDomains.length||w.topics.length?'Focus here next':'No weak spots right now 💪'}</h3>
   ${D?`<ul class="rd-list">${D}</ul>`:''}${T?`<p class="cisa-mini" style="margin:8px 0 2px">Weakest topics</p><ul class="rd-list">${T}</ul>`:''}
   <p class="cisa-mini">From ${w.answered} answered questions in mocks, quizzes and your logs${w.openMistakes?` · ${w.openMistakes} open mistakes`:''}.</p>
   <a class="btn" href="#cisa" data-cisa-tab="mistakes">Review mistakes →</a></section>`;
}
async function fillReadiness(){
  const slot=document.getElementById('readySlot'); if(!slot) return;
  try{
    if(!WeakMod) WeakMod=await import('./cisa/weak.js?v='+APP_V);
    if(!weakRefs) weakRefs=await WeakMod.loadRefs('./cisa/');
    const by=await studyMinutesByDay(); const el=document.getElementById('readySlot'); if(!el) return;
    const C=S.cisa||{};
    const gs=document.getElementById('goalSlot'); if(gs) gs.innerHTML=goalCardHTML(by);
    el.innerHTML=(gs?'':goalCardHTML(by))+forecastCardHTML(WeakMod.forecast(C,weakRefs,Date.now(),WeakMod.doneDatesFromEvents(actEvents)))+weakCardHTML(WeakMod.weakReport(C,weakRefs));
    el.querySelectorAll('[data-cisa-tab]').forEach(a=>a.addEventListener('click',()=>{window.__cisaTab=a.dataset.cisaTab;}));
  }catch(e){ console.warn('readiness',e); const el=document.getElementById('readySlot'); if(el) el.remove(); }
}
function weekCardHTML(){try{
 const byA=minutesByDay(),byW={};bookEntries.forEach(e=>{const k=String(e.date||'').slice(0,10);byW[k]=(byW[k]||0)+(Number(e.minutes)||0);});
 const span=off=>{const ks=[];for(let i=6+off;i>=off;i--){const d=new Date();d.setDate(d.getDate()-i);ks.push(dayKey(d));}return ks;};
 const calc=off=>{const ks=span(off),set=new Set(ks),from=new Date(ks[0]+'T00:00:00').getTime(),to=new Date(ks[6]+'T23:59:59').getTime();
  const mins=ks.reduce((a,k)=>a+(byA[k]||0)+(byW[k]||0),0),active=ks.filter(k=>(byA[k]||0)+(byW[k]||0)>0).length;
  const ai=Object.entries(grcState).filter(([k,v])=>AIC_KEY.test(k)&&v&&v.done&&v._t>=from&&v._t<=to).length;
  const man=Object.values((S.cisa&&S.cisa.manRead)||{}).filter(d=>set.has(String(d).slice(0,10))).length;
  const rv=Object.entries(grcState).filter(([k])=>/^rv-/.test(k)).reduce((a,[,v])=>a+((v&&v.log)||[]).filter(x=>{const t=Date.parse(x.at);return t>=from&&t<=to;}).length,0);
  return {mins,active,ai,man,rv};};
 const a=calc(0),b=calc(7),tr=(x,y)=>x>y?`<em class="wk-up">▲ ${x-y}</em>`:x<y?`<em class="wk-dn">▼ ${y-x}</em>`:'<em class="wk-eq">=</em>';
 const cell=(v,lab,pv,fmt=n=>n)=>`<div><b>${fmt(v)}</b><span>${lab}</span>${tr(Math.round(v),Math.round(pv))}</div>`;
 const sa=a.mins+a.ai*15+a.man*20+a.rv*5,sb=b.mins+b.ai*15+b.man*20+b.rv*5;const msg=sa===0?'A fresh week — even 20 minutes a day adds up.':sa>=sb?'Ahead of last week. Keep the rhythm going.':'A little behind last week — a short session today closes the gap.';
 return `<section class="ed-card wk-card"><div class="wk-h"><div><span class="ed-kicker">Your last 7 days</span><h3 class="ed-title">${(a.mins/60).toFixed(1)} hours · ${a.active} active day${a.active===1?'':'s'}</h3><p class="ed-sub">${msg} Arrows compare with the 7 days before.</p></div></div>
 <div class="wk-grid">${cell(a.mins,'minutes studied',b.mins)}${cell(a.active,'active days',b.active)}${cell(a.ai,'AI lessons completed',b.ai)}${cell(a.man,'CISA manual sections read',b.man)}${cell(a.rv,'module reviews done',b.rv)}</div></section>`;
}catch(e){console.warn(e);return '';}}
function todayCardHTML(){const t=today(),fs=flashStats('All');const studied=S.log.filter(x=>x.d===t).reduce((a,x)=>a+(+x.m||0),0)+bookEntries.filter(e=>String(e.date||'').slice(0,10)===t).reduce((a,e)=>a+(Number(e.minutes)||0),0);
 const lb=S.lastBackup||0, days=lb?Math.floor((Date.now()-lb)/864e5):null, due=days===null||days>=7;
 return `<section class="ed-card ed-today"><div class="td-main"><div class="td-head"><b>CISA study</b><span id="tdMeta"></span></div><div class="td-list" id="tdCisa"><div class="td-empty">Loading today’s plan…</div></div></div>
 <div class="td-side">
  <a class="td-row" href="#cisa" data-cisa-tab="overview" id="tdCoach"><span class="td-ic" style="--c:#0A84FF"><svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg></span><span class="td-txt"><b>Today’s coach</b><small>Loading…</small></span><span class="td-go">›</span></a>
  <a class="td-row" href="#cisa" data-cisa-tab="mistakes"><span class="td-ic" style="--c:#FF3B30"><svg viewBox="0 0 24 24"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg></span><span class="td-txt"><b id="tdMx">–</b><small>mistakes due</small></span><span class="td-go">›</span></a>
  <a class="td-row" href="#flash"><span class="td-ic" style="--c:#AF52DE"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="14" height="13" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v11"/></svg></span><span class="td-txt"><b>${fs.due+fs.newLeft}</b><small>flashcards ready${fs.due?` · ${fs.due} due`:''}</small></span><span class="td-go">›</span></a>
  ${(()=>{const n=aicReviewDue();return n?`<a class="td-row" href="#aic-review"><span class="td-ic" style="--c:#5856D6"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg></span><span class="td-txt"><b>${n}</b><small>AI modules ready for review</small></span><span class="td-go">›</span></a>`:'';})()}
  <a class="td-row" href="#cisa" data-cisa-tab="recorder"><span class="td-ic" style="--c:#34C759"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg></span><span class="td-txt"><b id="tdMin" data-base="${studied}">${studied}</b><small>minutes studied today · focus timer</small></span><span class="td-go">›</span></a>
  <div class="td-row td-backup ${due?'is-due':''}"><span class="td-ic" style="--c:${due?'#FF9F0A':'#0A84FF'}"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 19h16"/></svg></span><span class="td-txt"><b>${days===null?'No backup yet':days===0?'Backed up today':days+' day'+(days===1?'':'s')+' ago'}</b><small>${due?'Weekly backup recommended':'Backup of all progress'}</small></span><span class="td-btns"><button type="button" class="td-btn" id="bkDl">Download</button><button type="button" class="td-btn ghost" id="bkRs">Restore</button><input type="file" id="bkFile" accept="application/json,.json" hidden></span></div>
 </div></section>`;}
async function wireToday(){
 app.querySelectorAll('[data-cisa-tab]').forEach(a=>a.addEventListener('click',()=>{window.__cisaTab=a.dataset.cisaTab;}));
 const dl=document.getElementById('bkDl'), rs=document.getElementById('bkRs'), fi=document.getElementById('bkFile');
 if(dl) dl.onclick=exportAll; if(rs) rs.onclick=()=>fi.click(); if(fi) fi.onchange=()=>{const f=fi.files&&fi.files[0]; if(f) importAll(f); fi.value='';};
 try{
  if(!CisaModule) CisaModule=await import('./cisa/cisa-app.js?v='+APP_V);
  const info=await (CisaModule.coachInfo||CisaModule.todayInfo)(()=>S.cisa||{});
  const cr=document.getElementById('tdCoach'); if(cr&&info.coach){cr.querySelector('b').textContent=info.coach.done+'/3 coach steps';cr.querySelector('small').textContent='Domain '+info.coach.dom+(info.coach.sec?' · '+info.coach.sec:'');}
  const box=document.getElementById('tdCisa'); if(!box) return;
  const mx=document.getElementById('tdMx'); if(mx) mx.textContent=info.mistakesDue;
  const mn=document.getElementById('tdMin'); if(mn) mn.textContent=(+mn.dataset.base||0)+info.loggedToday;
  const meta=document.getElementById('tdMeta'); if(meta) meta.textContent=(info.mode==='relaxed'?'Relaxed':'Normal')+' plan'+(info.locked?' · locked':'')+(info.overdue?` · ${info.overdue} overdue`:'');
  box.innerHTML=info.items.length?info.items.map(x=>`<a class="td-task ${x.done?'done':''}" href="#cisa" data-cisa-tab="planner"><span class="td-check" aria-hidden="true">${x.done?'✓':''}</span><span class="td-t"><b>${esc(x.id.startsWith('mock')||x.id==='exam'?x.title:x.id+' · '+x.title)}</b><small>${x.minutes} min</small></span></a>`).join('')
   :`<div class="td-empty">${info.next?`No CISA study planned today. Next session: ${esc(new Date(info.next.date+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'}))}.`:'No CISA sessions scheduled. Open the CISA planner to set up your plan.'}</div>`;
  box.querySelectorAll('[data-cisa-tab]').forEach(a=>a.addEventListener('click',()=>{window.__cisaTab=a.dataset.cisaTab;}));
 }catch(e){console.warn('Today card',e);const box=document.getElementById('tdCisa'); if(box) box.innerHTML='<div class="td-empty">CISA plan unavailable offline.</div>';}
}
function exportAll(){
 const data={kind:'jslearning-full-v1',exportedAt:new Date().toISOString(),account:(document.getElementById('who').title||document.getElementById('who').textContent||''),progress:S,grcState,bookEntries};
 const blob=new Blob([JSON.stringify(data,null,1)],{type:'application/json'}), u=URL.createObjectURL(blob), a=document.createElement('a');
 a.href=u; a.download='js-learning-backup-'+today()+'.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000);
 S.lastBackup=Date.now(); save(); toast('Backup downloaded'); if((location.hash||'#dashboard')==='#dashboard') route();
}
async function importAll(file){
 try{
  if(file.size>20e6) throw Error('File is too large');
  const obj=JSON.parse(await file.text());
  if(obj.kind!=='jslearning-full-v1'||!obj.progress||typeof obj.progress!=='object') throw Error('This is not a JS Learning backup file');
  if(!(await uiConfirm('Restore this backup from '+(obj.exportedAt||'').slice(0,10)+'?\n\nYour current progress on this account will be replaced.'))) return;
  const cur=S.cisa||{}; const next=Object.assign(blank(),obj.progress); next.cisa=next.cisa||{};
  if(cur.planLock&&cur.planLock.locked){ for(const k of ['planLock','plans','planMode','topicEdits','customTasks','order','hidden']){ if(k in cur) next.cisa[k]=cur[k]; else delete next.cisa[k]; } }
  next.lastBackup=Date.now(); S=next; save(); await flush();
  if(obj.grcState&&typeof obj.grcState==='object'){ grcState=obj.grcState; for(const [id,body] of Object.entries(grcState)){ try{ await setDoc(doc(fdb,'users',v3uid,'grcProgress',id),body); }catch(e){} } }
  if(Array.isArray(obj.bookEntries)){ bookEntries=obj.bookEntries; for(const e of bookEntries){ if(e&&e.id){ try{ await setDoc(doc(fdb,'users',v3uid,'studyEntries',e.id),e); }catch(_){} } } }
  v3store(); route(); toast('Backup restored');
 }catch(e){ uiAlert(e.message,{title:'Couldn’t restore the backup'}); }
}
/* ---------- Flashcards view ---------- */
let flDeck='All', flCur=null, flShown=false, flSession={done:0,right:0};
function flNext(){const F=flashState(),t=today(),deck=flashDeck().filter(c=>flDeck==='All'||c.deck===flDeck);const dueC=deck.filter(c=>F[c.k]&&!F[c.k].x&&F[c.k].d<=t).sort((a,b)=>F[a.k].d.localeCompare(F[b.k].d));if(dueC.length)return dueC[0];const st=flashStats(flDeck);if(st.newLeft>0){const fresh=deck.filter(c=>!F[c.k]);return fresh[Math.floor(Math.random()*fresh.length)]||null;}return null;}
function flGrade(good){const F=flashState(),t=today(),c=flCur;if(!c)return;const r=F[c.k];if(!r){S.flashNew=(S.flashNew&&S.flashNew.d===t)?{d:t,n:S.flashNew.n+1}:{d:t,n:1};}
 const s=r?r.s:0, ns=good?s+1:0, iv=good?FL_INT[Math.min(s,FL_INT.length-1)]:1, d=new Date();d.setDate(d.getDate()+iv);
 F[c.k]={d:dayKey(d),s:ns,n:(r?r.n:0)+1,x:ns>=FL_INT.length};flSession.done++;if(good)flSession.right++;save();flCur=flNext();flShown=false;drawFlash();}
async function vFlash(){await loadCisaTopics();flCur=flNext();flShown=false;flSession={done:0,right:0};
 app.innerHTML=`<div class="view"><section class="view-head ed-head"><span class="eyebrow">Spaced review</span><h2>Flashcards</h2></section><div id="flashRoot"></div></div>`;drawFlash();}
function drawFlash(){const root=document.getElementById('flashRoot');if(!root)return;const st=flashStats(flDeck);
 const decks=['All','Glossary','AI Compliance','CISA'].map(d=>`<button type="button" class="fl-seg ${flDeck===d?'on':''}" data-deck="${d}">${d}</button>`).join('');
 const stats=`<div class="fl-stats"><div><b>${st.due}</b><span>due</span></div><div><b>${st.newLeft}</b><span>new today</span></div><div><b>${st.learned}</b><span>learning</span></div><div><b>${st.mastered}</b><span>mastered</span></div><div><b>${st.total}</b><span>cards</span></div></div>`;
 const card=flCur?`<div class="fl-card ${flShown?'flipped':''}" id="flCard" tabindex="0" role="button" aria-label="${flShown?'Answer shown':'Show answer'}"><div class="fl-face fl-front"><span class="fl-deck">${esc(flCur.deck)}</span><h3>${esc(flCur.front)}</h3><small>${(window.matchMedia&&matchMedia('(pointer:coarse)').matches)?'Tap to reveal':'Tap or press Space to reveal'}</small></div><div class="fl-face fl-back"><span class="fl-deck">${esc(flCur.front)}</span><p>${esc(flCur.back)}</p></div></div>
  <p class="fl-swipe-hint">${flShown?'Swipe right if you got it · left to see it again':'Tap the card to see the answer'}</p><div class="fl-actions">${flShown?`<button type="button" class="btn fl-again" id="flAgain">Again <kbd>1</kbd></button><button type="button" class="btn primary" id="flGood">Got it <kbd>2</kbd></button>`:`<button type="button" class="btn primary" id="flShow">Show answer <kbd>Space</kbd></button>`}</div>`
  :`<div class="fl-done"><b>${flSession.done?'Session complete':'All caught up'}</b><p>${flSession.done?`${flSession.right} of ${flSession.done} remembered. `:''}No cards are due in this deck right now. New cards unlock tomorrow (10 per day), and reviewed cards return on a 1, 3, 7, 14 and 30-day schedule.</p></div>`;
 root.innerHTML=`<div class="fl-top"><div class="fl-segs">${decks}</div>${stats}</div>${card}`;
 root.querySelectorAll('[data-deck]').forEach(b=>b.onclick=()=>{flDeck=b.dataset.deck;flCur=flNext();flShown=false;drawFlash();});
 const show=()=>{if(flCur&&!flShown){flShown=true;drawFlash();}};
 document.getElementById('flShow')?.addEventListener('click',show);document.getElementById('flCard')?.addEventListener('click',show);
 document.getElementById('flAgain')?.addEventListener('click',()=>flGrade(false));document.getElementById('flGood')?.addEventListener('click',()=>flGrade(true));}
document.addEventListener('keydown',e=>{if((location.hash||'')!=='#flash'||e.target.closest('input,textarea,select')||!document.getElementById('flashRoot'))return;if(e.key===' '&&flCur&&!flShown){e.preventDefault();flShown=true;drawFlash();}else if(flShown&&(e.key==='1'||e.key==='2')){e.preventDefault();flGrade(e.key==='2');}});
/* ---------- Quick search (⌘K) ---------- */
let cmdkItems=null, cmdkSel=0, cmdkRes=[];
function cmdkIndex(){if(cmdkItems)return cmdkItems;const it=[];
 document.querySelectorAll('#tabs .tab').forEach(b=>it.push({k:'Go to',t:b.textContent.trim(),s:'',run:()=>go(b.dataset.v)}));
 M.forEach(m=>{it.push({k:'Technical',t:m.t,s:'Module '+pad(m.n),run:()=>go(m.id)});m.lessons.forEach(l=>it.push({k:'Lesson',t:l.t,s:m.t,run:()=>{openLessons.add(l.id);go(m.id);setTimeout(()=>document.getElementById('L-'+l.id)?.scrollIntoView({behavior:'smooth',block:'start'}),250);}}));});
 const txt=bs=>(bs||[]).map(b=>[b.x,b.t,b.cap,Array.isArray(b.s)?b.s.map(z=>Array.isArray(z)?z.join(' '):z).join(' '):'',Array.isArray(b.r)?b.r.map(r=>r.join(' ')).join(' '):'',Array.isArray(b.c)?b.c.map(c=>Array.isArray(c)?c.join(' '):'').join(' '):''].map(v=>Array.isArray(v)?v.join(' '):(typeof v==='string'?v:'')).join(' ')).join(' ').replace(/\*\*/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
 GRC.forEach(m=>{it.push({k:'AI Compliance',t:m.name,s:m.id.toUpperCase(),run:()=>go(m.id)});const P=GRC_PLUS[m.id];m.lessons.forEach((l,i)=>{const t=Array.isArray(l)?l[0]:l.t,key=m.id+'-l'+String(i+1).padStart(2,'0');if(t)it.push({k:'AI Compliance lesson',t,s:m.id.toUpperCase()+' · '+m.name,body:P&&P.ls[i]&&P.ls[i].blocks?txt(P.ls[i].blocks):'',run:()=>{go(m.id);setTimeout(()=>document.getElementById('G-'+key)?.scrollIntoView({behavior:'smooth',block:'start'}),300);}});});});
 SEC_ACADEMY.forEach(m=>{it.push({k:'Application',t:m.name,s:m.id.toUpperCase(),run:()=>go(m.id)});(m.lessons||[]).forEach(l=>it.push({k:'App lesson',t:l.t,s:m.name,run:()=>go(m.id)}));});
 [['aic-guides','AI assessment guides'],['aic-cases','AI case studies'],['aic-checks','AI knowledge checks'],['aic-library','AI Compliance library'],['aic-watch','AI rules: what\u2019s changing'],['aic-glossary','AI glossary']].forEach(([h,t])=>it.push({k:'AI Compliance',t,s:'AI Compliance',run:()=>go(h)}));
 AIC_FLASH.forEach(([t,d])=>it.push({k:'AI glossary',t,s:d,run:()=>go('aic-glossary')}));
 Object.keys(GLOSS).forEach(t=>it.push({k:'Glossary',t,s:GLOSS[t],run:()=>{exploreQ=t;glossLetter='';go('explore');}}));
 (window.__cisaTopics||[]).forEach(t=>it.push({k:'CISA',t:t.id+' · '+t.title,s:'Domain '+t.domain,run:()=>{window.__cisaTab='syllabus';window.__cisaTopic=t.id;if((location.hash||'')==='#cisa')route();else go('cisa');}}));
 (window.__manualSecs||[]).forEach(x=>it.push({k:'Manual',t:x.id+' '+x.title,s:'CISA Manual · Chapter '+x.ch+(x.page?' · p. '+x.page:''),run:()=>{window.__cisaTab='manual';window.__cisaSection=x.id;if((location.hash||'')==='#cisa')route();else go('cisa');}}));
 cmdkItems=it.map(x=>({...x,h:(x.t+' '+x.s+' '+x.k).toLowerCase(),b:(x.body||'').toLowerCase()}));return cmdkItems;}
function cmdkSearch(q){q=q.trim().toLowerCase();const all=cmdkIndex();if(!q)return all.filter(x=>x.k==='Go to').slice(0,14);const words=q.split(/\s+/);const sc=x=>{const tl=x.t.toLowerCase();let s=0;if(tl===q)s+=100;if(tl.startsWith(q))s+=50;if(tl.includes(q))s+=25;if(x.k==='Go to'||x.k==='Technical'||x.k==='AI Compliance'||x.k==='Application')s+=6;if(x.k==='Glossary'&&tl.startsWith(q))s+=10;return s;};const head=all.filter(x=>words.every(w=>x.h.includes(w))).map(x=>({x,s:sc(x)}));
 const inHead=new Set(head.map(o=>o.x));
 const body=q.length<3?[]:all.filter(x=>x.b&&!inHead.has(x)&&words.every(w=>x.b.includes(w)||x.h.includes(w))).map(x=>{const i=x.b.indexOf(words[0]),raw=x.body,st=Math.max(0,i-50),snip=(st?'…':'')+raw.slice(st,st+120).trim()+'…';return {x:{...x,k:'In lesson',t:x.s.split(' · ')[0]+' · '+x.t,s:snip},s:5};});
 return [...head.sort((a,b)=>b.s-a.s),...body].slice(0,40).map(o=>o.x);}
function cmdkDraw(){const list=document.getElementById('cmdkList');cmdkRes=cmdkSearch(document.getElementById('cmdkInput').value);cmdkSel=Math.min(cmdkSel,Math.max(0,cmdkRes.length-1));
 list.innerHTML=cmdkRes.length?cmdkRes.map((x,i)=>`<button type="button" class="cmdk-item ${i===cmdkSel?'on':''}" role="option" aria-selected="${i===cmdkSel}" data-i="${i}"><span class="cmdk-k">${esc(x.k)}</span><span class="cmdk-t"><b>${esc(x.t)}</b>${x.s?`<small>${esc(String(x.s).slice(0,110))}</small>`:''}</span></button>`).join(''):'<div class="cmdk-empty">No matches</div>';
 list.querySelector('.cmdk-item.on')?.scrollIntoView({block:'nearest'});}
function cmdkOpen(){if(!dbRef||IS_ADMIN)return;const el=document.getElementById('cmdk');el.hidden=false;document.documentElement.classList.add('ap-lock');const inp=document.getElementById('cmdkInput');inp.value='';cmdkSel=0;cmdkDraw();setTimeout(()=>inp.focus(),20);loadCisaTopics().then(()=>{cmdkItems=null;if(!el.hidden)cmdkDraw();});}
function cmdkClose(){const el=document.getElementById('cmdk');if(el.hidden)return;el.hidden=true;document.documentElement.classList.remove('ap-lock');}
function cmdkRun(i){const x=cmdkRes[i];if(!x)return;cmdkClose();document.getElementById('sideNav')?.classList.remove('open');x.run();}
document.getElementById('cmdkInput').addEventListener('input',()=>{cmdkSel=0;cmdkDraw();});
document.getElementById('cmdkList').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)cmdkRun(+b.dataset.i);});
document.getElementById('cmdk').addEventListener('click',e=>{if(e.target.hasAttribute('data-cmdk-close'))cmdkClose();});
document.getElementById('cmdkBtn').addEventListener('click',cmdkOpen);
document.getElementById('bbSearch').addEventListener('click',cmdkOpen);
document.getElementById('bbMore').addEventListener('click',()=>document.getElementById('menuBtn')?.click());
document.addEventListener('keydown',e=>{const open=!document.getElementById('cmdk').hidden;
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open?cmdkClose():cmdkOpen();return;}
 if(!open)return;if(e.key==='Escape'){e.preventDefault();cmdkClose();}else if(e.key==='ArrowDown'){e.preventDefault();cmdkSel=Math.min(cmdkRes.length-1,cmdkSel+1);cmdkDraw();}else if(e.key==='ArrowUp'){e.preventDefault();cmdkSel=Math.max(0,cmdkSel-1);cmdkDraw();}else if(e.key==='Enter'){e.preventDefault();cmdkRun(cmdkSel);}});

let IS_ADMIN=false;
/* Show the Admin portal item only to the admin, and Messages only to learners (no reliance on CSS). */
function navForRole(){ document.querySelectorAll('#tabs .adm-only').forEach(el=>el.hidden=!IS_ADMIN); const m=document.querySelector('#tabs .lc-navbtn'); if(m) m.hidden=IS_ADMIN||!dbRef; }
function route(){
  if(!IS_ADMIN&&location.hash==='#admin'){ history.replaceState(null,'','#dashboard'); }
  if(IS_ADMIN){ let ah=(location.hash||'').replace('#',''); if(!/^admin(-[a-z]+)?$/.test(ah)||ah==='admin-chat'){ ah='admin'; history.replaceState(null,'','#admin'); } document.querySelectorAll('#tabs .tab').forEach(t=>t.setAttribute('aria-current',String(t.dataset.v===ah))); vAdmin(ah); return; }
  let h=(location.hash||'').replace('#','')||'dashboard'; if(h==='contents') h='courses';
  const isMod=/^m\d\d$/.test(h); const isGRC=/^a[ib]\d\d$/.test(h)||isAICRoute(h); const isApp=/^a\d\d$/.test(h);
  document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-current',String(t.dataset.v===(isMod?'courses':isGRC?'grc':isApp?'appsec':h))));
  document.querySelectorAll('#bottomBar [data-bb]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.bb===(isMod||h==='courses'?'courses':h))));
  if(isMod&&!coreFull){ app.innerHTML='<div class="view"><section class="ed-card" style="padding:28px;text-align:center;color:var(--muted)">Loading the module…</section></div>'; loadCore().then(()=>{ if(((location.hash||'').replace('#','')||'dashboard')===h) route(); }).catch(()=>{ app.innerHTML='<div class="view"><section class="ed-card" style="padding:28px">Could not load this module. Check your connection and try again.</section></div>'; }); } else if((isGRC||isAICRoute(h))&&!aicFull){ app.innerHTML='<div class="view"><section class="ed-card" style="padding:28px;text-align:center;color:var(--muted)">Loading the AI Compliance Academy…</section></div>'; loadAIC().then(()=>{ if(((location.hash||'').replace('#','')||'dashboard')===h) route(); }).catch(()=>{ app.innerHTML='<div class="view"><section class="ed-card" style="padding:28px">Could not load the AI Compliance Academy. Check your connection and try again.</section></div>'; }); } else if(isMod) vModule(h); else if(isAICRoute(h)) renderAIC(h,{app,state:()=>grcState,save:saveGRC,confirm:uiConfirm,plus:()=>GRC_PLUS}); else if(isGRC) vGRCModule(h); else if((isApp||h==='appsec')&&!secFull){ app.innerHTML='<div class="view"><section class="ed-card" style="padding:28px;text-align:center;color:var(--muted)">Loading the Application Academy…</section></div>'; loadSec().then(()=>{ if(((location.hash||'').replace('#','')||'dashboard')===h) route(); }).catch(()=>{ app.innerHTML='<div class="view"><section class="ed-card" style="padding:28px">Could not load the Application Academy. Check your connection and try again.</section></div>'; }); } else if(isApp) vApplicationModule(h); else (VIEWS[h]||vDashboard)();
  updateTop();
}
function afterRoute(){ if(pendingLevel){const el=document.getElementById('lv-'+pendingLevel); pendingLevel=null; if(el){el.scrollIntoView({block:'start'}); return;}} window.scrollTo(0,0);}
function go(view,level){if(view==='admin-chat'){if(IS_ADMIN&&AdminMod&&AdminMod.openChat)AdminMod.openChat();setMenu(false);return;}if(view==='messages'){setMenu(false);openMessages();return;}pendingLevel=level||null; if(location.hash.replace('#','')===view){route(); afterRoute();} else location.hash=view;}
document.getElementById('tabs').onclick=e=>{const b=e.target.closest('.tab'); if(b) go(b.dataset.v);};

/* ---------------- V4 shell: mobile drawer, theme, avatar ---------------- */
const topbar=document.getElementById('topbar'), menuBtn=document.getElementById('menuBtn');
function setMenu(open){topbar.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');}
menuBtn.onclick=()=>setMenu(!topbar.classList.contains('open'));
/* ---------- Sunset shell: account menu, Track/Tools dropdowns, scrolled header, band sizing ---------- */
const acctBtn=document.getElementById('acctBtn');
function setAcct(open){topbar.classList.toggle('acct-open',open);acctBtn.setAttribute('aria-expanded',String(open));}
function closeDrops(){document.querySelectorAll('.nav-drop.open').forEach(g=>{g.classList.remove('open');g.querySelector('.nav-label').setAttribute('aria-expanded','false');});}
acctBtn.onclick=e=>{e.stopPropagation();closeDrops();setAcct(!topbar.classList.contains('acct-open'));};
document.querySelectorAll('.nav-drop>.nav-label').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const g=b.parentElement,open=!g.classList.contains('open');closeDrops();setAcct(false);g.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));}));
document.addEventListener('click',e=>{if(!e.target.closest('.side-foot,#acctBtn'))setAcct(false);if(!e.target.closest('.nav-drop>.nav-label'))closeDrops();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setAcct(false);closeDrops();}});
document.getElementById('tabs').addEventListener('click',e=>{if(e.target.closest('.tab')){closeDrops();if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();}});
const markScrolled=()=>topbar.classList.toggle('scrolled',window.scrollY>6);
window.addEventListener('scroll',markScrolled,{passive:true});markScrolled();
const appEl=document.getElementById('app');
document.querySelectorAll('#topbar .tab, #topbar .side-btn').forEach(b=>{const t=(b.querySelector('span')||{}).textContent;if(t){b.title=t.trim();if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',t.trim());}});
function applyPalette(){document.documentElement.setAttribute('data-palette','mac-sonoma');}
document.querySelectorAll('.palette button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();applyPalette(b.dataset.palette);}));
applyPalette();
const sideMQ=window.matchMedia('(min-width:1000px)');
function sizeBand(){const y=window.scrollY,tb=topbar.getBoundingClientRect();let end=sideMQ.matches?0:tb.bottom+y;
  if(!appEl.hidden){const head=appEl.querySelector(':scope > .view > .view-head:first-child, :scope > .view-head:first-child, :scope > .view > .cockpit:first-child, :scope > .view > .mhero:first-child, :scope > .cisa-hub > .cisa-tabs');
    if(head){const r=head.getBoundingClientRect();if(head.matches('.cockpit,.mhero'))end=r.top+y+Math.min(r.height*0.5,170);else{const nx=head.nextElementSibling;end=(nx&&nx.matches('.kpis,.stats,.panel,.cards,.tscroll,.cert-cols,.sn-grid,details,.cisa-grid,.dash3,.dash-grid'))?nx.getBoundingClientRect().top+y+44:r.bottom+y+28;}}}
  document.documentElement.style.setProperty('--band-h',Math.round(end)+'px');}
let bandQueued=false;const queueBand=()=>{if(bandQueued)return;bandQueued=true;requestAnimationFrame(()=>{bandQueued=false;sizeBand();});};
new MutationObserver(queueBand).observe(appEl,{childList:true,subtree:true});
window.addEventListener('resize',queueBand);sideMQ.addEventListener&&sideMQ.addEventListener('change',queueBand);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(queueBand);
queueBand();
document.getElementById('tabs').addEventListener('click',()=>setMenu(false));
window.addEventListener('hashchange',()=>setMenu(false));
const THEMES=['system','light','dark'];
function themeNow(){try{return localStorage.getItem('p2c-theme')||'light'}catch{return 'light'}}
function applyTheme(){document.documentElement.setAttribute('data-theme','light');}
applyTheme();

function setAvatar(email){const c=(email||'?').trim().charAt(0).toUpperCase();document.getElementById('avatar').textContent=c;const t=document.getElementById('avatarTop');if(t)t.textContent=c;}
/* reading progress inside a module */
window.addEventListener('scroll',()=>{const bar=document.getElementById('readbar');if(!bar)return;const sec=document.getElementById('s-lessons');if(!sec)return;const r=sec.getBoundingClientRect();const total=sec.offsetHeight-window.innerHeight*0.6;const p=Math.min(1,Math.max(0,(-r.top+window.innerHeight*0.2)/Math.max(1,total)));bar.style.width=(p*100).toFixed(1)+'%';},{passive:true});



/* ---------------- sync: Firebase ---------------- */
const configured=!firebaseConfig.apiKey.startsWith('PASTE');
const fbApp=configured?initializeApp(firebaseConfig):null;
const auth=fbApp?getAuth(fbApp):null;
/* Admin unlock from a learner's device: the admin's credentials are checked on a
   temporary, separate Firebase app. That admin session writes the unlock to the
   learner's progress document (allowed by the Firestore rules), then signs out. */
async function verifyAdmin(email,password){
  if(!configured||!email||!password) return {ok:false,err:'Enter the admin email and password.'};
  let tmp=null;
  try{
    tmp=initializeApp(firebaseConfig,'admin-verify-'+Date.now());
    const a2=getAuth(tmp); let cred;
    try{ cred=await signInWithEmailAndPassword(a2,email,password); }catch(e){ return {ok:false,err:'Those are not the admin\u2019s sign-in details.'}; }
    if(!(cred&&cred.user&&cred.user.uid===ADMIN_UID)){ try{await signOut(a2);}catch(e){} return {ok:false,err:'Those are not the admin\u2019s sign-in details.'}; }
    const learner=auth&&auth.currentUser&&auth.currentUser.uid;
    if(learner&&learner!==ADMIN_UID){
      try{ await setDoc(doc(getFirestore(tmp),'progress',learner),{cisa:{planLock:{locked:false,unlockedAt:new Date().toISOString(),by:'admin'}}},{merge:true}); }
      catch(e){ try{await signOut(a2);}catch(_){} return {ok:false,err:'Could not reach the server to unlock. Check the connection and try again.'}; }
    }
    try{await signOut(a2);}catch(e){}
    return {ok:true};
  }catch(e){ return {ok:false,err:'Admin check failed. Try again.'}; }
  finally{ if(tmp){ try{ await deleteApp(tmp); }catch(e){} } }
}
const fdb=fbApp?getFirestore(fbApp):null;
/* Firestore helpers handed to the coaching modules (learner chat/popups and the admin portal). */
const FB={fdb,doc,collection,query,where,orderBy,onSnapshot,setDoc,addDoc,updateDoc,getDoc,getDocs};
let CoachMod=null, coachErr='';
async function coachStart(user){
  if(!fdb||!user||user.uid===ADMIN_UID) return;
  try{ CoachMod=CoachMod||await import('./cisa/learner-coach.js?v='+APP_V); if(!dbRef) return;
    const opts={fb:FB,uid:user.uid,getS:()=>S,save:()=>save(),onRemoteSignOut:()=>doSignOut('Signed out by the admin','The admin signed you out. Sign in again to continue.'),signOut:()=>doSignOut()};
    try{ CoachMod.startCoach(opts); }catch(e){ coachErr='start: '+(e&&e.message||e); console.warn(e); }
    if(!window.__openChat){ /* an outdated cached copy was loaded: fetch a fresh one */
      try{ CoachMod.stopCoach&&CoachMod.stopCoach(); }catch(e){}
      CoachMod=await import('./cisa/learner-coach.js?v='+APP_V+'-'+Date.now()); if(!dbRef) return; try{ CoachMod.startCoach(opts); }catch(e){ coachErr='restart: '+(e&&e.message||e); }
    }
  }catch(e){ console.warn('Coach module failed',e); coachErr='load: '+String(e&&e.message||e); }
}
async function openMessages(){
  if(window.__openChat){ window.__openChat(); return; }
  if(auth&&auth.currentUser&&!IS_ADMIN){ CoachMod=null; await coachStart(auth.currentUser); if(window.__openChat){ window.__openChat(); return; } }
  const diag=['App '+APP_V,'chat module '+(CoachMod?(CoachMod.VERSION||'old'):'not loaded'),coachErr||'no error reported',navigator.userAgent.replace(/^Mozilla\/5.0 /,'').slice(0,90)].join(' · ');
  if(await uiConfirm('Reload the page to load the latest version of the app.\n\nIf it still doesn’t open, send this to your admin:\n'+diag,{title:'Messages couldn’t open',ok:'Reload now',cancel:'Not now'})){ location.reload(); }
}
function coachStop(){ try{ CoachMod&&CoachMod.stopCoach(); }catch(e){} }
/* Admin: read other approved accounts' progress (allowed by Firestore rules for the admin only). */
async function readLearners(){
  if(!(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID)) return [];
  const out=[];
  for(const uid of ALLOWED_USER_UIDS.filter(u=>u!==ADMIN_UID)){
    try{ const snap=await getDoc(doc(fdb,'progress',uid)); out.push({uid,ok:true,data:snap.exists()?snap.data():null}); }
    catch(e){ out.push({uid,ok:false,error:String(e&&e.code||e&&e.message||e)}); }
  }
  return out;
}
async function relockLearner(uid,mode,at){
  if(!isAdminUser()) return false;
  try{ await setDoc(doc(fdb,'progress',uid),{cisa:{planMode:mode,planLock:{locked:true,mode,at,relockedAt:new Date().toISOString(),by:'admin'}}},{merge:true}); return true; }catch(e){ return false; }
}
async function unlockLearner(uid){
  if(!(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID)) return false;
  try{ await setDoc(doc(fdb,'progress',uid),{cisa:{planLock:{locked:false,unlockedAt:new Date().toISOString(),by:'admin'}}},{merge:true}); return true; }catch(e){ return false; }
}

/* Admin: read a learner's activity log (one small Firestore document per day). */
async function readActivity(uid,from){
  if(!(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID)) return {ok:false,rows:[],error:'not-admin'};
  try{
    const [prof,snap]=await Promise.all([getDoc(doc(fdb,'activity',uid)),getDocs(query(collection(fdb,'activity',uid,'days'),where('d','>=',from)))]);
    const rows=[]; snap.forEach(x=>{const r=(x.data()||{}).r||{}; for(const v of Object.values(r)) if(v&&v.d) rows.push(v);});
    return {ok:true,rows,profile:prof.exists()?prof.data():null};
  }catch(e){ return {ok:false,rows:[],error:String(e&&e.code||e&&e.message||e)}; }
}

let KEY='p2c-guest', dbRef=null, writing=Promise.resolve(), dbTimer=null;
/* ---- Progress sync (V27) ----
   Progress lives in one Firestore document (progress/{uid}) plus a copy on the device.
   Earlier versions replaced the whole document on every save and picked a winner by device clock,
   so an older copy on another device or tab could overwrite newer progress. Now:
   • nothing is written to the server until the server copy has loaded (remoteReady);
   • every write is a three-way merge (last synced copy = base, this device = local, server = remote)
     inside a transaction, so changes from other devices and tabs are kept, and deletions
     (un-ticking a lesson, retrying a quiz) are respected;
   • a live listener merges changes made on other devices or tabs while this one is open. */
let syncBase=null, remoteReady=false, unsubProg=null, syncPending=false, syncFails=0;
const jclone=o=>o===undefined?undefined:JSON.parse(JSON.stringify(o));
const isObj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
/* V28: compare by content, never by key order. Firestore returns map keys sorted alphabetically, so
   comparing JSON text treated identical progress as "changed" and caused a save/refresh loop. */
function jeq(a,b){
  if(a===b) return true;
  if(a===undefined||b===undefined||a===null||b===null) return a===b;
  if(Array.isArray(a)){ if(!Array.isArray(b)||a.length!==b.length) return false; for(let i=0;i<a.length;i++) if(!jeq(a[i],b[i])) return false; return true; }
  if(typeof a==='object'){ if(typeof b!=='object'||Array.isArray(b)) return false; const ka=Object.keys(a).filter(k=>a[k]!==undefined), kb=Object.keys(b).filter(k=>b[k]!==undefined); if(ka.length!==kb.length) return false; for(const k of ka) if(!jeq(a[k],b[k])) return false; return true; }
  return false;
}
const canon=o=>Array.isArray(o)?o.map(canon):isObj(o)?Object.fromEntries(Object.keys(o).sort().map(k=>[k,canon(o[k])])):o;
const canonStr=o=>JSON.stringify(canon(o));
function merge3(b,l,r){
  if(jeq(l,b)) return jclone(r);
  if(jeq(r,b)) return jclone(l);
  if(jeq(l,r)) return jclone(l);
  if(isObj(l)&&isObj(r)){const bb=isObj(b)?b:{},out={};for(const k of new Set([...Object.keys(r),...Object.keys(l)])){const v=merge3(bb[k],l[k],r[k]);if(v!==undefined)out[k]=v;}return out;}
  if(Array.isArray(l)&&Array.isArray(r)){
    const key=x=>isObj(x)&&x.id!=null?'id:'+x.id:'j:'+canonStr(x), bb=Array.isArray(b)?b:[];
    const uniq=a=>new Set(a.map(key)).size===a.length;
    if(!uniq(l)||!uniq(r)||l.every(x=>!isObj(x))&&r.every(x=>!isObj(x))&&(l.length===r.length)) return jclone(l); // lists like weeklyMinutes / topic order: keep this device's whole list
    const bm=new Map(bb.map(x=>[key(x),x])), lm=new Map(l.map(x=>[key(x),x])), rm=new Map(r.map(x=>[key(x),x])), out=[], seen=new Set();
    for(const x of r){const k=key(x);seen.add(k);if(bm.has(k)&&!lm.has(k))continue;out.push(lm.has(k)?merge3(bm.get(k),lm.get(k),x):jclone(x));}
    for(const x of l){const k=key(x);if(seen.has(k))continue;if(bm.has(k)&&!rm.has(k))continue;out.push(jclone(x));}
    return out;}
  return jclone(l); // both sides changed the same value differently: this device wins
}
window.__merge3=merge3;
const baseKey=()=>KEY+'-syncbase';
function saveBase(){try{localStorage.setItem(baseKey(),JSON.stringify(syncBase))}catch(e){}}
function loadBase(){try{const r=localStorage.getItem(baseKey());return r?JSON.parse(r):null}catch(e){return null}}
function storeLocal(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function softRefresh(){
  const a=document.activeElement; if(a&&(a.tagName==='TEXTAREA'||a.tagName==='INPUT'||a.isContentEditable)) return;
  const h=(location.hash||'').slice(1); if(h==='cisa'&&S.cisa&&S.cisa.activeMock) return;
  if(/^admin/.test(h)) return;
  const y=window.scrollY; try{route();}catch(e){} window.scrollTo(0,y); try{updateTop();}catch(e){}
}
function setSync(txt,ok){const el=document.getElementById('sync'); el.textContent=txt; el.classList.toggle('ok',!!ok);}
function loadLocal(){try{const raw=localStorage.getItem(KEY); return raw?Object.assign(blank(),JSON.parse(raw)):null;}catch(e){return null;}}
function save(){
  S.t=Date.now();
  storeLocal();
  if(dbRef){syncPending=true; clearTimeout(dbTimer); setSync(remoteReady?'Saving…':'Saved on this device',false); if(remoteReady) dbTimer=setTimeout(flush,1200);}
  updateTop();
}
/* Server rule planIntact(): while the plan is locked on the server, a learner write must carry the
   server's plan fields unchanged, or the WHOLE progress write is refused (and ticks/reads are lost with it). */
const PLAN_FIELDS=['planLock','plans','planMode','topicEdits','customTasks','order','hidden'];
/* V30: a plan the learner locked on this device is never silently dropped by the merge. If the server copy is not
   locked and no admin unlock was recorded after the learner's lock, this device's locked plan (dates, mode, topics)
   is kept and uploaded — this reconnects locks lost in the v51 sync problem. An admin unlock is always respected. */
function lockRecover(out,local,remote){
  const lc=local&&local.cisa, rc=(remote&&remote.cisa)||{};
  if(!lc||!lc.planLock||lc.planLock.locked!==true) return out;
  if(rc.planLock&&rc.planLock.locked===true) return out;
  if(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID) return out;
  const lockAt=Date.parse(lc.planLock.at||'')||0, unAt=Date.parse((rc.planLock&&rc.planLock.unlockedAt)||'')||0;
  if(unAt&&unAt>=lockAt) return out;
  out.cisa=Object.assign({},out.cisa||{}); for(const f of PLAN_FIELDS){ if(f in lc) out.cisa[f]=jclone(lc[f]); }
  return out;
}
function keepLockedPlan(body,remote){
  const rc=remote&&remote.cisa; if(!rc||!rc.planLock||rc.planLock.locked!==true) return;
  if(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID) return;
  body.cisa=Object.assign({},body.cisa||{});
  for(const f of PLAN_FIELDS){ if(f in rc) body.cisa[f]=jclone(rc[f]); else delete body.cisa[f]; }
}
function flush(){
  if(!dbRef||!remoteReady) return writing;
  clearTimeout(dbTimer); dbTimer=null;
  const ref=dbRef;
  writing=writing.then(async()=>{
    const mine=jclone(S); let body=null;
    await runTransaction(fdb,async tx=>{
      const snap=await tx.get(ref), remote=snap.exists()?snap.data():null;
      body=remote&&!jeq(remote,syncBase)?lockRecover(Object.assign(blank(),merge3(syncBase||{},mine,remote)),mine,remote):jclone(mine);
      keepLockedPlan(body,remote);
      body.t=Date.now(); tx.set(ref,body);
    });
    syncBase=jclone(body); saveBase();
    const before=jclone(S); S=Object.assign(blank(),merge3(mine,S,body)); storeLocal(); syncPending=false;
    if(!jeq(before,S)) softRefresh();
  }).then(()=>{syncFails=0;setSync('Synced',true);reportHealth(true);}).catch(e=>{
    console.warn('Progress sync failed',e); syncFails++;
    const code=String(e&&e.code||e&&e.message||'error'); reportHealth(false,code.replace(/^firestore\//,'').slice(0,80));
    setSync(navigator.onLine===false?'Offline: saved on this device':'Not synced yet ('+code.replace(/^firestore\//,'')+') — saved on this device',false);
    window.__lastSyncError={code,at:new Date().toISOString(),size:(()=>{try{return JSON.stringify(S).length}catch(x){return 0}})()};
    if(!/permission-denied|invalid-argument/.test(code)){clearTimeout(dbTimer);dbTimer=setTimeout(flush,Math.min(60000,3000*Math.pow(2,syncFails-1)));}
  });
  return writing;
}

/* ---- V29: sync health, daily backups, sync check, update banner ----
   • Each learner device reports app version, last good save and the last error to activity/{uid}.health
     (a document the learner may already write), so the admin portal can show save problems at once.
   • Once a day the device stores a full copy of the progress in activity/{uid}/days/bk-0 … bk-13
     (14 rotating slots, no "d" field so the activity queries skip them). The admin can restore one.
   • Clicking the sync chip compares this device with the server and reports any difference.
   • version.json is checked every 10 minutes; a newer version shows a "Reload to update" bar. */
let healthT=0, healthErr=null;
function reportHealth(ok,code){
  if(!actUid||!fdb) return;
  const now=Date.now(), key=ok?'':String(code||'error');
  if(key===healthErr&&now-healthT<5*60e3) return;
  healthT=now; healthErr=key;
  const pc=(S&&S.cisa)||{},pp=pc.plans&&pc.plans[pc.planMode];
  const h={v:APP_V,at:now,device:actDev(),online:navigator.onLine!==false,plan:{locked:!!(pc.planLock&&pc.planLock.locked),at:(pc.planLock&&pc.planLock.at)||null,mode:pc.planMode||null,exam:(pp&&pp.examDate)||null},ua:navigator.userAgent.replace(/^Mozilla\/5.0 /,'').slice(0,110)};
  if(ok){h.lastOk=now;h.err=null;h.errAt=null;}else{h.err=key;h.errAt=now;}
  setDoc(doc(fdb,'activity',actUid),{health:h},{merge:true}).catch(()=>{});
}
const BK_SLOTS=14;
async function dailyBackup(){
  if(!actUid||!fdb||!remoteReady||!syncBase) return;
  const day=actDate(new Date()), k='p2c-bk-'+actUid;
  try{ if(localStorage.getItem(k)===day) return; }catch(e){}
  const body=JSON.stringify(syncBase); if(body.length<50||body.length>900000) return;
  const slot='bk-'+(Math.floor(Date.now()/864e5)%BK_SLOTS);
  try{ await setDoc(doc(fdb,'activity',actUid,'days',slot),{bk:body,bkDay:day,at:Date.now(),v:APP_V,size:body.length}); try{localStorage.setItem(k,day);}catch(e){} }catch(e){ console.warn('Daily backup failed',e); }
}
function isAdminUser(){return !!(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID);}
async function listBackups(uid){
  if(!isAdminUser()) return [];
  const snaps=await Promise.all([...Array(BK_SLOTS)].map((_,i)=>getDoc(doc(fdb,'activity',uid,'days','bk-'+i)).catch(()=>null)));
  return snaps.filter(s=>s&&s.exists()&&s.data().bk).map(s=>{const x=s.data();return {id:s.id,day:x.bkDay,at:x.at,v:x.v,size:x.size};}).sort((a,b)=>b.at-a.at);
}
async function readBackup(uid,id){
  if(!isAdminUser()) return null;
  const s=await getDoc(doc(fdb,'activity',uid,'days',id)); if(!s.exists()) return null;
  try{ return JSON.parse(s.data().bk); }catch(e){ return null; }
}
async function restoreBackup(uid,id){
  if(!isAdminUser()) return {ok:false,err:'not-admin'};
  try{
    const data=await readBackup(uid,id); if(!data) return {ok:false,err:'Backup not found or unreadable.'};
    const cur=await getDoc(doc(fdb,'progress',uid));
    data.t=Date.now(); await setDoc(doc(fdb,'progress',uid),data);
    return {ok:true,previous:cur.exists()?cur.data():null};
  }catch(e){ return {ok:false,err:String(e&&e.code||e&&e.message||e)}; }
}
/* Admin "Run sync check": proves the admin can write and read back, then checks each learner. */
async function selfTest(){
  const out=[]; const add=(st,t)=>out.push({st,t});
  if(!isAdminUser()){add('bad','Not signed in as the admin.');return out;}
  try{ const n=Date.now(); await setDoc(doc(fdb,'progress',ADMIN_UID),{selftest:{at:n}},{merge:true}); const s=await getDoc(doc(fdb,'progress',ADMIN_UID)); const v=s.exists()&&s.data().selftest&&s.data().selftest.at;
    add(v===n?'ok':'bad',v===n?'Server write and read-back work (admin account).':'Wrote a test value but read back something else.'); }
  catch(e){ add('bad','Admin test write failed: '+String(e&&e.code||e)); }
  for(const uid of ALLOWED_USER_UIDS.filter(u=>u!==ADMIN_UID)){
    let p=null,a=null;
    try{ const s=await getDoc(doc(fdb,'progress',uid)); p=s.exists()?s.data():null; add(p?'ok':'warn',p?'Learner progress readable.':'Learner has no progress saved yet.'); }catch(e){ add('bad','Cannot read learner progress: '+String(e&&e.code||e)); }
    try{ const s=await getDoc(doc(fdb,'activity',uid)); a=s.exists()?s.data():null; }catch(e){ add('bad','Cannot read learner activity: '+String(e&&e.code||e)); }
    const h=a&&a.health;
    if(!h) add('warn','No sync report from the learner yet (it appears after they open v'+APP_V+' or later).');
    else{
      add(String(h.v)===APP_V?'ok':'warn',String(h.v)===APP_V?'Learner is on the current version (v'+h.v+').':'Learner is on v'+h.v+', current is v'+APP_V+'. They need to close all tabs and reopen.');
      if(h.err) add('bad','Learner saves are failing: '+h.err+' since '+new Date(h.errAt).toLocaleString()+'.');
      else add('ok','Last successful save '+agoText(h.lastOk)+' on '+(h.device||'a device')+'.');
    }
    if(p&&p.cisa){ const pl=p.cisa.planLock||{}; let lockEv=0; try{ const from=new Date(Date.now()-150*864e5).toISOString().slice(0,10); const r=await readActivity(uid,from); for(const x of (r.rows||[])) if(x.k==='e'&&/locked the (Normal|Relaxed) study plan/i.test(x.x||'')) lockEv=Math.max(lockEv,x.u||0); }catch(e){}
      const un=Date.parse(pl.unlockedAt||'')||0;
      if(pl.locked===true) add('ok','CISA plan locked ('+(p.cisa.planMode||'')+').');
      else if(lockEv&&lockEv>un) add('bad','CISA plan shows NOT locked, but the learner locked it on '+new Date(lockEv).toLocaleString()+' and no admin unlock is recorded after that. Use “Lock plan” on the overview.');
      else add('ok','CISA plan not locked'+(un?' (unlocked by admin on '+new Date(un).toLocaleDateString()+')':'')+'.'); }
    try{ const b=await listBackups(uid); add(b.length?'ok':'warn',b.length?b.length+' daily backup'+(b.length===1?'':'s')+', latest '+b[0].day+'.':'No daily backups yet (the first is made a few seconds after the learner opens the app).'); }catch(e){ add('warn','Could not list backups.'); }
  }
  return out;
}
function agoText(t){ if(!t) return 'never'; const m=Math.round((Date.now()-t)/60e3); return m<1?'just now':m<60?m+' min ago':m<2880?Math.round(m/60)+' h ago':Math.round(m/1440)+' days ago'; }
/* Learner/admin: click the sync chip to compare this device with the server. */
function countsOf(x){
  x=x||{}; const c=x.cisa||{};
  return {
    'Lessons done':Object.values(x.ls||{}).filter(Boolean).length,
    'CISA topics complete':Object.values(c.complete||{}).filter(Boolean).length,
    'Manual sections read':Object.keys(c.manRead||{}).length,
    'CISA plan':c.planLock&&c.planLock.locked?'locked ('+(c.planMode||'')+(c.plans&&c.plans[c.planMode]&&c.plans[c.planMode].examDate?', exam '+c.plans[c.planMode].examDate:'')+')':'not locked',
    'Notes':Object.keys(x.notes||{}).length
  };
}
async function syncCheck(){
  if(!dbRef){ uiAlert('Sign in to sync your progress.',{title:'Not signed in'}); return; }
  setSync('Checking…',false);
  try{
    if(!remoteReady) await initRemote();
    if(syncPending||dbTimer) await flush();
    const s=await getDoc(dbRef), remote=s.exists()?s.data():{};
    const a=countsOf(S), b=countsOf(remote), lines=[]; let same=true;
    for(const k of Object.keys(a)){ const eq=String(a[k])===String(b[k]); if(!eq) same=false; lines.push((eq?'✓ ':'✗ ')+k+': '+a[k]+(eq?'':'  (server: '+b[k]+')')); }
    const err=window.__lastSyncError;
    setSync(same?'Synced':'Not synced yet',same);
    uiAlert((same?'Everything on this device is saved on the server.':'This device and the server differ. Your progress is kept on this device and the app keeps retrying.'+(err?'\nLast error: '+err.code:''))+'\n\n'+lines.join('\n')+'\n\nApp version v'+APP_V,{title:same?'All synced':'Not fully synced'});
  }catch(e){
    setSync('Not synced yet ('+String(e&&e.code||'error').replace(/^firestore\//,'')+')',false);
    uiAlert('Could not reach the server: '+String(e&&e.code||e&&e.message||e)+'\n\nYour progress is kept on this device. Check the connection and try again.',{title:'Server not reachable'});
  }
}
document.getElementById('sync').addEventListener('click',syncCheck);
document.getElementById('sync').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();syncCheck();}});
let verTimer=null, verShown=false;
async function verCheck(){
  clearTimeout(verTimer); verTimer=setTimeout(verCheck,10*60e3);
  if(verShown||document.visibilityState==='hidden') return;
  try{
    const r=await fetch('./version.json?t='+Date.now(),{cache:'no-store'}); if(!r.ok) return;
    const j=await r.json(); if(!(Number(j.v)>Number(APP_V))) return;
    verShown=true; const bar=document.createElement('div'); bar.className='upd-bar'; bar.setAttribute('role','status');
    bar.innerHTML='<span><b>Update ready.</b> A new version of JS Learning (v'+String(j.v).replace(/\D/g,'')+') is available.</span><button type="button">Reload</button>';
    bar.querySelector('button').onclick=async()=>{ bar.querySelector('button').textContent='Updating…'; try{ if(dbRef&&(syncPending||dbTimer)) await flush(); }catch(e){} try{ const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration(); if(reg) await reg.update(); }catch(e){} location.reload(); };
    document.body.appendChild(bar);
  }catch(e){}
}
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible') verCheck(); });
/* V39: admin "Reset study data". The admin overwrites progress/{uid} with {resetId}. The first learner device that
   sees a new resetId wipes its local copy AND finishes the server cleanup that only the learner may do (AI course
   and workbook entries, activity log, daily backups), then marks progress.resetDone. Any other device only wipes its
   local copy, so study done after the reset on another device is never lost. Chat and coaching are kept. */
async function applyResetIfNeeded(remote){
  const R=remote&&remote.resetId, u=auth&&auth.currentUser; if(!R||!u||u.uid===ADMIN_UID) return false;
  const uid=u.uid, appliedKey='p2c-reset-'+uid; let applied=null; try{applied=localStorage.getItem(appliedKey);}catch(e){}
  const full=remote.resetDone!==R; if(applied===R&&!full) return false;
  try{[KEY,baseKey(),'p2c-v3-'+uid,'p2c-bk-'+uid,'p2c-bookmarks','p2c-last-active'].forEach(k=>localStorage.removeItem(k));}catch(e){}
  grcState={}; bookEntries=[]; clearTimeout(dbTimer); syncPending=false;
  S=Object.assign(blank(),jclone(remote)); syncBase=jclone(remote); storeLocal(); saveBase();
  if(full){
    for(const area of ['grcProgress','studyEntries']){ try{const q=await getDocs(collection(fdb,'users',uid,area)); await Promise.all(q.docs.map(d=>deleteDoc(d.ref).catch(()=>{})));}catch(e){} }
    try{const q=await getDocs(collection(fdb,'activity',uid,'days')); await Promise.all(q.docs.map(d=>{const x=d.data()||{}; return setDoc(d.ref,d.id.startsWith('bk-')?{bk:'',bkDay:null,cleared:Date.now()}:{d:x.d||d.id,r:{}}).catch(()=>{});}));}catch(e){}
    try{const a=await getDoc(doc(fdb,'activity',uid)); const ad=a.exists()?a.data():{}, em=ad.email||actEmail||u.email||''; const keep=ad.autoBlock?{autoBlock:ad.autoBlock}:{}; await setDoc(doc(fdb,'activity',uid),{email:em,lastSeen:Date.now(),resetAt:Date.now(),...keep});}catch(e){}
    try{await updateDoc(dbRef,{resetDone:R}); S.resetDone=R; syncBase.resetDone=R; storeLocal(); saveBase();}catch(e){console.warn('reset mark failed',e);}
  }
  try{localStorage.setItem(appliedKey,R); sessionStorage.setItem('p2c-reset-note','1');}catch(e){}
  return true;
}
function showResetNote(){ try{ if(sessionStorage.getItem('p2c-reset-note')){ sessionStorage.removeItem('p2c-reset-note'); setTimeout(()=>uiAlert('Your study data was reset by the admin, so you are starting fresh. Your messages are still here.',{title:'Study data reset'}),800); } }catch(e){} }
async function resetLearner(uid){
  if(!isAdminUser()) return {ok:false,err:'not-admin'};
  const id='r'+Date.now();
  try{ const s=await getDoc(doc(fdb,'progress',uid)); if(!s.exists()) return {ok:true,id,empty:true};
    await setDoc(doc(fdb,'progress',uid),{t:Date.now(),resetId:id,resetAt:new Date().toISOString(),resetBy:'admin'}); return {ok:true,id}; }
  catch(e){ return {ok:false,err:String(e&&e.code||e&&e.message||e)}; }
}

async function initRemote(){
  if(!dbRef) return;
  try{
    const snap=await getDoc(dbRef), remote=snap.exists()?snap.data():null;
    if(remote&&remote.resetId) await applyResetIfNeeded(remote);
    showResetNote();
    if(remote){
      const merged=lockRecover(Object.assign(blank(),merge3(syncBase||{},S,remote)),S,remote);
      const changed=!jeq(merged,S); S=merged; storeLocal(); syncBase=jclone(remote); saveBase(); remoteReady=true;
      if(!jeq(S,remote)) await flush(); else syncPending=false;
      if(changed) softRefresh();
    } else { remoteReady=true; syncBase={}; if(S.t>0) await flush(); }
    if(!syncPending){ setSync('Synced',true); reportHealth(true); }
    if(unsubProg) unsubProg();
    unsubProg=onSnapshot(dbRef,sn=>{
      if(sn.metadata.hasPendingWrites||!sn.exists()) return;
      const remote=sn.data();
      if(remote.resetId){ let ap=null; try{ap=localStorage.getItem('p2c-reset-'+(auth.currentUser&&auth.currentUser.uid));}catch(e){}
        if(ap!==remote.resetId||remote.resetDone!==remote.resetId){ if(!window.__resetBusy){ window.__resetBusy=1; applyResetIfNeeded(remote).then(did=>{ if(did) location.reload(); else window.__resetBusy=0; }); } return; } }
      if(jeq(remote,syncBase)) return;
      const before=jclone(S); S=lockRecover(Object.assign(blank(),merge3(syncBase||{},S,remote)),S,remote); syncBase=jclone(remote); saveBase(); storeLocal();
      if(!jeq(S,remote)){syncPending=true; clearTimeout(dbTimer); dbTimer=setTimeout(flush,800);}
      if(!jeq(before,S)) softRefresh();
    },e=>console.warn('Progress listener',e));
  }catch(e){console.warn('Progress load failed',e); setSync('Offline: saved on this device',false); reportHealth(false,'load: '+String(e&&e.code||e&&e.message||e).replace(/^firestore\//,'').slice(0,70));}
}
window.addEventListener('online',()=>{if(!dbRef) return; if(!remoteReady) initRemote(); else if(syncPending) flush();});
window.addEventListener('pagehide',()=>{if(dbTimer) flush();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&dbTimer) flush(); if(document.visibilityState==='visible'&&dbRef&&!remoteReady) initRemote();});
async function startSession(user){
  KEY='p2c-'+user.uid;
  dbRef=doc(fdb,'progress',user.uid); remoteReady=false; syncPending=false; if(unsubProg){unsubProg();unsubProg=null;}
  IS_ADMIN=user.uid===ADMIN_UID; document.documentElement.classList.toggle('admin-mode',IS_ADMIN); navForRole();
  if(IS_ADMIN&&location.hash!=='#admin') history.replaceState(null,'','#admin');
  actStart(user); coachStart(user);
  S=loadLocal()||blank(); syncBase=loadBase();
  USER_NAME=LEARNER_NAMES[user.uid]||''; { const w=document.getElementById('who'); w.textContent=USER_NAME||user.email||''; w.title=user.email||''; } setAvatar(USER_NAME||user.email);
  setSync('Loading…',false);
  route();
  if(!IS_ADMIN) setTimeout(()=>{ (window.requestIdleCallback||setTimeout)(()=>{ loadCore().catch(()=>{}).then(()=>loadAIC().catch(()=>{})).then(()=>loadSec().catch(()=>{})); },{timeout:8000}); },6000);
  await initRemote();
  await loadV3(user.uid);
  setTimeout(dailyBackup,15000); verCheck();
}
window.addEventListener('hashchange',()=>{if(dbRef){route(); afterRoute();}});

/* ---------------- activity log ----------------
   For learner accounts only. Measures active time per area (the page must be visible and the
   learner must have used the mouse, keyboard or touch in the last 3 minutes; 9 minutes during a
   mock exam or focus timer), plus key actions. Saved as one small document per day:
   activity/{uid}/days/{YYYY-MM-DD}. The admin portal reads it. */
const ACT_TICK=15, ACT_IDLE=180e3, ACT_IDLE_BUSY=540e3, ACT_GAP=10*60e3, ACT_SAVE=60e3;
let actUid=null, actEmail='', actCur=null, actPending={}, actLastInput=Date.now(), actSaveT=0, actTimer=null;
['pointerdown','keydown','wheel','scroll','touchstart','mousemove'].forEach(ev=>window.addEventListener(ev,()=>{actLastInput=Date.now();},{passive:true,capture:true}));
const actP2=n=>String(n).padStart(2,'0');
const actDate=d=>`${d.getFullYear()}-${actP2(d.getMonth()+1)}-${actP2(d.getDate())}`;
const actHM=d=>`${actP2(d.getHours())}:${actP2(d.getMinutes())}`;
const actId=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function actDev(){const coarse=matchMedia('(pointer:coarse)').matches;return !coarse?'Computer':Math.min(screen.width,screen.height)<700?'Phone':'Tablet';}
const ACT_VIEWS={dashboard:'Dashboard',courses:'Technical academy',grc:'AI Compliance academy',appsec:'Application academy',workbook:'My workbook',log:'Study log',insights:'Study insights',explore:'Explore & glossary',flash:'Flashcards',rosetta:'Cloud Rosetta',subnets:'Subnet calculator',certs:'Cert paths',cisa:'CISA'};
function actWhere(){
  const h=(location.hash||'').replace('#','')||'dashboard';
  if(h==='cisa'&&window.__cisaWhere){try{return window.__cisaWhere();}catch(e){}}
  const mod=/^([mga])\d\d$/.exec(h)||/^(a)[ib]\d\d$/.exec(h)&&[h,'g'];
  const area=ACT_VIEWS[h]||(/^aic-/.test(h)?'AI Compliance academy':mod?{m:'Technical academy',g:'AI Compliance academy',a:'Application academy'}[mod[1]]:'Other');
  let detail='';
  if(/^aic-/.test(h)){const t=app.querySelector('h1')||app.querySelector('.aw-title');detail=((t&&(t.value||t.textContent)||h).trim()).slice(0,110);}
  else if(mod){const t=app.querySelector('h1')||app.querySelector('.mhero h2');detail=(h.toUpperCase()+(t?' · '+t.textContent.trim():'')).slice(0,110);}
  else if(h==='flash'){const on=app.querySelector('[aria-pressed="true"], .is-on, .active');detail=on?('Deck: '+on.textContent.trim()).slice(0,60):'';}
  return {area,detail,busy:false};
}
function actQueue(r){actPending[r.id]=r;}
/* V38: automatic block after 10 or more days without signing in. Checked once at sign-in, before this session
   updates lastSeen; the block is recorded in activity/{uid}.autoBlock and lifted when the admin unblocks. */
const AUTO_BLOCK_DAYS=10; let actInactP=null;
async function inactivityCheck(uid){
  try{
    const s=await getDoc(doc(fdb,'activity',uid)); if(!s.exists()) return;
    const d=s.data(), last=d.lastSeen||0, ab=d.autoBlock;
    if(!last||Date.now()-last<AUTO_BLOCK_DAYS*864e5) return;
    if(ab&&ab.lastSeen===last) return; // already recorded for this gap
    await setDoc(doc(fdb,'activity',uid),{autoBlock:{at:Date.now(),lastSeen:last,days:Math.floor((Date.now()-last)/864e5)}},{merge:true});
  }catch(e){ console.warn('inactivity check failed',e); }
}
async function actFlush(){
  if(actInactP){ try{await actInactP;}catch(e){} }
  if(!actUid||!fdb) return; const uid=actUid, rows=Object.values(actPending); actPending={}; actSaveT=Date.now();
  const byDay={}; for(const r of rows){(byDay[r.d]=byDay[r.d]||{})[r.id]=Object.assign({},r);}
  try{
    for(const [d,r] of Object.entries(byDay)) await setDoc(doc(fdb,'activity',uid,'days',d),{d,r},{merge:true});
    await setDoc(doc(fdb,'activity',uid),{email:actEmail,lastSeen:Date.now(),lastArea:actCur?actCur.a:'',device:actDev()},{merge:true});
  }catch(e){ for(const r of rows) if(!actPending[r.id]) actPending[r.id]=r; }
}
function actTick(){
  if(!actUid||document.visibilityState!=='visible'||!gate.hidden) return;
  const w=actWhere(); if(Date.now()-actLastInput>(w.busy?ACT_IDLE_BUSY:ACT_IDLE)){
    // went idle: take back the minutes counted after the last mouse, keyboard or touch input
    if(actCur&&!actCur.trim){const over=Math.floor((actCur.u-actLastInput)/1000)-ACT_TICK; if(over>0){actCur.sec=Math.max(ACT_TICK,actCur.sec-over);actCur.e=actHM(new Date(actLastInput+ACT_TICK*1000));} actCur.trim=1; if(actCur.sec>=30) actQueue(actCur); actFlush();}
    return; }
  const now=new Date(), d=actDate(now), x=w.detail||'';
  if(actCur&&!actCur.trim&&actCur.d===d&&actCur.a===w.area&&actCur.x===x&&Date.now()-actCur.u<ACT_GAP){actCur.sec+=ACT_TICK;actCur.e=actHM(now);actCur.u=Date.now();}
  else actCur={id:actId('t'),k:'t',d,s:actHM(new Date(Date.now()-ACT_TICK*1000)),e:actHM(now),a:w.area,x,sec:ACT_TICK,dev:actDev(),u:Date.now()};
  if(actCur.sec>=30) actQueue(actCur);
  if(Date.now()-actSaveT>=ACT_SAVE) actFlush();
}
function actEvent(what,area){
  if(!actUid) return; const now=new Date();
  actQueue({id:actId('e'),k:'e',d:actDate(now),s:actHM(now),e:actHM(now),a:area||actWhere().area,x:String(what).slice(0,160),sec:0,dev:actDev(),u:Date.now()});
  actFlush();
}
function actStart(user){
  clearInterval(actTimer); actTimer=null; actCur=null; actPending={};
  if(!user||user.uid===ADMIN_UID||!fdb){actUid=null;return;}
  actUid=user.uid; actEmail=user.email||''; actLastInput=Date.now(); actSaveT=Date.now();
  actInactP=inactivityCheck(user.uid);
  actTimer=setInterval(actTick,ACT_TICK*1000);
  actEvent('Signed in on '+actDev().toLowerCase(),'Account');
}
async function actStop(reason){ if(!actUid) return; actEvent(reason||'Signed out','Account'); try{await actFlush();}catch(e){} clearInterval(actTimer); actTimer=null; actUid=null; actCur=null; }
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden') actFlush();});
window.addEventListener('pagehide',()=>actFlush());

/* ---------------- sign-in ---------------- */
const gate=document.getElementById('gate'), msg=document.getElementById('gateMsg'), btn=document.getElementById('loginBtn'), FX=window.gateFX||{ready(){},burst(){},shake(){},leave:()=>Promise.resolve(),reset(){}};
const say=(t,cls)=>{msg.textContent=t; msg.className='gate-msg '+(cls||'');};
const ERR={'auth/invalid-credential':'That email and password don’t match. Try again.','auth/wrong-password':'That email and password don’t match. Try again.','auth/user-not-found':'That email and password don’t match. Try again.','auth/invalid-email':'Enter a valid email address.','auth/missing-password':'Enter your password.','auth/too-many-requests':'Too many attempts. Wait a few minutes and try again.','auth/network-request-failed':'No connection. Check your internet and try again.','auth/user-disabled':'This account has been turned off.','auth/api-key-not-valid.-please-pass-a-valid-api-key.':'The Firebase settings in index.html are not valid. Copy your real config from Firebase → Project settings → Your apps.','auth/invalid-api-key':'The Firebase settings in index.html are not valid. Copy your real config from Firebase → Project settings → Your apps.','auth/configuration-not-found':'Email/Password sign-in is not turned on in Firebase (SETUP.md, step 2).','auth/operation-not-allowed':'Email/Password sign-in is not turned on in Firebase (SETUP.md, step 2).','auth/unauthorized-domain':'This website address isn’t allowed yet. Add it under Firebase → Authentication → Settings → Authorized domains.'};
let justSubmitted=false;
function showGate(on){gate.hidden=!on; document.querySelector('.top').hidden=on; app.hidden=on; if(on){ FX.reset(); const pw=document.getElementById('password'); if(pw) pw.value=''; }}
showGate(true);
if(!configured){
  FX.ready();
}else{
  onAuthStateChanged(auth,async user=>{
    FX.ready();
    if(user){ if(!ALLOWED_USER_UIDS.includes(user.uid)){await signOut(auth);say('This account is not approved for this private workbook.','bad');return;} if(justSubmitted){justSubmitted=false; try{sessionStorage.setItem('p2c-signed-in','1')}catch(e){} await FX.leave();} else { let tabOk=false; try{tabOk=sessionStorage.getItem('p2c-signed-in')==='1'}catch(e){} if(!tabOk){ await signOut(auth); say('Please sign in with your email and password.',''); return; } let last=0; try{last=+localStorage.getItem('p2c-last-active')||0}catch(e){} if(last&&Date.now()-last>=10*60*1000){ await signOut(auth); say('Your session timed out after 10 minutes of inactivity. Please sign in again.',''); return; } } showGate(false); window.scrollTo(0,0); startSession(user); setTimeout(()=>idleReset(),0);}
    else{ try{sessionStorage.removeItem('p2c-signed-in')}catch(e){} adminStop(); dbRef=null; v3uid=null; IS_ADMIN=false; document.documentElement.classList.remove('admin-mode'); navForRole(); actUid=null; clearInterval(actTimer); coachStop(); S=blank(); app.innerHTML=''; showGate(true); document.getElementById('password').value=''; clearTimeout(idleT); }
  });
}
document.getElementById('loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); if(!auth){FX.shake(); say('Sign-in isn’t available right now.','bad'); return;}
  const em=document.getElementById('email').value.trim(), pw=document.getElementById('password').value;
  if(!em||!pw){say('Enter your email and password.','bad'); FX.shake(); return;}
  btn.disabled=true; btn.querySelector('span').textContent='Summoning…'; say(''); FX.burst(btn);
  justSubmitted=true;
  try{await signInWithEmailAndPassword(auth,em,pw);}
  catch(err){justSubmitted=false; FX.shake(); say(ERR[err.code]||'Sign-in failed ('+(err.code||'unknown error')+').','bad');}
  finally{btn.disabled=false; btn.querySelector('span').textContent='Sign in';}
});
/* Sign-out: stop live features, try to save for at most 3 seconds, then always sign out. */
const withTimeout=(pr,ms)=>Promise.race([Promise.resolve(pr).catch(()=>{}),new Promise(r=>setTimeout(r,ms))]);
let signingOut=false;
async function doSignOut(reason,note){
  if(signingOut) return; signingOut=true;
  const b=document.getElementById('signout'); if(b){ b.disabled=true; const t=b.querySelector('span'); if(t) t.textContent='Signing out…'; }
  try{
    coachStop(); adminStop();
    await withTimeout(actStop(reason||'Signed out'),2000);
    await withTimeout(flush(),3000);
  }finally{
    IS_ADMIN=false; document.documentElement.classList.remove('admin-mode'); navForRole(); setMenu(false);
    try{ await signOut(auth); }catch(e){ console.warn('signOut failed',e); }
    if(b){ b.disabled=false; const t=b.querySelector('span'); if(t) t.textContent='Sign out'; }
    signingOut=false;
    if(location.hash!=='#dashboard') history.replaceState(null,'','#dashboard');
    if(note) say(note,'');
  }
}
document.getElementById('signout').onclick=()=>doSignOut('Signed out');
/* ---------------- inactivity timeout: sign out after 10 minutes without activity ---------------- */
const IDLE_MS=10*60*1000; let idleT=null, idleAt=Date.now();
function idleReset(){ idleAt=Date.now(); try{localStorage.setItem('p2c-last-active',String(idleAt))}catch(e){} clearTimeout(idleT); if(dbRef) idleT=setTimeout(idleExpire,IDLE_MS); }
async function idleExpire(){ if(!dbRef) return; let last=idleAt; try{last=Math.max(last,+localStorage.getItem('p2c-last-active')||0)}catch(e){}
  if(Date.now()-last<IDLE_MS){ clearTimeout(idleT); idleT=setTimeout(idleExpire,IDLE_MS-(Date.now()-last)); return; }
  await doSignOut('Signed out automatically after 10 minutes without activity','You were signed out after 10 minutes of inactivity. Sign in again to continue.');}
let idleThrottle=0;
['pointerdown','keydown','wheel','touchstart','mousemove','scroll'].forEach(ev=>window.addEventListener(ev,()=>{const n=Date.now(); if(n-idleThrottle>5000){idleThrottle=n; idleReset();}},{passive:true}));
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'&&dbRef){ let last=idleAt; try{last=Math.max(last,+localStorage.getItem('p2c-last-active')||0)}catch(e){} if(Date.now()-last>=IDLE_MS) idleExpire(); else idleReset(); }});

/* v75: on phones, wide tables (Workbook, Insights) show as one card per row. Each cell gets its column name
   as a label (data-l), so the CSS can stack the row without losing meaning. */
(function labelTables(){
  const run=()=>{ document.querySelectorAll('#app .tscroll table:not([data-labeled]), #app .lcard table:not([data-labeled]), #app .ib-scroll table:not([data-labeled])').forEach(t=>{ const heads=[...t.querySelectorAll('thead th')].map(th=>th.textContent.trim()); if(heads.length<2&&!t.closest('.tscroll')) return; if(!heads.length) return; t.setAttribute('data-labeled','1'); t.setAttribute('data-cols',String(heads.length)); t.querySelectorAll('tbody tr').forEach(tr=>[...tr.children].forEach((td,i)=>{ if(i>0||td.tagName==='TD'){ if(heads[i]&&td.colSpan<2&&!td.hasAttribute('data-l')) td.setAttribute('data-l',heads[i]); } })); }); };
  try{ new MutationObserver(()=>{ clearTimeout(labelTables.t); labelTables.t=setTimeout(run,60); }).observe(document.getElementById('app'),{childList:true,subtree:true}); }catch(e){}
  run();
})();

/* v76: lesson navigation bar and "continue where you left off" (Technical, AI Compliance, Application modules).
   Works on the rendered page: every lesson card (article.lesson in .timeline) gets Previous / Next buttons under it,
   the lesson in view is remembered per module (this device), and reopening the module jumps back to it. */
const LN_KEY='p2c-lastlesson'; let lnOpened=null, lnIO=null, lnSaveT=null;
function lnGet(){ try{ return JSON.parse(localStorage.getItem(LN_KEY)||'{}')||{}; }catch(e){ return {}; } }
function lnSet(mod,id){ try{ const o=lnGet(); o[mod]={id,at:Date.now()}; localStorage.setItem(LN_KEY,JSON.stringify(o)); }catch(e){} }
function lnScrollTo(el){ if(!el) return; const top=document.querySelector('header.top'); let off=(top&&getComputedStyle(top).position!=='static'?top.getBoundingClientRect().height:0)+12;
  /* sticky lesson outline bar (phones) also covers the top of the page */
  document.querySelectorAll('#app .outline-panel, #app .mside, #app .outline').forEach(x=>{ const cs=getComputedStyle(x); if(cs.position==='sticky'&&x.offsetHeight<140) off=Math.max(off,(parseFloat(cs.top)||0)+x.offsetHeight+12); }); window.scrollTo({top:el.getBoundingClientRect().top+scrollY-off,behavior:'smooth'}); }
function lnToast(text,onBack,sub){ document.querySelector('.ln-toast')?.remove(); const t=document.createElement('div'); t.className='ln-toast'; t.setAttribute('role','status');
  t.innerHTML=`<span class="lnt-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg></span><span class="lnt-txt"><b>${text}</b>${sub?`<small>${sub}</small>`:''}</span><button type="button">Start over</button><i class="lnt-bar"></i>`;
  t.querySelector('button').onclick=()=>{ t.remove(); onBack&&onBack(); }; document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add('in')); setTimeout(()=>t.classList.add('out'),5600); setTimeout(()=>t.remove(),6000); }
function enhanceLessons(){
  const h=(location.hash||'').slice(1);
  if(!/^(m\d\d|a[ib]\d\d|a\d\d)$/.test(h)) return;
  const arts=[...document.querySelectorAll('#app .timeline > article.lesson')]; if(!arts.length) return;
  arts.forEach((a,i)=>{
    const card=a.querySelector('.lcard')||a; if(card.querySelector(':scope > .lnav')) return;
    const nav=document.createElement('div'); nav.className='lnav';
    const ttl=el=>{ const t=el&&el.querySelector('h4, h3'); return t?t.textContent.trim():''; };
    const dots=arts.map((x,k)=>`<i class="${k<i?'done':k===i?'cur':''}${x.classList.contains('on')?' learned':''}"></i>`).join('');
    const prev=i>0?`<button type="button" class="lnav-prev" data-lnav="${arts[i-1].id}" aria-label="Previous lesson: ${ttl(arts[i-1]).replace(/"/g,'&quot;')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>`:'<span class="lnav-prev ghost" aria-hidden="true"></span>';
    const nt=i<arts.length-1?ttl(arts[i+1]):'';
    const next=i<arts.length-1
      ?`<button type="button" class="lnav-next" data-lnav="${arts[i+1].id}"><span class="lnav-k">Up next · lesson ${i+2}</span><span class="lnav-t">${nt.replace(/</g,'&lt;')}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>`
      :`<button type="button" class="lnav-next fin" data-lnav="__end"><span class="lnav-k">Last lesson done?</span><span class="lnav-t">Finish: takeaways &amp; checkpoint</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg></button>`;
    nav.innerHTML=`<div class="lnav-dots" aria-label="Lesson ${i+1} of ${arts.length}">${dots}<b>${i+1}/${arts.length}</b></div><div class="lnav-row">${prev}${next}</div>`; card.appendChild(nav);
    nav.querySelectorAll('[data-lnav]').forEach(b=>b.onclick=()=>{ const id=b.dataset.lnav;
      if(id==='__end'){ const tl=a.closest('.timeline'); const sec=tl&&tl.closest('section'); let n=sec&&sec.nextElementSibling; while(n&&!n.offsetHeight) n=n.nextElementSibling; lnScrollTo(n||tl); return; }
      const el=document.getElementById(id); lnScrollTo(el); lnSet(h,id); });
  });
  // remember the lesson being read
  try{ lnIO&&lnIO.disconnect(); lnIO=new IntersectionObserver(es=>{ const vis=es.filter(e=>e.isIntersecting).sort((x,y)=>x.boundingClientRect.top-y.boundingClientRect.top)[0]; if(!vis) return; clearTimeout(lnSaveT); lnSaveT=setTimeout(()=>lnSet(h,vis.target.id),900); },{rootMargin:'-20% 0px -55% 0px'}); arts.forEach(a=>lnIO.observe(a)); }catch(e){}
  // continue where you left off (only when the module is freshly opened, not after a re-render)
  if(lnOpened!==h){ lnOpened=h; const last=lnGet()[h]; const idx=last?arts.findIndex(a=>a.id===last.id):-1;
    if(idx>0){ const el=arts[idx]; setTimeout(()=>{ if(lnOpened!==h) return; lnScrollTo(el); const tt=(el.querySelector('h4, h3')||{}).textContent||''; lnToast('Welcome back 👋',()=>window.scrollTo({top:0,behavior:'smooth'}),`Picking up at lesson ${idx+1} of ${arts.length}${tt?' · '+tt.trim().replace(/</g,'&lt;'):''}`); },350); } }
}
window.addEventListener('hashchange',()=>{ lnOpened=null; document.querySelector('.ln-toast')?.remove(); });
try{ let lnT=null; new MutationObserver(()=>{ clearTimeout(lnT); lnT=setTimeout(enhanceLessons,80); }).observe(document.getElementById('app'),{childList:true,subtree:true}); }catch(e){}

/* v76: swipe flashcards on touch screens — swipe right = Got it, swipe left = Again (after the answer shows).
   Before the answer shows, any swipe or tap reveals it. Buttons and keys still work as before. */
(function flashSwipe(){
  let sx=0, sy=0, dx=0, active=false, card=null, moved=false;
  const end=(ok)=>{ if(!card) return; card.style.transition='transform .22s ease, opacity .22s ease'; if(ok===null){ card.style.transform=''; card.classList.remove('sw-l','sw-r'); } else { card.style.transform=`translateX(${ok?120:-120}%) rotate(${ok?14:-14}deg)`; card.style.opacity='0'; setTimeout(()=>{ try{ flGrade(ok); }catch(e){} },200); } card=null; };
  document.addEventListener('pointerdown',e=>{ const c=e.target.closest&&e.target.closest('#flCard'); if(!c||e.pointerType==='mouse') return; card=c; active=true; moved=false; sx=e.clientX; sy=e.clientY; dx=0; card.style.transition='none'; },{passive:true});
  document.addEventListener('pointermove',e=>{ if(!active||!card) return; dx=e.clientX-sx; const dy=e.clientY-sy; if(!moved&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){ active=false; card.style.transform=''; card=null; return; } if(Math.abs(dx)>8) moved=true; if(!moved) return; if(!flShown) return; card.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`; card.classList.toggle('sw-r',dx>40); card.classList.toggle('sw-l',dx<-40); },{passive:true});
  document.addEventListener('pointerup',()=>{ if(!active||!card){ active=false; return; } active=false; if(!moved) { card.style.transform=''; card=null; return; } if(!flShown){ card.style.transform=''; card=null; flShown=true; drawFlash(); return; } if(Math.abs(dx)>80) end(dx>0); else end(null); },{passive:true});
  document.addEventListener('pointercancel',()=>{ active=false; end(null); },{passive:true});
})();

/* v76: night reading mode — a dark theme for reading at night. Saved on this device. */
(function nightMode(){
  const KEY='p2c-night', root=document.documentElement;
  const get=()=>{ try{ return localStorage.getItem(KEY)==='1'; }catch(e){ return false; } };
  const meta=()=>{ let m=document.querySelector('meta[name="theme-color"]'); if(!m){ m=document.createElement('meta'); m.name='theme-color'; document.head.appendChild(m); } m.content=root.hasAttribute('data-night')?'#111418':'#F7F8FB'; };
  const apply=on=>{ if(on) root.setAttribute('data-night','1'); else root.removeAttribute('data-night'); meta(); const b=document.getElementById('nightBtn'); if(b){ b.setAttribute('aria-pressed',String(on)); b.querySelector('span').textContent=on?'Day mode':'Night mode'; } };
  apply(get());
  const add=()=>{ const box=document.querySelector('.side-actions'); if(!box||document.getElementById('nightBtn')) return;
    const b=document.createElement('button'); b.type='button'; b.id='nightBtn'; b.className='side-btn';
    b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg><span>Night mode</span>';
    b.onclick=()=>{ const on=!root.hasAttribute('data-night'); try{ localStorage.setItem(KEY,on?'1':'0'); }catch(e){} apply(on); };
    box.insertBefore(b,box.firstChild); apply(get()); };
  add(); setTimeout(add,1500);
})();
