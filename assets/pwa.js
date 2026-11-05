// JOM KAFA sebagai web app (PWA): daftar service worker dan urus butang "Pasang aplikasi".
// Dimuatkan dalam <head> setiap halaman (tanpa defer) supaya KafaPWA sedia sebelum halaman dilukis.
// Matikan zum "ketik dua kali" di semua halaman (contoh: tekan ◀ ▶ dengan pantas di iPhone/iPad).
// touch-action: manipulation masih membenarkan tatal dan zum dua jari untuk kebolehcapaian.
(() => {
  const st = document.createElement("style");
  st.textContent = "html,body,button,a,input,select,label,[data-act]{touch-action:manipulation}";
  (document.head || document.documentElement).appendChild(st);
})();

window.KafaPWA = (() => {
  const ua = navigator.userAgent || "";
  const P = {
    deferred: null,
    // iPhone / iPad (termasuk iPad yang menyamar sebagai Mac)
    ios: /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    standalone: () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true,
    // boleh tunjuk butang pasang? (Android/Chrome/Edge memberi isyarat; iOS sentiasa perlu panduan manual)
    canInstall: () => !P.standalone() && (!!P.deferred || P.ios),
    async install() {
      if (P.deferred) { P.deferred.prompt(); const r = await P.deferred.userChoice.catch(() => null); P.deferred = null; P.emit(); return r && r.outcome; }
      return "manual";
    },
    emit() { document.dispatchEvent(new CustomEvent("kafa-pwa")); }
  };
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); P.deferred = e; P.emit(); });
  window.addEventListener("appinstalled", () => { P.deferred = null; P.emit(); });
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(e => console.warn("SW", e)));
  }
  return P;
})();
