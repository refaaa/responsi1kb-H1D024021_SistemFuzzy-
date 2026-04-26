
const App = (() => {

  const sliders   = [1,2,3,4].map(i => document.getElementById('s' + i));
  const valBadges = [1,2,3,4].map(i => document.getElementById('val' + i));
  const scoreEls  = [1,2,3,4].map(i => document.getElementById('sc' + i));
  const memEls    = [1,2,3,4].map(i => document.getElementById('m' + i));

  const fBars = {
    r: [1,2,3,4].map(i => document.getElementById('f' + i + 'r')),
    m: [1,2,3,4].map(i => document.getElementById('f' + i + 'm')),
    h: [1,2,3,4].map(i => document.getElementById('f' + i + 'h')),
  };

  const checkboxIds = ['menguning','bercak','menggulung','terhambat','akar','nobercak'];

  /* ── Navigasi antar halaman ──────────────────────────────── */
  function goTo(pageId) {
    
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active', 'slide-in');
    });

    // Jika navigasi ke hasil → hitung dulu
    if (pageId === 'page-hasil') update();

    // Tampilkan halaman tujuan
    const target = document.getElementById(pageId);
    target.classList.add('active', 'slide-in');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Baca semua nilai slider & checkbox ─────────────────── */
  function readInputs() {
    const values = sliders.map(s => parseInt(s.value));
    const gejala = {};
    checkboxIds.forEach(id => {
      gejala[id] = document.getElementById('c-' + id)?.checked ?? false;
    });
    return { values, gejala };
  }

  /* ── Update badge nilai slider ─────────────────────────── */
  function updateSliderBadge(idx, val) {
    const badge = valBadges[idx];
    if (!badge) return;
    badge.textContent = val;

    if (val < 33) {
      badge.style.background = '#4CAF50';
    } else if (val < 66) {
      badge.style.background = '#FF9800';
    } else {
      badge.style.background = '#EF5350';
    }
  }

  function renderFuzzyBars(memberships) {
    memberships.forEach((m, i) => {
      fBars.r[i].style.width = Math.round(m.rendah * 100) + '%';
      fBars.m[i].style.width = Math.round(m.sedang * 100) + '%';
      fBars.h[i].style.width = Math.round(m.tinggi * 100) + '%';

      const tags = [];
      if (m.rendah > 0.04)
        tags.push(`<span class="mtag mtag-g">Rendah ${(m.rendah*100).toFixed(0)}%</span>`);
      if (m.sedang > 0.04)
        tags.push(`<span class="mtag mtag-a">Sedang ${(m.sedang*100).toFixed(0)}%</span>`);
      if (m.tinggi > 0.04)
        tags.push(`<span class="mtag mtag-r">Tinggi ${(m.tinggi*100).toFixed(0)}%</span>`);

      if (memEls[i]) memEls[i].innerHTML = tags.join('');
    });
  }

  function renderResult(condition, score) {
    const hero  = document.getElementById('resultHero');
    const emoji = document.getElementById('resultEmoji');
    const stat  = document.getElementById('resultStatus');
    const desc  = document.getElementById('resultDesc');
    const bar   = document.getElementById('progressBar');
    const lbl   = document.getElementById('scoreLabel');

    if (!hero) return;

    hero.className = 'result-hero ' + condition.cls;
    emoji.innerHTML = condition.emoji;   
    stat.innerHTML  = condition.label;   
    desc.textContent  = condition.desc;
    bar.style.width   = score + '%';
    lbl.textContent   = 'Skor kondisi: ' + score + ' / 100';
  }

  /* ── Render skor per parameter ─────────────────────────── */
  function renderScores(crispValues) {
    crispValues.forEach((v, i) => {
      if (scoreEls[i]) scoreEls[i].textContent = Math.round(v);
    });
  }

  /* ── Render rekomendasi ─────────────────────────────────── */
  function renderRecs(recKey) {
    const grid = document.getElementById('recGrid');
    if (!grid) return;

    const recs = REC_DB[recKey] || REC_DB.sehat;
    grid.innerHTML = recs.map(r => `
      <div class="rec-item ${r.border}">
        <div class="rec-icon">${r.icon}</div>
        <div class="rec-body">
          <div class="rec-cat">${r.cat}</div>
          <div class="rec-text">${r.text}</div>
        </div>
      </div>
    `).join('');
  }

  /* ── Update checkbox visual (highlight gejala aktif) ─────── */
  function updateGejalaHighlight(gejala) {
    // Highlight kotak gejala terkait kondisi yang terdeteksi
  }

  /* ── FUNGSI UTAMA: hitung & render semua ─────────────────── */
  function update() {
    const { values, gejala } = readInputs();


    values.forEach((v, i) => updateSliderBadge(i, v));

    // Hitung fuzzy
    const { score, memberships, crispValues } = computeFuzzy(values);

    renderFuzzyBars(memberships);

    renderScores(crispValues);

    // Klasifikasi
    const condition = classifyCondition(score, gejala);

    // Render hasil
    renderResult(condition, score);
    renderRecs(condition.recKey);

    return { score, condition };
  }

  
  function reset() {
    const defaults = [20, 15, 25, 10];
    sliders.forEach((s, i) => {
      s.value = defaults[i];
    });

    checkboxIds.forEach(id => {
      const el = document.getElementById('c-' + id);
      if (el) el.checked = false;
    });

    update();

    // Konfirmasi
    const btn = document.querySelector('#page-diagnosa .btn-ulangi');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ Direset!';
      btn.style.background = '#E8F5E9';
      btn.style.borderColor = '#4CAF50';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 1200);
    }
  }

  function init() {

    sliders.forEach(s => s.addEventListener('input', update));

    // Jalankan kalkulasi awal
    update();
  }

  document.addEventListener('DOMContentLoaded', init);
  
  return { goTo, update, reset };

})();
