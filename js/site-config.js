/* ============================================================
   site-config.js — 全站共用設定
   要改價格、聯絡方式，只改這個檔案。

   1) window.CAMP：旭川5天4夜 滑雪一條龍全包的設定
      camp.html 直接讀 window.CAMP。開班日期和剩餘名額不放這裡：由後端 /api/classes 提供。
      ⚠️ 價目表要跟後端 schedule.js 的 prices、transfer 一致（報價信和付款以後端為準）。
   2) window.SITE_CONFIG：首頁和其他頁面用的值
      頁面上寫 data-cfg="路徑" 的元素會自動填入：
        data-cfg="allin.price3"  → ¥278,000（淡季 3 人同行的每人價格）
        data-cfg="allin.save3"   → ¥180,000（3 人同行每人比 1 人報名省多少）
   ============================================================ */

/* ================================================================
   ★ 這裡是你唯一需要改的地方 ★
   ================================================================ */
window.CAMP = {
  plan: 'allin',                // 一條龍全包
  // 後端網址（結尾要有 /api/camp-lead）
  backend: 'https://hpc-camp-backend-production.up.railway.app/api/camp-lead',
  // 每次送出也會用 Web3Forms 寄一封通知到你的信箱（後端掛掉時是備援）
  web3formsKey: 'a2a66d84-31b8-4e10-ad64-29181cca53d1',

  // 每人價格：依同一筆報名的人數（1–6 人）。旺季日期由後端班次決定
  prices: {
    regular: { 1: 458000, 2: 328000, 3: 278000, 4: 248000, 5: 238000, 6: 228000 }, // 淡季
    peak:    { 1: 518000, 2: 358000, 3: 298000, 4: 268000, 5: 258000, 6: 248000 }  // 旺季
  },
  // 機場接送（加購）：新千歲 ⇄ 旭川，一台車單程
  transfer: {
    small: 85000,           // 1–3 人小車
    large: 90000,           // 4–6 人大車
    largeFrom: 4,           // 幾人以上派大車
    nightSurcharge: 20000,  // 22:00–05:00 每趟加收（人工確認，不算進試算）
    latestLanding: '10:30'  // 加購接機：班機要在幾點前降落（Day 1 14:00 旭川集合）
  },
  classSize: 6,                 // 每班最多人數
  deposit: 50000,               // 每人訂金
  lineUrl: 'https://line.me/R/ti/p/@414sdfly',
  whatsappUrl: 'https://wa.me/817044204150'
};

(function () {
  var CAMP = window.CAMP;
  var P = CAMP.prices.regular;

  var SITE_CONFIG = {
    // 一條龍全包（數值都從上面的 window.CAMP 讀）
    allin: {
      price3: P[3],          // 淡季 3 人同行的每人價格（首頁主價格）
      save3: P[1] - P[3],    // 3 人同行每人比 1 人報名省多少
      priceFrom: P[6]        // 最低每人價格（淡季 6 人同行）
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
