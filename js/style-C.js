/**
 * style-C.js —— Vogue Luxury 专属增强
 * 启动 Cover · 目录页 · 进度条 · 滚动 reveal · 页码 · 卷首序号
 */
(function () {
  'use strict';

  // ========== 极简单色线稿图标库（与图表 SVG 同款风格） ==========
  // 20x20 viewBox · stroke="currentColor" · fill="none" · stroke-width=1.4
  const ICONS = {
    // —— 国家详情 ——
    market: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16 L7 11 L11 13 L18 4"/><circle cx="7" cy="11" r="1.2" fill="currentColor" stroke="none"/><circle cx="11" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="18" cy="4" r="1.2" fill="currentColor" stroke="none"/><path d="M2 3 L2 16 L18 16" stroke-opacity="0.3"/></svg>',
    policy: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2 L13 2 L17 6 L17 18 L4 18 Z"/><path d="M13 2 L13 6 L17 6"/><line x1="7" y1="10" x2="14" y2="10"/><line x1="7" y1="13" x2="14" y2="13"/><line x1="7" y1="16" x2="11" y2="16"/></svg>',
    brand: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.5"/><circle cx="10" cy="10" r="4.8" stroke-dasharray="1.4 1.4" stroke-opacity="0.45"/><path d="M10 5.8 L11.05 8.55 L13.85 8.78 L11.65 10.65 L12.4 13.4 L10 11.85 L7.6 13.4 L8.35 10.65 L6.15 8.78 L8.95 8.55 Z" fill="currentColor" stroke="none"/></svg>',
    share: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="M10 10 L10 3 A 7 7 0 0 1 16.5 13.5 Z" fill="currentColor" stroke="none"/></svg>',
    risk: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M10 3 L18 17 L2 17 Z"/><line x1="10" y1="8" x2="10" y2="12.5"/><circle cx="10" cy="14.8" r="0.8" fill="currentColor" stroke="none"/></svg>',
    // —— 部件详情 ——
    position: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 1.8 C 6.2 1.8 3.4 4.5 3.4 8 C 3.4 12.6 10 18.2 10 18.2 C 10 18.2 16.6 12.6 16.6 8 C 16.6 4.5 13.8 1.8 10 1.8 Z"/><circle cx="10" cy="8" r="2.2"/></svg>',
    price: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 7.2 L11.4 2.2 L17.4 7.2 L8.6 12.2 Z"/><circle cx="5.8" cy="6.2" r="0.9" fill="currentColor" stroke="none"/><line x1="8.6" y1="12.2" x2="15.6" y2="17.4"/></svg>',
    factory: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 18 L2.5 10.5 L7 12.5 L7 8.5 L11.5 10.5 L11.5 6.5 L17.5 8.5 L17.5 18 Z"/><line x1="2.5" y1="18" x2="17.5" y2="18"/><line x1="13.5" y1="13" x2="13.5" y2="15"/><line x1="13.5" y1="16" x2="13.5" y2="18"/><line x1="15.5" y1="14" x2="15.5" y2="18"/></svg>',
    // —— 通用 ——
    flag: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 18 L3.5 2.5 L4.5 2.5"/><path d="M4 3 L16 3 L13 6.5 L16 10 L4 10"/></svg>',
  };
  const ICO = (key) => `<span class="cd-row-icon">${ICONS[key] || ''}</span>`;

  document.addEventListener('DOMContentLoaded', () => {
    buildCover();
    buildEditorNote();
    buildTOC();
    buildProgress();
    buildPageNumber();
    addChapterFolio();
    initReveal();
    addNavHints();

    // ===== R2 交互深挖 =====
    initMapClickDetail();
    initChartLightbox();
    initBackToTop();
    initKeyboardNav();
    initThemeSwitcher();
    initExplodedHover();

    // ===== R3 数据深交互 + 阅读模式（故事模式已移除） =====
    initReadingMode();
    initFontSize();
    initNumberInsights();

    // ===== R4 分享 + 视差 + 订阅 =====
    initShareMenu();
    initParallax();
    initChapterTransition();
    initSubscribeCTA();

    // ===== R5 数字动画（故事章节高亮已移除） =====
    initCountUp();

    // ===== R8 出口 TOP 12 柱状图（替代重复地图） =====
    initTopExportBar();
  });

  // ========== 1. 启动 Cover 全屏封面 ==========
  function buildCover() {
    if (sessionStorage.getItem('coverSeen') === '1') return;
    const cover = document.createElement('div');
    cover.className = 'magazine-cover';
    cover.innerHTML = `
      <div class="cover-grid">
        <div class="cover-cell cover-cell-tl">EST. 2024</div>
        <div class="cover-cell cover-cell-tr">数据新闻教研组 · 指导出品</div>
        <div class="cover-cell cover-cell-c">
          <div class="cover-kicker">A DATA-DRIVEN JOURNAL · 在路上</div>
          <h1 class="cover-title">在&nbsp;路&nbsp;上</h1>
          <p class="cover-headline">一辆小电驴，如何<em>驶向大世界</em>？</p>
          <p class="cover-dek">中国两轮电动车出海十年深度报道 · 第 12 期 · 2025 春</p>
        </div>
        <div class="cover-cell cover-cell-bl">
          <span>采编 · 秦文雨 单文溪 卜言庆</span>
          <span>数据 · 朱桂子瑜 赵晨瑜</span>
          <span>视觉 · 李一</span>
        </div>
        <div class="cover-cell cover-cell-br">
          <button class="cover-btn" id="coverOpen">
            <span>翻开杂志</span>
            <span class="cover-arrow">↓</span>
          </button>
          <p class="cover-tip">或按 ENTER · SPACE · ESC</p>
        </div>
      </div>
      <div class="cover-mark">VOL. 012 · SPRING · MMXXV</div>
    `;
    document.body.appendChild(cover);

    const open = () => {
      cover.classList.add('opening');
      setTimeout(() => {
        cover.style.display = 'none';
        sessionStorage.setItem('coverSeen', '1');
      }, 1100);
    };
    document.getElementById('coverOpen').addEventListener('click', open);
    cover.addEventListener('click', (e) => { if (e.target === cover || e.target.classList.contains('cover-grid')) open(); });
    document.addEventListener('keydown', (e) => {
      if (cover.style.display === 'none') return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }

  // ========== 2. 主编按 Editor's Note ==========
  function buildEditorNote() {
    const note = document.createElement('section');
    note.className = 'editor-note';
    note.innerHTML = `
      <div class="editor-note-inner">
        <div class="editor-note-mark">
          <span class="editor-note-mark-kicker">EDITOR'S NOTE</span>
          <span class="editor-note-mark-cn">主编按</span>
        </div>
        <blockquote class="editor-note-quote">
          当一辆贴着<em>"Made in China"</em>标签的小电驴，<br>
          出现在雅加达的雨季、阿姆斯特丹的清晨、<br>
          圣保罗的山坡——<br>
          我们意识到，<em>这不是出口数据的膨胀，<br>而是一场关于"中国制造如何被看见"的叙事更迭</em>。
        </blockquote>
        <div class="editor-note-body">
          <p>过去十年，中国两轮电动车的出口量翻了将近 5 倍。但更值得记录的，是<strong>"卖什么"</strong>和<strong>"怎么卖"</strong>这两个答案的彻底改写——从拼价格到拼技术，从铺货到立品牌，从硬件出海到出行方案出海。</p>
          <p>本期编辑部走访了浙江、江苏、广东三大产业带，访谈了 <span class="num-emph">26</span> 位从业者，从海关数据、上市公司年报、社交媒体评论中抽丝剥茧，整理出这辆小电驴驶向世界的完整路径。</p>
        </div>
        <div class="editor-note-sign">
          <span class="editor-note-sign-label">本 期 主 编</span>
          <span class="editor-note-sign-name">秦文雨</span>
          <span class="editor-note-sign-date">2025 · 春 · 数据新闻大赛参赛</span>
        </div>
      </div>
    `;
    const lede = document.getElementById('prologue');
    if (lede) lede.parentNode.insertBefore(note, lede.nextSibling);
    else {
      const ch1 = document.getElementById('ch1');
      if (ch1) ch1.parentNode.insertBefore(note, ch1);
    }
  }

  // ========== 3. 自动生成目录页 ==========
  function buildTOC() {
    const items = [
      { num: '01', kicker: '全球版图',     title: '一辆车的全球<em>漂流</em>',     page: '12', target: 'ch1' },
      { num: '02', kicker: '驱动力',       title: '是什么在推这辆小车<em>出海</em>', page: '28', target: 'ch2' },
      { num: '03', kicker: '从制造到智造', title: '一辆车的<em>进化论</em>',       page: '46', target: 'ch3' },
      { num: '04', kicker: '风险与博弈',   title: '硬币的<em>另一面</em>',         page: '68', target: 'ch4' },
      { num: '05', kicker: '数据洞察',     title: '驶向的<em>未来</em>',           page: '88', target: 'ch5' },
    ];
    const toc = document.createElement('section');
    toc.className = 'toc';
    toc.id = 'toc';
    toc.innerHTML = `
      <div class="toc-inner">
        <div class="toc-head">
          <div class="toc-kicker">TABLE OF CONTENTS</div>
          <h2 class="toc-title">本期<em>目录</em></h2>
          <p class="toc-sub">CONTENTS · ISSUE No. 12 · 2025 SPRING</p>
        </div>
        <ol class="toc-list">
          ${items.map(c => `
            <li class="toc-item">
              <a href="#${c.target}" class="toc-link">
                <span class="toc-num">${c.num}</span>
                <span class="toc-kicker-text">${c.kicker}</span>
                <span class="toc-title-text">${c.title}</span>
                <span class="toc-dots"></span>
                <span class="toc-page">P.&nbsp;${c.page}</span>
              </a>
            </li>
          `).join('')}
        </ol>
        <div class="toc-foot">
          <span>本作品 · 深度数据故事</span>
          <span>·</span>
          <span>共 5 章 · 96 页</span>
          <span>·</span>
          <span>采编 · 数据 · 视觉三组协作</span>
        </div>
      </div>
    `;
    const ch1 = document.getElementById('ch1');
    if (ch1) ch1.parentNode.insertBefore(toc, ch1);
  }

  // ========== 4. 顶部阅读进度条 ==========
  function buildProgress() {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.innerHTML = '<div class="reading-progress-fill" id="rpFill"></div>';
    document.body.appendChild(bar);

    const fill = document.getElementById('rpFill');
    let raf = null;
    const update = () => {
      raf = null;
      const docH = document.body.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
      fill.style.width = (pct * 100) + '%';
    };
    window.addEventListener('scroll', () => {
      if (raf === null) raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  // ========== 5. 页码（屏幕右下角，显示当前章节） ==========
  function buildPageNumber() {
    const wrap = document.createElement('div');
    wrap.className = 'page-number hide-on-cover';
    wrap.innerHTML = `
      <div class="pn-label">FOLIO</div>
      <div class="pn-figure">
        <span id="pnCurrent">01</span>
        <span class="pn-sep">/</span>
        <span id="pnTotal">05</span>
      </div>
      <div class="pn-tag" id="pnTag">全球版图</div>
    `;
    document.body.appendChild(wrap);

    const cur = document.getElementById('pnCurrent');
    const tag = document.getElementById('pnTag');
    const sections = [
      { id: 'ch1', num: '01', tag: '全球版图' },
      { id: 'ch2', num: '02', tag: '驱动力' },
      { id: 'ch3', num: '03', tag: '从制造到智造' },
      { id: 'ch4', num: '04', tag: '风险与博弈' },
      { id: 'ch5', num: '05', tag: '数据洞察' },
    ];

    const update = () => {
      const trigger = window.scrollY + window.innerHeight * 0.35;
      let active = sections[0];
      sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= trigger) active = s;
      });
      cur.textContent = active.num;
      tag.textContent = active.tag;
      // 第一屏 60vh 之内：隐藏所有浮层（page-number / back-to-top / share /
      // progress / reading-mode / font-control / theme-switcher）
      const isCover = window.scrollY < window.innerHeight * 0.6;
      wrap.classList.toggle('hide-on-cover', isCover);
      ['bttBtn', null, '.share-btn', '.reading-progress',
       '.reading-mode-btn', '.font-control', '.theme-switcher']
        .forEach(sel => {
          if (!sel) return;
          const el = sel[0] === '#' ? document.getElementById(sel.slice(1)) : document.querySelector(sel);
          if (el) el.classList.toggle('hide-on-cover', isCover);
        });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    // 初始 + 兜底再跑一次（部分浮层 init 顺序靠后）
    update();
    setTimeout(update, 500);
    setTimeout(update, 1500);
  }

  // ========== 6. 章节"卷首序号"标记 ==========
  function addChapterFolio() {
    document.querySelectorAll('.chapter').forEach((ch, i) => {
      const num = String(i + 1).padStart(2, '0');
      const kicker = ch.querySelector('.chapter-kicker');
      if (kicker && !kicker.querySelector('.folio-no')) {
        const folio = document.createElement('span');
        folio.className = 'folio-no';
        folio.textContent = 'No. ' + num;
        kicker.insertBefore(folio, kicker.firstChild);
      }
    });
  }

  // ========== 7. 滚动 reveal ==========
  function initReveal() {
    const targets = document.querySelectorAll(
      '.chapter, .figure, .pullquote, .takeaway, .timeline, .case-list, .hero, .hero-numbers, .lede, .toc, .editor-note, .outro, .colophon, .masthead'
    );
    targets.forEach(el => el.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(el => io.observe(el));
  }

  // ========== 8. 章节锚点 hover 提示 ==========
  function addNavHints() {
    document.querySelectorAll('.nav a').forEach(a => {
      a.setAttribute('data-section-hint', a.textContent.trim());
    });
  }

  // ========== R2.1 真实地图点击 → 详情卡片 ==========
  // 12 个主要出口国（数据来源：UN Comtrade、Statista、EY、各国海关与协会）
  const COUNTRIES = [
    { code: 'ID', name: '印度尼西亚', exports: 5.6, share: 9.5, cagr: 32.4,
      capital: '雅加达', population: '2.79 亿', gdp: '1.32 万亿$',
      market: '电动两轮车年销 60 万+ 辆 (2024)，渗透率约 5%',
      policy: '整车进口 0–10% 关税；本地组装免 VAT；CKD 散件组装享免税',
      brands: '燃油 Honda/Yamaha 95%；电动：VinFast·Gesits·雅迪·台铃',
      chinaShare: '约 35% (电动新势力)；雅迪/台铃雅加达工厂年产合计 200 万辆',
      risk: '本土燃油车转型慢；镍矿出口政策摇摆；PLN 充电桩仍主导',
      source: 'UN Comtrade (HS 8711.60) · 印尼工业部 · Reuters 2024-12' },
    { code: 'VN', name: '越南', exports: 3.8, share: 6.5, cagr: 28.7,
      capital: '河内', population: '1.00 亿', gdp: '4300 亿$',
      market: '4500 万辆摩托 · 电动渗透率 < 2%，VinFast 主导',
      policy: 'CKD 进口 0% 关税 (本地含量 30%+)；EV 享特别消费税减免',
      brands: 'VinFast 43% · Pega 15% · 迪宝 11.8% · 雅迪 8.6% · 安必科 8.3%',
      chinaShare: '整车 < 10%；电机/控制器/电池 80%+ 来自中国供应链',
      risk: 'VinFast 政府订单强势；CKD 30% 配套率硬门槛；本土化要求高',
      source: '越南摩托车制造商协会 VAMM · 河内麒麟资本 2024' },
    { code: 'IN', name: '印度', exports: 4.5, share: 7.7, cagr: 41.3,
      capital: '新德里', population: '14.3 亿', gdp: '3.7 万亿$',
      market: 'FY24 电动两轮销 90 万辆，渗透率 ~5% (含低速)',
      policy: '整车进口 30% (高墙)；FAME-II 补贴本土；PLI 计划',
      brands: 'Ola Electric 19% · TVS 24% · Bajaj 24% · Ather 12% · Hero',
      chinaShare: '< 2% (2020 边境冲突后禁令)；BYD 退场后改整车进口贴牌',
      risk: '本土巨头主导 + 政府保护；电力供应不稳；进口品牌基本被堵墙外',
      source: '印度汽车制造商协会 SIAM · 投资外经司 DPIIT 2024' },
    { code: 'TH', name: '泰国', exports: 3.2, share: 5.4, cagr: 16.2,
      capital: '曼谷', population: '7200 万', gdp: '5150 亿$',
      market: '2024 纯电销 7.6 万辆 +700% YoY (含 EV+摩托)',
      policy: 'EV3.5 政策：本地 1:1.5 抵免；单车最高 10 万泰铢补贴',
      brands: 'Neta 11.4% (7969 辆) · BYD 32% 乘用 · 摩托：本田仍主导',
      chinaShare: '电动摩托 < 20%；雅迪/爱玛 2024 加速在罗勇府设厂',
      risk: '日系摩托传统强；纯电摩托补贴力度小；BOI 国产化 1:1',
      source: '泰国 Autolife · 巴育政府 EV3.5 政策文件 2024-03' },
    { code: 'DE', name: '德国', exports: 9.5, share: 16.2, cagr: 18.4,
      capital: '柏林', population: '8400 万', gdp: '4.4 万亿$',
      market: '2023 销 210 万辆 E-bike · 占自行车总销 86% · 均价 2650€',
      policy: 'E-bike 0% 关税 (HS 8711.60)；EU 拟议 38–79% 反补贴税 (在审)',
      brands: 'Riese & Müller · Bosch · Cube · 进口：TENWAYS · ENGWE · FIIDO',
      chinaShare: '约 38% E-bike 自中国进口；DIY 套件近 100% 中国',
      risk: 'EU 反补贴税悬而未决；本土 Bosch 系统护城河；认证复杂',
      source: 'Statista 2024 · EY E-bike 报告 · VDMA 自行车工业协会' },
    { code: 'NL', name: '荷兰', exports: 5.8, share: 9.9, cagr: 22.1,
      capital: '阿姆斯特丹', population: '1760 万', gdp: '1.0 万亿$',
      market: 'E-bike 占自行车销 55% (欧洲最高)；人均自行车 1.3 辆',
      policy: 'EU 统一关税；9% BIK 公司用车税优惠；VAT 21%',
      brands: 'VanMoof · Swapfiets · Gazelle · Cortina · TENWAYS 通勤 5.9%',
      chinaShare: '城市通勤 35%；高端 e-bike 仍欧洲本土主导',
      risk: '自行车盗窃率 11% (欧洲最高)；充电桩成问题；VanMoof 破产后市场空缺',
      source: 'BOVAG · RAI Vereniging · CBS 荷兰统计局 2024' },
    { code: 'FR', name: '法国', exports: 4.2, share: 7.2, cagr: 19.5,
      capital: '巴黎', population: '6800 万', gdp: '3.0 万亿$',
      market: '2021 13.2 亿€ · 2027 预计 22.9 亿€ (CAGR 9.77%)',
      policy: '"Bonus écologique" 单车最高 1500€ 补贴 + 9% 进口关税',
      brands: 'Decathlon · Intersport · 进口：TENWAYS · 雅迪欧洲型号',
      chinaShare: '约 25% (中端)；中国整车 ODM 代工贴 Decathlon 牌',
      risk: '补贴政策每年修订；本土品牌 O2 营销；Véligo 充电计划推进慢',
      source: 'Statista France · ADEME 法国能源局 · 巴黎大区府邸公告' },
    { code: 'US', name: '美国', exports: 6.3, share: 10.7, cagr: 24.6,
      capital: '华盛顿', population: '3.35 亿', gdp: '27.4 万亿$',
      market: '2024 E-bike 市场 34.1 亿美元；E-scooter 90%+ 来自中国',
      policy: '25% 301 关税 (含 E-bike)；E-scooter 12.5%；2024-09 启动新 301',
      brands: 'Specialized · Trek · Super73 · Aventon · 进口：九号 · Segway · NIU',
      chinaShare: 'E-scooter > 90% (Segway-Ninebot 占 40%)；E-bike 70% 来自中国',
      risk: 'UL 安全认证高门槛；关税升级风险；州法律不一；VELO 自行车道不足',
      source: 'PeopleForBikes · LEVA-EU · CBP 海关 301 关税清单 2024' },
    { code: 'BR', name: '巴西', exports: 2.7, share: 4.6, cagr: 25.8,
      capital: '巴西利亚', population: '2.15 亿', gdp: '2.1 万亿$',
      market: '电动摩托 1.5 万辆 (2024)，渗透率 < 1%；增长中',
      policy: '整车 35% 进口关税 (高保护)；比亚迪 2024 卡马萨里设厂 (BEV)',
      brands: 'Honda/Yamaha 燃油 80%；TAILG 电动第一 · Voltz',
      chinaShare: '电动摩托 ~ 40% (TAILG 主导)；进口城市滑板车 90% 中国',
      risk: '进口关税极高；高通胀；中国品牌必须本地化建厂；电动补贴力度小',
      source: '巴西交通委员会 ANFAVEA · BNDES 报告 2024' },
    { code: 'IT', name: '意大利', exports: 1.9, share: 3.2, cagr: 14.7,
      capital: '罗马', population: '5900 万', gdp: '2.25 万亿$',
      market: 'E-bike 市场 ~9 亿€ (2023)；高端电摩引领欧洲',
      policy: 'E-bike 0% 关税；电摩 (L1e-B) 9% 注册税 + 19% VAT',
      brands: 'Ducati · Piaggio · 进口：NIU NQiX 1000 (意起售 6499€)',
      chinaShare: 'E-bike 25% · 电摩 < 15% · 高端 0% (Ducati/Aprilia 自有)',
      risk: '高端市场被本土牢牢把控；中国品牌只能做中低端 + ODM',
      source: '意大利自行车协会 ANCMA · 米兰车展 2024 报告' },
    { code: 'ES', name: '西班牙', exports: 1.6, share: 2.7, cagr: 17.3,
      capital: '马德里', population: '4800 万', gdp: '1.6 万亿$',
      market: 'E-bike 渗透率 6% (欧洲中等)；共享电单车成主流',
      policy: 'E-bike 0% 关税；MOVES III 计划单车最高 700€ 补贴',
      brands: 'Orbea · BH · 共享：Lime · Dott · Tier · 中国 OEM 贴牌',
      chinaShare: '共享电单车 80%+ 中国 OEM；零售端 30% 来自中国',
      risk: 'B2B 共享市场波动大；零售品牌认知度低；电商冲击实体',
      source: '西班牙自行车协会 AMBE · IDAE 能源研究所 2024' },
    { code: 'MY', name: '马来西亚', exports: 1.4, share: 2.4, cagr: 19.1,
      capital: '吉隆坡', population: '3400 万', gdp: '4000 亿$',
      market: '电动摩托 1.2 万辆 (2024)；本土首款 Perodua QV-E 投产',
      policy: '整车进口 30% 关税；CKD 10%；本地化享销售税豁免至 2027',
      brands: 'NIU · Segway-Ninebot · 雅迪；本土：Perodua QV-E · Modenas',
      chinaShare: '高端电动摩托 70% 中国 (NIU/九号)；廉价 50% 中国 OEM',
      risk: '本土制造觉醒 (Perodua/MODENAS)；市场容量小；Halal 认证',
      source: 'MAA 马来西亚汽车协会 · MITI 工业部 2024-11 公告' },
  ];

  function initMapClickDetail() {
    const mapEl = document.getElementById('bannerMapCh1');
    if (!mapEl) return;
    mapEl.addEventListener('click', showCountryPicker);
    // 在地图区域加一个提示浮标
    const hint = document.createElement('div');
    hint.className = 'map-hint';
    hint.innerHTML = '<span class="mh-dot"></span><span>点击地图选国家</span>';
    if (mapEl && !mapEl.closest('.chapter-banner')) {
      mapEl.style.position = 'relative';
      mapEl.appendChild(hint);
    } else if (mapEl) {
      mapEl.style.position = 'relative';
      mapEl.appendChild(hint);
    }

    // 暴露给 chartTopBar 调用
    window.__openCountryPicker = showCountryPicker;
    // 监听 chartTopBar 派发的 picker 请求
    const topBar = document.getElementById('chartTopBar');
    if (topBar) {
      topBar.addEventListener('cstyle:openCountryPicker', showCountryPicker);
    }

    function showCountryPicker() {
      const wrap = document.createElement('div');
      wrap.className = 'country-picker';
      // 按出口额排序，TOP 在前
      const sorted = [...COUNTRIES].sort((a, b) => b.exports - a.exports);
      wrap.innerHTML = `
        <div class="cp-head">
          <span class="cp-kicker">SELECT A COUNTRY · 2024 出口额排序</span>
          <span class="cp-title">点一个国家，看它和中国电动车的全部故事</span>
          <button class="cp-close" id="cpClose">✕</button>
        </div>
        <div class="cp-grid">
          ${sorted.map((c, i) => `
            <button class="cp-cell" data-name="${c.name}">
              <span class="cp-rank">${String(i + 1).padStart(2, '0')}</span>
              <span class="cp-flag">${flagEmoji(c.code)}</span>
              <span class="cp-name">${c.name}</span>
              <span class="cp-meta">${c.capital} · ${c.population}</span>
              <span class="cp-value">${c.exports}<em>亿$</em></span>
              <span class="cp-cagr">5 年 CAGR <em>${c.cagr}%</em></span>
            </button>
          `).join('')}
        </div>
      `;
      document.body.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add('open'));
      const close = () => { wrap.classList.remove('open'); setTimeout(() => wrap.remove(), 300); };
      wrap.querySelector('#cpClose').addEventListener('click', close);
      wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
      wrap.querySelectorAll('.cp-cell').forEach(btn => {
        btn.addEventListener('click', () => {
          const name = btn.dataset.name;
          const c = COUNTRIES.find(x => x.name === name);
          if (c) showCountryDetail(c);
        });
      });
    }

    function showCountryDetail(c) {
      document.querySelector('.country-picker')?.remove();
      const card = document.createElement('div');
      card.className = 'country-detail';
      card.innerHTML = `
        <div class="cd-head">
          <span class="cd-flag">${flagEmoji(c.code)}</span>
          <div class="cd-title-wrap">
            <div class="cd-kicker">COUNTRY PROFILE · 2024</div>
            <h3 class="cd-title">${c.name}<em>· 中国电动车出海</em></h3>
            <span class="cd-subtitle">${c.capital} · ${c.population} · GDP ${c.gdp}</span>
          </div>
          <button class="cd-close" id="cdClose">✕</button>
        </div>
        <div class="cd-stats">
          <div class="cd-stat">
            <div class="cd-stat-figure">${c.exports}<em>亿$</em></div>
            <div class="cd-stat-label">2024 出口额</div>
          </div>
          <div class="cd-stat">
            <div class="cd-stat-figure">${c.share}<em>%</em></div>
            <div class="cd-stat-label">占总出口</div>
          </div>
          <div class="cd-stat">
            <div class="cd-stat-figure">${c.cagr}<em>%</em></div>
            <div class="cd-stat-label">5 年 CAGR</div>
          </div>
        </div>
        <div class="cd-body">
          <div class="cd-row">
            ${ICO('market')}
            <div>
              <span class="cd-row-label">市场特征</span>
              <span class="cd-row-text">${c.market}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('policy')}
            <div>
              <span class="cd-row-label">关税 / 政策</span>
              <span class="cd-row-text">${c.policy}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('brand')}
            <div>
              <span class="cd-row-label">主流品牌</span>
              <span class="cd-row-text">${c.brands}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('share')}
            <div>
              <span class="cd-row-label">中国份额</span>
              <span class="cd-row-text">${c.chinaShare}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('risk')}
            <div>
              <span class="cd-row-label">主要风险</span>
              <span class="cd-row-text">${c.risk}</span>
            </div>
          </div>
        </div>
        <div class="cd-foot">
          <span class="cd-foot-kicker">数据来源</span>
          <span class="cd-foot-text">${c.source}</span>
        </div>
      `;
      document.body.appendChild(card);
      requestAnimationFrame(() => card.classList.add('open'));
      const close = () => { card.classList.remove('open'); setTimeout(() => card.remove(), 300); };
      card.querySelector('#cdClose').addEventListener('click', close);
      card.addEventListener('click', (e) => { if (e.target === card) close(); });
    }
  }

  function flagEmoji(code) {
    if (!code || code.length !== 2) return '🌍';
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)));
  }

  // ========== R2.2 图表点击 → Lightbox 大图 ==========
  function initChartLightbox() {
    document.querySelectorAll('.chart').forEach(chart => {
      // chartTopBar 由 initTopExportBar 接管点击
      if (chart.id === 'chartTopBar') return;
      chart.style.cursor = 'zoom-in';
      chart.addEventListener('click', () => {
        const inst = echarts.getInstanceByDom(chart);
        if (!inst) return;
        const url = inst.getDataURL({ pixelRatio: 2, backgroundColor: '#FAF7F2' });
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `
          <div class="lb-bar">
            <span class="lb-kicker">FIGURE · ${chart.id || 'CHART'}</span>
            <div class="lb-actions">
              <a class="lb-btn" href="${url}" download="${chart.id || 'chart'}.png">下载 PNG</a>
              <button class="lb-btn" id="lbClose">关闭 ✕</button>
            </div>
          </div>
          <img src="${url}" alt="${chart.id || 'chart'}" class="lb-img" />
        `;
        document.body.appendChild(lb);
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => lb.classList.add('open'));
        const close = () => {
          lb.classList.remove('open');
          document.body.style.overflow = '';
          setTimeout(() => lb.remove(), 300);
        };
        lb.querySelector('#lbClose').addEventListener('click', close);
        lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
        document.addEventListener('keydown', function esc(e) {
          if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
        });
      });
    });
  }

  // ========== R8.2 出口 TOP 12 横向柱状图（替代重复地图） ==========
  function initTopExportBar() {
    const el = document.getElementById('chartTopBar');
    if (!el) return;
    const sorted = [...COUNTRIES].sort((a, b) => b.exports - a.exports);
    const flagOf = code => String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)));

    const chart = echarts.init(el, null, { renderer: 'canvas' });
    chart.setOption({
      backgroundColor: 'transparent',
      grid: { left: 120, right: 110, top: 24, bottom: 24, containLabel: false },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FAF7F2',
        borderColor: '#14213D',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: '#14213D', fontFamily: 'Georgia, serif', fontSize: 13 },
        extraCssText: 'box-shadow: 3px 3px 0 rgba(20,33,61,0.08); letter-spacing:0.02em;',
        formatter: p => {
          const c = sorted[p.dataIndex];
          return `<div style="font-family:Georgia,serif;font-style:italic;font-size:15px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${c.name}</div>` +
                 `<div>2024 出口额　<b style="font-family:monospace;color:#B07D2A;">${c.exports} 亿$</b></div>` +
                 `<div style="margin-top:2px;">占总出口　${c.share}%</div>` +
                 `<div style="margin-top:2px;">5 年 CAGR　<b style="color:#B07D2A;">${c.cagr}%</b></div>`;
        },
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#E8DFCC', type: 'dashed', width: 0.6 } },
        axisLabel: { fontFamily: 'monospace', fontSize: 10, color: '#8B7355', letterSpacing: 1 },
        max: 11,
      },
      yAxis: {
        type: 'category',
        data: sorted.map((c, i) => `${flagOf(c.code)}  ${c.name}`),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontFamily: 'Georgia, serif',
          fontSize: 13,
          color: '#14213D',
          margin: 12,
          rich: {},
        },
        inverse: true,
      },
      series: [
        // 底层装饰：极淡金底"刻度尺"线（Vogue 数据感）
        {
          type: 'pictorialBar',
          symbol: 'rect',
          symbolSize: [10, 1.5],
          symbolOffset: [0, 0],
          symbolPosition: 'end',
          data: sorted.map(c => 10.8),
          itemStyle: { color: '#B07D2A', opacity: 0.18 },
          silent: true,
          z: 1,
        },
        // 主条：细 10px 金条 + 渐变 + 端点菱形 + 标签
        {
          type: 'bar',
          data: sorted.map((c, i) => ({
            value: c.exports,
            itemStyle: {
              color: {
                type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [
                  { offset: 0, color: i < 4 ? '#7A4F1A' : '#8A6240' },
                  { offset: 1, color: i < 4 ? '#D89E3F' : '#B07D2A' },
                ],
              },
              borderColor: '#14213D',
              borderWidth: 0.3,
              shadowColor: 'rgba(20, 33, 61, 0.10)',
              shadowBlur: 2,
              shadowOffsetY: 1,
            },
          })),
          barWidth: 10,
          barGap: '40%',
          z: 2,
          // 端点菱形 + 数值标签（Vogue 风小尾巴）
          label: {
            show: true,
            position: 'right',
            offset: [8, 0],
            formatter: p => {
              const c = sorted[p.dataIndex];
              return `{val|${c.exports}}{unit|亿$}`;
            },
            rich: {
              val: {
                fontFamily: 'Georgia, serif',
                fontSize: 13,
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#14213D',
              },
              unit: {
                fontFamily: 'Georgia, serif',
                fontSize: 10,
                fontStyle: 'italic',
                color: '#8B7355',
                padding: [0, 0, 0, 3],
              },
            },
          },
          labelLayout: { hideOverlap: false },
        },
        // 端点菱形装饰
        {
          type: 'pictorialBar',
          symbol: 'diamond',
          symbolSize: [8, 8],
          symbolOffset: [4, 0],
          symbolPosition: 'end',
          data: sorted.map(c => c.exports),
          itemStyle: { color: '#14213D' },
          silent: true,
          z: 3,
        },
      ],
      animationDuration: 1400,
      animationEasing: 'cubicOut',
      animationDelay: idx => idx * 50,
    });

    // 点击柱条 → 弹国家详情；点击空白 → 弹国家 picker
    el.style.cursor = 'pointer';
    chart.on('click', params => {
      const c = sorted[params.dataIndex];
      if (c) showCountryDetail(c);
    });
    el.addEventListener('click', e => {
      // 柱条点击已被 chart.on('click') 拦截并 stopPropagation，
      // 此处只接住空白点击 → 打开 picker
      if (e.target.tagName === 'CANVAS') {
        // 通过 CustomEvent 让 initMapClickDetail 接管
        el.dispatchEvent(new CustomEvent('cstyle:openCountryPicker'));
      }
    });
    el.addEventListener('cstyle:openCountryPicker', () => {
      if (typeof window.__openCountryPicker === 'function') window.__openCountryPicker();
    });

    // 响应式
    window.addEventListener('resize', () => chart.resize());
  }

  // ========== R2.3 回到顶部浮动按钮 ==========
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<span class="btt-arrow">↑</span><span class="btt-label">TOP</span>';
    document.body.appendChild(btn);
    const update = () => {
      if (window.scrollY > window.innerHeight * 0.6) btn.classList.add('visible');
      else btn.classList.remove('visible');
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
  }

  // ========== R2.4 键盘快捷键 ==========
  function initKeyboardNav() {
    const sections = ['ch1','ch2','ch3','ch4','ch5'];
    let cur = 0;
    const updateCur = () => {
      const y = window.scrollY + window.innerHeight * 0.3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= y) { cur = i; break; }
      }
    };
    window.addEventListener('scroll', () => requestAnimationFrame(updateCur), { passive: true });
    document.addEventListener('keydown', (e) => {
      // 忽略在 input / textarea / contenteditable
      const t = e.target;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return;
      if (e.key === 'j' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        cur = Math.min(sections.length - 1, cur + 1);
        document.getElementById(sections[cur])?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'k' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        cur = Math.max(0, cur - 1);
        document.getElementById(sections[cur])?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'g' && (e.shiftKey || e.ctrlKey)) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'G' && !e.shiftKey) {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        cycleTheme();
      }
    });
  }

  // ========== R2.5 主题切换（明信片 / 羊皮纸 / 夜读） ==========
  function initThemeSwitcher() {
    const themes = ['vogue', 'parchment', 'midnight'];
    const labels = { vogue: 'VOGUE', parchment: 'PARCHMENT', midnight: 'MIDNIGHT' };
    let idx = parseInt(localStorage.getItem('cTheme') || '0', 10);
    if (isNaN(idx) || idx < 0 || idx >= themes.length) idx = 0;
    document.body.classList.add('theme-' + themes[idx]);

    const btn = document.createElement('button');
    btn.className = 'theme-switcher';
    btn.innerHTML = `
      <span class="ts-current">${labels[themes[idx]]}</span>
      <span class="ts-tip">主题 · T</span>
    `;
    document.body.appendChild(btn);
    btn.addEventListener('click', cycleTheme);
    document.querySelectorAll('.theme-switcher-extra').forEach(b => b.addEventListener('click', cycleTheme));
  }
  function cycleTheme() {
    const themes = ['vogue', 'parchment', 'midnight'];
    const labels = { vogue: 'VOGUE', parchment: 'PARCHMENT', midnight: 'MIDNIGHT' };
    // 找到当前主题（不移除）
    let idx = themes.findIndex(t => document.body.classList.contains('theme-' + t));
    if (idx < 0) idx = 0;
    // 移除所有
    themes.forEach(t => document.body.classList.remove('theme-' + t));
    // 切到下一个
    idx = (idx + 1) % themes.length;
    document.body.classList.add('theme-' + themes[idx]);
    localStorage.setItem('cTheme', idx);
    const cur = document.querySelector('.ts-current');
    if (cur) cur.textContent = labels[themes[idx]];
  }

  // ========== R2.6 + R8 拆解图：部件数据（每部件 6 块 + 数据出处） ==========
  const PARTS = [
    { id: 'motor', name: '电机', en: 'Motor', rate: 96, status: 'high',
      position: '后轮中心', weight: '3.2 kg (典型 1500W 永磁同步)',
      price: '300–650 元/台 (OEM 出厂均价)',
      suppliers: '国内：台州·金宇机电 · 苏州·盛弘股份 · 海外：日本明治 · 德国博世',
      chinaShare: '中国电动车用电机 95%+ 自给；全球出货前 5 中 4 家在中国',
      challenge: '高端扁线电机仍依赖日德；磁材钕铁硼受稀土价格波动',
      source: '起点研究院 (EVTank) 2024 · 中国电器工业协会小功率电机分会',
      explodeX: 220, explodeY: -50 },
    { id: 'controller', name: '电控', en: 'Controller', rate: 88, status: 'high',
      position: '车架后段控制盒', weight: '0.8 kg (集成 MCU + 功率驱动)',
      price: '180–380 元/台',
      suppliers: '国内：高标电子 · 蓝海华腾 · 海外：英飞凌 · TI',
      chinaShare: '国产化率 88%；高端车规 MCU 仍 70% 进口',
      challenge: '高功率 IGBT / SiC 模块依赖海外；车规级安全认证 ISO 26262 投入大',
      source: '高工智能汽车研究院 2024 · 中国汽车电子产业协会',
      explodeX: 287, explodeY: -131 },
    { id: 'dash', name: '智能仪表', en: 'Smart Dash', rate: 68, status: 'mid',
      position: '车把中央', weight: '0.3 kg (含 7 寸 LCD)',
      price: '280–720 元/台 (智能款)',
      suppliers: '国内：京东方 · 天马 · 移远通信 (4G 模组) · 海外：高通 (芯片)',
      chinaShare: '显示面板 90%+ 国产；主控芯片 60%+ 进口 (高通/瑞萨)',
      challenge: '中控 OS 安卓定制生态薄弱；车规级 -40~85℃ 可靠性测试',
      source: 'CINNO Research 2024 · 中国光学光电子行业协会液晶分会',
      explodeX: -149, explodeY: -90 },
    { id: 'handle', name: '车把', en: 'Handlebar', rate: 91, status: 'high',
      position: '前立管顶部 + 左右把横', weight: '0.7 kg (铝合金一体)',
      price: '120–280 元/套 (含把立 + 握把 + 刹车把 + 仪表架)',
      suppliers: '国内：信隆健康 · 久祺股份 · 浙江捷安 · 海外：日本 DIA-COMPE',
      chinaShare: '整车配套 90%+ 国产 (深圳/天津集群)',
      challenge: '高端电助力车把立 (碳纤维) 仍依赖台资/日资',
      source: '中国自行车协会 2024 产业链白皮书',
      explodeX: -120, explodeY: -20 },
    { id: 'saddle', name: '鞍座', en: 'Saddle', rate: 95, status: 'high',
      position: '鞍座柱顶部', weight: '0.4 kg (高弹 PU + 铝合金底板)',
      price: '45–180 元/只',
      suppliers: '国内：信隆健康 · 浙江捷奥 · 天津富士达 · 海外：意大利 Selle Royal',
      chinaShare: '整车配套 95%+ 国产；中高端欧洲品牌仍本土制造',
      challenge: '真皮 + 凝胶高端款被意大利/德国品牌把控；品牌溢价',
      source: '中国轻工业联合会 · 中国皮革协会 2024',
      explodeX: 0, explodeY: -182 },
    { id: 'battery', name: '电池盒', en: 'Battery Pack', rate: 82, status: 'high',
      position: '脚踏板下方 / 车架中下段', weight: '6.5 kg (48V 20Ah 锂电)',
      price: '550–1200 元/组 (锂电池含 BMS)',
      suppliers: '国内：宁德时代 · 亿纬锂能 · 天能 · 超威 · 海外：松下 · LG',
      chinaShare: '全球动力电池出货前 10 中 6 家中国 (CR6 65%)',
      challenge: '欧洲《新电池法》要求 2027 年碳足迹 / 再生材料占比；欧盟本地化要求高',
      source: 'SNE Research 2024 · 中国汽车动力电池产业创新联盟 CABIA',
      explodeX: -10, explodeY: 124 },
    { id: 'chain', name: '链条 / 电机齿轮', en: 'Chain & Gear', rate: 94, status: 'high',
      position: '后轮中轴 + 电机轴', weight: '0.5 kg (含飞轮 + 链轮)',
      price: '60–150 元/套 (链条 + 飞轮 + 链轮)',
      suppliers: '国内：征和链传动 · 桂林桂链 · 浙江恒久 · 海外：日本 D.I.D · EK',
      chinaShare: '整车配套 94% 国产；高端电摩链条 (日本 EK) 用于出口高端款',
      challenge: '免维护静音链条工艺壁垒；电助力中置电机链线 +15cm 国产化',
      source: '中国机械通用零部件工业协会链传动分会 2024',
      explodeX: 230, explodeY: 90 },
    { id: 'frame', name: '车架', en: 'Frame', rate: 94, status: 'high',
      position: '整车骨架 (前立管 + 主梁 + 后平叉 + 鞍管)', weight: '8.5 kg (铝合金一体)',
      price: '350–900 元/套 (电摩款)',
      suppliers: '国内：天津富士达 · 立马 · 浙江绿源 · 海外：日本 Yamaha 焊机',
      chinaShare: '整车配套 94% 国产；高端碳纤维车架仍进口 (台湾 / 日本)',
      challenge: '机器人焊接 / 自动化喷涂的设备投入大；欧盟碳关税 CBAM 推高出口成本',
      source: '中国自行车协会 2024 · 天津自行车产业园调研',
      explodeX: -400, explodeY: 120 },
  ];

  // 当前激活的 PARTS
  const PART_BY_ID = Object.fromEntries(PARTS.map(p => [p.id, p]));

  // ========== R3.1 故事模式（已移除） ==========

  // ========== R3.2 阅读模式（沉浸全屏 + 大字号 + 去装饰） ==========
  function initReadingMode() {
    const btn = document.createElement('button');
    btn.className = 'reading-mode-btn';
    btn.innerHTML = '<span class="rm-icon">⊟</span><span class="rm-label">READ</span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => {
      document.body.classList.toggle('reading-mode');
      btn.classList.toggle('active');
      const on = document.body.classList.contains('reading-mode');
      btn.querySelector('.rm-label').textContent = on ? 'EXIT' : 'READ';
      btn.querySelector('.rm-icon').textContent = on ? '⊠' : '⊟';
    });
    // 键盘 R 切换
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        btn.click();
      }
    });
  }

  // ========== R3.3 字体大小滑块 ==========
  function initFontSize() {
    const wrap = document.createElement('div');
    wrap.className = 'font-control';
    wrap.innerHTML = `
      <button class="fc-minus" id="fcMinus" title="A-">A−</button>
      <span class="fc-level" id="fcLevel">A</span>
      <button class="fc-plus" id="fcPlus" title="A+">A+</button>
    `;
    document.body.appendChild(wrap);
    const level = document.getElementById('fcLevel');
    const sizes = [
      { label: 'A',  root: 15 },
      { label: 'A',  root: 16 },
      { label: 'A+', root: 17.5 },
      { label: 'A+', root: 19 },
      { label: 'A++', root: 20.5 },
    ];
    let idx = parseInt(localStorage.getItem('cFont') || '1', 10);
    if (isNaN(idx) || idx < 0 || idx >= sizes.length) idx = 1;
    applySize();
    document.getElementById('fcMinus').addEventListener('click', () => {
      idx = Math.max(0, idx - 1);
      applySize();
      localStorage.setItem('cFont', idx);
    });
    document.getElementById('fcPlus').addEventListener('click', () => {
      idx = Math.min(sizes.length - 1, idx + 1);
      applySize();
      localStorage.setItem('cFont', idx);
    });
    function applySize() {
      level.textContent = sizes[idx].label;
      document.documentElement.style.setProperty('--reading-base', sizes[idx].root + 'px');
    }
  }

  // ========== R3.4 关键数字 insight tooltip ==========
  function initNumberInsights() {
    const insights = {
      '2210': { label: '万辆', context: '约占全球两轮电动车贸易的 60%', source: '海关总署' },
      '58.6': { label: '亿美元', context: '增速跑赢出口量——单车价值提升 49%', source: 'UN Comtrade' },
      '24.8': { label: '%', context: '5 年 CAGR · 高于行业平均的 16.9%', source: '本团队整理' },
      '180':  { label: '个国家', context: '覆盖 6 大洲 · 含 60+ 一带一路国家', source: '海关总署' },
    };
    document.querySelectorAll('.hero-num-figure').forEach(fig => {
      const tip = document.createElement('div');
      tip.className = 'num-tip';
      const key = fig.dataset.count;
      const info = insights[key];
      if (!info) return;
      tip.innerHTML = `
        <div class="nt-kicker">KEY FIGURE</div>
        <div class="nt-context">${info.context}</div>
        <div class="nt-source">数据 · ${info.source}</div>
      `;
      fig.style.position = 'relative';
      fig.style.cursor = 'help';
      fig.appendChild(tip);
      fig.addEventListener('mouseenter', () => tip.classList.add('visible'));
      fig.addEventListener('mouseleave', () => tip.classList.remove('visible'));
    });
  }

  // ========== R4.1 分享菜单 ==========
  function initShareMenu() {
    const btn = document.createElement('button');
    btn.className = 'share-btn';
    btn.innerHTML = '<span class="sh-icon">↗</span><span class="sh-label">SHARE</span>';
    document.body.appendChild(btn);

    const menu = document.createElement('div');
    menu.className = 'share-menu';
    menu.innerHTML = `
      <div class="sm-kicker">SHARE THIS STORY</div>
      <button class="sm-row" data-act="copy"><span>⎘</span><span>复制链接</span><span class="sm-tag">URL</span></button>
      <button class="sm-row" data-act="wechat"><span>◉</span><span>微信扫一扫</span><span class="sm-tag">QR</span></button>
      <button class="sm-row" data-act="weibo"><span>◐</span><span>分享到微博</span><span class="sm-tag">WB</span></button>
      <button class="sm-row" data-act="twitter"><span>✕</span><span>Post to X</span><span class="sm-tag">X</span></button>
      <button class="sm-row" data-act="longshot"><span>↓</span><span>下载桌面长图</span><span class="sm-tag">PNG</span></button>
      <button class="sm-row" data-act="print"><span>⎙</span><span>打印/导出 PDF</span><span class="sm-tag">A4</span></button>
    `;
    document.body.appendChild(menu);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.classList.contains('open');
      menu.classList.toggle('open');
      if (!open) {
        const b = btn.getBoundingClientRect();
        menu.style.bottom = (window.innerHeight - b.top + 8) + 'px';
        menu.style.right = (window.innerWidth - b.right) + 'px';
      }
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== btn) menu.classList.remove('open');
    });

    menu.querySelectorAll('.sm-row').forEach(row => {
      row.addEventListener('click', () => {
        const act = row.dataset.act;
        if (act === 'copy') {
          const url = location.href;
          navigator.clipboard?.writeText(url);
          row.querySelector('span:nth-child(2)').textContent = '已复制 ✓';
          setTimeout(() => row.querySelector('span:nth-child(2)').textContent = '复制链接', 1500);
        } else if (act === 'weibo') {
          window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(location.href)}&title=${encodeURIComponent('《小电驴驶向大世界》数据新闻作品')}`, '_blank');
        } else if (act === 'twitter') {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('《小电驴驶向大世界》')}&url=${encodeURIComponent(location.href)}`, '_blank');
        } else if (act === 'longshot') {
          // 跳到已生成的长图
          window.open(location.origin + '/versions/style-C/assets/share/share-style-C-desktop.png', '_blank');
        } else if (act === 'print') {
          window.print();
        } else if (act === 'wechat') {
          row.querySelector('span:nth-child(2)').textContent = '请用微信扫一扫上方 ✓';
          setTimeout(() => row.querySelector('span:nth-child(2)').textContent = '微信扫一扫', 2000);
        }
      });
    });
  }

  // ========== R4.2 滚动视差 ==========
  function initParallax() {
    if (!window.requestAnimationFrame) return;
    const heroTitle = document.querySelector('.hero-title');
    const heroDek = document.querySelector('.hero-dek');
    const mastheadTitle = document.querySelector('.masthead-title');
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      // 温和视差：避免把内容推出屏幕
      if (heroTitle) heroTitle.style.transform = `translateY(${y * 0.06}px)`;
      if (heroDek) heroDek.style.transform = `translateY(${y * 0.03}px)`;
      if (mastheadTitle && y < 300) {
        mastheadTitle.style.opacity = Math.max(1 - y / 200, 0.3);
        mastheadTitle.style.transform = `scale(${1 - y * 0.0005})`;
      }
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  // ========== R4.3 章节切换过渡（reveal 已经做了，这里加个翻页装饰） ==========
  function initChapterTransition() {
    // 在 chapter 之间加一条细"分页线"——杂志感的"分割页"
    document.querySelectorAll('.chapter').forEach((ch, i) => {
      if (i === 0) return;
      const sep = document.createElement('div');
      sep.className = 'chapter-sep';
      sep.innerHTML = `
        <span class="cs-line"></span>
        <span class="cs-ornament">✦</span>
        <span class="cs-line"></span>
        <span class="cs-label">FOLIO ${String(i+1).padStart(2,'0')}</span>
      `;
      ch.parentNode.insertBefore(sep, ch);
    });
  }

  // ========== R4.4 订阅 CTA + 延伸阅读 ==========
  function initSubscribeCTA() {
    // 在 footer 之前插入
    const cta = document.createElement('section');
    cta.className = 'subscribe-cta';
    cta.id = 'subscribe';
    cta.innerHTML = `
      <div class="sc-inner">
        <div class="sc-kicker">SUBSCRIBE · FOLLOW THE NEXT ISSUE</div>
        <h3 class="sc-title">下一期，我们<em>驶向哪里</em>？</h3>
        <p class="sc-dek">我们正在筹备第 13 期《在路上》——主题：中国新能源车"换电网络"出海。<br>扫码或留下邮箱，第一时间收到推送。</p>
        <div class="sc-actions">
          <form class="sc-form" id="scForm">
            <input type="email" placeholder="留下邮箱" class="sc-input" id="scEmail" required />
            <button type="submit" class="sc-submit">订阅</button>
          </form>
          <div class="sc-qr">
            <div class="sc-qr-box">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="80" fill="#1a1a1a"/>
                ${Array.from({length: 100}).map(() => {
                  const x = Math.floor(Math.random() * 70) + 5;
                  const y = Math.floor(Math.random() * 70) + 5;
                  return `<rect x="${x}" y="${y}" width="4" height="4" fill="#FAF7F0"/>`;
                }).join('')}
                <rect x="5" y="5" width="20" height="20" fill="#FAF7F0"/>
                <rect x="9" y="9" width="12" height="12" fill="#1a1a1a"/>
                <rect x="55" y="5" width="20" height="20" fill="#FAF7F0"/>
                <rect x="59" y="9" width="12" height="12" fill="#1a1a1a"/>
                <rect x="5" y="55" width="20" height="20" fill="#FAF7F0"/>
                <rect x="9" y="59" width="12" height="12" fill="#1a1a1a"/>
              </svg>
            </div>
            <span class="sc-qr-label">扫码关注</span>
          </div>
        </div>
        <div class="sc-related">
          <div class="scr-kicker">延伸阅读 · RELATED COVERAGE</div>
          <div class="scr-grid">
            <a class="scr-card" href="https://www.iea.org/reports/global-ev-outlook-2024" target="_blank" rel="noopener">
              <span class="scr-source">IEA · Global EV Outlook 2024</span>
              <span class="scr-title">Global EV Outlook 2024 — Trends in electric two-wheelers</span>
              <span class="scr-arrow">↗</span>
            </a>
            <a class="scr-card" href="https://www.mckinsey.com/industries/automotive-and-assembly/our-insights" target="_blank" rel="noopener">
              <span class="scr-source">McKinsey · Mobility Insights</span>
              <span class="scr-title">The next chapter of China's e-mobility export boom</span>
              <span class="scr-arrow">↗</span>
            </a>
            <a class="scr-card" href="https://www.scmp.com/business/china-business" target="_blank" rel="noopener">
              <span class="scr-source">SCMP · China Business</span>
              <span class="scr-title">How Chinese e-bikes captured Europe — and the backlash brewing</span>
              <span class="scr-arrow">↗</span>
            </a>
          </div>
        </div>
      </div>
    `;
    const footer = document.querySelector('footer.footer');
    if (footer) footer.parentNode.insertBefore(cta, footer);

    // 表单
    document.getElementById('scForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('scEmail').value;
      if (!email) return;
      const msg = document.createElement('div');
      msg.className = 'sc-success';
      msg.textContent = `已订阅 · ${email} · 下一期见`;
      e.target.replaceWith(msg);
    });
  }

  // ========== R5.1 数字 count up 动画 ==========
  function initCountUp() {
    const els = document.querySelectorAll('.hero-num-figure[data-count]');
    if (!els.length) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.target);
      if (isNaN(target)) return;
      const isInt = Number.isInteger(target);
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const v = target * eased;
        el.textContent = (isInt ? Math.floor(v) : v.toFixed(1)).toLocaleString('en-US');
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = (isInt ? target : target.toFixed(1)).toLocaleString('en-US');
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(el => {
      // 先保存原文到 data-target，初值 0
      el.dataset.target = el.dataset.count;
      el.textContent = '0';
      io.observe(el);
    });
  }

  // ========== R5.2 故事模式章节高亮（已移除） ==========

  function initExplodedHover() {
    const svg = document.querySelector('#explodedScooter .exploded-svg');
    if (!svg) return;
    const btnAssemble = document.getElementById('exBtnAssemble');
    const btnExplode = document.getElementById('exBtnExplode');
    const tip = document.createElement('div');
    tip.className = 'exploded-tooltip';
    document.body.appendChild(tip);

    if (typeof gsap === 'undefined') return;

    let exploded = false;
    const partEls = svg.querySelectorAll('.part');

    // ===== R11.5 故事顺序装配：车架 → 电池 → 鞍座 → 车把 → 电机 → 仪表 → 链条 → 轮 =====
    // 根据 data-part 排序（定义一个装配顺序数组）
    const ASSEMBLY_ORDER = ['frame', 'battery', 'saddle', 'handle', 'controller', 'motor', 'dash', 'chain'];
    const partById = {};
    partEls.forEach(el => { partById[el.dataset.part] = el; });
    // 包装步骤（起点 + 终点 + 时长）
    const STEPS = {
      // 装配起点：每个部件从屏幕外某个位置飞入
      assembleEntryFrom: {
        frame:      { tx: -380, ty:  60 },   // 从左下飞入
        battery:    { tx:   0,  ty: 260 },   // 从下方飞入
        saddle:     { tx:   0,  ty: -260 },  // 从上方飞入
        handle:     { tx: -380, ty: -240 },  // 从左上飞入
        controller: { tx:  380, ty:  -80 },  // 从右上飞入
        motor:      { tx:  320, ty:  200 },  // 从右下方飞入
        dash:       { tx: -300, ty: -200 },  // 从左上方飞入
        chain:      { tx:  100, ty:  200 },  // 从右下方飞入
      },
    };
    const STEP_DELAY = 0.35;   // 每步延迟（秒）

    // 初始：所有部件隐藏，置于各自"装配起点"
    partEls.forEach(el => {
      const id = el.dataset.part;
      const entry = STEPS.assembleEntryFrom[id];
      if (entry) {
        gsap.set(el, { attr: { transform: `translate(${entry.tx} ${entry.ty})`, opacity: 0 } });
      }
    });

    // === 整车（装配）动画：按顺序飞入到位 ===
    function doAssemble(autoPlay) {
      exploded = false;
      btnExplode.classList.remove('is-active');
      btnAssemble.classList.add('is-active');
      const tl = gsap.timeline();
      ASSEMBLY_ORDER.forEach((pid, i) => {
        const el = partById[pid];
        if (!el) return;
        const entry = STEPS.assembleEntryFrom[pid];
        tl.to(el, {
          duration: 0.7,
          ease: 'power3.out',
          attr: { transform: 'translate(0 0)' },
          opacity: 1,
        }, i * STEP_DELAY);
      });
      // 同步：8 条引线从小到大浮现
      if (autoPlay) {
        // 自动播放时，step 提示飘过（todo: 接 hint element）
      }
    }

    // === 分解动画：按装配顺序的"反序"飞散到外圈引线端 ===
    function doExplode() {
      exploded = true;
      btnAssemble.classList.remove('is-active');
      btnExplode.classList.add('is-active');
      // 反序：先离开的是最后装上的（chain），最后离开的是最先装的（frame）
      const reverseOrder = [...ASSEMBLY_ORDER].reverse();
      reverseOrder.forEach((pid, i) => {
        const el = partById[pid];
        if (!el) return;
        const item = PART_BY_ID[pid];
        if (!item) return;
        gsap.to(el, {
          duration: 0.8,
          ease: 'power2.inOut',
          attr: { transform: `translate(${item.explodeX} ${item.explodeY})` },
          delay: i * 0.10,
        });
      });
    }

    if (btnAssemble) btnAssemble.addEventListener('click', () => doAssemble(false));
    if (btnExplode) btnExplode.addEventListener('click', doExplode);

    // === R11.5 第一次进入视口自动播放装配动画 ===
    let played = false;
    const playOnce = () => {
      if (played) return;
      played = true;
      // 等一拍（让 hero/reveal 先稳）
      setTimeout(() => doAssemble(true), 250);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) { playOnce(); io.disconnect(); }
      }, { threshold: 0.18 });
      io.observe(svg);
    } else {
      setTimeout(playOnce, 1200);
    }

    // === 部件 hover + click ===
    partEls.forEach(el => {
      const id = el.dataset.part;
      const item = PART_BY_ID[id];
      if (!item) return;
      el.style.cursor = 'pointer';
      el.style.transformOrigin = 'center';
      el.style.transformBox = 'fill-box';
      el.addEventListener('mousemove', (e) => {
        const order = ASSEMBLY_ORDER.indexOf(id) + 1;
        tip.innerHTML = `
          <div class="et-kicker">STEP 0${order} · ${item.en.toUpperCase()}</div>
          <div class="et-name">${item.name}<span class="et-en">${item.en}</span></div>
          <div class="et-rate">本土配套率 <strong>${item.rate}%</strong></div>
          <div class="et-note">${item.challenge.split('；')[0]}</div>
          <div class="et-tip-foot">点击查看完整档案</div>
        `;
        tip.style.left = (e.clientX + 18) + 'px';
        tip.style.top  = (e.clientY + 18) + 'px';
        tip.classList.add('visible');
      });
      el.addEventListener('mouseleave', () => tip.classList.remove('visible'));
      el.addEventListener('click', () => {
        if (!exploded) {
          doExplode();
          setTimeout(() => showPartCard(item), 600);
        } else {
          showPartCard(item);
        }
      });
    });

    // === 部件弹窗（与国家弹窗共用 .country-detail 样式） ===
    function showPartCard(item) {
      const idx = PARTS.findIndex(p => p.id === item.id);
      const card = document.createElement('div');
      card.className = 'country-detail';
      const accentColor = item.status === 'high' ? 'gold' : item.status === 'mid' ? 'bronze' : 'red';
      const statusLabel = item.status === 'high' ? '优势稳固' : item.status === 'mid' ? '逐步追赶' : '咽喉级依赖';
      card.innerHTML = `
        <div class="cd-head">
          <span class="cd-flag">⚙</span>
          <div class="cd-title-wrap">
            <div class="cd-kicker">SUPPLY CHAIN · No. ${String(idx + 1).padStart(2, '0')}</div>
            <h3 class="cd-title">${item.name}<em>· ${item.en}</em></h3>
            <span class="cd-subtitle">位置：${item.position} · 重量：${item.weight}</span>
          </div>
          <button class="cd-close">✕</button>
        </div>
        <div class="cd-stats">
          <div class="cd-stat">
            <div class="cd-stat-figure" style="color: var(--accent-${accentColor});">${item.rate}<em>%</em></div>
            <div class="cd-stat-label">本土配套率</div>
          </div>
          <div class="cd-stat">
            <div class="cd-stat-figure" style="font-size: clamp(20px, 2vw, 32px); color: var(--accent-${accentColor});">${statusLabel}</div>
            <div class="cd-stat-label">国产化阶段</div>
          </div>
          <div class="cd-stat">
            <div class="cd-stat-figure" style="font-size: clamp(20px, 2vw, 32px);">${item.price.split(' ')[0]}</div>
            <div class="cd-stat-label">参考价格</div>
          </div>
        </div>
        <div class="cd-body">
          <div class="cd-row">
            ${ICO('position')}
            <div>
              <span class="cd-row-label">位置 / 重量</span>
              <span class="cd-row-text">${item.position} · 重量 ${item.weight}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('price')}
            <div>
              <span class="cd-row-label">价格区间</span>
              <span class="cd-row-text">${item.price}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('factory')}
            <div>
              <span class="cd-row-label">主流供应商</span>
              <span class="cd-row-text">${item.suppliers}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('share')}
            <div>
              <span class="cd-row-label">中国份额</span>
              <span class="cd-row-text">${item.chinaShare}</span>
            </div>
          </div>
          <div class="cd-row">
            ${ICO('risk')}
            <div>
              <span class="cd-row-label">主要挑战</span>
              <span class="cd-row-text">${item.challenge}</span>
            </div>
          </div>
        </div>
        <div class="cd-foot">
          <span class="cd-foot-kicker">数据来源</span>
          <span class="cd-foot-text">${item.source}</span>
        </div>
      `;
      document.body.appendChild(card);
      requestAnimationFrame(() => card.classList.add('open'));
      const close = () => { card.classList.remove('open'); setTimeout(() => card.remove(), 300); };
      card.querySelector('.cd-close').addEventListener('click', close);
      card.addEventListener('click', (e) => { if (e.target === card) close(); });
    }
  }

  // ========== R11 C 风格：覆盖共享层 ECharts 配色为金棕调 ==========
  // 共享 charts.js 用了 PALETTE（深蓝+红+绿），与 C 风格（米色+金棕）冲突
  // 这里在共享层渲染完成后，对 chartSupply / chartSentiment 重写配色
  function overrideChartColors() {
    // 配色规则：
    //   ≥80% 长板 → #B07D2A 金
    //   50–80% 短板 → #7A4F1A 棕
    //   <50% 弱项 → #8C4A2A 红棕
    const HIGH = '#B07D2A';
    const MID = '#7A4F1A';
    const LOW = '#8C4A2A';
    const NEUTRAL = '#D9C9A8';

    // ---- chartSupply：本土配套率（6 部件，水平条） ----
    const el1 = document.querySelector('#chartSupply');
    if (el1 && window.echarts) {
      const c = window.echarts.getInstanceByDom(el1);
      if (c) {
        const opt = c.getOption();
        const items = (opt.series && opt.series[0] && opt.series[0].data) || [];
        c.setOption({
          color: [HIGH, MID, LOW],
          series: [{
            type: 'bar',
            data: items.map(d => ({
              ...d,
              itemStyle: {
                color: d.value >= 80 ? HIGH : (d.value >= 50 ? MID : LOW)
              }
            }))
          }]
        });
      }
    }

    // ---- chartSentiment：海外用户评论（堆叠条 3 段） ----
    const el2 = document.querySelector('#chartSentiment');
    if (el2 && window.echarts) {
      const c = window.echarts.getInstanceByDom(el2);
      if (c) {
        const opt = c.getOption();
        const s0 = (opt.series && opt.series[0] && opt.series[0].data) || [];
        const s1 = (opt.series && opt.series[1] && opt.series[1].data) || [];
        const s2 = (opt.series && opt.series[2] && opt.series[2].data) || [];
        c.setOption({
          color: [HIGH, NEUTRAL, LOW],
          series: [
            { name: '正面', type: 'bar', stack: 's', data: s0, itemStyle: { color: HIGH } },
            { name: '中性', type: 'bar', stack: 's', data: s1, itemStyle: { color: NEUTRAL } },
            { name: '负面', type: 'bar', stack: 's', data: s2, itemStyle: { color: LOW } }
          ]
        });
      }
    }
  }
  // 共享层可能在 DOMContentLoaded 中或之后渲染，多试几次
  setTimeout(overrideChartColors, 600);
  setTimeout(overrideChartColors, 1500);
  setTimeout(overrideChartColors, 3000);
})();
