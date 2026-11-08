/* =====================================================================
   PORTAL KAFA: tetapan dan logik bersama
   ---------------------------------------------------------------------
   Untuk menambah subjek baharu yang sudah siap:
   1. Letak game dalam folder, contoh: tahun3/hafazan/index.html
   2. Tambah satu baris dalam READY di bawah, contoh:
      "3/hafazan": { path:"hafazan/index.html", r:"Hafazan Ceria", j:"حفظن چرياء",
                     dr:"Hafal surah pilihan", dj:"حفظ سورة ڤيليهن" },
   ===================================================================== */

const YEARS = [1, 2, 3, 4, 5, 6];

// Senarai subjek KAFA. r = Rumi, j = Jawi, dr/dj = penerangan ringkas.
const SUBJECTS = [
  { id:"sirah",   icon:"🐪", r:"Sirah",       j:"سيره",      dr:"Kisah kehidupan Nabi ﷺ",       dj:"قيصه کهيدوڤن نبي ﷺ" },
  { id:"quran",   icon:"📖", r:"Al-Quran",    j:"القرءان",    dr:"Bacaan al-Quran",              dj:"باچاٴن القرءان" },
  { id:"tajwid",  icon:"🎙️", r:"Tajwid",      j:"تجويد",     dr:"Makhraj huruf dan hukum tajwid", dj:"مخرج حروف دان حکوم تجويد" },
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
  // Tahun 1: reka bentuk sendiri (theme menggantikan tema dunia Tahun 3 pada kad subjek)
  "1/akhlak": {
    path:"akhlak/index.html",
    r:"Pokok Adab Hoho", j:"ڤوکوق اداب هوهو",
    dr:"10 stesen, 8 jenis permainan", dj:"10 ستيسن، 8 جنيس ڤرماٴينن",
    progress:{ key:"a1-best", max:33 },
    theme:{ c1:"#FF9F1C", c2:"#2E7D32", a:"#FFE066", m:"🦉", deco:"tree" }
  },
  "1/tauhid": {
    path:"tauhid/index.html",
    r:"Taman Bunga Iman", j:"تامن بوڠا ايمان",
    dr:"8 stesen, 7 jenis permainan", dj:"8 ستيسن، 7 جنيس ڤرماٴينن",
    progress:{ key:"tw1-best", max:27 },
    theme:{ c1:"#FFC94A", c2:"#F08A00", a:"#FF6FA8", m:"🐝", deco:"garden" }
  },
  "1/feqah": {
    path:"feqah/index.html",
    r:"Pulau Titisan Suci", j:"ڤولاو تيتيسن سوچي",
    dr:"9 pulau, 8 jenis permainan", dj:"9 ڤولاو، 8 جنيس ڤرماٴينن",
    progress:{ key:"f1-best", max:30 },
    theme:{ c1:"#12B5D6", c2:"#0B4A6E", a:"#FFD166", m:"💧", deco:"rainbow" }
  },
  "1/jawi": {
    path:"jawi/index.html",
    r:"Zoo Huruf Jaja", j:"زو حروف جاجا",
    dr:"10 kandang, 9 jenis permainan", dj:"10 کندڠ، 9 جنيس ڤرماٴينن",
    progress:{ key:"j1-best", max:33 },
    theme:{ c1:"#9CCB52", c2:"#4E8F2A", a:"#FFC83D", m:"🐘", deco:"savanna" }
  },
  "1/hafazan": {
    path:"hafazan/index.html",
    r:"Belon Udara Hafiz", j:"بلون اودارا حافظ",
    dr:"10 surah, 7 jenis permainan", dj:"10 سورة، 7 جنيس ڤرماٴينن",
    progress:{ key:"h1-best", max:33 },
    theme:{ c1:"#FF9A8B", c2:"#8E7CC3", a:"#FFC94D", m:"🎈", deco:"dawn" }
  },
  "1/arab": {
    path:"arab/index.html",
    r:"Karnival Kalimah", j:"کارنيۏل کليمة",
    dr:"9 gerai, 8 jenis permainan", dj:"9 ڬراي، 8 جنيس ڤرماٴينن",
    progress:{ key:"r1-best", max:30 },
    theme:{ c1:"#5B2A9E", c2:"#FF4F9A", a:"#FFD23F", m:"🐱", deco:"karnival" }
  },
  "2/feqah": {
    path:"feqah/index.html",
    r:"Istana Suci Naga Nana", j:"ايستان سوچي ناڬ نانا",
    dr:"9 menara, 8 jenis permainan", dj:"9 منارا، 8 جنيس ڤرماٴينن",
    progress:{ key:"f2-best", max:30 },
    theme:{ c1:"#7B3FBF", c2:"#4A2380", a:"#F2B630", m:"🐲", deco:"istana" }
  },
  "2/akhlak": {
    path:"akhlak/index.html",
    r:"Dapur Adab Chef Mimi", j:"داڤور ادب چيف ميمي",
    dr:"7 resipi, 8 jenis permainan", dj:"7 رسيڤي، 8 جنيس ڤرماٴينن",
    progress:{ key:"a2-best", max:24 },
    theme:{ c1:"#E8483B", c2:"#3FBF8F", a:"#FFD66B", m:"🐥", deco:"dapur" }
  },
  "2/jawi": {
    path:"jawi/index.html",
    r:"Pejabat Pos Huruf", j:"ڤجابت ڤوس حروف",
    dr:"8 rumah, 8 jenis permainan", dj:"8 رومه، 8 جنيس ڤرماٴينن",
    progress:{ key:"j2-best", max:27 },
    theme:{ c1:"#D7263D", c2:"#2E6FBA", a:"#F2B134", m:"🕊️", deco:"airmail" }
  },
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
  },
  "3/arab": {
    path:"arab/index.html",
    r:"Lompat Katak", j:"لومڤت کاتق",
    dr:"9 pelajaran, 9 jenis permainan", dj:"9 ڤلاجرن، 9 جنيس ڤرماٴينن",
    progress:{ key:"r3-best", max:30 }
  },
  "3/tajwid": {
    path:"tajwid/index.html",
    r:"Angkasa Tajwid", j:"اڠکاس تجويد",
    dr:"8 planet, 9 jenis permainan", dj:"8 ڤلانيت، 9 جنيس ڤرماٴينن",
    progress:{ key:"j3-best", max:27 }
  },
  "3/hafazan": {
    path:"hafazan/index.html",
    r:"Kereta Api Hafazan", j:"کريتا اڤي حفظن",
    dr:"8 surah, 9 jenis permainan", dj:"8 سوره، 9 جنيس ڤرماٴينن",
    progress:{ key:"h3-best", max:27 }
  }
};

// Zon Arked: permainan aksi yang menggunakan soalan daripada subjek yang sudah siap.
// subjects = id subjek yang ada bank soalan dalam arked/index.html. hiKey = rekod skor tertinggi.
const ARCADE = {
  3: { path:"arked/index.html", hiKey:"ark3-hi", subjects:["sirah","feqah","tauhid","akhlak","arab","tajwid","hafazan"] }
};

// Tema dunia setiap subjek (sama seperti dunia dalam Zon Arked): warna, maskot dan hiasan latar kad
const THEMES = {
  sirah:   { c1:"#F08A3C", c2:"#7A3B12", a:"#FFD08A", m:"🐪", deco:"dunes" },
  feqah:   { c1:"#1BB394", c2:"#0B4F44", a:"#9FF5DD", m:"🕌", deco:"arches" },
  tauhid:  { c1:"#1394B8", c2:"#073B4C", a:"#9EE7FF", m:"🐢", deco:"bubbles" },
  akhlak:  { c1:"#E5487E", c2:"#7A1A3E", a:"#FFC2D8", m:"🏡", deco:"hills" },
  arab:    { c1:"#34B05A", c2:"#14532D", a:"#BDF5C9", m:"🐸", deco:"pads" },
  tajwid:  { c1:"#6C5CE7", c2:"#1C1B3A", a:"#D2CCFF", m:"🚀", deco:"stars" },
  hafazan: { c1:"#D64532", c2:"#5E1A14", a:"#FFC9BF", m:"🚂", deco:"rails" },
  mix:     { c1:"#8B45F0", c2:"#120634", a:"#FF8CE6", m:"🎲", deco:"stars" }
};
const themeVars = (id, t) => { t = t || THEMES[id] || THEMES.mix; return `--c1:${t.c1};--c2:${t.c2};--a:${t.a}`; };

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

/* ===================== Pasang aplikasi (PWA) ===================== */
// Kad "Pasang JOM KAFA": Android/Chrome/Edge membuka tetingkap pasang; iPhone/iPad diberi panduan Kongsi → Tambah ke Skrin Utama.
function installCard(){
  const P = window.KafaPWA;
  if(!P || !P.canInstall() || kLoad("kafa-pwa-hide", 0) > Date.now()) return '<div id="pwa"></div>';
  return `<section class="install" id="pwa">
      <img src="/icons/icon-192.png" alt="" width="64" height="64">
      <div><b>📲 ${tx("Pasang JOM KAFA","ڤاسڠ JOM KAFA")}</b>
        <p>${tx("Buka terus dari skrin utama, penuh skrin, dan boleh main walaupun tiada internet.","بوک تروس دري سکرين اوتام، ڤنوه سکرين، دان بوليه ماٴين والاٴوڤون تيادا اينترنيت.")}</p></div>
      <button class="ibtn" data-act="install">${tx("Pasang","ڤاسڠ")}</button>
      <button class="ix" data-act="pwahide" aria-label="${tx("Tutup","توتوڤ")}">✕</button>
    </section>`;
}
function iosGuide(){
  document.querySelectorAll(".iosg").forEach(x=>x.remove());
  const d = document.createElement("div"); d.className = "iosg"; d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true");
  d.innerHTML = `<div class="card"><button class="ix" data-act="iosclose" aria-label="${tx("Tutup","توتوڤ")}">✕</button>
    <img src="/icons/icon-192.png" alt="" width="72" height="72"><h2>${tx("Pasang di iPhone / iPad","ڤاسڠ د iPhone / iPad")}</h2>
    <ol><li>${tx("Tekan butang <b>Kongsi</b>","تکن بوتڠ <b>کوڠسي</b>")} <span class="sh">⬆️</span> ${tx("di Safari (bawah atau atas skrin).","د Safari (باوه اتاو اتس سکرين).")}</li>
      <li>${tx("Pilih <b>Tambah ke Skrin Utama</b> (Add to Home Screen).","ڤيليه <b>تمبه ک سکرين اوتام</b> (Add to Home Screen).")}</li>
      <li>${tx("Tekan <b>Tambah</b>. Ikon JOM KAFA akan muncul di skrin utama.","تکن <b>تمبه</b>. ايکون JOM KAFA اکن مونچول د سکرين اوتام.")}</li></ol></div>`;
  document.body.appendChild(d);
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
    ${installCard()}
    <p class="foot">${tx("Dibina untuk murid KAFA. Subjek baharu akan ditambah dari semasa ke semasa.","دبينا اونتوق موريد کافا. سوبجيک بهارو اکن دتمبه دري سماس ک سماس.")}<br><a href="privasi.html" style="color:inherit">${tx("Dasar Privasi","داسر ڤريۏاسي")}</a></p>`;
}

/* ===================== Laman tahun ===================== */
function renderYear(app, y){
  document.title = tx(`Tahun ${y} • KAFA`,`تاهون ${y} • کافا`);
  const nReady = readyFor(y).length;
  // Tahun yang sudah ada subjek sedia hanya memaparkan subjek itu (kad dunia), ikut susunan Zon Arked.
  // Tahun yang belum ada subjek memaparkan senarai "Akan datang".
  const order = ARCADE[y] ? ARCADE[y].subjects : [];
  const pos = s => { const i = order.indexOf(s.id); return i<0 ? 99 : i; };
  const tiles = nReady ? readyFor(y).sort((a,b)=>pos(a)-pos(b)).map((s,i)=>worldCard(s, READY[`${y}/${s.id}`], i, y)).join("") : SUBJECTS.map(s=>{
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
    ${buyCard(y)}
    ${ARCADE[y] ? `<div class="ytabs" role="tablist">
      <button role="tab" data-act="ytab" data-t="learn" aria-selected="${yTab!=="arcade"}">📚 ${tx("Belajar","بلاجر")}<small>${tx(`${nReady} subjek`,`${nReady} سوبجيک`)}</small></button>
      <button role="tab" data-act="ytab" data-t="arcade" aria-selected="${yTab==="arcade"}">🕹️ ${tx("Zon Arked 3D","زون ارکيد 3D")}<small>${tx("6 permainan","6 ڤرماٴينن")}</small></button></div>` : ""}
    ${ARCADE[y] && yTab==="arcade" ? arcadeHTML(y) : `<section class="${nReady?"wgrid":"subjects"}" aria-label="${tx("Subjek","سوبجيک")}">${tiles}</section>`}`;
}
// Kad "Buka penuh Tahun N" (versi percubaan) atau tanda "milik kamu" selepas membeli
function buyCard(y){
  const AC = window.KafaAccess; if(!AC || !AC.sold(y)) return "";
  if(AC.has(y)) return `<div class="owned">✅ ${tx(`Tahun ${y} milik kamu — semua subjek & Zon Arked dibuka`,`تاهون ${y} ميليق کامو — سموا سوبجيک & زون ارکيد دبوک`)}</div>`;
  const price = AC.price(y), wa = AC.waLink(y);
  return `<section class="buy" aria-label="${tx("Beli","بلي")}">
      <div class="bt"><span class="bl" aria-hidden="true">🔓</span><div><b>${tx(`Buka penuh Tahun ${y}`,`بوک ڤنوه تاهون ${y}`)}</b>
        <p>${tx("Kamu sedang mencuba versi percuma: Sirah (tajuk pertama) dan satu permainan Zon Arked. Beli sekali untuk membuka semua subjek, semua tajuk dan Zon Arked penuh — seumur hidup.","کامو سدڠ منچوبا ۏرسي ڤرچوما: سيره (تاجوق ڤرتام) دان ساتو ڤرماٴينن زون ارکيد. بلي سکالي اونتوق ممبوک سموا سوبجيک، سموا تاجوق دان زون ارکيد ڤنوه — سأومور هيدوڤ.")}</p></div>
        ${price ? `<span class="pr">${price}<small>${tx("sekali bayar","سکالي باير")}</small></span>` : ""}</div>
      <div class="bb">${wa ? `<a class="b wa" href="${wa}" target="_blank" rel="noopener">💬 ${tx("Beli melalui WhatsApp","بلي ملالوٴي WhatsApp")}</a>` : ""}
        <button class="b code" data-act="redeem" data-y="${y}">🔑 ${tx("Masukkan kod","ماسوقکن کود")}</button>
        <button class="b alt" data-act="relogin" data-y="${y}">👤 ${tx("Sudah beli? Log masuk","سوده بلي؟ لوڬ ماسوق")}</button></div>
    </section>`;
}
// Tebus kod: perlu log masuk dahulu (kod diikat kepada akaun Google)
let redeemYear = null;
async function redeemFlow(y){
  if(!window.KafaAuth || !KafaAuth.on) return toast(tx("Pembelian hanya tersedia di laman rasmi.","ڤمبليان هاڽ ترسديا د لامن رسمي."));
  await KafaAuth.init();
  if(!KafaAuth.uid){ redeemYear = y; return KafaAuth.signIn(tx("Membuka log masuk","ممبوک لوڬ ماسوق")); }
  codeSheet(y);
}
function codeSheet(y){
  document.querySelectorAll(".kbuy").forEach(x=>x.remove());
  const d = document.createElement("div"); d.className = "kbuy"; d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true");
  d.innerHTML = `<div class="kcard"><button class="kx" data-k="close" aria-label="${tx("Tutup","توتوڤ")}">✕</button>
    <div class="klock">🔑</div><h2>${tx("Masukkan kod pengaktifan","ماسوقکن کود ڤڠکتيفن")}</h2>
    <p class="kmsg">${tx("Kod diterima selepas pembelian, contohnya","کود دتريما سلڤس ڤمبليان، چونتوهڽ")} <b dir="ltr">T${y}-ABCD-2345</b></p>
    <input class="kin" id="kcode" maxlength="16" autocomplete="off" autocapitalize="characters" spellcheck="false" dir="ltr" placeholder="T${y}-XXXX-XXXX">
    <p class="kerr" id="kerr" role="alert"></p>
    <button class="kbtn code" data-k="go">✨ ${tx("Buka Tahun","بوک تاهون")} ${y}</button></div>`;
  document.body.appendChild(d);
  const inp = d.querySelector("#kcode"); inp.focus();
  const go = async btn=>{
    const err = d.querySelector("#kerr"); err.textContent = "";
    KafaAuth.busy(btn, true, tx("Menyemak kod","مڽمق کود"));
    try{
      const r = await KafaAuth.api("redeem", {code: inp.value});
      KafaAccess.set(KafaAuth.uid, r.years); d.remove();
      toast(r.already ? tx(`Tahun ${r.year} memang sudah dibuka untuk akaun ini.`,`تاهون ${r.year} ممڠ سوده دبوک اونتوق اکاٴون اين.`) : "🎉 "+tx(`Tahun ${r.year} kini dibuka sepenuhnya!`,`تاهون ${r.year} کيني دبوک سڤنوهڽ!`));
    }catch(e){
      KafaAuth.busy(btn, false);
      err.textContent = "⚠️ " + ({"bad-code":tx("Kod tidak sah. Semak semula ejaan kod.","کود تيدق صح. سمق سمولا ايجاٴن کود."), "code-used":tx("Kod ini telah digunakan oleh akaun lain.","کود اين تله دڬوناکن اوليه اکاٴون لاٴين."),
        "too-many":tx("Terlalu banyak cubaan. Cuba lagi selepas sejam.","ترلالو باڽق چوباٴن. چوبا لاڬي سلڤس سجم.")}[e.code] || (e.status===401 ? tx("Sila log masuk semula.","سيلا لوڬ ماسوق سمولا.") : tx("Tidak dapat disambung ke pelayan. Semak internet.","تيدق داڤت دسمبوڠ ک ڤلاين. سمق اينترنيت.")));
    }
  };
  d.addEventListener("click", e=>{ const k = e.target.closest("[data-k]"); if(e.target===d) return d.remove(); if(!k) return;
    if(k.dataset.k==="close") d.remove(); if(k.dataset.k==="go") go(k); });
  inp.addEventListener("keydown", e=>{ if(e.key==="Enter") go(d.querySelector('[data-k="go"]')); });
}
// "Sudah beli? Log masuk": jika belum log masuk, buka log masuk; jika sudah, semak semula pembelian
// dan tunjuk akaun yang sedang digunakan (pembelian mungkin dibuat dengan e-mel lain)
async function relogin(y){
  if(!window.KafaAuth || !KafaAuth.on) return;
  await KafaAuth.init();
  if(!KafaAuth.uid) return KafaAuth.signIn(tx("Membuka log masuk","ممبوک لوڬ ماسوق"));
  KafaAuth.loading(true, tx("Menyemak pembelian","مڽمق ڤمبليان")); await syncAccess(); KafaAuth.loading(false);
  if(KafaAccess.has(y)) return toast("✅ "+tx(`Tahun ${y} sudah dibuka untuk akaun ini.`,`تاهون ${y} سوده دبوک اونتوق اکاٴون اين.`));
  const u = KafaAuth.clerk && KafaAuth.clerk.user, email = u && u.primaryEmailAddress ? u.primaryEmailAddress.emailAddress : "";
  document.querySelectorAll(".kbuy").forEach(x=>x.remove());
  const d = document.createElement("div"); d.className = "kbuy"; d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true");
  d.innerHTML = `<div class="kcard"><button class="kx" data-k="close" aria-label="${tx("Tutup","توتوڤ")}">✕</button>
    <div class="klock">👤</div><h2>${tx("Anda sudah log masuk","اندا سوده لوڬ ماسوق")}</h2>
    <p class="kmsg">${tx("Akaun:","اکاٴون:")} <b dir="ltr">${email || "-"}</b></p>
    <p class="kmsg">${tx(`Tiada pembelian Tahun ${y} untuk akaun ini. Jika anda membeli dengan e-mel lain, tukar akaun. Jika anda ada kod, masukkan kod.`,`تيادا ڤمبليان تاهون ${y} اونتوق اکاٴون اين. جک اندا ممبلي دڠن اي-ميل لاٴين، توکر اکاٴون. جک اندا اد کود، ماسوقکن کود.`)}</p>
    <button class="kbtn code" data-k="code">🔑 ${tx("Masukkan kod","ماسوقکن کود")}</button>
    <button class="kbtn alt" data-k="switch">🔄 ${tx("Tukar akaun","توکر اکاٴون")}</button></div>`;
  d.addEventListener("click", async e=>{ const k = e.target.closest("[data-k]"); if(e.target===d) return d.remove(); if(!k) return;
    if(k.dataset.k==="close") d.remove();
    if(k.dataset.k==="code"){ d.remove(); codeSheet(y); }
    if(k.dataset.k==="switch"){ d.remove(); await KafaAuth.signOut(tx("Log keluar","لوڬ کلوار")); KafaAuth.signIn(tx("Membuka log masuk","ممبوک لوڬ ماسوق")); }
  });
  document.body.appendChild(d);
}
// Semak tahun yang dibeli dengan pelayan (sekali setiap kali laman tahun dibuka)
async function syncAccess(){
  if(!window.KafaAuth || !KafaAuth.on || !window.KafaAccess) return;
  const c = await KafaAuth.init(); if(!c) return;
  if(!KafaAuth.uid){ if(KafaAccess.uid()) KafaAccess.clear(); return; }
  try{ const me = await KafaAuth.api("me"); KafaAccess.set(KafaAuth.uid, me.years || []); }catch(e){}
}
// tab laman tahun: #arked membuka Zon Arked terus (boleh dikongsi)
let yTab = location.hash==="#arked" ? "arcade" : "learn";
// Kad dunia subjek: latar bertema, maskot terapung, bar kemajuan bintang
function worldCard(s, entry, i, y){
  const t = entry.theme || THEMES[s.id] || THEMES.mix, st = starsOf(entry);
  const pct = st ? Math.min(100, Math.round(st.got / st.max * 100)) : 0;
  const AC = window.KafaAccess, owned = !AC || AC.has(y), open = owned || AC.canSubject(y, s.id);
  // subjek berkunci: tetingkap beli; subjek percubaan: reben "Cuba percuma"
  if(!open) return `<button class="wcard locked" data-act="buy" data-y="${y}" data-deco="${t.deco}" style="${themeVars(s.id, entry.theme)};--i:${i}">
      <span class="scene" aria-hidden="true"></span><span class="mas" aria-hidden="true">${t.m}</span>
      <span class="chip">${s.icon} ${tx(s.r,s.j)}</span><h2>${tx(entry.r,entry.j)}</h2><p>${tx(entry.dr,entry.dj)}</p>
      <span class="lockb">🔒 ${tx("Buka penuh untuk bermain","بوک ڤنوه اونتوق برماٴين")}</span></button>`;
  return `<a class="wcard tilt" href="${entry.path}" data-deco="${t.deco}" style="${themeVars(s.id, entry.theme)};--i:${i}">
      ${owned ? "" : `<span class="ribbon">🎁 ${tx("Cuba percuma","چوبا ڤرچوما")}</span>`}
      <span class="scene" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span>
      <span class="mas" aria-hidden="true">${t.m}</span>
      <span class="chip">${s.icon} ${tx(s.r,s.j)}</span>
      <h2>${tx(entry.r,entry.j)}</h2>
      <p>${tx(entry.dr,entry.dj)}</p>
      ${st ? `<span class="bar" role="img" aria-label="${st.got}/${st.max}"><i style="width:${pct}%"></i></span>
      <span class="stars">⭐ ${st.got}/${st.max}${st.got>=st.max ? " 🏆" : ""}</span>` : ""}
      <span class="go">${st && st.got ? tx("Sambung","سمبوڠ") : tx("Mula main","مولا ماٴين")} ▶</span>
    </a>`;
}
function arcadeHTML(y){
  const A = ARCADE[y]; if(!A) return "";
  const hi = kLoad(A.hiKey, {});
  const best = id => Math.max(0, ...Object.values(hi[id]||{}));
  const cards = [...A.subjects.map(id=>SUBJECTS.find(s=>s.id===id)), {id:"mix", icon:"🎲", r:"Campur semua", j:"چمڤور سموا"}].map((s,i)=>
    `<a class="arc tilt${window.KafaAccess && !KafaAccess.has(y) && (KafaAccess.trial(y).arcade||{}).subj!==s.id ? " lk" : ""}" href="${A.path}?s=${s.id}" data-deco="${(THEMES[s.id]||THEMES.mix).deco}" style="${themeVars(s.id)};--i:${i}"><span class="scene" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span>
      <span class="ic" aria-hidden="true">${(THEMES[s.id]||THEMES.mix).m}</span><b>${tx(s.r,s.j)}</b><small>🏆 ${best(s.id)}</small></a>`).join("");
  const orbit = A.subjects.map((id,i)=>`<span style="--k:${i};--n:${A.subjects.length}"><i>${(THEMES[id]||THEMES.mix).m}</i></span>`).join("");
  return `<section class="arcade" aria-label="${tx("Zon Arked","زون ارکيد")}">
      <span class="aurora" aria-hidden="true"></span>
      <div class="ahero">
        <div class="atext"><span class="pill">✨ ${tx("Belajar sambil bermain","بلاجر سمبيل برماٴين")}</span>
          <h2>${tx("Zon Arked 3D","زون ارکيد 3D")}</h2>
        <p>${tx("Permainan aksi 3D mengikut dunia setiap subjek: padang pasir Sirah, masjid Feqah, lautan Tauhid, kampung Akhlak, kolam Arab, angkasa Tajwid dan kereta api Hafazan. Main sendiri atau lawan pasukan dalam kelas!","ڤرماٴينن اکسي 3D مڠيکوت دنيا ستياڤ سوبجيک: ڤادڠ ڤاسير سيره، مسجد فقه، لاءوتن توحيد، کامڤوڠ اخلاق، کولم عرب، اڠکاس تجويد دان کريتا اڤي حفظن. ماٴين سنديري اتاو لاون ڤاسوقن دالم کلس!")}</p>
          <ul class="feats"><li>🎮 ${tx("6 permainan 3D setiap dunia","6 ڤرماٴينن 3D ستياڤ دنيا")}</li><li>🏆 ${tx("Papan pendahulu","ڤاڤن ڤندهولو")}</li><li>🏫 ${tx("Mod kelas & duel","مود کلس & دوايل")}</li></ul>
          </div>
        <div class="orbit" aria-hidden="true"><b>🕹️</b>${orbit}</div>
      </div>
      <h3>🌍 ${tx("Pilih dunia untuk bermain","ڤيليه دنيا اونتوق برماٴين")}</h3>
      <div class="arcgrid">${cards}</div>
    </section>`;
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
      if(b.dataset.act==="install" && window.KafaPWA){ KafaPWA.install().then(o=>{ if(o==="manual") iosGuide(); }); }
      if(b.dataset.act==="pwahide"){ kSave("kafa-pwa-hide", Date.now() + 7*864e5); const p = document.getElementById("pwa"); if(p) p.outerHTML = '<div id="pwa"></div>'; }
      if(b.dataset.act==="ytab"){ yTab = b.dataset.t; try{ history.replaceState(null, "", yTab==="arcade" ? "#arked" : location.pathname); }catch(err){} draw(); window.scrollTo(0,0); }
      if(b.dataset.act==="buy"){ KafaAccess.sheet(+b.dataset.y, {onCode:()=>redeemFlow(+b.dataset.y)}); }
      if(b.dataset.act==="redeem"){ redeemFlow(+b.dataset.y); }
      if(b.dataset.act==="relogin"){ relogin(+b.dataset.y); }
      if(b.dataset.act==="soon"){ toast(tx(`${b.dataset.name} akan datang, insya-Allah.`,`${b.dataset.name} اکن داتڠ، ان شاء الله.`)); }
    });
    // kad dunia condong mengikut tetikus / jari (dimatikan jika pengguna memilih kurang animasi)
    const calm = (()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } })();
    if(!calm){
      app.addEventListener("pointermove", e=>{
        if(e.pointerType!=="mouse") return; // jari/pen: tiada condong (elak halaman melebar semasa menatal)
        const c = e.target.closest(".tilt"); if(!c) return;
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg"); c.style.setProperty("--ry", (x * 12).toFixed(2) + "deg");
        c.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(0) + "%");
      });
      app.addEventListener("pointerout", e=>{ const c = e.target.closest(".tilt"); if(c && !c.contains(e.relatedTarget)){ c.style.removeProperty("--rx"); c.style.removeProperty("--ry"); } });
    }
    // akses berbayar: lukis semula bila berubah; selepas log masuk, semak pembelian dan teruskan tebus kod jika diminta
    if(page==="year" && window.KafaAccess){
      document.addEventListener("kafa-access", ()=>draw());
      if(window.KafaAuth && KafaAuth.on) KafaAuth.onChange(async ()=>{ KafaAuth.loading(true, tx("Menyemak pembelian","مڽمق ڤمبليان")); await syncAccess(); KafaAuth.loading(false); if(redeemYear && KafaAuth.uid){ const y2 = redeemYear; redeemYear = null; codeSheet(y2); } });
      syncAccess().then(()=>{ if(location.hash==="#kod"){ try{ history.replaceState(null, "", location.pathname); }catch(err){} redeemFlow(year); } });
    }
    document.addEventListener("kafa-pwa", ()=>{ const p = document.getElementById("pwa"); if(p) p.outerHTML = installCard(); });
    document.addEventListener("click", e=>{ if(e.target.closest('[data-act="iosclose"]') || e.target.classList.contains("iosg")) document.querySelectorAll(".iosg").forEach(x=>x.remove()); });
    draw();
  }
};
