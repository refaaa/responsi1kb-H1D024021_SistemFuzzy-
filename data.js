
/* ── Bobot per parameter (total = 1.0) ─── */
const WEIGHTS = [0.30, 0.25, 0.25, 0.20];

/* ── Representasi crisp (untuk defuzzifikasi) ─── */
const CRISP_REPR = { rendah: 15, sedang: 50, tinggi: 85 };

/* ── Threshold klasifikasi skor akhir ─── */
const THRESHOLD = { sehat: 30, kurang: 55, nutrisi: 72 };
// < 30     → Sehat
// 30–54    → Kekurangan Nutrisi / Kurang Sehat
// 55–71    → Terinfeksi
// ≥ 72     → Kelebihan Air / Tidak Sehat

/* ── Rekomendasi per kondisi ─── */
const REC_DB = {

  sehat: [
    {
      icon: "<i class='fas fa-tint' style='color:#0288d1;'></i>", cat: "Penyiraman",
      text: "Pertahankan pola penyiraman 2x sehari — pagi dan sore. Jangan terlalu basah atau terlalu kering.",
      border: "border-green"
    },
    {
      icon: "<i class='fas fa-leaf' style='color:#2e7d32;'></i>", cat: "Pemupukan",
      text: "Lanjutkan pemupukan NPK seimbang setiap 2 minggu. Tanamanmu sudah bagus, pertahankan!",
      border: "border-green"
    },
    {
      icon: "<i class='fas fa-sun' style='color:#f9a825;'></i>", cat: "Paparan Cahaya",
      text: "Pastikan tanaman mendapat sinar matahari 6–8 jam per hari untuk pertumbuhan optimal.",
      border: "border-green"
    },
    {
      icon: "<i class='fas fa-search' style='color:#546e7a;'></i>", cat: "Monitoring Rutin",
      text: "Tetap periksa hama dan penyakit setiap minggu meski kondisi sedang bagus sebagai langkah preventif.",
      border: "border-green"
    }
  ],

  terinfeksi: [
    {
      icon: "<i class='fas fa-bell' style='color:#d32f2f;'></i>", cat: "Isolasi Segera",
      text: "Pisahkan tanaman yang terinfeksi dari tanaman sehat untuk mencegah penyebaran lebih luas.",
      border: "border-red"
    },
    {
      icon: "<i class='fas fa-spray-can' style='color:#2e7d32;'></i>", cat: "Pestisida",
      text: "Semprotkan pestisida sistemik (imidakloprid / mankozeb) setiap 5–7 hari hingga gejala hilang.",
      border: "border-red"
    },
    {
      icon: "<i class='fas fa-cut' style='color:#5d4037;'></i>", cat: "Pemangkasan",
      text: "Pangkas dan buang bagian daun yang rusak, bercak, atau menunjukkan tanda infeksi jamur/bakteri.",
      border: "border-orange"
    },
    {
      icon: "<i class='fas fa-wind' style='color:#81d4fa;'></i>", cat: "Sirkulasi Udara",
      text: "Perbaiki sirkulasi udara di sekitar tanaman dan hindari penyiraman daun secara langsung.",
      border: "border-orange"
    }
  ],

  nutrisi: [
    {
      icon: "<i class='fas fa-seedling' style='color:#2e7d32;'></i>", cat: "Tambah Pupuk",
      text: "Berikan pupuk daun mengandung Nitrogen (N), Magnesium (Mg), dan Besi (Fe) untuk memperbaiki warna daun.",
      border: "border-orange"
    },
    {
      icon: "<i class='fas fa-flask' style='color:#7b1fa2;'></i>", cat: "Cek pH Tanah",
      text: "Ukur pH tanah — tanaman cabai optimal di pH 6.0–7.0. Jika terlalu asam/basa, nutrisi tidak terserap baik.",
      border: "border-orange"
    },
    {
      icon: "<i class='fas fa-worm' style='color:#795548;'></i>", cat: "Perbaiki Media Tanam",
      text: "Campurkan kompos organik atau vermikompos ke media tanam untuk meningkatkan ketersediaan nutrisi.",
      border: "border-green"
    },
    {
      icon: "<i class='fas fa-sun' style='color:#f9a825;'></i>", cat: "Optimasi Cahaya",
      text: "Kurang cahaya bisa menyebabkan daun menguning. Pastikan tanaman tidak ternaungi sepanjang hari.",
      border: "border-green"
    }
  ],

  air: [
    {
      icon: "<i class='fas fa-shower' style='color:#0288d1;'></i>", cat: "Kurangi Penyiraman",
      text: "Segera kurangi frekuensi penyiraman. Cek kelembapan tanah sebelum menyiram — tanah harus agak kering.",
      border: "border-blue"
    },
    {
      icon: "<i class='fas fa-hole' style='color:#8d6e63;'></i>", cat: "Perbaiki Drainase",
      text: "Buat lubang drainase tambahan atau ganti media tanam dengan campuran yang lebih porous (pasir + perlite).",
      border: "border-blue"
    },
    {
      icon: "<i class='fas fa-seedling' style='color:#2e7d32;'></i>", cat: "Perawatan Akar",
      text: "Cabut tanaman dengan hati-hati, potong bagian akar busuk, lalu rendam dalam larutan fungisida 30 menit.",
      border: "border-red"
    },
    {
      icon: "<i class='fas fa-arrows-spin' style='color:#546e7a;'></i>", cat: "Ganti Media Tanam",
      text: "Jika kondisi parah, ganti seluruh media tanam dengan tanah steril baru untuk menghilangkan patogen.",
      border: "border-red"
    }
  ]
};