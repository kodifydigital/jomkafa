// Tetapan awam portal. Kunci "publishable" Clerk selamat didedahkan (bukan kunci rahsia).
// Biarkan clerkKey kosong untuk menyembunyikan leaderboard (contohnya semasa dibuka terus dari fail).
window.KAFA_CONFIG = {
  clerkKey: "pk_live_Y2xlcmsuam9ta2FmYS5rb2RpZnlkaWdpdGFsLmNvbSQ",   // Clerk Dashboard (Production) → API Keys

  // Jualan ikut tahun (beli sekali, seumur hidup). Pengguna membuka tahun dengan kod pengaktifan.
  shop: {
    whatsapp: "60135818932", // nombor WhatsApp untuk butang "Beli", format antarabangsa tanpa + (contoh: "60123456789")
    price: { 3: "RM65" }     // harga yang dipaparkan, contoh: { 3: "RM 29" }. Kosong = harga tidak dipaparkan
  },

  // Versi percubaan percuma bagi tahun yang dijual. Tahun yang tiada di sini dibuka seperti biasa.
  //   subject: subjek percuma, station: tajuk percuma (0 = tajuk pertama), arcade: satu permainan Zon Arked
  trial: {
    3: { subject: "sirah", station: "0", arcade: { subj: "sirah", game: "whack" } }
  }
};
