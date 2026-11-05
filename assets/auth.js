// Log masuk (Clerk) dan panggilan API bersama untuk Zon Arked dan Papan Pemuka Guru.
// Perlukan assets/config.js dimuatkan dahulu. Tanpa kunci Clerk, atau jika dibuka dari fail, KafaAuth.on = false.
// Gaya pemuat dikongsi: pusingan kecil dalam butang, skrin pemuat (cincin pelangi + maskot) dan kerangka berkilau.
(() => {
  const st = document.createElement("style");
  st.textContent = `
.kspin{display:inline-block;width:1em;height:1em;border-radius:50%;border:.17em solid currentColor;border-right-color:transparent;vertical-align:-.14em;animation:kspin .7s linear infinite;margin-inline-end:.4em}
@keyframes kspin{to{transform:rotate(360deg)}}
.kbusy{cursor:progress!important;opacity:.88}
.kload{position:fixed;inset:0;z-index:95;display:grid;place-items:center;padding:16px;background:rgba(10,8,25,.45);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);animation:kfade .2s ease}
@keyframes kfade{from{opacity:0}}
.kload .kbox{display:flex;flex-direction:column;align-items:center;gap:12px;min-width:200px;padding:22px 28px;border-radius:26px;background:#fff;color:#1E1640;box-shadow:0 14px 40px rgba(0,0,0,.35);font-weight:800;font-size:18px;text-align:center;animation:kpop .3s ease}
@keyframes kpop{from{transform:scale(.85)}}
.kload .kwrap{position:relative;width:84px;height:84px}
.kload .kring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(#F97316,#EC4899,#8B5CF6,#06B6D4,#22C55E,#FACC15,#F97316);
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 calc(100% - 8px));mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 calc(100% - 8px));animation:kspin 1s linear infinite}
.kload .kemo{position:absolute;inset:0;display:grid;place-items:center;font-size:38px;animation:kbob 1s ease-in-out infinite}
@keyframes kbob{50%{transform:translateY(-6px)}}
.kload .kdots::after{content:"";animation:kdots 1.2s steps(4) infinite}
@keyframes kdots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}}
.kskel{display:block;height:1.1em;border-radius:10px;background:linear-gradient(90deg,rgba(127,127,127,.16) 25%,rgba(127,127,127,.34) 50%,rgba(127,127,127,.16) 75%);background-size:200% 100%;animation:kshim 1.2s linear infinite}
@keyframes kshim{to{background-position:-200% 0}}
@media (prefers-reduced-motion: reduce){.kspin,.kload .kring,.kload .kemo,.kskel{animation:none}}`;
  (document.head || document.documentElement).appendChild(st);
})();

window.KafaAuth = (() => {
  const CFG = window.KAFA_CONFIG || {};
  const A = {
    on: !!CFG.clerkKey && /^https?:$/.test(location.protocol),
    clerk: null, uid: null, failed: false, _p: null, _fns: [],
    init() {
      if (!A.on) return Promise.resolve(null);
      if (!A._p) A._p = (async () => {
        // kunci publishable mengandungi domain Frontend API Clerk (base64, berakhir dengan "$")
        const fapi = atob(CFG.clerkKey.split("_")[2]).replace(/\$$/, "");
        await new Promise((res, rej) => { const s = document.createElement("script");
          s.src = `https://${fapi}/npm/@clerk/clerk-js@5/dist/clerk.browser.js`; s.async = true; s.crossOrigin = "anonymous";
          s.setAttribute("data-clerk-publishable-key", CFG.clerkKey); s.onload = res; s.onerror = rej; document.head.appendChild(s); });
        await window.Clerk.load();
        A.clerk = window.Clerk; A.uid = A.clerk.user ? A.clerk.user.id : null;
        A.clerk.addListener(({ user }) => { const id = user ? user.id : null; if (id !== A.uid) { A.uid = id; A._fns.forEach(f => f()); } });
        return A.clerk;
      })().catch(e => { console.warn("Clerk", e); A.failed = true; return null; });
      return A._p;
    },
    onChange(f) { A._fns.push(f); },
    // Skrin pemuat penuh: KafaAuth.loading(true, "Menyimpan", "🐪") ... KafaAuth.loading(false)
    loading(on, text, emo) {
      let el = document.getElementById("kload");
      if (!on) { if (el) el.remove(); return; }
      if (!el) { el = document.createElement("div"); el.id = "kload"; el.className = "kload"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite"); document.body.appendChild(el); }
      el.innerHTML = `<div class="kbox"><div class="kwrap"><span class="kring"></span><span class="kemo">${emo || "🐪"}</span></div><span class="kdots">${text || ""}</span></div>`;
    },
    // Butang sedang menunggu pelayan: pusingan kecil, tidak boleh ditekan dua kali
    busy(btn, on, text) {
      if (!btn) return;
      if (on) { if (btn.dataset.klabel == null) btn.dataset.klabel = btn.innerHTML; btn.disabled = true; btn.classList.add("kbusy"); btn.setAttribute("aria-busy", "true");
        btn.innerHTML = `<span class="kspin" aria-hidden="true"></span>${text || btn.dataset.klabel}`; }
      else { if (btn.dataset.klabel != null) { btn.innerHTML = btn.dataset.klabel; delete btn.dataset.klabel; } btn.disabled = false; btn.classList.remove("kbusy"); btn.removeAttribute("aria-busy"); }
    },
    async signIn(text, emo) {
      if (!A.clerk) { A.loading(true, text, emo); await A.init(); A.loading(false); }
      if (A.clerk) A.clerk.openSignIn({});
      return !!A.clerk;
    },
    async signOut(text, emo) {
      if (!A.clerk) return;
      A.loading(true, text, emo);
      try { await A.clerk.signOut(); } finally { A.loading(false); }
    },
    // ralat membawa status HTTP dan kod (cth. "rude-name") supaya laman boleh memaparkan mesej Rumi/Jawi
    async api(path, body) {
      const h = { "Content-Type": "application/json" };
      const t = A.clerk && A.clerk.session ? await A.clerk.session.getToken() : null;
      if (t) h.Authorization = "Bearer " + t;
      const r = await fetch("/api/" + path, { method: body ? "POST" : "GET", headers: h, body: body ? JSON.stringify(body) : undefined });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw Object.assign(new Error(j.error || "Ralat"), { status: r.status, code: j.code });
      return j;
    }
  };
  return A;
})();
