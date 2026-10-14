function login(){
  if(username.value==="admin" && password.value==="admin123"){
    sessionStorage.storysprout_admin="1";
    show();
  }else loginMsg.textContent="Invalid login.";
}
function logout(){sessionStorage.removeItem("storysprout_admin");location.reload();}
function show(){
  loginBox.classList.add("hidden");
  adminApp.classList.remove("hidden");
  load();
  render();
}
function render(){
  adminTable.innerHTML=getBooks().map(b=>`<tr><td>${b.title}</td><td>${b.ageGroup}</td><td>${b.theme}</td><td><button onclick="editBook(${b.id})">Edit</button><button class="danger" onclick="deleteBook(${b.id})">Delete</button></td></tr>`).join("");
}
function saveBook(){
  let bs=getBooks(), id=bookId.value?Number(bookId.value):Date.now();
  let b={id,title:title.value,author:author.value,ageGroup:ageGroup.value,theme:bookTheme.value,rating:Number(rating.value),lexile:Number(lexile.value),astmaTier:astmaTier.value,summary:summary.value};
  let i=bs.findIndex(x=>x.id===id); if(i<0)bs.push(b); else bs[i]=b;
  saveBooks(bs); clearForm(); render(); alert("Book saved.");
}
function editBook(id){
  let b=getBooks().find(x=>x.id===id);
  bookId.value=b.id;title.value=b.title;author.value=b.author;ageGroup.value=b.ageGroup;
  bookTheme.value=b.theme;rating.value=b.rating;lexile.value=b.lexile;astmaTier.value=b.astmaTier;summary.value=b.summary;
  formTitle.textContent="Edit Book";
}
function deleteBook(id){if(confirm("Delete this book?")){saveBooks(getBooks().filter(b=>b.id!==id));render();}}
function clearForm(){bookId.value="";title.value="";author.value="";summary.value="";rating.value=4.5;lexile.value=450;formTitle.textContent="Add New Book";}
function labels(){astmaVal.textContent=wAstma.value+"%";genreVal.textContent=wGenre.value+"%";ratingVal.textContent=wRating.value+"%";ageVal.textContent=wAge.value+"%";}
function load(){let w=getWeights();wAstma.value=w.astma*100;wGenre.value=w.genre*100;wRating.value=w.rating*100;wAge.value=w.age*100;labels();}
function saveWeights(){saveWeightsData({astma:wAstma.value/100,genre:wGenre.value/100,rating:wRating.value/100,age:wAge.value/100});alert("Weights saved.");}
function resetData(){if(confirm("Reset seed data?")){localStorage.removeItem("storysprout_books");localStorage.removeItem("storysprout_weights");location.reload();}}

const ERP_DATA=[
{publisher:"HarperChildrens Pub",sku:"SKU-99421",book:"The Little Seed's Big Adventure",stock:1420,rights:"DRM Granted",status:"Active Sync"},
{publisher:"Penguin Young Readers",sku:"SKU-88231",book:"Astronaut Pip & The Starlight Trail",stock:320,rights:"DRM Granted",status:"Low Stock"},
{publisher:"Sterling Kids",sku:"SKU-77410",book:"Oliver Owl's Kindness Kingdom",stock:680,rights:"DRM Granted",status:"Active Sync"},
{publisher:"Dreams Publishing",sku:"SKU-66208",book:"The Whispering Moon & Sleepy Bear",stock:910,rights:"DRM Granted",status:"Active Sync"},
{publisher:"Pendelton House",sku:"SKU-55017",book:"Mystery of the Clockwork Dragon",stock:95,rights:"Review Required",status:"Review"}
];

function showAdminTab(tab){
  booksTab.classList.toggle("hidden",tab!=="books");
  erpTab.classList.toggle("hidden",tab!=="erp");
  tabBooks.classList.toggle("active",tab==="books");
  tabERP.classList.toggle("active",tab==="erp");
  pageTitle.textContent=tab==="erp"?"ERP Dashboard":"Book Management";
  pageSubtitle.textContent=tab==="erp"?"Enterprise inventory and integration overview.":"Add, edit and delete recommendations.";
  if(tab==="erp")renderERP();
}
function renderERP(){
  const filter=document.getElementById("erpFilter").value;
  const rows=ERP_DATA.filter(x=>filter==="all"||x.status===filter);
  erpTable.innerHTML=rows.map(x=>`<tr><td>${x.publisher}</td><td>${x.sku}</td><td>${x.book}</td><td><b>${x.stock.toLocaleString()}</b></td><td>${x.rights}</td><td><span class="status-pill ${x.status==="Active Sync"?"status-active":x.status==="Low Stock"?"status-low":"status-review"}">${x.status}</span></td><td><button onclick="viewERPItem('${x.sku}')">View</button></td></tr>`).join("");
  erpEvents.innerHTML=[
    ["09:42","ERP inventory sync completed","142 SKUs updated"],
    ["09:36","Digital rights validation","All active titles verified"],
    ["09:18","Low stock alert generated","SKU-88231 requires review"],
    ["08:55","Recommendation request","STEM / Age 4–7 availability checked"]
  ].map(e=>`<div class="event"><span class="event-time">${e[0]}</span><span><b>${e[1]}</b><br><span class="muted">${e[2]}</span></span></div>`).join("");
}
function viewERPItem(sku){
  const x=ERP_DATA.find(i=>i.sku===sku);
  alert("ERP Record\n\nPublisher: "+x.publisher+"\nSKU: "+x.sku+"\nBook: "+x.book+"\nStock: "+x.stock+"\nDigital Rights: "+x.rights+"\nStatus: "+x.status);
}
function runERPWorkflow(){
  workflowBox.classList.remove("hidden");
  ["wf1","wf2","wf3","wf4","wf5"].forEach(id=>document.getElementById(id).classList.remove("done"));
  const steps=[["wf1","Customer request received"],["wf2","ASTMA recommendation calculated"],["wf3","ERP inventory availability verified"],["wf4","Digital rights validated"],["wf5","Final recommendation ready"]];
  let i=0; workflowStatus.textContent="Starting enterprise workflow...";
  const timer=setInterval(()=>{
    if(i>=steps.length){clearInterval(timer);workflowStatus.textContent="✓ Workflow completed successfully — book is available for recommendation.";return;}
    document.getElementById(steps[i][0]).classList.add("done");
    workflowStatus.textContent="✓ "+steps[i][1]; i++;
  },650);
}

[wAstma,wGenre,wRating,wAge].forEach(x=>x.addEventListener("input",labels));
if(sessionStorage.storysprout_admin)show();
