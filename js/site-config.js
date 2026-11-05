/* ============================================================
   site-config.js — 全站共用設定
   要改價格、截止日、班次、聯絡方式，只改這個檔案。

   1) window.CAMP：保證班／精簡版設定（從 camp.html 原封不動搬過來）
      camp.html 和 camp-lite.html 直接讀 window.CAMP（精簡版在自己的頁面裡把 plan 換成 'lite'）。
      開班日期不放這裡：由後端 /api/classes 提供。
      首頁全包卡的價格、截止日、總價值和精簡版價格也從這裡來。
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
  plan: 'camp',                 // 這一頁的方案：camp＝保證班、lite＝精簡版
  // 後端網址：Railway 部署完成後，把網址換成你的（結尾要有 /api/camp-lead）
  backend: 'https://hpc-camp-backend-production.up.railway.app/api/camp-lead',
  // 後端掛掉時的備援：仍會用 Web3Forms 寄到你的信箱
  web3formsKey: 'a2a66d84-31b8-4e10-ad64-29181cca53d1',

  price: {
    current: 268000,            // 目前顯示的價格
    labelZh: '早鳥第一梯', labelEn: 'Early bird · first release',
    deadline: '2026/11/20',     // 這一批截止日
    earlyDeadlineISO: '2026-11-20T23:59:59+09:00', // 過了這個時間（日本時間），早鳥自動變第二批
    secondDeadline: '2026/12/10',  // 第二梯截止日
    secondDeadlineISO: '2026-12-10T23:59:59+09:00', // 過了這個時間，自動變正價
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
    second:  { price: 283000, zh: '第二梯', en: 'Second release' },
    regular: { price: 298000, zh: '正價', en: 'Regular' },
    peak:    { price: 298000, zh: '旺季', en: 'Peak season' },
    // 精簡版（camp-lite.html）用：平日 248,000／旺季 278,000，沒有早鳥
    liteRegular: { price: 248000, zh: '精簡版', en: 'Lite' },
    litePeak:    { price: 278000, zh: '精簡版・旺季', en: 'Lite · peak season' }
  },

  // 開班日期、梯次、剩餘名額都由後端自動決定（後端 repo 的 schedule.js），這裡不用改。
  // 平日班永遠顯示 6 個日期、旺季 7 個；滿班自動換下一班，梯次截止自動換日期和價格。
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
      price: CAMP.tiers.liteRegular.price        // 精簡版平日價
    },
    // 自由搭配起價
    from: {
      transfer: 43000,  // 機場接送（單程，最便宜路線；完整價目在 custom.html 的 window.CUSTOM）
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
