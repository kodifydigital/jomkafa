# Sebutan huruf (assets/huruf)
Satu fail bagi setiap huruf, dinamakan ikut kod Unicode huruf itu (contoh: ب U+0628 → u0628.mp3).
- Semua huruf Jawi (termasuk hijaiyah): suara lelaki Malaysia (Microsoft Neural ms-MY-OsmanNeural), sebutan ikut video rujukan Zul (YouTube ePbqMtyuat8, "Belajar Jawi : Huruf-Huruf Jawi"): alif, ba, ta, ta marbutoh, tsa, jim, ca, ha, kho, dal, zal, ro, zai, sin, syin, sod, dhod, tho, zo, ain, ghain, nga, fa, pa, qof, kaf, ga, lam, mim, nun, wau, va, ha, hamzah, ya, ye, nya.
- Skrip penjana: ~/kafa-tools/gen_huruf_ms.py (edge-tts).
- Pengecualian: lam (u0644) dipotong daripada perkataan "Islam" (suara Osman, kadar -40%, ~/kafa-tools/cut_tail.py) kerana suara ini menyebut "lam" seperti "lem", "laam" seperti "la-am" dan "laem" seperti "laim". Mim dijana dengan ejaan "miim". Nun (u0646) guna suara Arab ar-JO-TaimNeural, teks نُونْ, kerana suara Melayu menyebutnya seperti "nen".

Untuk guna rakaman ustaz/ustazah sendiri: rakam setiap huruf, simpan sebagai MP3 dengan nama fail yang sama, dan gantikan fail di sini. Kod permainan tidak perlu diubah.
