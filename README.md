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
│   └── kafa.js           ← Senarai subjek dan game yang sudah siap
├── tahun3/
│   ├── index.html        ← Senarai subjek Tahun 3
│   ├── sirah/
│   │   └── index.html    ← Game Pengembaraan Sirah
│   └── feqah/
│       └── index.html    ← Game Jom Bina Masjid (Feqah)
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

Id subjek yang tersedia: `sirah`, `quran`, `hafazan`, `tauhid`, `feqah`, `akhlak`, `jawi`, `arab`.
Untuk menambah subjek lain, tambah dalam senarai `SUBJECTS` dalam fail yang sama.

Dalam game baharu, letak butang kembali dengan pautan `../index.html` supaya murid boleh kembali ke senarai subjek.

## Tulisan Jawi / Rumi

Butang "Rumi"/"جاوي" di bahagian atas menukar tulisan. Pilihan ini dikongsi dengan game Sirah (disimpan sebagai `kafa-lang`).

## Letak di GitHub Pages

Upload seluruh isi folder `kafa` ke repo (fail `index.html` mesti berada di folder utama repo), kemudian aktifkan Settings → Pages → branch `main`, folder `/ (root)`.
