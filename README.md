# Jom Belajar KAFA

Portal permainan pembelajaran untuk murid KAFA, Tahun 3 hingga Tahun 6.

## Cara buka

Klik dua kali `index.html` untuk buka dalam pelayar (Chrome/Edge). Tidak perlu internet, kecuali untuk memuatkan fon.

## Struktur folder

```
kafa/
├── index.html            ← Laman utama (pilih Tahun 3, 4, 5, 6)
├── assets/
│   ├── kafa.css          ← Gaya bersama
│   ├── kafa.js           ← Senarai subjek dan game yang sudah siap
│   ├── config.js         ← Kunci awam Clerk (leaderboard)
│   └── vendor/
│       └── three.min.js  ← three.js r128 untuk Zon Arked 3D (boleh main tanpa internet)
├── tahun3/
│   ├── index.html        ← Senarai subjek Tahun 3
│   ├── sirah/
│   │   └── index.html    ← Game Pengembaraan Sirah
│   ├── feqah/
│   │   └── index.html    ← Game Jom Bina Masjid (Feqah)
│   ├── tauhid/
│   │   └── index.html    ← Game Kembara Lautan Iman (Tauhid)
│   ├── akhlak/
│   │   └── index.html    ← Game Jalan-jalan Kampung Akhlak (Akhlak)
│   ├── arab/
│   │   └── index.html    ← Game Lompat Katak (Bahasa Arab)
│   ├── tajwid/
│   │   └── index.html    ← Game Angkasa Tajwid (Tajwid)
│   ├── hafazan/
│   │   └── index.html    ← Game Kereta Api Hafazan (Hafazan)
│   └── arked/
│       └── index.html    ← Zon Arked 3D: 6 permainan bertema dunia setiap subjek (?s=idSubjek)
├── api/                  ← API leaderboard (Vercel Functions): me, class, score, leaderboard
├── sql/schema.sql        ← Skema pangkalan data Neon
├── package.json          ← Kebergantungan API (@neondatabase/serverless, @clerk/backend)
├── tahun4/index.html
├── tahun5/index.html
└── tahun6/index.html
```

## Cara tambah subjek baharu (contoh: Hafazan Tahun 3)

1. Buat folder `tahun3/hafazan/` dan letak fail game sebagai `index.html`.
2. Buka `assets/kafa.js` dan tambah satu baris dalam `READY`:

```js
"3/hafazan": {
  path:"hafazan/index.html",
  r:"Hafazan Ceria", j:"حفظن چرياء",
  dr:"Hafal surah pilihan", dj:"حفظ سورة ڤيليهن"
},
```

3. Simpan. Kad Hafazan di Tahun 3 akan bertukar daripada "Akan datang" kepada boleh dimainkan.

Id subjek yang tersedia: `sirah`, `quran`, `tajwid`, `hafazan`, `tauhid`, `feqah`, `akhlak`, `jawi`, `arab`.
Untuk menambah subjek lain, tambah dalam senarai `SUBJECTS` dalam fail yang sama.

Dalam game baharu, letak butang kembali dengan pautan `../index.html` supaya murid boleh kembali ke senarai subjek.

## Tulisan Jawi / Rumi

Butang "Rumi"/"جاوي" di bahagian atas menukar tulisan. Pilihan ini dikongsi dengan game Sirah (disimpan sebagai `kafa-lang`).

## Letak di GitHub Pages

Upload seluruh isi folder `kafa` ke repo (fail `index.html` mesti berada di folder utama repo), kemudian aktifkan Settings → Pages → branch `main`, folder `/ (root)`.

## Papan Pendahulu (Zon Arked)

Leaderboard menggunakan **Clerk** (log masuk Google), **Neon** (Postgres) dan **Vercel Functions** (folder `api/`).
Jika `assets/config.js` tiada kunci, atau laman dibuka terus dari fail, leaderboard disembunyikan dan permainan tetap berfungsi.

1. **Neon** — cipta projek di neon.tech, salin *connection string* (`postgresql://…?sslmode=require`).
   Jadual dicipta automatik pada panggilan API pertama (atau jalankan `sql/schema.sql`).
2. **Clerk** — cipta aplikasi di clerk.com, hidupkan **Google** sahaja di *User & Authentication → SSO connections*,
   matikan e-mel/kata laluan jika mahu Google sahaja. Salin *Publishable key* dan *Secret key*.
3. **Vercel** — import repo ini. Di *Settings → Environment Variables* tambah:
   - `DATABASE_URL` = connection string Neon
   - `CLERK_SECRET_KEY` = secret key Clerk (`sk_…`)
4. Letak publishable key (`pk_…`) dalam `assets/config.js`, kemudian deploy.
5. Untuk domain sendiri dengan kunci *production* Clerk, tambah domain itu dalam Clerk Dashboard → Domains.

Cara guna:
- Murid log masuk dengan Google (akaun ibu bapa), pilih **nama samaran** — nama sebenar Google tidak dipaparkan.
- Guru log masuk, buka 👤 → *Untuk guru: cipta kelas*, dan kongsi kod 6 aksara dengan murid.
- Hanya skor **Main Sendiri** dihantar. Pelayan menolak skor yang mustahil dan menghadkan kekerapan hantar.
