// Akses berbayar ikut tahun (beli sekali, seumur hidup) + versi percubaan percuma.
// Tahun yang dibeli disemak dengan pelayan (/api/me) di laman tahun & Zon Arked, kemudian disimpan di peranti
// supaya halaman subjek tahu tanpa perlu log masuk semula (dan masih berfungsi tanpa internet).
// Tetapan harga, nombor WhatsApp dan kandungan percubaan: assets/config.js (shop, trial).
window.KafaAccess = (() => {
  const CFG = window.KAFA_CONFIG || {}, KEY = "kafa-access";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const isJ = () => { try { return (JSON.parse(localStorage.getItem("kafa-lang")) || "jawi") === "jawi"; } catch (e) { return true; } };
  const tx = (r, j) => isJ() ? j : r;
  const A = {
    // tahun yang ada percubaan dalam config = tahun yang dijual; tahun lain dibuka seperti biasa
    trial: y => (CFG.trial || {})[y] || null,
    sold: y => !!A.trial(y),
    has: y => !A.sold(y) || (read().years || []).includes(+y),
    uid: () => read().uid || null,
    set(uid, years) { try { localStorage.setItem(KEY, JSON.stringify({ uid, years: years || [], t: Date.now() })); } catch (e) {} document.dispatchEvent(new CustomEvent("kafa-access")); },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} document.dispatchEvent(new CustomEvent("kafa-access")); },
    canSubject: (y, s) => A.has(y) || (A.trial(y) || {}).subject === s,
    canStation: (y, s, i) => A.has(y) || ((A.trial(y) || {}).subject === s && String(i) === String(A.trial(y).station)),
    canArcade: (y, s, g) => { if (A.has(y)) return true; const a = (A.trial(y) || {}).arcade || {}; return a.subj === s && a.game === g; },
    price: y => ((CFG.shop || {}).price || {})[y] || "",
    waLink(y) {
      const n = String((CFG.shop || {}).whatsapp || "").replace(/\D/g, "");
      return n ? `https://wa.me/${n}?text=${encodeURIComponent(`Assalamualaikum, saya mahu membeli JOM KAFA Tahun ${y}.`)}` : "";
    },
    // Tetingkap "Buka penuh Tahun N". opts.onCode: fungsi untuk "Saya ada kod" (laman tahun); jika tiada, ke laman tahun #kod
    sheet(y, opts = {}) {
      document.querySelectorAll(".kbuy").forEach(x => x.remove());
      const d = document.createElement("div"); d.className = "kbuy"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
      const wa = A.waLink(y), price = A.price(y);
      d.innerHTML = `<div class="kcard">
        ${opts.lockPage ? "" : `<button class="kx" data-k="close" aria-label="${tx("Tutup", "توتوڤ")}">✕</button>`}
        <div class="klock">🔒</div>
        <h2>${tx(`Buka penuh Tahun ${y}`, `بوک ڤنوه تاهون ${y}`)}</h2>
        <p class="kmsg">${opts.msg || tx("Bahagian ini untuk pengguna yang telah membeli. Versi percuma: subjek Sirah (tajuk pertama) dan satu permainan Zon Arked.",
          "بهاڬين اين اونتوق ڤڠڬونا يڠ تله ممبلي. ۏرسي ڤرچوما: سوبجيک سيره (تاجوق ڤرتام) دان ساتو ڤرماٴينن زون ارکيد.")}</p>
        <ul class="kperks"><li>✅ ${tx("Semua subjek dan semua tajuk", "سموا سوبجيک دان سموا تاجوق")}</li>
          <li>✅ ${tx("Zon Arked penuh: semua dunia & permainan 3D", "زون ارکيد ڤنوه: سموا دنيا & ڤرماٴينن 3D")}</li>
          <li>✅ ${tx("Bayar sekali, guna seumur hidup", "باير سکالي، ڬونا سأومور هيدوڤ")}</li></ul>
        ${price ? `<div class="kprice">${price} <small>${tx("sekali bayar", "سکالي باير")}</small></div>` : ""}
        ${wa ? `<a class="kbtn wa" href="${wa}" target="_blank" rel="noopener">💬 ${tx("Beli melalui WhatsApp", "بلي ملالوٴي WhatsApp")}</a>` : ""}
        <button class="kbtn code" data-k="code">🔑 ${tx("Saya ada kod pengaktifan", "ساي اد کود ڤڠکتيفن")}</button>
        ${opts.lockPage ? `<a class="kbtn alt" href="/tahun${y}/index.html">${isJ() ? "→" : "←"} ${tx(`Kembali ke Tahun ${y}`, `کمبالي ک تاهون ${y}`)}</a>` : ""}
        <p class="ksmall">${tx("Sudah membeli? Masukkan kod atau log masuk dengan akaun yang sama di laman Tahun " + y + ".", "سوده ممبلي؟ ماسوقکن کود اتاو لوڬ ماسوق دڠن اکاٴون يڠ سام د لامن تاهون " + y + ".")}</p>
      </div>`;
      d.addEventListener("click", e => {
        const k = e.target.closest("[data-k]"); if (!k && e.target !== d) return;
        if (e.target === d && !opts.lockPage) return d.remove();
        if (!k) return;
        if (k.dataset.k === "close") d.remove();
        if (k.dataset.k === "code") { if (opts.onCode) { d.remove(); opts.onCode(); } else location.href = `/tahun${y}/index.html#kod`; }
      });
      document.body.appendChild(d);
      return d;
    }
  };

  // gaya tetingkap beli (dikongsi semua halaman)
  const st = document.createElement("style");
  st.textContent = `
.kbuy{position:fixed;inset:0;z-index:92;display:grid;place-items:center;padding:16px;background:rgba(10,8,25,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:kbin .2s ease;font-family:"Baloo 2","Trebuchet MS",sans-serif}
html[dir="rtl"] .kbuy{font-family:"Noto Naskh Arabic","Amiri","Baloo 2",serif}
@keyframes kbin{from{opacity:0}}
.kbuy .kcard{position:relative;width:min(420px,100%);max-height:92vh;overflow:auto;padding:20px 20px 16px;border-radius:26px;text-align:center;color:#1E1640;background:linear-gradient(180deg,#FFFFFF,#F4F0FF);box-shadow:0 18px 50px rgba(0,0,0,.4);animation:kbpop .3s ease}
@keyframes kbpop{from{transform:scale(.88)}}
.kbuy .kx{position:absolute;z-index:3;top:10px;inset-inline-end:10px;width:36px;height:36px;border-radius:50%;border:2px solid #DCD3F5;background:#fff;font-size:16px;cursor:pointer}
.kbuy .klock{display:inline-block;font-size:46px;line-height:1;animation:kwob 1.6s ease-in-out infinite}
@keyframes kwob{50%{transform:rotate(-10deg) scale(1.08)}}
.kbuy h2{margin:6px 0 4px;font-size:25px;line-height:1.25}
.kbuy .kmsg{margin:0;color:#5F5689;font-size:15.5px;line-height:1.45}
.kbuy .kperks{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:6px;text-align:start;font-weight:700;font-size:16px}
.kbuy .kperks li{background:#fff;border:2px solid #E7E0FA;border-radius:12px;padding:5px 10px}
.kbuy .kprice{margin:12px 0 0;font-size:30px;font-weight:800;color:#7C3AED}
.kbuy .kprice small{font-size:14px;color:#5F5689}
.kbuy .kbtn{display:block;width:100%;margin-top:10px;border:0;border-radius:16px;padding:11px;font:inherit;font-size:18px;font-weight:800;text-decoration:none;cursor:pointer}
.kbuy .kbtn.wa{background:#25D366;color:#063B1B;box-shadow:0 4px 0 #128C4A}
.kbuy .kbtn.code{background:#7C3AED;color:#fff;box-shadow:0 4px 0 #4C1D95}
.kbuy .kbtn.alt{background:#fff;color:#1E1640;border:2px solid #DCD3F5}
.kbuy .ksmall{margin:10px 0 0;font-size:13.5px;color:#5F5689}
.ktrial{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;border:0;border-radius:999px;padding:8px 16px;font:inherit;font-weight:800;font-size:15px;color:#fff;cursor:pointer;
  background:linear-gradient(90deg,#F97316,#EC4899);box-shadow:0 4px 0 #7A1C4F,0 8px 20px rgba(0,0,0,.25);white-space:nowrap}
@media (prefers-reduced-motion: reduce){.kbuy .klock{animation:none}}`;
  (document.head || document.documentElement).appendChild(st);

  // Halaman subjek /tahunN/<subjek>/: kunci subjek berbayar, dan tajuk selain tajuk percubaan
  const m = location.pathname.match(/\/tahun(\d)\/([a-z]+)\//);
  if (m && m[2] !== "arked") {
    const y = +m[1], subj = m[2];
    const guard = () => {
      if (A.has(y)) return;
      if (!A.canSubject(y, subj)) { A.sheet(y, { lockPage: true, msg: tx("Subjek ini dibuka selepas membeli. Versi percuma: subjek Sirah (tajuk pertama).", "سوبجيک اين دبوک سلڤس ممبلي. ۏرسي ڤرچوما: سوبجيک سيره (تاجوق ڤرتام).") }); return; }
      // subjek percubaan: tajuk lain, Cabaran Akhir dan "Mod guru: buka semua" memaparkan tetingkap beli
      document.addEventListener("click", e => {
        if (A.has(y)) return;
        const b = e.target.closest('[data-act="station"],[data-act="teacher"]'); if (!b) return;
        if (b.dataset.act === "station" && A.canStation(y, subj, b.dataset.i)) return;
        e.preventDefault(); e.stopImmediatePropagation();
        A.sheet(y, { msg: tx("Tajuk ini dibuka selepas membeli. Dalam versi percuma, hanya tajuk pertama dibuka.", "تاجوق اين دبوک سلڤس ممبلي. دالم ۏرسي ڤرچوما، هاڽ تاجوق ڤرتام دبوک.") });
      }, true);
      const pill = document.createElement("button"); pill.className = "ktrial"; pill.textContent = "🎁 " + tx("Versi percuma • Buka penuh", "ۏرسي ڤرچوما • بوک ڤنوه");
      pill.addEventListener("click", () => A.sheet(y)); document.body.appendChild(pill);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", guard); else guard();
  }
  return A;
})();
