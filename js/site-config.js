/* ============================================================
   site-config.js — 全站共用設定
   要改價格、截止日、班次、聯絡方式，只改這個檔案。

   1) window.CAMP：保證班設定（從 camp.html 原封不動搬過來）
      camp.html 直接讀 window.CAMP；首頁全包卡的價格、截止日、總價值也從這裡來。
   2) window.SITE_CONFIG：首頁和其他頁面用的值
      頁面上寫 data-cfg="路徑" 的元素會自動填入：
        data-cfg="camp.earlyBird"                → ¥268,000
        data-cfg="camp.earlyBirdDeadline"        → 11/20
        data-cfg="camp.earlyBirdDeadline" data-cfg-format="date-en" → Nov 20
   ============================================================ */

/* ================================================================
   ★ 這裡是你唯一需要改的地方 ★
   ================================================================ */
window.CAMP = {
  // 後端網址：Railway 部署完成後，把網址換成你的（結尾要有 /api/camp-lead）
  backend: 'https://hpc-camp-backend-production.up.railway.app/api/camp-lead',
  // 後端掛掉時的備援：仍會用 Web3Forms 寄到你的信箱
  web3formsKey: 'a2a66d84-31b8-4e10-ad64-29181cca53d1',

  price: {
    current: 268000,            // 目前顯示的價格
    labelZh: '早鳥第一批', labelEn: 'Early bird · first release',
    deadline: '2026/11/20',     // 這一批截止日
    earlyDeadlineISO: '2026-11-20T23:59:59+09:00', // 過了這個時間（日本時間），早鳥自動變第二批
    secondDeadline: '2026/12/15',  // 第二批截止日
    next: 283000,               // 下一批價格
    regular: 298000,            // 正價
    totalValue: 475400          // 總價值（方案 403,400＋贈品 72,000）
  },
  deposit: 50000,               // 每人訂金
  lineUrl: 'https://line.me/R/ti/p/@414sdfly',   // 加購區的 LINE 連結
  whatsappUrl: 'https://wa.me/817044204150',

  // 每個價格等級的金額
  tiers: {
    early:   { price: 268000, zh: '早鳥', en: 'Early bird' },
    second:  { price: 283000, zh: '第二批', en: 'Second release' },
    regular: { price: 298000, zh: '正價', en: 'Regular' },
    peak:    { price: 298000, zh: '旺季', en: 'Peak season' }
  },

  // 目前開放的班次（每個日期一次只開一班，最多 3 人）
  // seats = 這一班剩幾個名額；額滿填 0。額滿後要再開同日期的下一班，就把 seats 改回 3、tier 改成當下的批次。
  // ── 第一批 早鳥（11/20 截止或 18 個名額賣完）──
  dates: [
    { start: '2026-12-18', end: '2026-12-22', seats: 3, tier: 'early' },
    { start: '2027-01-07', end: '2027-01-11', seats: 3, tier: 'early' },
    { start: '2027-01-17', end: '2027-01-21', seats: 3, tier: 'early' },
    { start: '2027-02-17', end: '2027-02-21', seats: 3, tier: 'early' },
    { start: '2027-03-01', end: '2027-03-05', seats: 3, tier: 'early' },
    { start: '2027-03-13', end: '2027-03-17', seats: 3, tier: 'early' },
  // ── 旺季（聖誕、跨年、農曆新年、2月底連假）：一開始就以正價開放，不給早鳥 ──
    { start: '2026-12-22', end: '2026-12-26', seats: 3, tier: 'peak' },
    { start: '2026-12-26', end: '2026-12-30', seats: 3, tier: 'peak' },
    { start: '2026-12-30', end: '2027-01-03', seats: 3, tier: 'peak' },
    { start: '2027-02-05', end: '2027-02-09', seats: 3, tier: 'peak' },
    { start: '2027-02-09', end: '2027-02-13', seats: 3, tier: 'peak' },
    { start: '2027-02-13', end: '2027-02-17', seats: 3, tier: 'peak' },
    { start: '2027-02-25', end: '2027-03-01', seats: 3, tier: 'peak' }
  ]
};

(function () {
  var CAMP = window.CAMP;
  // '2026/11/20' → '11/20'
  var md = function (d) { var p = String(d).split('/'); return Number(p[1]) + '/' + Number(p[2]); };

  var SITE_CONFIG = {
    // 全包保證班（數值都從上面的 window.CAMP 讀）
    camp: {
      earlyBird: CAMP.tiers.early.price,         // 早鳥價（每人）
      earlyBirdDeadline: md(CAMP.price.deadline), // 早鳥截止（月/日）
      totalValue: CAMP.price.totalValue           // 總價值
    },
    // 精簡版
    lite: {
      price: 248000
    },
    // 自由搭配起價
    from: {
      transfer: 80000,  // 機場接送（單程）
      lodging: 11000,   // 住宿（每晚每人）
      storage: 16000,   // 倉儲（一年）
      lesson: 98000     // 課程（一天 6 小時）
    },
    lineId: CAMP.lineUrl.split('/').pop(),       // '@414sdfly'
    whatsapp: CAMP.whatsappUrl.split('/').pop()  // '817044204150'
  };

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  SITE_CONFIG.yen = function (n) {
    return '¥' + Number(n).toLocaleString('en-US');
  };
  // '11/20' → 'Nov 20'
  SITE_CONFIG.dateEn = function (m) {
    var p = String(m).split('/');
    return MONTHS[Number(p[0]) - 1] + ' ' + Number(p[1]);
  };

  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, SITE_CONFIG);
  }

  function fill() {
    var els = document.querySelectorAll('[data-cfg]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var v = get(el.getAttribute('data-cfg'));
      if (v == null) continue;
      var fmt = el.getAttribute('data-cfg-format');
      if (fmt === 'date-en') v = SITE_CONFIG.dateEn(v);
      else if (typeof v === 'number') v = SITE_CONFIG.yen(v);
      el.textContent = v;
    }
  }

  window.SITE_CONFIG = SITE_CONFIG;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
