/**
 * main.js —— 主交互逻辑
 * 滚动 / 数字计数 / 导航高亮 / 时间轴 / 案例列表渲染
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    initNavHighlight();
    initHeroCounters();
    // ★ 2026-07-26 单点 try/catch：任意 render 失败不影响其他 section
    safeCall('renderTimeline', renderTimeline);
    safeCall('renderTradeTimeline', renderTradeTimeline);
    safeCall('renderBrandGrid', renderBrandGrid);
    safeCall('renderFengxianCluster', renderFengxianCluster);
    initExplodedScooter();
    // ★ R17 访谈数据渲染
    safeCall('renderCkdFlow', renderCkdFlow);
    safeCall('renderFengxianFacts', renderFengxianFacts);
    safeCall('renderInterviewCredits', renderInterviewCredits);
  });

  /* ===== 兜底：单点失败不波及其他 ===== */
  function safeCall(name, fn) {
    try {
      fn();
    } catch (e) {
      console.error(`[${name}] 渲染失败:`, e);
    }
  }

  /* ===== 当前日期 ===== */
  function setCurrentDate() {
    const el = document.getElementById('currentDate');
    if (!el) return;
    const d = new Date();
    const m = d.getMonth() + 1;
    const season = m <= 3 || m === 12 ? '冬' : m <= 6 ? '春' : m <= 9 ? '夏' : '秋';
    el.textContent = `${d.getFullYear()} 年 · ${season}`;
  }

  /* ===== 导航高亮 ===== */
  function initNavHighlight() {
    const sections = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
    const links = document.querySelectorAll('.nav a');
    const linkMap = new Map();
    links.forEach(l => linkMap.set(l.dataset.section, l));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const link = linkMap.get(e.target.id);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -65% 0px' });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ===== Hero 数字计数动画 ===== */
  function initHeroCounters() {
    const nums = document.querySelectorAll('.hero-num-figure[data-count]');
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimal = parseInt(el.dataset.decimal || '0', 10);
      // 提取单位（em 子元素）
      const unitHTML = el.innerHTML.match(/<em>.*?<\/em>/)?.[0] || '';
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = target * eased;
        const display = decimal > 0 ? cur.toFixed(decimal) : Math.floor(cur).toLocaleString();
        el.innerHTML = display + unitHTML;
        if (t < 1) requestAnimationFrame(tick);
        else el.innerHTML = (decimal > 0 ? target.toFixed(decimal) : target.toLocaleString()) + unitHTML;
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  /* ===== 政策时间轴 ===== */
  function renderTimeline() {
    const wrap = document.getElementById('timeline');
    if (!wrap) return;
    wrap.innerHTML = DATA.drivers.policyTimeline.map(t => `
      <div class="timeline-row">
        <div class="timeline-date">${t.date}</div>
        <div class="timeline-marker"></div>
        <div class="timeline-body">
          ${t.event}<span class="timeline-tag">${t.country}</span>
          <span class="timeline-source">来源：${t.source}</span>
        </div>
      </div>
    `).join('');
  }

  /* ===== 贸易摩擦时间轴 ===== */
  function renderTradeTimeline() {
    const wrap = document.getElementById('tradeTimeline');
    if (!wrap) return;
    wrap.innerHTML = DATA.risk.tradeTimeline.map(t => `
      <div class="timeline-row">
        <div class="timeline-date">${t.date}</div>
        <div class="timeline-marker" style="background: var(--accent-orange);"></div>
        <div class="timeline-body">
          ${t.event}<span class="timeline-tag">${t.country}</span>
          <span class="timeline-source">来源：${t.source}</span>
        </div>
      </div>
    `).join('');
  }

  /* ===== 品牌案例列表 (R47: 通用 stats 渲染，移除海外三维死字段) =====
   * 2026-07-26 加固：
   *  - brands 不存在或为空 → 容器保留骨架（不让整段消失）
   *  - 单个 brand 字段缺失 → 跳过该 brand，其他正常渲染
   *  - 单个 brand 渲染抛错 → 该 brand 显示占位，其他继续
   */
  function renderBrandGrid() {
    const wrap = document.getElementById('brandGrid');
    if (!wrap) return;

    const brands = (DATA && DATA.upgrade && Array.isArray(DATA.upgrade.brands))
      ? DATA.upgrade.brands
      : [];

    if (brands.length === 0) {
      console.warn('[renderBrandGrid] DATA.upgrade.brands 缺失或为空，保持骨架占位');
      return;
    }

    wrap.innerHTML = brands.map(b => {
      // 单个 brand 用 try/catch 包，坏一个不影响整体
      try {
        if (!b || !b.name) return '';
        const nameParts = String(b.name).split(' ');
        const nameZh = nameParts[0] || b.name;
        const nameEn = nameParts.slice(1).join(' ') || '';
        const founded = b.founded || '—';
        const stats = Array.isArray(b.stats) ? b.stats : [];
        const highlight = b.highlight || '';
        const caseText = b.case || '';

        return `
      <div class="case-row">
        <div class="case-brand">
          <div class="case-brand-name">${esc(nameZh)}</div>
          <div class="case-brand-en">${esc(nameEn)} · est. ${esc(String(founded))}</div>
        </div>
        <div>
          <div class="case-stats">
            ${stats.map(s => `
              <div>
                <div class="case-stat-num">${esc(s && s.num)}${s && s.unit ? `<em>${esc(s.unit)}</em>` : ''}</div>
                <div class="case-stat-label">${esc(s && s.label)}</div>
              </div>
            `).join('')}
          </div>
          <div class="case-body">
            <strong>${esc(highlight)}</strong><br>
            <em>案例：${esc(caseText)}</em>
          </div>
        </div>
      </div>
    `;
      } catch (e) {
        console.error('[renderBrandGrid] 单个 brand 渲染失败:', b && b.name, e);
        return `<div class="case-row" data-error="true" style="opacity:.5"><div class="case-brand-name">${esc(b && b.name) || '—'}</div><div class="case-body">该条数据渲染失败，请刷新或查看控制台</div></div>`;
      }
    }).join('');
  }

  /* ===== 简易 HTML 转义 ===== */
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ===== R49 三层叙事：爆发阶段 + 区域市场 + 价值链节点 ===== */
  function renderFengxianCluster() {
    const wrap = document.getElementById('fengxianCluster');
    if (!wrap || !DATA.upgrade.valueChain) return;
    const vc = DATA.upgrade.valueChain;
    const ringColors = ['#B07D2A', '#7A4F1A', '#9B8D76', '#14213D', '#10B981', '#3B82F6', '#F59E0B'];

    // ====== 阶段一：分阶段时间轴 ======
    const phaseBlocks = vc.phases.map((p, i) => `
      <div class="vc-phase">
        <div class="vc-phase-year">${p.year}</div>
        <div class="vc-phase-line">
          <div class="vc-phase-dot"></div>
          ${i < vc.phases.length - 1 ? '<div class="vc-phase-bar"></div>' : ''}
        </div>
        <div class="vc-phase-body">
          <div class="vc-phase-label">${p.label}</div>
          <div class="vc-phase-stat">${p.stat}</div>
          <p class="vc-phase-desc">${p.desc}</p>
          <p class="vc-phase-source">来源：${p.sources}</p>
        </div>
      </div>
    `).join('');
    const phaseSection = `
      <div class="vc-section vc-phases">
        <div class="vc-section-tag">
          <span class="vc-eyebrow">2020—2025 · 爆发时间线</span>
        </div>
        <div class="vc-phases-timeline">${phaseBlocks}</div>
      </div>
    `;

    // ====== 阶段二：分市场 ======
    const marketCards = vc.markets.map(m => `
      <div class="vc-market-card">
        <div class="vc-market-head">
          <span class="vc-market-region">${m.region}</span>
          <span class="vc-market-period">${m.period}</span>
        </div>
        <div class="vc-market-causes">
          <div class="vc-market-causes-label">驱动因素</div>
          <ul>${m.causes.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
        <div class="vc-market-result">
          <div class="vc-market-result-label">方向性判断</div>
          <p>${m.result}</p>
        </div>
        <p class="vc-market-source">数据基础：${m.source}</p>
      </div>
    `).join('');
    const marketSection = `
      <div class="vc-section vc-markets">
        <div class="vc-section-tag">
          <span class="vc-eyebrow">分区域市场 · 驱动因素</span>
          <span class="vc-grade">业界观察 · 非权威数据</span>
        </div>
        <p class="vc-markets-note">${vc.regionMarketsNote}</p>
        <div class="vc-markets-grid">${marketCards}</div>
      </div>
    `;

    // ====== 阶段三：价值链节点 ======
    const nodeCards = vc.nodes.map(n => `
      <div class="vc-node-card">
        <div class="vc-node-head">
          <span class="vc-node-level">${n.level}</span>
        </div>
        <div class="vc-node-name">${n.name}</div>
        <div class="vc-node-role">${n.role}</div>
        <p class="vc-node-stat">${n.stat}</p>
        <p class="vc-node-source">${n.source}</p>
      </div>
    `).join('');
    const nodesSection = `
      <div class="vc-section vc-nodes">
        <div class="vc-section-tag">
          <span class="vc-eyebrow">价值链节点 · 5 大集群</span>
        </div>
        <div class="vc-nodes-grid">${nodeCards}</div>
      </div>
    `;

    // ====== 阶段四：丰县节点详细（半小时产业圈 SVG）======
    const fx = vc.fengxian;
    const ringEls = fx.rings.map((r, i) => {
      const angle = (i / fx.rings.length) * Math.PI * 2 - Math.PI / 2;
      const r2 = 130;
      const cx = 220 + Math.cos(angle) * r2;
      const cy = 200 + Math.sin(angle) * r2;
      return `
        <g class="fc-ring" transform="translate(${cx} ${cy})">
          <circle r="36" fill="${ringColors[i % ringColors.length]}" opacity="0.15"/>
          <text text-anchor="middle" dy="6" font-family="var(--f-cn-serif, Georgia, serif)" font-size="15" fill="${ringColors[i % ringColors.length]}" font-weight="600">${r}</text>
        </g>
      `;
    }).join('');
    const fengxianSvg = `
      <svg class="fc-svg" viewBox="0 0 440 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="半小时产业圈：丰县电动车价值链节点">
        <defs>
          <marker id="fcArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9B8D76"/></marker>
        </defs>
        <circle cx="220" cy="200" r="55" fill="#14213D" stroke="#B07D2A" stroke-width="2"/>
        <text x="220" y="195" text-anchor="middle" font-family="var(--f-cn-serif, Georgia, serif)" font-size="20" font-weight="700" fill="#FAF7F2">丰县</text>
        <text x="220" y="218" text-anchor="middle" font-family="var(--f-en-mono, monospace)" font-size="9" letter-spacing="2" fill="#B07D2A">FENGXIAN</text>
        <circle cx="220" cy="200" r="160" fill="none" stroke="#9B8D76" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
        <text x="220" y="48" text-anchor="middle" font-family="var(--f-en-mono, monospace)" font-size="10" letter-spacing="3" fill="#7A4F1A" font-style="italic">— HALF-HOUR CIRCLE —</text>
        ${ringEls}
        ${fx.rings.map((_, i) => {
          const angle = (i / fx.rings.length) * Math.PI * 2 - Math.PI / 2;
          const r2 = 130;
          const cx = 220 + Math.cos(angle) * r2;
          const cy = 200 + Math.sin(angle) * r2;
          return `<line x1="220" y1="200" x2="${cx}" y2="${cy}" stroke="#9B8D76" stroke-width="0.8" opacity="0.5" marker-end="url(#fcArrow)"/>`;
        }).join('')}
        <g transform="translate(360 360)">
          <rect x="-66" y="-22" width="132" height="44" fill="#FFF" stroke="#B07D2A" stroke-width="1"/>
          <text x="0" y="-4" text-anchor="middle" font-family="var(--f-cn-serif, Georgia, serif)" font-size="11" fill="#14213D">外贸覆盖</text>
          <text x="0" y="14" text-anchor="middle" font-family="var(--f-en-mono, monospace)" font-size="14" font-weight="700" fill="#B07D2A">130+ 国</text>
        </g>
      </svg>
    `;
    const fengxianCases = fx.cases.map(c => 
      `<li><strong>${c.name}</strong> · ${c.role}：${c.desc}<span class="vc-case-source">（${c.source}）</span></li>`
    ).join('');
    const fengxianSection = `
      <div class="vc-section vc-fengxian">
        <div class="vc-section-tag">
          <span class="vc-eyebrow">价值链节点细节 · 丰县 · 半小时产业圈</span>
          <span class="vc-grade">${fx.grade}</span>
        </div>
        <div class="vc-fengxian-region">${fx.region}</div>
        <div class="vc-fengxian-body">
          <div class="vc-fengxian-svg">${fengxianSvg}</div>
          <div class="vc-fengxian-meta">
            <div class="vc-fengxian-capacity">
              <div class="vc-cap-item">
                <div class="vc-cap-eyebrow">电机产线</div>
                <div class="vc-cap-num">${fx.capacity.motorLine}</div>
              </div>
              <div class="vc-cap-item">
                <div class="vc-cap-eyebrow">控制器</div>
                <div class="vc-cap-num">${fx.capacity.controllerEfficiency}</div>
                <div class="vc-cap-note">${fx.capacity.controllerQuality}</div>
              </div>
              <div class="vc-cap-item">
                <div class="vc-cap-eyebrow">出口覆盖</div>
                <div class="vc-cap-num">${fx.exportReach.motor}</div>
                <div class="vc-cap-note">${fx.exportReach.total}</div>
              </div>
            </div>
            <div class="vc-fengxian-cases">
              <div class="vc-fengxian-cases-label">受访案例</div>
              <ul>${fengxianCases}</ul>
            </div>
          </div>
        </div>
        <p class="vc-section-source">数据来源：${fx.sources}</p>
      </div>
    `;

    wrap.innerHTML = `
      <div class="vc-head">
        <p class="vc-lede">${vc.lede}</p>
      </div>
      ${phaseSection}
      ${marketSection}
      ${nodesSection}
      ${fengxianSection}
    `;
  }

  /* ===== 电瓶车拆解图：进入视口时触发 8 条射线描边 ===== */
  function initExplodedScooter() {
    const svg = document.querySelector('#explodedScooter .exploded-svg');
    if (!svg) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          svg.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(svg);
  }

  /* ===== R17 · 散件出口流程（6 步） ===== */
  function renderCkdFlow() {
    const wrap = document.getElementById('ckdFlow');
    if (!wrap || !DATA.drivers || !DATA.drivers.ckdExport) return;
    const flow = DATA.drivers.ckdExport.flow;
    wrap.innerHTML = `
      <div class="ckd-flow-head">
        <span class="ckd-flow-eyebrow">CKD 散件出口 · 6 步全流程</span>
        <span class="ckd-flow-source">${DATA.drivers.ckdExport.source}</span>
      </div>
      <ol class="ckd-flow-steps">
        ${flow.map((s, i) => `
          <li class="ckd-flow-step" data-step="${s.step}">
            <div class="ckd-flow-num">${String(s.step).padStart(2, '0')}</div>
            <div class="ckd-flow-label">${s.label}</div>
            <div class="ckd-flow-desc">${s.desc}</div>
            ${i < flow.length - 1 ? '<div class="ckd-flow-arrow">→</div>' : ''}
          </li>
        `).join('')}
      </ol>
    `;
  }

  /* ===== R17 · 丰县 5 大事实 ===== */
  function renderFengxianFacts() {
    const wrap = document.getElementById('fengxianFacts');
    if (!wrap || !DATA.drivers || !DATA.drivers.fengxian) return;
    const facts = DATA.drivers.fengxian.facts;
    wrap.innerHTML = facts.map(f => `
      <div class="fengxian-fact">
        <div class="fengxian-fact-label">${f.label}</div>
        <div class="fengxian-fact-desc">${f.desc}</div>
      </div>
    `).join('');
  }

  /* ===== R17 · 访谈致谢 ===== */
  function renderInterviewCredits() {
    const wrap = document.getElementById('interviewCredits');
    if (!wrap || !DATA.interviews || !DATA.interviews.contributors) return;
    const contributors = DATA.interviews.contributors;
    wrap.innerHTML = contributors.map(c => `
      <div class="interview-credit">
        <div class="interview-credit-name">${c.name}</div>
        <div class="interview-credit-role">${c.role}</div>
        <div class="interview-credit-date">${c.date}</div>
      </div>
    `).join('');
  }
})();