// Service worker JOM KAFA: simpan halaman, gaya, skrip dan three.js supaya boleh main tanpa internet.
// Tukar VERSION setiap kali mahu memaksa semua peranti memuat turun semula fail teras.
const VERSION = "jomkafa-v14";
const CORE = [
  "/", "/index.html", "/privasi.html", "/manifest.webmanifest",
  "/assets/kafa.css", "/assets/kafa.js", "/assets/config.js", "/assets/auth.js", "/assets/pwa.js", "/assets/access.js", "/assets/vendor/three.min.js",
  "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png", "/icons/favicon.png",
  "/tahun1/index.html", "/tahun2/index.html", "/tahun3/index.html", "/tahun4/index.html", "/tahun5/index.html", "/tahun6/index.html",
  "/tahun1/akhlak/index.html", "/tahun1/jawi/index.html", "/tahun1/feqah/index.html", "/tahun1/tauhid/index.html", "/tahun1/arab/index.html", "/tahun1/hafazan/index.html", "/tahun2/akhlak/index.html", "/tahun2/jawi/index.html", "/tahun2/feqah/index.html",
  "/tahun3/sirah/index.html", "/tahun3/feqah/index.html", "/tahun3/tauhid/index.html", "/tahun3/akhlak/index.html",
  "/tahun3/arab/index.html", "/tahun3/tajwid/index.html", "/tahun3/hafazan/index.html", "/tahun3/arked/index.html",
  "/guru/index.html"
];
// sebutan nama huruf (Jawi Tahun 1) supaya boleh didengar tanpa internet
const HURUF = ["u0621.mp3", "u0627.mp3", "u0628.mp3", "u0629.mp3", "u062a.mp3", "u062b.mp3", "u062c.mp3", "u062d.mp3", "u062e.mp3", "u062f.mp3", "u0630.mp3", "u0631.mp3", "u0632.mp3", "u0633.mp3", "u0634.mp3", "u0635.mp3", "u0636.mp3", "u0637.mp3", "u0638.mp3", "u0639.mp3", "u063a.mp3", "u0641.mp3", "u0642.mp3", "u0643.mp3", "u0644.mp3", "u0645.mp3", "u0646.mp3", "u0647.mp3", "u0648.mp3", "u0649.mp3", "u064a.mp3", "u0686.mp3", "u06a0.mp3", "u06a4.mp3", "u06ac.mp3", "u06bd.mp3", "u06cf.mp3"].map(f => "/assets/huruf/" + f);
const FONTS = "jomkafa-fonts";

self.addEventListener("install", e => {
  // cache: "reload" supaya fail baharu diambil terus dari pelayan, bukan cache HTTP pelayar
  e.waitUntil(caches.open(VERSION).then(c => Promise.all([...CORE, ...HURUF].map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// "/tahun3/" dan "/tahun3/index.html" ialah halaman yang sama
const norm = url => { const u = new URL(url); if (u.pathname.endsWith("/")) u.pathname += "index.html"; u.search = ""; u.hash = ""; return u.href; };

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  // fon Google: cache dahulu (jarang berubah)
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }))));
    return;
  }
  // API, log masuk Clerk dan domain luar lain: sentiasa dari rangkaian
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;

  const key = norm(req.url);
  if (req.mode === "navigate" || req.destination === "document") {
    // halaman: rangkaian dahulu (kandungan terkini), cache jika tiada internet
    e.respondWith(fetch(req).then(r => { if (r.ok && !r.redirected) caches.open(VERSION).then(c => c.put(key, r.clone())); return r; })
      .catch(() => caches.match(key).then(hit => hit || caches.match("/index.html"))));
    return;
  }
  // gaya, skrip, ikon, three.js: cache dahulu, kemas kini di latar belakang
  e.respondWith(caches.open(VERSION).then(c => c.match(key).then(hit => {
    const net = fetch(req).then(r => { if (r.ok) c.put(key, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
