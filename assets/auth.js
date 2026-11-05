// Log masuk (Clerk) dan panggilan API bersama untuk Zon Arked dan Papan Pemuka Guru.
// Perlukan assets/config.js dimuatkan dahulu. Tanpa kunci Clerk, atau jika dibuka dari fail, KafaAuth.on = false.
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
    signIn() { if (A.clerk) A.clerk.openSignIn({}); },
    signOut() { if (A.clerk) A.clerk.signOut(); },
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
