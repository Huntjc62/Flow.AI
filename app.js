
const STORE="flowai_v4_data";
const BRAND="flowai_v4_brand";
const ACCOUNT="flowai_account";
const defaultData={
 leads:[
  {id:"L1",name:"Sarah Mitchell",company:"Mitchell & Co",service:"Website redesign",value:2400,status:"New",source:"Website",date:"2026-09-14"},
  {id:"L2",name:"Daniel Brooks",company:"Brooks Plumbing",service:"Commercial maintenance",value:1850,status:"Contacted",source:"Referral",date:"2026-09-13"},
  {id:"L3",name:"Amy Carter",company:"Carter Property",service:"Property services",value:4200,status:"Quote sent",source:"Facebook",date:"2026-09-12"},
  {id:"L4",name:"James Wilson",company:"Wilson Electrical",service:"Rewire",value:3200,status:"New",source:"Google",date:"2026-09-11"},
  {id:"L5",name:"Lucy Hall",company:"Hall Homes",service:"Maintenance",value:950,status:"Contacted",source:"Website",date:"2026-09-10"}
 ],
 jobs:[
  {id:"J1",name:"Mitchell & Co",service:"Website project",value:2400,status:"In progress",due:"2026-09-18",health:86},
  {id:"J2",name:"Brooks Plumbing",service:"Maintenance",value:1850,status:"Scheduled",due:"2026-09-20",health:94},
  {id:"J3",name:"Carter Property",service:"Property services",value:4200,status:"Waiting",due:"2026-09-16",health:58},
  {id:"J4",name:"Hall Homes",service:"Maintenance",value:950,status:"Complete",due:"2026-09-13",health:100}
 ],
 customers:[
  {id:"C1",name:"Mitchell & Co",contact:"Sarah Mitchell",email:"sarah@example.com",value:5400,last:"2026-09-12",status:"Active"},
  {id:"C2",name:"Brooks Plumbing",contact:"Daniel Brooks",email:"daniel@example.com",value:9200,last:"2026-09-11",status:"Active"},
  {id:"C3",name:"Carter Property",contact:"Amy Carter",email:"amy@example.com",value:12700,last:"2026-09-08",status:"At risk"},
  {id:"C4",name:"Hall Homes",contact:"Lucy Hall",email:"lucy@example.com",value:3100,last:"2026-09-13",status:"Active"}
 ],
 settings:{goal:"Save admin time",watch:["New enquiries","Unanswered leads","Overdue jobs","Quotes awaiting decisions"]}
};
let data=load(STORE,defaultData), brand=load(BRAND,{name:"FlowAI",colour:"#6d5dfc",type:"Service business",currency:"GBP (£)"}), page="overview";

function load(k,f){try{return JSON.parse(localStorage.getItem(k))||structuredClone(f)}catch{return structuredClone(f)}}
function save(){localStorage.setItem(STORE,JSON.stringify(data));localStorage.setItem(BRAND,JSON.stringify(brand))}
function money(n){const sym=brand.currency.startsWith("USD")?"$":brand.currency.startsWith("EUR")?"€":"£";return sym+Number(n||0).toLocaleString("en-GB")}
function initials(n){return (n||"U").split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(msg){const e=document.createElement("div");e.className="toast good";e.textContent=msg;document.querySelector("#toasts").appendChild(e);setTimeout(()=>e.remove(),2800)}
function openModal(body){document.querySelector("#modal").innerHTML=body;document.querySelector("#modalBg").classList.add("open")}
function closeModal(){document.querySelector("#modalBg").classList.remove("open")}
function account(){return load(ACCOUNT,{ownerName:"Owner",businessName:"My workspace",email:""})}
function applyBrand(){document.documentElement.style.setProperty("--brand",brand.colour);document.documentElement.style.setProperty("--brand2",brand.colour);$("#brandName").textContent=brand.name;$("#brandMark").textContent=initials(brand.name).slice(0,1);$("#workspaceName").textContent=account().businessName||brand.name;$("#userName").textContent=account().ownerName||"Owner";$("#userAvatar").textContent=initials(account().ownerName||"Owner");$("#watchText").textContent=data.settings.watch.length?data.settings.watch.slice(0,2).join(" + "):"your business for opportunities"}
function $(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}
function nav(){qsa(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page))}
function render(){applyBrand();nav();$("#navLeadCount").textContent=data.leads.filter(x=>x.status==="New").length;$("#navJobCount").textContent=data.jobs.filter(x=>x.status!=="Complete").length;$("#content").innerHTML=pages[page]();bindPage()}

const pages={
 overview:()=>{const revenue=data.jobs.reduce((a,x)=>a+x.value,0), pipeline=data.leads.reduce((a,x)=>a+x.value,0), newLeads=data.leads.filter(x=>x.status==="New").length, atRisk=data.jobs.filter(x=>x.health<70).length;
 return `<div class="page-head"><div><span class="eyebrow">Good morning</span><h1>Here’s what matters today.</h1><p>FlowAI has turned your business data into a focused work queue.</p></div><div class="actions"><button class="btn secondary" data-pagego="ai">✦ Ask AI</button><button class="btn primary" data-add="lead">＋ Add lead</button></div></div>
 <div class="grid stats">
  ${stat("Pipeline",money(pipeline),"◈","Across "+data.leads.length+" leads")}
  ${stat("Active jobs",data.jobs.filter(x=>x.status!=="Complete").length,"▣",atRisk?`${atRisk} need attention`:"Everything on track")}
  ${stat("New leads",newLeads,"◉",newLeads?"Respond today":"No new leads")}
  ${stat("Customer value",money(data.customers.reduce((a,x)=>a+x.value,0)),"♧","Across "+data.customers.length+" customers")}
 </div>
 <div class="grid two" style="margin-top:16px">
  <div class="card ai-brief"><span class="eyebrow">AI business brief</span><h2>${atRisk?`One job needs your attention.`:`Your operation looks healthy.`}</h2><p>${newLeads?`You have ${newLeads} new ${newLeads===1?"lead":"leads"} worth ${money(data.leads.filter(x=>x.status==="New").reduce((a,x)=>a+x.value,0))}. `:"No new leads are waiting. "} ${atRisk?`${atRisk} job${atRisk>1?"s are":" is"} showing signs of delay. `:"No obvious delivery risks detected. "}FlowAI recommends focusing on the highest-impact actions first.</p><div class="brief-actions"><button class="btn light" data-pagego="ai">Open AI Centre</button><button class="btn dark" data-action="brief">Refresh brief</button></div></div>
  <div class="card section"><div class="section-head"><h3>AI priority queue</h3><button class="link" data-pagego="ai">View all</button></div><div class="queue">${priorityItems()}</div></div>
 </div>
 <div class="grid two" style="margin-top:16px">
  <div class="card section"><div class="section-head"><h3>Sales pipeline</h3><button class="link" data-pagego="leads">Manage leads</button></div>${pipelineBar()}<div class="legend"><span>New<b>${data.leads.filter(x=>x.status==="New").length}</b></span><span>Contacted<b>${data.leads.filter(x=>x.status==="Contacted").length}</b></span><span>Quotes<b>${data.leads.filter(x=>x.status==="Quote sent").length}</b></span><span>Won<b>${data.leads.filter(x=>x.status==="Won").length}</b></span></div></div>
  <div class="card section"><div class="section-head"><h3>Jobs to watch</h3><button class="link" data-pagego="jobs">All jobs</button></div><div class="list">${data.jobs.filter(x=>x.status!=="Complete").slice(0,4).map(recordJob).join("")||empty("No active jobs","Add a job to start tracking delivery.")}</div></div>
 </div>`},
 leads:()=>`<div class="page-head"><div><span class="eyebrow">Sales</span><h1>Leads</h1><p>Every opportunity, with AI telling you what to do next.</p></div><button class="btn primary" data-add="lead">＋ Add lead</button></div>
 <div class="filterbar"><input id="recordFilter" placeholder="Search leads…"><select id="statusFilter"><option value="">All statuses</option><option>New</option><option>Contacted</option><option>Quote sent</option><option>Won</option><option>Lost</option></select></div>
 <div class="card section"><div id="recordList" class="list">${data.leads.map(recordLead).join("")||empty("No leads yet","Add your first lead.")}</div></div>`,
 jobs:()=>`<div class="page-head"><div><span class="eyebrow">Delivery</span><h1>Jobs</h1><p>Know what is moving, what is stuck and what needs you.</p></div><button class="btn primary" data-add="job">＋ Add job</button></div>
 <div class="card section"><table class="table"><thead><tr><th>Job</th><th>Status</th><th>Due</th><th>Value</th><th>Health</th><th></th></tr></thead><tbody>${data.jobs.map(jobRow).join("")||`<tr><td colspan="6">${empty("No jobs yet","Add your first job.")}</td></tr>`}</tbody></table></div>`,
 customers:()=>`<div class="page-head"><div><span class="eyebrow">Relationships</span><h1>Customers</h1><p>See customer value, relationship health and opportunities.</p></div><button class="btn primary" data-add="customer">＋ Add customer</button></div>
 <div class="grid three">${data.customers.map(customerCard).join("")||empty("No customers yet","Add your first customer.")}</div>`,
 calendar:()=>{const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];return `<div class="page-head"><div><span class="eyebrow">Planning</span><h1>Calendar</h1><p>Jobs and follow-ups in one place.</p></div><button class="btn primary" data-add="job">＋ Add job</button></div><div class="calendar">${days.map(d=>`<div class="day-head">${d}</div>`).join("")}${Array.from({length:28},(_,i)=>{const n=i+1;const ev=data.jobs.find(j=>Number(j.due.slice(-2))===n);return `<div class="day"><span class="date">${n}</span>${ev?`<div class="event">${esc(ev.name)}<br>${esc(ev.service)}</div>`:""}</div>`}).join("")}</div>`},
 ai:()=>`<div class="page-head"><div><span class="eyebrow">Intelligence</span><h1>AI Command Centre</h1><p>Ask FlowAI questions about your business or tell it what outcome you want.</p></div></div>
 <div class="grid ai-grid"><div class="card command-box"><span class="eyebrow">Your business, on demand</span><h2>What should we do next?</h2><p>FlowAI analyses your leads, jobs and customers and turns them into practical actions.</p><div class="command-input"><input id="aiInput" placeholder="e.g. Which leads should I call today?"><button class="btn primary" id="runAI">Ask</button></div><div class="suggestions"><button class="suggestion" data-aiq="Which leads need attention today?">Which leads need attention?</button><button class="suggestion" data-aiq="Which jobs are at risk?">Which jobs are at risk?</button><button class="suggestion" data-aiq="Where is my biggest opportunity?">Biggest opportunity?</button><button class="suggestion" data-aiq="Give me my daily brief">Give me my daily brief</button></div></div>
 <div class="card section"><div class="section-head"><h3>AI recommendation</h3><span class="tag green">Live</span></div><div id="aiResult">${aiAnswer("Give me my daily brief")}</div></div></div>
 <div class="grid two" style="margin-top:16px"><div class="card section"><div class="section-head"><h3>Automations</h3><button class="link" data-pagego="settings">Configure</button></div>${["New lead follow-up","Overdue job alert","Quote decision reminder","Customer reactivation"].map((x,i)=>`<div class="toggle"><span>${x}</span><input type="checkbox" ${i<2?"checked":""} data-auto="${x}"></div>`).join("")}</div><div class="card section"><div class="section-head"><h3>AI activity</h3></div><div class="list">${["Scanned today’s pipeline","Flagged at-risk job","Ranked new enquiries","Checked customer inactivity"].map(x=>`<div class="record"><div class="record-avatar">✦</div><div class="record-main"><strong>${x}</strong><small>Completed moments ago</small></div><span class="tag green">Done</span></div>`).join("")}</div></div></div>`,
 reports:()=>{const won=data.leads.filter(x=>x.status==="Won").length,total=data.leads.length;const conversion=total?Math.round(won/total*100):0;return `<div class="page-head"><div><span class="eyebrow">Performance</span><h1>Reports</h1><p>A simple view of how the business is moving.</p></div><button class="btn secondary" id="exportBtn">↓ Export CSV</button></div><div class="grid stats">${stat("Lead conversion",conversion+"%","↗",won+" won")}${stat("Pipeline value",money(data.leads.reduce((a,x)=>a+x.value,0)),"◈","Potential revenue")}${stat("Jobs completed",data.jobs.filter(x=>x.status==="Complete").length,"✓","This workspace")}${stat("At-risk jobs",data.jobs.filter(x=>x.health<70).length,"!","Need attention")}</div><div class="grid two" style="margin-top:16px"><div class="card section"><div class="section-head"><h3>Lead performance</h3></div>${pipelineBar()}<div class="legend"><span>New<b>${data.leads.filter(x=>x.status==="New").length}</b></span><span>Contacted<b>${data.leads.filter(x=>x.status==="Contacted").length}</b></span><span>Quotes<b>${data.leads.filter(x=>x.status==="Quote sent").length}</b></span><span>Won<b>${won}</b></span></div></div><div class="card section"><div class="section-head"><h3>Job health</h3></div>${data.jobs.map(j=>`<div class="record"><div class="record-main"><strong>${esc(j.name)}</strong><small>${esc(j.service)}</small></div><span class="score">${j.health}%</span></div>`).join("")}</div></div>`},
 settings:()=>`<div class="page-head"><div><span class="eyebrow">Workspace</span><h1>Settings</h1><p>Make FlowAI look and behave like your business.</p></div><button class="btn primary" id="saveSettings">Save changes</button></div><div class="grid settings-grid"><div class="card settings-card"><div class="section-head"><h3>Branding</h3></div><div class="field"><label>Business name</label><input id="sBrandName" value="${esc(brand.name)}"></div><div class="field"><label>Primary colour</label><div class="colour-row"><input id="sColour" type="color" value="${brand.colour}"><span>Your interface colour</span></div></div><div class="field"><label>Business type</label><select id="sType">${["Service business","Trades","Home services","Professional services","Agency","Other"].map(x=>`<option ${brand.type===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field"><label>Currency</label><select id="sCurrency">${["GBP (£)","EUR (€)","USD ($)"].map(x=>`<option ${brand.currency===x?"selected":""}>${x}</option>`).join("")}</select></div></div><div class="card settings-card"><div class="section-head"><h3>AI preferences</h3></div><div class="toggle"><span>New enquiry monitoring</span><input type="checkbox" checked></div><div class="toggle"><span>Job risk monitoring</span><input type="checkbox" checked></div><div class="toggle"><span>Customer opportunity alerts</span><input type="checkbox" checked></div><div class="toggle"><span>Daily AI brief</span><input type="checkbox" checked></div><div style="margin-top:18px"><button class="btn danger" id="resetBtn">Reset demo data</button></div></div></div>`,
};

function stat(a,b,c,d){return `<div class="card stat"><div class="stat-top"><span>${a}</span><span class="stat-icon">${c}</span></div><h2>${b}</h2><span class="trend">${d}</span></div>`}
function empty(h,p){return `<div class="empty"><div class="empty-icon">○</div><h3>${h}</h3><p>${p}</p></div>`}
function priorityItems(){const arr=[];data.leads.filter(x=>x.status==="New").slice(0,2).forEach(x=>arr.push(`<div class="queue-item"><i class="priority high"></i><div class="queue-main"><strong>Contact ${esc(x.name)}</strong><small>New ${money(x.value)} opportunity</small></div><button class="queue-arrow" data-edit="lead" data-id="${x.id}">→</button></div>`));data.jobs.filter(x=>x.health<70).forEach(x=>arr.push(`<div class="queue-item"><i class="priority"></i><div class="queue-main"><strong>Check ${esc(x.name)}</strong><small>Job health is ${x.health}%</small></div><button class="queue-arrow" data-edit="job" data-id="${x.id}">→</button></div>`));return arr.slice(0,4).join("")||`<div class="queue-item"><i class="priority low"></i><div class="queue-main"><strong>Nothing urgent</strong><small>FlowAI will keep watching.</small></div></div>`}
function pipelineBar(){const total=Math.max(data.leads.length,1);const vals=["New","Contacted","Quote sent","Won"].map(s=>data.leads.filter(x=>x.status===s).length);return `<div class="pipeline">${vals.map(v=>`<div style="width:${Math.max(v/total*100, v?3:0)}%;background:var(--brand)"></div>`).join("")}</div>`}
function recordLead(x){return `<div class="record searchable"><div class="record-avatar">${initials(x.name)}</div><div class="record-main"><strong>${esc(x.name)}</strong><small>${esc(x.company)} · ${esc(x.service)}</small></div><span class="tag ${x.status==="New"?"amber":x.status==="Won"?"green":x.status==="Lost"?"red":""}">${esc(x.status)}</span><span class="score">${money(x.value)}</span><button class="queue-arrow" data-edit="lead" data-id="${x.id}">⋯</button></div>`}
function recordJob(x){return `<div class="record searchable"><div class="record-avatar">▣</div><div class="record-main"><strong>${esc(x.name)}</strong><small>${esc(x.service)} · due ${esc(x.due)}</small></div><span class="tag ${x.health<70?"red":x.status==="Complete"?"green":""}">${esc(x.status)}</span><span class="score">${x.health}%</span></div>`}
function jobRow(x){return `<tr><td class="name">${esc(x.name)}<br><small style="color:#969aa6">${esc(x.service)}</small></td><td><span class="tag ${x.health<70?"red":x.status==="Complete"?"green":""}">${esc(x.status)}</span></td><td>${esc(x.due)}</td><td>${money(x.value)}</td><td><span class="score">${x.health}%</span></td><td><button class="link" data-edit="job" data-id="${x.id}">Edit</button></td></tr>`}
function customerCard(x){return `<div class="card section"><div class="record" style="border:0;padding:0;background:transparent"><div class="record-avatar">${initials(x.name)}</div><div class="record-main"><strong>${esc(x.name)}</strong><small>${esc(x.contact)}</small></div><span class="tag ${x.status==="Active"?"green":"red"}">${esc(x.status)}</span></div><div style="margin:18px 0 13px;font-size:22px;font-weight:850">${money(x.value)}<div style="font-size:9px;color:#9a9eaa;font-weight:500;margin-top:2px">lifetime value</div></div><div style="font-size:10px;color:#777d8c">Last activity <b>${esc(x.last)}</b></div></div>`}
function aiAnswer(q){q=q.toLowerCase();if(q.includes("lead")){const ls=data.leads.filter(x=>x.status==="New"||x.status==="Quote sent").sort((a,b)=>b.value-a.value);return `<p style="font-size:12px;line-height:1.7;color:#646a79">I’d prioritise <b>${ls.slice(0,3).map(x=>esc(x.name)).join(", ")||"no leads right now"}</b>. ${ls.length?`Together they represent ${money(ls.slice(0,3).reduce((a,x)=>a+x.value,0))} of potential revenue.`:"Your pipeline is currently clear."}</p>`}if(q.includes("job")){const js=data.jobs.filter(x=>x.health<80);return `<p style="font-size:12px;line-height:1.7;color:#646a79">${js.length?`I’d check <b>${js.map(x=>esc(x.name)).join(", ")}</b> first. Their health scores are below 80%, which suggests delivery risk.`:"No jobs are currently below 80% health. Delivery looks stable."}</p>`}if(q.includes("opportunity")){const c=[...data.customers].sort((a,b)=>b.value-a.value)[0];return `<p style="font-size:12px;line-height:1.7;color:#646a79">Your biggest obvious opportunity is <b>${c?esc(c.name):"your customer base"}</b>. ${c?`They already have ${money(c.value)} in lifetime value, making a repeat-service or expansion conversation worth testing.`:"Add customers and I’ll identify expansion opportunities."}</p>`}return `<p style="font-size:12px;line-height:1.7;color:#646a79">Today: <b>${data.leads.filter(x=>x.status==="New").length} new leads</b>, <b>${data.jobs.filter(x=>x.health<70).length} at-risk jobs</b> and <b>${data.customers.filter(x=>x.status==="At risk").length} customers at risk</b>. I’d start with the highest-value new lead, then resolve any job below 70% health.</p>`}

function bindPage(){
 qsa("[data-pagego]").forEach(b=>b.onclick=()=>{page=b.dataset.pagego;render()});
 qsa("[data-add]").forEach(b=>b.onclick=()=>openRecord(b.dataset.add));
 qsa("[data-edit]").forEach(b=>b.onclick=()=>openRecord(b.dataset.edit,b.dataset.id));
 $("#recordFilter")?.addEventListener("input",filterRecords);$("#statusFilter")?.addEventListener("change",filterRecords);
 $("#runAI")?.addEventListener("click",runAI);qsa(".suggestion").forEach(b=>b.onclick=()=>{if($("#aiInput"))$("#aiInput").value=b.dataset.aiq;runAI()});
 $("#saveSettings")?.addEventListener("click",()=>{brand.name=$("#sBrandName").value.trim()||"FlowAI";brand.colour=$("#sColour").value;brand.type=$("#sType").value;brand.currency=$("#sCurrency").value;save();applyBrand();toast("Workspace branding saved");render()});
 $("#resetBtn")?.addEventListener("click",()=>{if(confirm("Reset all demo records?")){data=structuredClone(defaultData);save();toast("Demo data reset");render()}});
 $("#exportBtn")?.addEventListener("click",exportCSV);
 qsa("[data-action=brief]").forEach(b=>b.onclick=()=>toast("AI brief refreshed"));
}
function filterRecords(){const q=($("#recordFilter")?.value||"").toLowerCase(),s=$("#statusFilter")?.value||"";qsa("#recordList .record").forEach((el,i)=>{const x=data.leads[i];el.style.display=(!q||JSON.stringify(x).toLowerCase().includes(q))&&(!s||x.status===s)?"":"none"})}
function runAI(){const q=$("#aiInput")?.value||"Give me my daily brief";if($("#aiResult"))$("#aiResult").innerHTML=aiAnswer(q);toast("FlowAI analysed your workspace")}
function openRecord(type,id){
 const arr=type==="lead"?data.leads:type==="job"?data.jobs:data.customers;const x=arr.find(y=>y.id===id)||{};
 const isLead=type==="lead",isJob=type==="job";
 openModal(`<div class="modal-head"><div><span class="eyebrow">${id?"Edit":"Create"} ${type}</span><h2>${id?"Update":"Add"} ${type}</h2><p>Keep your workspace data structured for AI.</p></div><button class="close" id="closeModal">×</button></div>
 <div class="form-grid">
 ${isLead?field("Name","name",x.name,"e.g. Sarah Mitchell"):isJob?field("Customer / company","name",x.name,"e.g. Mitchell & Co"):field("Customer","name",x.name,"e.g. Mitchell & Co")}
 ${field(isLead?"Company":isJob?"Service":"Contact","second",isLead?x.company:isJob?x.service:x.contact,isLead?"e.g. Acme Ltd":isJob?"e.g. Installation":"e.g. Sarah Mitchell")}
 ${isLead?field("Service","service",x.service,"What are they asking for?"):isJob?field("Value","value",x.value,"0"):field("Email","email",x.email,"name@company.com")}
 ${isLead?field("Value","value",x.value,"0"):isJob?field("Due date","due",x.due,"YYYY-MM-DD"):field("Lifetime value","value",x.value,"0")}
 ${isLead?fieldSelect("Status","status",x.status||"New",["New","Contacted","Quote sent","Won","Lost"]):isJob?fieldSelect("Status","status",x.status||"Scheduled",["Scheduled","In progress","Waiting","Complete"]):fieldSelect("Status","status",x.status||"Active",["Active","At risk","Inactive"])}
 ${isJob?field("Health %","health",x.health??100,"0–100"):field("Notes","notes",x.notes||"","Optional notes")}
 </div><div class="modal-foot">${id?`<button class="btn danger" id="deleteRecord">Delete</button>`:""}<button class="btn secondary" id="cancelModal">Cancel</button><button class="btn primary" id="saveRecord">Save ${type}</button></div>`);
 $("#closeModal").onclick=closeModal;$("#cancelModal").onclick=closeModal;
 $("#saveRecord").onclick=()=>{const get=k=>document.querySelector(`[name="${k}"]`)?.value.trim();let obj={...x,id:id||type.charAt(0).toUpperCase()+Date.now().toString(36),name:get("name")||"Unnamed",status:get("status")};
 if(isLead){obj.company=get("second");obj.service=get("service");obj.value=Number(get("value")||0);obj.source=x.source||"Manual";obj.date=x.date||new Date().toISOString().slice(0,10)}
 else if(isJob){obj.service=get("second");obj.value=Number(get("value")||0);obj.due=get("due");obj.health=Math.max(0,Math.min(100,Number(get("health")||100)))}
 else {obj.contact=get("second");obj.email=get("email");obj.value=Number(get("value")||0);obj.last=x.last||new Date().toISOString().slice(0,10)}
 const idx=arr.findIndex(y=>y.id===obj.id);if(idx>=0)arr[idx]=obj;else arr.push(obj);save();closeModal();toast(`${type[0].toUpperCase()+type.slice(1)} saved`);render()};
 $("#deleteRecord")?.addEventListener("click",()=>{if(confirm(`Delete this ${type}?`)){const i=arr.findIndex(y=>y.id===id);if(i>=0)arr.splice(i,1);save();closeModal();toast(`${type[0].toUpperCase()+type.slice(1)} deleted`);render()}});
}
function field(label,name,value,placeholder){return `<div class="field"><label>${label}</label><input name="${name}" value="${esc(value??"")}" placeholder="${placeholder||""}"></div>`}
function fieldSelect(label,name,value,opts){return `<div class="field"><label>${label}</label><select name="${name}">${opts.map(o=>`<option ${o===value?"selected":""}>${o}</option>`).join("")}</select></div>`}
function exportCSV(){const rows=[["Type","Name","Status","Value"],...data.leads.map(x=>["Lead",x.name,x.status,x.value]),...data.jobs.map(x=>["Job",x.name,x.status,x.value]),...data.customers.map(x=>["Customer",x.name,x.status,x.value])];const csv=rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="flowai-report.csv";a.click();URL.revokeObjectURL(a.href);toast("Report exported")}
function init(){
 qsa(".nav-item").forEach(b=>b.onclick=()=>{page=b.dataset.page;render();$("#sidebar").classList.remove("open")});
 $("#mobileMenu").onclick=()=>$("#sidebar").classList.toggle("open");
 $("#modalBg").onclick=e=>{if(e.target.id==="modalBg")closeModal()};
 $("#aiBtn").onclick=()=>{page="ai";render()};
 $("#bellBtn").onclick=()=>{ $("#bellDot").style.display="none";toast("No new critical notifications")};
 $("#profileBtn").onclick=()=>{page="settings";render()};
 $("#workspaceBtn").onclick=()=>{page="settings";render()};
 $("#logoutBtn").onclick=()=>{if(confirm("Log out of this prototype?")){localStorage.removeItem(ACCOUNT);location.reload()}};
 $("#search").addEventListener("keydown",e=>{if(e.key==="Enter"){const q=e.target.value.toLowerCase();const p=q.includes("lead")?"leads":q.includes("job")?"jobs":q.includes("customer")?"customers":"ai";page=p;render()}});
 document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#search").focus()}});
 render();
}
init();

/* Production Firebase hook:
   This prototype intentionally keeps a local adapter so it runs from a downloaded folder.
   For production, replace load/save/auth with Firebase Auth + Firestore and call AI from
   a Cloud Function/server endpoint so API secrets never reach the browser. */


/* FlowAI V5 Premium UI layer */
(function(){
  const observer = new MutationObserver(() => {
    document.querySelectorAll('button').forEach(b => {
      if (!b.dataset.premiumBound) {
        b.dataset.premiumBound = '1';
        b.addEventListener('mousedown',()=>b.style.transform='scale(.985)');
        b.addEventListener('mouseup',()=>b.style.transform='');
      }
    });
  });
  observer.observe(document.body,{childList:true,subtree:true});

  // Add subtle premium browser chrome / accessibility defaults.
  document.documentElement.style.scrollBehavior='smooth';
  document.body.classList.add('flowai-premium');
})();

/* =========================================================
   FLOWAI V6 — RECORD DETAIL ROUTER
   ========================================================= */
(function(){
  const key = 'flowai_v4_data';
  const state = {
    get(){
      try { return JSON.parse(localStorage.getItem(key)) || {}; } catch(e){ return {}; }
    },
    save(v){ localStorage.setItem(key, JSON.stringify(v)); }
  };

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }
  function initials(name){
    const a=String(name||'').trim().split(/\s+/).filter(Boolean);
    return (a[0]?.[0]||'?')+(a[1]?.[0]||'');
  }
  function getRecord(type,id){
    const d=state.get();
    const arr=d[type] || [];
    return arr.find(x=>String(x.id)===String(id));
  }
  function goBack(){
    if(typeof window.render==='function') window.render();
    else location.hash='';
  }
  function recordShell(title, subtitle, avatar, content, side=''){
    return `<div class="record-page">
      <div class="record-top">
        <div class="record-breadcrumbs"><button id="recordBack">← Back</button><span>/</span><span>${esc(subtitle)}</span></div>
        <div class="record-title-row">
          <div class="record-identity">
            <div class="record-avatar">${esc(avatar)}</div>
            <div><div class="record-eyebrow">${esc(subtitle)}</div><div class="record-name">${esc(title)}</div><div class="record-meta">FlowAI record · Private workspace view</div></div>
          </div>
          <div class="record-actions">
            <button class="crm-btn" id="recordClose">Close</button>
            <button class="crm-btn primary" id="recordEdit">Edit record</button>
          </div>
        </div>
        <div class="record-tabs"><button class="record-tab active">Overview</button><button class="record-tab">Activity</button><button class="record-tab">Notes</button><button class="record-tab">Files</button></div>
      </div>
      <div class="record-layout"><main class="record-main">${content}</main><aside class="record-side">${side}</aside></div>
    </div>`;
  }

  function card(title,body,action=''){
    return `<section class="record-card"><div class="record-card-head"><div class="record-card-title">${esc(title)}</div>${action?`<button class="record-card-action">${esc(action)}</button>`:''}</div><div class="record-card-body">${body}</div></section>`;
  }

  function field(label,value){
    return `<div class="detail-item"><label>${esc(label)}</label><div>${esc(value||'—')}</div></div>`;
  }

  function leadDetail(id){
    const r=getRecord('leads',id);
    if(!r){goBack();return;}
    const full=[r.firstName,r.lastName].filter(Boolean).join(' ')||'Unnamed lead';
    const d=state.get();
    const jobs=(d.jobs||[]).filter(j=>String(j.leadId||'')===String(id));
    const content =
      `<section class="record-card"><div class="metric-strip">
        <div class="metric"><label>Status</label><strong>${esc(r.status||'New')}</strong><span>Current stage</span></div>
        <div class="metric"><label>Value</label><strong>${esc(r.value?`£${Number(r.value).toLocaleString()}`:'—')}</strong><span>Estimated opportunity</span></div>
        <div class="metric"><label>Source</label><strong>${esc(r.source||'Direct')}</strong><span>Acquisition</span></div>
        <div class="metric"><label>Created</label><strong>${esc(r.created||'—')}</strong><span>Record date</span></div>
      </div></section>`+
      card('Contact information',`<div class="detail-grid">${field('First name',r.firstName)}${field('Last name',r.lastName)}${field('Email',r.email)}${field('Phone',r.phone)}${field('Service',r.service)}${field('Office / owner',r.office||'Primary team')}</div>`)+
      card('Opportunity details',`<div class="detail-grid">${field('Status',r.status)}${field('Lead source',r.source)}${field('Estimated value',r.value?`£${Number(r.value).toLocaleString()}`:'—')}${field('Next action',r.nextAction||'Follow up with lead')}</div>`)+
      card('Activity timeline',`<div class="timeline">
        <div class="timeline-item"><div class="timeline-dot">●</div><div><div class="timeline-title">Lead created</div><div class="timeline-text">FlowAI added this enquiry to your pipeline.</div><div class="timeline-time">${esc(r.created||'Recently')}</div></div></div>
        <div class="timeline-item"><div class="timeline-dot">AI</div><div><div class="timeline-title">AI priority available</div><div class="timeline-text">Review this record to see suggested next actions.</div><div class="timeline-time">FlowAI</div></div></div>
      </div>`)+
      (jobs.length?card('Related jobs',jobs.map(j=>`<div class="list-row"><div class="list-primary"><div class="list-name">${esc(j.title||j.name||'Job')}</div><div class="list-secondary">${esc(j.status||'Scheduled')}</div></div><div class="list-actions"><span class="badge">${esc(j.status||'Open')}</span></div></div>`).join(''):'');
    const side=card('Record owner',`<div class="side-section-title">Assigned to</div><div class="side-field"><strong>${esc(r.owner||r.office||'Your team')}</strong></div>
      <div class="side-section-title" style="margin-top:18px">AI insight</div><div class="side-field"><strong>Next best action</strong><div style="font-size:10px;color:#858a99;margin-top:4px">Review the lead and follow up based on its current status.</div></div>`);
    document.querySelector('.content').innerHTML=recordShell(full,'Lead',initials(full),content,side);
    bindRecordEdit('leads',id,r,full);
  }

  function jobDetail(id){
    const r=getRecord('jobs',id);
    if(!r){goBack();return;}
    const title=r.title||r.name||'Untitled job';
    const d=state.get();
    const customer=(d.customers||[]).find(c=>String(c.id)===String(r.customerId));
    const content=
      `<section class="record-card"><div class="metric-strip">
        <div class="metric"><label>Status</label><strong>${esc(r.status||'Open')}</strong><span>Job stage</span></div>
        <div class="metric"><label>Value</label><strong>${esc(r.value?`£${Number(r.value).toLocaleString()}`:'—')}</strong><span>Job value</span></div>
        <div class="metric"><label>Due</label><strong>${esc(r.dueDate||r.date||'—')}</strong><span>Scheduled date</span></div>
        <div class="metric"><label>Health</label><strong>${esc(r.health?`${r.health}%`:'Good')}</strong><span>AI job health</span></div>
      </div></section>`+
      card('Job details',`<div class="detail-grid">${field('Job name',title)}${field('Status',r.status)}${field('Due date',r.dueDate||r.date)}${field('Assigned to',r.assignee||r.owner)}${field('Customer',customer?[customer.firstName,customer.lastName].filter(Boolean).join(' '):r.customer||'—')}${field('Value',r.value?`£${Number(r.value).toLocaleString()}`:'—')}</div>`)+
      card('Customer',customer?`<div class="detail-grid">${field('Name',[customer.firstName,customer.lastName].filter(Boolean).join(' '))}${field('Email',customer.email)}${field('Phone',customer.phone)}${field('Customer value',customer.value?`£${Number(customer.value).toLocaleString()}`:'—')}</div>`:`<div class="record-empty">No linked customer is attached to this job.</div>`)+
      card('Job activity',`<div class="timeline"><div class="timeline-item"><div class="timeline-dot">✓</div><div><div class="timeline-title">Job created</div><div class="timeline-text">This job is now being monitored by FlowAI.</div></div></div><div class="timeline-item"><div class="timeline-dot">AI</div><div><div class="timeline-title">AI monitoring active</div><div class="timeline-text">FlowAI can flag risk, delays and missing actions.</div></div></div></div>`);
    const side=card('Job health',`<div class="side-field"><label>Current health</label><strong>${esc(r.health?`${r.health}%`:'Good')}</strong></div><div class="side-field"><label>Risk</label><strong>${esc(r.risk||'No major risk detected')}</strong></div><div class="side-field"><label>Next action</label><strong>${esc(r.nextAction||'Keep job status up to date')}</strong></div>`);
    document.querySelector('.content').innerHTML=recordShell(title,'Job',initials(title),content,side);
    bindRecordEdit('jobs',id,r,title);
  }

  function customerDetail(id){
    const r=getRecord('customers',id);
    if(!r){goBack();return;}
    const full=[r.firstName,r.lastName].filter(Boolean).join(' ')||r.name||'Unnamed customer';
    const d=state.get();
    const jobs=(d.jobs||[]).filter(j=>String(j.customerId||'')===String(id));
    const content=
      `<section class="record-card"><div class="metric-strip">
        <div class="metric"><label>Customer value</label><strong>${esc(r.value?`£${Number(r.value).toLocaleString()}`:'—')}</strong><span>Total value</span></div>
        <div class="metric"><label>Status</label><strong>${esc(r.status||'Active')}</strong><span>Relationship</span></div>
        <div class="metric"><label>Jobs</label><strong>${jobs.length}</strong><span>Linked records</span></div>
        <div class="metric"><label>Last contact</label><strong>${esc(r.lastContact||'—')}</strong><span>Recent activity</span></div>
      </div></section>`+
      card('Customer information',`<div class="detail-grid">${field('First name',r.firstName)}${field('Last name',r.lastName)}${field('Email',r.email)}${field('Phone',r.phone)}${field('Status',r.status)}${field('Customer value',r.value?`£${Number(r.value).toLocaleString()}`:'—')}</div>`)+
      card('Jobs & history',jobs.length?jobs.map(j=>`<div class="list-row"><div class="list-primary"><div class="list-name">${esc(j.title||j.name||'Job')}</div><div class="list-secondary">${esc(j.dueDate||j.date||'')} · ${esc(j.status||'Open')}</div></div><span class="badge">${esc(j.value?`£${Number(j.value).toLocaleString()}`:'Job')}</span></div>`).join(''):'<div class="record-empty">No jobs are linked to this customer yet.</div>')+
      card('Customer activity',`<div class="timeline"><div class="timeline-item"><div class="timeline-dot">●</div><div><div class="timeline-title">Customer profile opened</div><div class="timeline-text">You are viewing a private, single-record workspace.</div></div></div><div class="timeline-item"><div class="timeline-dot">AI</div><div><div class="timeline-title">Customer memory</div><div class="timeline-text">Future AI actions can use this customer's history without cluttering the main pipeline.</div></div></div></div>`);
    const side=card('Relationship',`<div class="side-field"><label>Status</label><strong>${esc(r.status||'Active')}</strong></div><div class="side-field"><label>Email</label><strong>${esc(r.email||'—')}</strong></div><div class="side-field"><label>Phone</label><strong>${esc(r.phone||'—')}</strong></div>`);
    document.querySelector('.content').innerHTML=recordShell(full,'Customer',initials(full),content,side);
    bindRecordEdit('customers',id,r,full);
  }

  function bindRecordEdit(type,id,r,title){
    document.getElementById('recordBack')?.addEventListener('click',goBack);
    document.getElementById('recordClose')?.addEventListener('click',goBack);
    document.getElementById('recordEdit')?.addEventListener('click',()=>editRecord(type,id,r,title));
  }

  function editRecord(type,id,r,title){
    const editable=['firstName','lastName','name','email','phone','status','service','source','value','dueDate','date','assignee','owner','notes'];
    const body=`<div class="record-edit"><div class="form-grid">${
      editable.filter(k=>r[k]!==undefined || ['firstName','lastName','name','email','phone','status','notes'].includes(k)).map(k=>{
        const v=r[k]??'';
        const area=k==='notes';
        return `<div class="field ${area?'full':''}"><label>${esc(k.replace(/([A-Z])/g,' $1'))}</label>${area?`<textarea data-edit="${k}">${esc(v)}</textarea>`:`<input data-edit="${k}" value="${esc(v)}">`}</div>`;
      }).join('')
    }</div></div>`;
    document.querySelector('.content').innerHTML=`<div class="record-page"><div class="record-top"><div class="record-breadcrumbs"><button id="recordCancel">← Back to record</button></div><div class="record-title-row"><div><div class="record-eyebrow">Edit ${esc(type.slice(0,-1))}</div><div class="record-name">${esc(title)}</div><div class="record-meta">Changes apply only to this record.</div></div></div></div><div class="record-layout"><main class="record-main">${card('Edit details',body)}</main></div><div class="record-footer"><button class="crm-btn" id="recordCancel2">Cancel</button><button class="crm-btn primary" id="recordSave">Save changes</button></div></div>`;
    document.getElementById('recordCancel')?.addEventListener('click',()=>openRecord(type,id));
    document.getElementById('recordCancel2')?.addEventListener('click',()=>openRecord(type,id));
    document.getElementById('recordSave')?.addEventListener('click',()=>{
      const d=state.get(); const arr=d[type]||[]; const item=arr.find(x=>String(x.id)===String(id));
      if(!item)return;
      document.querySelectorAll('[data-edit]').forEach(el=>item[el.dataset.edit]=el.value);
      state.save(d); openRecord(type,id);
    });
  }

  function openRecord(type,id){
    if(type==='leads') leadDetail(id);
    else if(type==='jobs') jobDetail(id);
    else if(type==='customers') customerDetail(id);
    else goBack();
  }

  // Global helper: existing V4 list rows can call window.openFlowAIRecord(type,id).
  window.openFlowAIRecord=openRecord;

  // Hash support: #lead/123, #job/123, #customer/123
  function route(){
    const h=location.hash.replace(/^#/,'');
    const m=h.match(/^(lead|job|customer)\/(.+)$/);
    if(!m)return;
    openRecord({lead:'leads',job:'jobs',customer:'customers'}[m[1]],decodeURIComponent(m[2]));
  }
  window.addEventListener('hashchange',route);
  setTimeout(route,250);
})();
