# Jom Belajar KAFA

Portal permainan pembelajaran untuk murid KAFA, Tahun 1 hingga Tahun 6.

## Cara buka

Klik dua kali `index.html` untuk buka dalam pelayar (Chrome/Edge). Tidak perlu internet, kecuali untuk memuatkan fon.

## Struktur folder

```
kafa/
├── index.html            ← Laman utama (pilih Tahun 1 hingga 6)
├── assets/
│   ├── kafa.css          ← Gaya bersama
│   ├── kafa.js           ← Senarai subjek dan game yang sudah siap
│   ├── config.js         ← Kunci awam Clerk (leaderboard)
│   ├── auth.js           ← Log masuk Clerk + panggilan /api (dikongsi Zon Arked & papan pemuka guru)
│   ├── pwa.js            ← Daftar service worker + butang "Pasang JOM KAFA"
│   ├── access.js         ← Akses berbayar ikut tahun: kunci versi percubaan + tetingkap beli
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
├── admin/index.html      ← Admin: jana kod pengaktifan, beri akses, lihat pembelian
├── guru/index.html       ← Papan Pemuka Guru (kemajuan murid, soalan kerap salah, urus nama murid)
├── privasi.html          ← Dasar Privasi
├── manifest.webmanifest  ← Web app (PWA): nama JOM KAFA, ikon, warna
├── assets/huruf/        ← Sebutan nama huruf (MP3) untuk Jawi Tahun 1
├── sw.js                 ← Service worker: simpan halaman & permainan untuk main tanpa internet
├── icons/                ← Ikon aplikasi (192, 512, maskable, Apple, favicon)
├── api/                  ← API (Vercel Functions): me, class, score, leaderboard, dashboard
├── sql/schema.sql        ← Skema pangkalan data Neon
├── package.json          ← Kebergantungan API (@neondatabase/serverless, @clerk/backend)
├── tahun1/
│   ├── index.html        ← Senarai subjek Tahun 1
│   ├── akhlak/
│   │   └── index.html    ← Game Pokok Adab Hoho (Akhlak Tahun 1, reka bentuk berbeza daripada Tahun 3)
│   ├── jawi/index.html   ← Game Zoo Huruf Jaja (Jawi Tahun 1)
│   ├── feqah/index.html  ← Game Pulau Titisan Suci (Feqah Tahun 1)
│   ├── tauhid/index.html ← Game Taman Bunga Iman (Tauhid Tahun 1)
│   ├── arab/index.html   ← Game Karnival Kalimah (Bahasa Arab Tahun 1)
│   └── hafazan/index.html← Game Belon Udara Hafiz (Hafazan Tahun 1)
├── tahun2/
│   ├── index.html        ← Senarai subjek Tahun 2
│   ├── akhlak/index.html ← Game Dapur Adab Chef Mimi (Akhlak Tahun 2)
│   ├── jawi/index.html   ← Game Pejabat Pos Huruf (Jawi Tahun 2)
│   ├── feqah/index.html  ← Game Istana Suci Naga Nana (Feqah Tahun 2)
│   ├── tauhid/index.html ← Game Ladang Tuai Iman (Tauhid Tahun 2)
│   ├── arab/index.html   ← Game Bas Sekolah Kalimah (Bahasa Arab Tahun 2)
│   └── hafazan/index.html← Game Sampan Hafiz (Hafazan Tahun 2)
├── tahun4/
│   ├── index.html        ← Senarai subjek Tahun 4
│   ├── akhlak/index.html ← Game Hari Sukan Adab (Akhlak Tahun 4)
│   ├── tajwid/index.html ← Game Makmal Tajwid (Tajwid Tahun 4)
│   ├── sirah/index.html ← Game Muzium Sirah (Sirah Tahun 4)
│   ├── hafazan/index.html ← Game Ekspedisi Hutan Hafiz (Hafazan Tahun 4)
│   ├── arab/index.html ← Game Lapangan Terbang Lughah (Bahasa Arab Tahun 4)
│   ├── tauhid/index.html ← Game Daki Gunung Iman (Tauhid Tahun 4)
│   ├── jawi/index.html ← Game Detektif Aksara (Jawi Tahun 4)
│   ├── feqah/index.html ← Game Kem Pengakap Feqah (Feqah Tahun 4)
├── tahun5/
│   ├── index.html        ← Senarai subjek Tahun 5
│   ├── tajwid/index.html ← Game Orkestra Tajwid (Tajwid Tahun 5)
│   ├── sirah/index.html ← Game Perpustakaan Sirah (Sirah Tahun 5)
│   ├── hafazan/index.html ← Game Rumah Api Hafiz (Hafazan Tahun 5)
│   ├── arab/index.html ← Game Pasar Terapung Lughah (Bahasa Arab Tahun 5)
│   ├── tauhid/index.html ← Game Balai Cerap Iman (Tauhid Tahun 5)
│   ├── feqah/index.html ← Game Stesen Cuaca Feqah (Feqah Tahun 5)
│   ├── jawi/index.html ← Game Kapal Selam Aksara (Jawi Tahun 5)
│   ├── akhlak/index.html ← Game Studio Rakaman Adab (Akhlak Tahun 5)
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
- Nama samaran dan nama kelas yang mengandungi perkataan kasar ditolak (penapis dalam `api/_lib.js`).
- **Papan Pemuka Guru** (`/guru/`): pemilik kelas melihat skor murid ikut subjek, aktiviti 14 hari dan soalan paling kerap salah,
  serta boleh menukar nama murid (nama itu dikunci) atau mengeluarkan murid. Dibuka melalui 👤 → kelas → 📊 Papan pemuka.

## Web app (PWA) — JOM KAFA

Portal boleh dipasang seperti aplikasi di telefon, tablet dan iPad:
- **Android / Chrome / Edge:** kad **📲 Pasang JOM KAFA** di laman utama membuka tetingkap pasang.
- **iPhone / iPad (Safari):** kad yang sama memaparkan panduan *Kongsi → Tambah ke Skrin Utama*.

`sw.js` menyimpan semua halaman, permainan dan three.js semasa dibuka kali pertama, jadi pelajaran dan Zon Arked boleh dimain
tanpa internet. Log masuk dan papan pendahulu masih perlukan internet.
- Halaman (HTML) diambil dari rangkaian dahulu, jadi kemas kini terus kelihatan apabila ada internet.
- Gaya/skrip diambil dari cache dahulu dan dikemas kini di latar belakang (versi baharu kelihatan pada bukaan seterusnya).
- Jika menambah halaman baharu, tambah laluannya dalam `CORE` di `sw.js` dan naikkan `VERSION`.
- Setiap halaman baharu perlu tag PWA dalam `<head>` (salin daripada `index.html`: manifest, ikon, `/assets/pwa.js`).

## Jualan ikut tahun (kod pengaktifan)

Setiap tahun dibeli sekali dan dibuka seumur hidup untuk akaun Google pembeli.
- **Versi percubaan** (`trial` dalam `assets/config.js`): Tahun 3 → subjek Sirah tajuk pertama + Zon Arked dunia Sirah permainan pertama.
  Tahun yang tiada dalam `trial` dibuka seperti biasa (belum dijual).
- **Harga & WhatsApp** (`shop` dalam `assets/config.js`): nombor WhatsApp untuk butang "Beli" dan harga yang dipaparkan.
- **Admin** (`/admin/`): tambah pemboleh ubah Vercel `ADMIN_EMAILS` = e-mel Google admin (pisahkan dengan koma), kemudian redeploy.
  Di situ: senarai **Pengguna** (e-mel, log masuk terakhir, aktif terakhir, tahun dibeli, main Zon Arked, tarikh daftar; carian e-mel, 50 sehalaman, CSV) dengan statistik (jumlah, log masuk 24 jam / 7 / 30 hari, baharu 7 hari, pembeli), jana kod (contoh 40 kod untuk satu kelas), salin/CSV, beri akses terus kepada e-mel, padam kod yang belum digunakan.
  Data log masuk datang daripada Clerk (`CLERK_SECRET_KEY`), jadi pengguna yang log masuk sebelum ciri ini dibina juga tersenarai.
- **Pembeli**: Laman Tahun → "Masukkan kod" → log masuk Google → taip kod `T3-XXXX-XXXX`.
- Kunci dibuat di peranti (tahun yang dibeli disemak dengan pelayan dan disimpan di peranti); pengguna yang mahir teknikal masih boleh memintasnya.
