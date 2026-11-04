/* =====================================================================
   PORTAL KAFA: tetapan dan logik bersama
   ---------------------------------------------------------------------
   Untuk menambah subjek baharu yang sudah siap:
   1. Letak game dalam folder, contoh: tahun3/hafazan/index.html
   2. Tambah satu baris dalam READY di bawah, contoh:
      "3/hafazan": { path:"hafazan/index.html", r:"Hafazan Ceria", j:"حفظن چرياء",
                     dr:"Hafal surah pilihan", dj:"حفظ سورة ڤيليهن" },
   ===================================================================== */

const YEARS = [3, 4, 5, 6];

// Senarai subjek KAFA. r = Rumi, j = Jawi, dr/dj = penerangan ringkas.
const SUBJECTS = [
  { id:"sirah",   icon:"🐪", r:"Sirah",       j:"سيره",      dr:"Kisah kehidupan Nabi ﷺ",       dj:"قيصه کهيدوڤن نبي ﷺ" },
  { id:"quran",   icon:"📖", r:"Al-Quran",    j:"القرءان",    dr:"Bacaan dan tajwid",            dj:"باچاٴن دان تجويد" },
  { id:"hafazan", icon:"🧠", r:"Hafazan",     j:"حفظن",      dr:"Hafal surah-surah pilihan",    dj:"حفظ سورة٢ ڤيليهن" },
  { id:"tauhid",  icon:"☝️", r:"Tauhid",      j:"توحيد",     dr:"Mengenal Allah dan rukun iman", dj:"مڠنل الله دان روکون ايمان" },
  { id:"feqah",   icon:"🕌", r:"Feqah",       j:"فقه",       dr:"Tayammum, azan dan solat",     dj:"تيمم، اذان دان صلاة" },
  { id:"akhlak",  icon:"💎", r:"Akhlak",      j:"اخلاق",     dr:"Adab dan akhlak mulia",        dj:"اداب دان اخلاق موليا" },
  { id:"jawi",    icon:"✍️", r:"Jawi",        j:"جاوي",      dr:"Membaca dan menulis Jawi",     dj:"ممباچ دان منوليس جاوي" },
  { id:"arab",    icon:"🗣️", r:"Bahasa Arab", j:"بهاس عرب",  dr:"Perkataan dan ayat mudah",     dj:"ڤرکاتاٴن دان ايات موده" }
];

// Game yang sudah siap. Kunci = "tahun/idSubjek". path adalah relatif kepada folder tahun.
// progress (pilihan): cara membaca bintang yang disimpan oleh game itu.
const READY = {
  "3/sirah": {
    path:"sirah/index.html",
    r:"Pengembaraan Sirah", j:"ڤڠمباراٴن سيره",
    dr:"6 pelajaran dan Cabaran Akhir", dj:"6 ڤلاجرن دان چابرن اخير",
    progress:{ key:"s3-best", max:21 }
  },
  "3/feqah": {
    path:"feqah/index.html",
    r:"Jom Bina Masjid", j:"جوم بينا مسجد",
    dr:"7 pelajaran, 10 jenis permainan", dj:"7 ڤلاجرن، 10 جنيس ڤرماٴينن",
    progress:{ key:"f3-best", max:24 }
  },
  "3/tauhid": {
    path:"tauhid/index.html",
    r:"Kembara Lautan Iman", j:"کمبارا لاءوتن ايمان",
    dr:"7 zon lautan, 8 jenis permainan", dj:"7 زون لاءوتن، 8 جنيس ڤرماٴينن",
    progress:{ key:"t3-best", max:24 }
  },
  "3/akhlak": {
    path:"akhlak/index.html",
    r:"Jalan-jalan Kampung Akhlak", j:"جالن٢ کامڤوڠ اخلاق",
    dr:"8 tempat, 8 jenis permainan", dj:"8 تمڤت، 8 جنيس ڤرماٴينن",
    progress:{ key:"a3-best", max:27 }
  }
};

/* ===================== Bahasa (Jawi / Rumi) ===================== */
function kLoad(k,f){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f; }catch(e){ return f; } }
function kSave(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
let LANG = kLoad("kafa-lang","jawi");
const isJ = () => LANG==="jawi";
const tx = (r,j) => isJ() ? j : r;
function applyLang(){
  document.documentElement.dir = isJ() ? "rtl" : "ltr";
  document.documentElement.lang = isJ() ? "ms-Arab" : "ms";
}
const BACK = () => isJ() ? "→" : "←";

/* ===================== Maskot Kiki ===================== */
function mascot(){
  return `<svg class="mascot" viewBox="0 0 130 110" aria-hidden="true">
    <g fill="#C98B4E"><rect x="36" y="70" width="8" height="32" rx="4"/><rect x="50" y="72" width="8" height="30" rx="4"/><rect x="70" y="72" width="8" height="30" rx="4"/><rect x="84" y="70" width="8" height="32" rx="4"/></g>
    <path d="M28 62 Q16 66 18 80" stroke="#C98B4E" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="62" cy="62" rx="36" ry="20" fill="#E0A863"/>
    <ellipse cx="56" cy="46" rx="18" ry="15" fill="#E0A863"/>
    <path d="M88 58 Q96 44 98 28" stroke="#E0A863" stroke-width="16" fill="none" stroke-linecap="round"/>
    <ellipse cx="90" cy="19" rx="3.5" ry="6" fill="#C98B4E"/>
    <ellipse cx="102" cy="24" rx="15" ry="12" fill="#E0A863"/>
    <ellipse cx="111" cy="30" rx="9" ry="7" fill="#EDC48F"/>
    <rect x="91" y="6" width="22" height="9" rx="2" fill="#1F1F1F"/>
    <circle cx="103" cy="21" r="3.2" fill="#2A1A0A"/><circle cx="104" cy="20" r="1" fill="#fff"/>
    <circle cx="97" cy="28" r="3" fill="#F2A0A0" opacity=".7"/>
    <path d="M104 31 Q110 37 116 31" stroke="#5A3A1E" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/* ===================== Bantuan ===================== */
const yearColor = y => `var(--y${y})`;
const readyFor = y => SUBJECTS.filter(s => READY[`${y}/${s.id}`]);
function starsOf(entry){
  if(!entry.progress) return null;
  const obj = kLoad(entry.progress.key, null);
  const got = obj ? Object.values(obj).reduce((a,b)=>a+(+b||0),0) : 0;
  return { got, max: entry.progress.max };
}
function toast(msg){
  document.querySelectorAll(".toast").forEach(t=>t.remove());
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role","status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2600);
}
function langBtn(){
  return `<button class="langbtn" data-act="lang" aria-label="${tx("Tukar ke tulisan Jawi","Tukar ke tulisan Rumi")}">${isJ()?"Rumi":'<span class="ar">جاوي</span>'}</button>`;
}

/* ===================== Laman utama ===================== */
function renderHome(app){
  document.title = tx("Jom Belajar KAFA","جوم بلاجر کافا");
  const gates = YEARS.map((y,i)=>{
    const n = readyFor(y).length;
    const meta = n ? tx(`${n} subjek sedia`,`${n} سوبجيک سديا`) : tx("Akan datang","اکن داتڠ");
    return `<a class="gate ${n?"":"soon"}" href="tahun${y}/index.html" style="--c:${yearColor(y)};--i:${i}">
      <span class="num">${y}</span>
      <span class="lbl">${tx("Tahun","تاهون")} ${y}</span>
      <span class="meta">${meta}</span>
    </a>`;
  }).join("");
  app.innerHTML = `
    <div class="topbar"><span></span><div class="grp">${langBtn()}</div></div>
    <header class="welcome">
      <h1>${tx("Jom Belajar KAFA","جوم بلاجر کافا")}</h1>
      <div class="greet">${mascot()}<div class="bubble">${tx("Assalamualaikum! Saya Kiki. Pilih tahun kamu untuk mula belajar.","السلام عليکم! ساي کيکي. ڤيليه تاهون کامو اونتوق مولا بلاجر.")}</div></div>
    </header>
    <nav class="gates" aria-label="${tx("Pilih tahun","ڤيليه تاهون")}">${gates}</nav>
    <p class="foot">${tx("Dibina untuk murid KAFA. Subjek baharu akan ditambah dari semasa ke semasa.","دبينا اونتوق موريد کافا. سوبجيک بهارو اکن دتمبه دري سماس ک سماس.")}</p>`;
}

/* ===================== Laman tahun ===================== */
function renderYear(app, y){
  document.title = tx(`Tahun ${y} • KAFA`,`تاهون ${y} • کافا`);
  const nReady = readyFor(y).length;
  const sorted = [...SUBJECTS].sort((a,b)=> (READY[`${y}/${b.id}`]?1:0) - (READY[`${y}/${a.id}`]?1:0));
  const tiles = sorted.map(s=>{
    const entry = READY[`${y}/${s.id}`];
    if(entry){
      const st = starsOf(entry);
      return `<a class="subj ready ${nReady<=2?"feature":""}" href="${entry.path}" style="--c:${yearColor(y)}">
        <span class="ic" aria-hidden="true">${s.icon}</span>
        <h2>${tx(s.r,s.j)}</h2>
        <p>${tx(entry.r,entry.j)} • ${tx(entry.dr,entry.dj)}</p>
        ${st?`<span class="prog">⭐ ${st.got}/${st.max}</span>`:""}
        <span class="go">${tx("Main sekarang","ماٴين سکارڠ")} ▶</span>
      </a>`;
    }
    return `<button class="subj soon" data-act="soon" data-name="${tx(s.r,s.j)}">
      <span class="ic" aria-hidden="true">${s.icon}</span>
      <h2>${tx(s.r,s.j)}</h2>
      <p>${tx(s.dr,s.dj)}</p>
      <span class="badge">⏳ ${tx("Akan datang","اکن داتڠ")}</span>
    </button>`;
  }).join("");
  app.innerHTML = `
    <div class="topbar"><a class="iconbtn" href="../index.html" aria-label="${tx("Kembali ke laman utama","کمبالي ک لامن اوتام")}">${BACK()}</a><div class="grp">${langBtn()}</div></div>
    <header class="yhead" style="--c:${yearColor(y)}">
      <span class="arch" aria-hidden="true">${y}</span>
      <div>
        <h1>${tx("Tahun","تاهون")} ${y}</h1>
        <p>${nReady ? tx(`${nReady} subjek sedia dimainkan. Pilih satu!`,`${nReady} سوبجيک سديا دماٴينکن. ڤيليه ساتو!`) : tx("Subjek sedang disediakan. Nantikan!","سوبجيک سدڠ دسدياکن. نانتيکن!")}</p>
      </div>
      ${mascot()}
    </header>
    <section class="subjects" aria-label="${tx("Subjek","سوبجيک")}">${tiles}</section>`;
}

/* ===================== Mula ===================== */
const KafaPortal = {
  start(page, year){
    applyLang();
    const app = document.getElementById("app");
    const draw = () => page==="year" ? renderYear(app, year) : renderHome(app);
    app.addEventListener("click", e=>{
      const b = e.target.closest("[data-act]");
      if(!b) return;
      if(b.dataset.act==="lang"){ LANG = isJ() ? "rumi" : "jawi"; kSave("kafa-lang", LANG); applyLang(); draw(); }
      if(b.dataset.act==="soon"){ toast(tx(`${b.dataset.name} akan datang, insya-Allah.`,`${b.dataset.name} اکن داتڠ، ان شاء الله.`)); }
    });
    draw();
  }
};
