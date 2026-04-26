/* fuzzy.js — Mesin Logika Fuzzy (Fuzzifikasi & Defuzzifikasi) */

/**
 * FUNGSI KEANGGOTAAN TRAPESOID
 * ─────────────────────────────────────────────────────────────
 * Grafik visualisasi:
 *        ___________
 *       /           \
 *      /             \
 * ____/               \____
 *    a    b       c    d
 *
 * @param {number} x  - nilai input (0–100)
 * @param {number} a  - titik awal naik  (µ mulai dari 0)
 * @param {number} b  - puncak kiri      (µ = 1)
 * @param {number} c  - puncak kanan     (µ = 1)
 * @param {number} d  - titik akhir turun (µ kembali ke 0)
 * @returns {number} µ ∈ [0, 1]
 */
function trapezoid(x, a, b, c, d) {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

/**
 * FUZZIFIKASI
 * ─────────────────────────────────────────────────────────────
 * Menghitung derajat keanggotaan untuk 3 himpunan fuzzy:
 *
 *  • rendah  →  kondisi baik/normal/sehat
 *  • sedang  →  kondisi mulai terganggu
 *  • tinggi  →  kondisi buruk/parah
 
 * @param {number} x - nilai slider (0–100)
 * @returns {{ rendah: number, sedang: number, tinggi: number }}
 */
function getMembership(x) {
  const rendah = trapezoid(x,  -1,  0,  25, 45);
  const sedang = trapezoid(x,  30, 45,  55, 70);
  const tinggi = trapezoid(x,  55, 75, 100, 101);
  return { rendah, sedang, tinggi };
}

/**
 * DEFUZZIFIKASI — Weighted Average (Centroid Disederhanakan)
 * ─────────────────────────────────────────────────────────────
 * Formula:
 *
 *   crisp = Σ(µᵢ × zᵢ) / Σ(µᵢ)
 *
 * di mana zᵢ adalah representasi crisp tiap himpunan:
 *   rendah → 15, sedang → 50, tinggi → 85
 *
 * @param {{ rendah: number, sedang: number, tinggi: number }} m
 * @returns {number}
 */
function defuzzify(m) {
  const sumMu = m.rendah + m.sedang + m.tinggi;
  if (sumMu === 0) return 0;
  return (
    m.rendah * CRISP_REPR.rendah +
    m.sedang * CRISP_REPR.sedang +
    m.tinggi * CRISP_REPR.tinggi
  ) / sumMu;
}

/**
 * HITUNG SKOR KONDISI TANAMAN
 * ─────────────────────────────────────────────────────────────
 * Menggabungkan crisp value semua parameter dengan bobot (WEIGHTS).
 *
 * @param {number[]} values - [s1, s2, s3, s4] nilai slider
 * @returns {{ score: number, memberships: object[], crispValues: number[] }}
 */
function computeFuzzy(values) {
  let weightedSum = 0;
  const memberships  = [];
  const crispValues  = [];

  values.forEach((val, idx) => {
    const m     = getMembership(val);
    const crisp = defuzzify(m);

    memberships.push(m);
    crispValues.push(crisp);
    weightedSum += crisp * WEIGHTS[idx];
  });

  return {
    score: Math.round(weightedSum),
    memberships,
    crispValues
  };
}

/**
 * KLASIFIKASI KONDISI + RULE IF-THEN
 * ─────────────────────────────────────────────────────────────
 * Menentukan jenis kondisi berdasarkan skor fuzzy
 * DAN gejala tambahan dari checkbox.
 *
 * Rule Base:
 *  R1: Semua parameter rendah → SEHAT
 *  R2: Bercak hitam/coklat OR daun menggulung → TERINFEKSI
 *  R3: Daun menguning AND tidak ada bercak → KEKURANGAN NUTRISI
 *  R4: Pertumbuhan kerdil OR warna tidak normal → KEKURANGAN NUTRISI
 *  R5: Akar busuk → KELEBIHAN AIR
 *
 * @param {number} score
 * @param {object} gejala - objek boolean dari checkbox
 * @returns {{ cls, label, emoji, desc, recKey }}
 */
function classifyCondition(score, gejala) {

  // Rule R5 — Akar busuk → Kelebihan Air (prioritas tinggi)
  if (gejala.akar) {
    return {
      cls:    'air',
      label:  'Kelebihan Air <i class="fas fa-tint" style="color:#0288d1;"></i>',
      emoji:  '<i class="fas fa-tint" style="color:#0288d1;"></i>',
      desc:   'Terdeteksi akar busuk. Tanamanmu kelebihan air atau terkena penyakit akar.',
      recKey: 'air'
    };
  }

  // Rule R2 — Bercak atau daun menggulung → Terinfeksi
  if (gejala.bercak || gejala.menggulung) {
    return {
      cls:    'tidak',
      label:  'Terinfeksi <i class="fas fa-biohazard" style="color:#7b1fa2;"></i>',
      emoji:  '<i class="fas fa-biohazard" style="color:#7b1fa2;"></i>',
      desc:   'Terdeteksi gejala infeksi jamur, bakteri, atau hama. Segera tangani!',
      recKey: 'terinfeksi'
    };
  }

  // Rule R3 & R4 — Kuning tanpa bercak / pertumbuhan terhambat → Nutrisi
  if ((gejala.menguning && gejala.nobercak) || gejala.terhambat) {
    return {
      cls:    'nutrisi',
      label:  'Kekurangan Nutrisi <i class="fas fa-thermometer-half" style="color:#ff9800;"></i>',
      emoji:  '<i class="fas fa-thermometer-half" style="color:#ff9800;"></i>',
      desc:   'Tanamanmu kekurangan nutrisi penting. Perlu tambahan pupuk segera.',
      recKey: 'nutrisi'
    };
  }

  // Fallback berbasis skor fuzzy
  if (score < THRESHOLD.sehat) {
    return {
      cls:    'sehat',
      label:  'Sehat <i class="fas fa-leaf" style="color:#2e7d32;"></i>',
      emoji:  '<i class="fas fa-leaf" style="color:#2e7d32;"></i>',
      desc:   'Tanamanmu dalam kondisi prima! Pertahankan perawatan yang sudah baik.',
      recKey: 'sehat'
    };
  } else if (score < THRESHOLD.kurang) {
    return {
      cls:    'nutrisi',
      label:  'Kekurangan Nutrisi <i class="fas fa-thermometer-half" style="color:#ff9800;"></i>',
      emoji:  '<i class="fas fa-thermometer-half" style="color:#ff9800;"></i>',
      desc:   'Ada tanda-tanda kekurangan nutrisi. Perhatikan pemupukan dan kondisi tanah.',
      recKey: 'nutrisi'
    };
  } else if (score < THRESHOLD.nutrisi) {
    return {
      cls:    'kurang',
      label:  'Terinfeksi <i class="fas fa-biohazard" style="color:#7b1fa2;"></i>',
      emoji:  '<i class="fas fa-biohazard" style="color:#7b1fa2;"></i>',
      desc:   'Kondisi tanaman menunjukkan kemungkinan infeksi. Perlu penanganan segera.',
      recKey: 'terinfeksi'
    };
  } else {
    return {
      cls:    'tidak',
      label:  'Kelebihan Air <i class="fas fa-tint" style="color:#0288d1;"></i>',
      emoji:  '<i class="fas fa-tint" style="color:#0288d1;"></i>',
      desc:   'Kondisi tanaman sangat buruk — kemungkinan busuk akar atau genangan air.',
      recKey: 'air'
    };
  }
}