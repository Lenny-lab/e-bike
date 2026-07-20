/**
 * charts.js —— ECharts 图表初始化
 * 新闻业配色：FT 风格（深蓝 / 橙红 / 橄榄绿 / 暗金）
 * 所有图表去掉 boxy 的"卡片感"，融入文章流
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAllCharts, 100);
  });

  function initAllCharts() {
    if (typeof echarts === 'undefined') return;

    initChartYearly();
    initChartMap();
    initChartPrice();
    initChartSupply();
    initChartSentiment();
    initChartBattery();
    initChartSmart();
    initChartCert();
    initChartCompetition();

    // R21 · mobile 适配：window.resize 时所有 chart resize（用 IIFE 隔离变量名）
    (function () {
      let _rt;
      window.addEventListener('resize', () => {
        clearTimeout(_rt);
        _rt = setTimeout(() => {
          document.querySelectorAll('[id^="chart"]').forEach(el => {
            if (!el.id || !el.id.startsWith('chart')) return;
            const c = echarts.getInstanceByDom(el);
            if (c) c.resize();
          });
        }, 150);
      });
    })();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.querySelectorAll('.chart').forEach(el => {
          echarts.getInstanceByDom(el)?.resize();
        });
      }, 200);
    });
  }

  /* ===== 主题 ===== */
  const baseTheme = {
    textStyle: {
      fontFamily: '"Noto Sans SC", "Source Han Sans SC", sans-serif',
      color: '#1A1A1A'
    },
    grid: { left: 56, right: 32, top: 36, bottom: 40 },
    tooltip: {
      backgroundColor: 'rgba(20, 33, 61, 0.96)',
      borderColor: 'transparent',
      textStyle: { color: '#F5F1E6', fontSize: 12 },
      padding: [10, 14],
      extraCssText: 'border-radius: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15);'
    }
  };

  // 配色（FT 风）
  const PALETTE = ['#14213D', '#C8102E', '#D9822B', '#5B7C3D', '#0E4D8C', '#8B5A2B'];

  /* ===== 1.1 年度出口趋势 ===== */
  function initChartYearly() {
    const el = document.getElementById('chartYearly');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = DATA.market.yearly;
    const years = data.map(y => y.year);
    const volume = data.map(y => y.volume);
    const value = data.map(y => y.value);
    const mobile = window.innerWidth < 700;


    chart.setOption({
      ...baseTheme,
      legend: {
        data: [{ name: '出口量（万辆）' }, { name: '出口额（亿美元）' }],
        top: 0, left: 'center',
        textStyle: { color: '#4A4A4A', fontSize: window.innerWidth < 600 ? 10 : 12, fontFamily: 'Noto Sans SC' },
        itemWidth: 16, itemHeight: 10,
        itemGap: window.innerWidth < 600 ? 14 : 32
      },
      grid: { left: mobile ? 38 : 60, right: mobile ? 34 : 64, top: mobile ? 58 : 42, bottom: mobile ? 48 : 42 },
      xAxis: {
        type: 'category', data: years,
        axisLine: { lineStyle: { color: '#1A1A1A', width: 1 } },
        axisLabel: {
          color: '#4A4A4A', fontSize: 12, fontFamily: 'IBM Plex Mono',
          formatter: v => v
        },
        axisTick: { show: false }
      },
      yAxis: [
        {
          type: 'value', name: '万辆', position: 'left',
          nameTextStyle: { color: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono' },
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: '#888', fontSize: 11, fontFamily: 'IBM Plex Mono' },
          splitLine: { lineStyle: { color: '#E8E2D5', type: 'solid' } }
        },
        {
          type: 'value', name: '亿美元', position: 'right',
          nameTextStyle: { color: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono' },
          axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: '#888', fontSize: 11, fontFamily: 'IBM Plex Mono' },
          splitLine: { show: false }
        }
      ],
      tooltip: {
        ...baseTheme.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'line', lineStyle: { color: '#888' } },
        formatter: params => {
          const year = params[0].name;
          const y = data.find(d => String(d.year) === String(year));
          let html = `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${year}</div>`;
          params.forEach(p => {
            html += `<div style="font-size:12px;margin:3px 0;">${p.marker} ${p.seriesName}：<b style="font-family:IBM Plex Mono;">${p.value}</b></div>`;
          });
          html += `<div style="font-size:10px;opacity:0.6;margin-top:6px;font-family:IBM Plex Mono;">${y.source}</div>`;
          return html;
        }
      },
      series: [
        {
          name: '出口量（万辆）', type: 'bar', yAxisIndex: 0,
          data: volume.map(v => ({ value: v, itemStyle: { color: PALETTE[0] } })),
          barWidth: 28,
          emphasis: { itemStyle: { color: '#000' } },
          label: {
            show: !mobile, position: 'top',
            formatter: '{c}',
            color: '#4A4A4A', fontSize: window.innerWidth < 600 ? 8 : 10, fontFamily: 'IBM Plex Mono'
          },
          // R21 · mobile 减 bar 宽度，避免 5 根柱挤
          barWidth: mobile ? 16 : 28
        },
        {
          name: '出口额（亿美元）', type: 'line', yAxisIndex: 1,
          data: value, smooth: true, symbolSize: 7,
          lineStyle: { width: 2.5, color: PALETTE[1] },
          itemStyle: { color: PALETTE[1], borderColor: '#FAF7F0', borderWidth: 1.5 },
          markPoint: { data: [] }
        }
      ]
    });
  }

  /* ===== 1.2 世界地图 ===== */
  function initChartMap() {
    const el = document.getElementById('chartMap');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });

    const chinaCoord = [116.40, 39.90];
    const flows = DATA.market.mapFlows.map(f => ({
      fromName: '中国', toName: f.country,
      coords: [chinaCoord, f.to], value: f.value
    }));

    chart.setOption({
      ...baseTheme,
      tooltip: {
        ...baseTheme.tooltip,
        trigger: 'item',
        formatter: p => {
          if (p.seriesType === 'lines') {
            return `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${p.data.toName}</div>` +
                   `<div style="font-size:12px;">2025 出口额：<b style="color:#14213D;font-size:15px;font-family:IBM Plex Mono;">${p.data.value} 亿$</b></div>`;
          }
          if (p.seriesType === 'effectScatter') {
            const flow = DATA.market.mapFlows.find(f => f.country === p.name);
            if (flow) {
              return `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${flow.country}</div>` +
                     `<div style="font-size:12px;">出口额：<b style="color:#C8102E;font-size:14px;font-family:IBM Plex Mono;">${flow.value} 亿$</b></div>` +
                     `<div style="font-size:11px;opacity:0.7;margin-top:2px;">${flow.qty} 百万辆</div>`;
            }
            return `<b style="font-style:italic;">中国</b><br/><span style="opacity:0.6;font-size:11px;">出发地 · 2025 总出口 68.27 亿$</span>`;
          }
          return p.name || '';
        }
      },
      geo: {
        map: 'world', roam: false, zoom: 1.15, center: [10, 25],
        label: { show: false },
        itemStyle: {
          areaColor: '#F0EBE0',
          borderColor: '#FFFFFF',
          borderWidth: 1
        },
        emphasis: {
          label: { show: false },
          itemStyle: { areaColor: '#E0D7C2' }
        }
      },
      series: [
        {
          type: 'effectScatter', coordinateSystem: 'geo',
          data: [{ name: '中国', value: chinaCoord.concat([100]) }],
          symbolSize: 16,
          rippleEffect: { brushType: 'stroke', scale: 4, period: 4 },
          label: {
            show: true, position: 'right', color: PALETTE[0], fontWeight: 700, fontSize: 13,
            backgroundColor: 'rgba(250,247,240,0.85)', padding: [4, 6], borderRadius: 0,
            formatter: '{b}'
          },
          itemStyle: { color: PALETTE[0], borderColor: '#FAF7F0', borderWidth: 1.5 },
          zlevel: 4
        },
        {
          type: 'effectScatter', coordinateSystem: 'geo',
          data: DATA.market.mapFlows.map(f => ({ name: f.country, value: f.to.concat([f.value]) })),
          // ★ 按出口额 value 缩放：sqrt(value)*4.5，最小 6，最大约 18（美国 15.88 → ~17.9）
          symbolSize: d => Math.max(6, Math.min(20, Math.sqrt(d[2]) * 4.5)),
          rippleEffect: { brushType: 'stroke', scale: 2.2, period: 5 },
          showEffectOn: 'render',
          label: {
            show: true, position: 'right', distance: 4, color: '#1A1A1A',
            fontSize: 10, fontFamily: 'IBM Plex Mono',
            backgroundColor: 'rgba(250,247,240,0.7)',
            padding: [1, 3], borderRadius: 0,
            formatter: p => {
              const flow = DATA.market.mapFlows.find(f => f.country === p.name);
              return flow ? `${p.name} ${flow.value}` : p.name;
            }
          },
          itemStyle: { color: PALETTE[1], borderColor: '#FAF7F0', borderWidth: 0.8 },
          zlevel: 3
        },
        {
          type: 'lines', coordinateSystem: 'geo', zlevel: 1,
          data: flows,
          effect: { show: true, period: 5, trailLength: 0.3, symbol: 'arrow', symbolSize: 5, color: '#fff' },
          lineStyle: {
            color: PALETTE[0],
            width: 1.2, curveness: 0.3, opacity: 0.5
          }
        }
      ]
    });
  }

  /* ===== 1.3 单价分档（堆叠柱） ===== */

  function initChartPrice() {
    const el = document.getElementById('chartPrice');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = DATA.market.priceByTier;
    const mobile = window.innerWidth < 700;

    // ★ 统一配色：与 chartCert 同源金棕梯度（FT 风）
    const PRICE_COLOR = ['#E8DFCC', '#B07D2A', '#14213D'];

    chart.setOption({
      ...baseTheme,
      legend: {
        data: ['低端（<200 美元）', '中端（200-500 美元）', '高端（>500 美元）'],
        left: mobile ? 'center' : 'right', top: 0,
        textStyle: { color: '#4A4A4A', fontSize: mobile ? 10 : 12, fontFamily: 'Noto Sans SC' },
        itemWidth: 14, itemHeight: 10,
        itemGap: window.innerWidth < 600 ? 8 : 18
      },
      grid: { left: mobile ? 38 : 56, right: mobile ? 16 : 32, top: mobile ? 76 : 44, bottom: mobile ? 44 : 42 },
      xAxis: {
        type: 'category', data: data.map(d => d.year),
        axisLine: { lineStyle: { color: '#1A1A1A', width: 1 } },
        axisLabel: { color: '#4A4A4A', fontSize: mobile ? 10 : 12, fontFamily: 'IBM Plex Mono' },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value', name: '美元 / 辆',
        nameTextStyle: { color: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono' },
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#888', fontSize: 11, fontFamily: 'IBM Plex Mono' },
        splitLine: { lineStyle: { color: '#E8E2D5', type: 'solid' } }
      },
      tooltip: {
        ...baseTheme.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: params => {
          const year = params[0].name;
          const total = params.reduce((s, p) => s + p.value, 0);
          let html = `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${year}</div>`;
          html += `<div style="margin-bottom:4px;">均价：<b style="color:#14213D;font-size:14px;">${total.toFixed(0)} 美元/辆</b></div>`;
          params.forEach(p => {
            html += `<div style="font-size:11px;opacity:0.85;margin:2px 0;">${p.marker} ${p.seriesName}：${p.value}</div>`;
          });
          return html;
        }
      },
      series: [
        { name: '低端（<200 美元）', type: 'bar', stack: 'p', data: data.map(d => d.low), itemStyle: { color: PRICE_COLOR[0] } },
        { name: '中端（200-500 美元）', type: 'bar', stack: 'p', data: data.map(d => d.mid), itemStyle: { color: PRICE_COLOR[1] } },
        { name: '高端（>500 美元）', type: 'bar', stack: 'p', data: data.map(d => d.high), itemStyle: { color: PRICE_COLOR[2] } }
      ]
    });
  }

  /* ===== 2.2 三电配套率（横向条） ===== */
  function initChartSupply() {
    const el = document.getElementById('chartSupply');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = [...DATA.drivers.supplyChain].sort((a, b) => a.domestic - b.domestic);

    // ★ 三档颜色：≤50% 红色 (咽喉) · 50-80% 橙色 (追赶) · ≥80% 深蓝 (优势)
    const tierColor = v => v < 50 ? PALETTE[1] : v < 80 ? PALETTE[2] : PALETTE[0];

    chart.setOption({
      ...baseTheme,
      grid: { left: window.innerWidth < 600 ? 72 : 110, right: window.innerWidth < 600 ? 48 : 80, top: 24, bottom: 24 },
      xAxis: {
        type: 'value', max: 100,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#E8E2D5' } }
      },
      yAxis: {
        type: 'category', data: data.map(d => d.name),
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#1A1A1A', fontSize: window.innerWidth < 600 ? 10 : 13, fontFamily: 'Noto Serif SC, serif' }
      },
      tooltip: {
        ...baseTheme.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: params => {
          const p = params[0];
          const item = data[p.dataIndex];
          const tier = item.domestic < 50 ? '咽喉 · 高度依赖进口' : item.domestic < 80 ? '追赶中' : '优势稳固';
          let html = `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${item.name}</div>`;
          html += `<div style="font-size:12px;margin:3px 0;">本土配套率：<b style="font-family:IBM Plex Mono;color:#14213D;font-size:14px;">${item.domestic}%</b></div>`;
          html += `<div style="font-size:11px;opacity:0.75;margin-top:4px;font-style:italic;">${tier}</div>`;
          return html;
        }
      },
      series: [{
        type: 'bar',
        data: data.map(d => ({
          value: d.domestic,
          itemStyle: { color: tierColor(d.domestic) }
        })),
        barWidth: window.innerWidth < 600 ? 14 : 22,
        label: {
          show: true, position: 'right', distance: 6,
          formatter: '{c}%',
          color: '#1A1A1A', fontSize: window.innerWidth < 600 ? 10 : 12, fontFamily: 'IBM Plex Mono', fontWeight: 600
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#888', type: 'dashed', width: 1 },
          data: [
            { xAxis: 50, label: { show: false } },
            { xAxis: 80, label: { show: false } }
          ]
        }
      }]
    });
  }

  /* ===== 2.3 海外情感（堆叠条） ===== */
  function initChartSentiment() {
    const el = document.getElementById('chartSentiment');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = DATA.drivers.sentiment;
    const mobile = window.innerWidth < 700;

    chart.setOption({
      ...baseTheme,
      legend: {
        data: ['\u6b63\u9762', '\u4e2d\u6027', '\u8d1f\u9762'],
        left: mobile ? 'center' : 'right', top: 0,
        textStyle: { color: '#4A4A4A', fontSize: mobile ? 10 : 12, fontFamily: 'Noto Sans SC' },
        itemWidth: 12, itemHeight: 9,
        itemGap: mobile ? 10 : 18
      },
      grid: { left: mobile ? 76 : 112, right: mobile ? 18 : 54, top: mobile ? 54 : 46, bottom: mobile ? 22 : 28, containLabel: false },
      xAxis: {
        type: 'value', max: 100,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#E8E2D5' } }
      },
      yAxis: {
        type: 'category', data: data.map(d => d.topic),
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: {
          color: '#1A1A1A', fontSize: mobile ? 10 : 13, fontFamily: 'Noto Serif SC, serif',
          width: mobile ? 66 : 100, overflow: 'break', lineHeight: mobile ? 14 : 18
        }
      },
      tooltip: {
        ...baseTheme.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: params => {
          const topic = params[0].name;
          let html = `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${topic}</div>`;
          params.forEach(p => { html += `<div style="font-size:12px;margin:3px 0;">${p.marker} ${p.seriesName}\uff1a<b style="font-family:IBM Plex Mono;color:#D89E3F;">${p.value}%</b></div>`; });
          return html;
        }
      },
      series: [
        { name: '\u6b63\u9762', type: 'bar', stack: 's', barWidth: mobile ? 14 : 18, data: data.map(d => d.positive), itemStyle: { color: PALETTE[3] } },
        { name: '\u4e2d\u6027', type: 'bar', stack: 's', barWidth: mobile ? 14 : 18, data: data.map(d => d.neutral), itemStyle: { color: '#D8D2C5' } },
        { name: '\u8d1f\u9762', type: 'bar', stack: 's', barWidth: mobile ? 14 : 18, data: data.map(d => d.negative), itemStyle: { color: PALETTE[1] } }
      ]
    });
  }

  /* ===== 3.1 ?????????????? ===== */
  
  function initChartBattery() {
    const el = document.getElementById('chartBattery');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = DATA.upgrade.battery;
    const years = data.map(d => d.year);
    const mobile = window.innerWidth < 700;

    chart.setOption({
      ...baseTheme,
      legend: {
        data: ['铅酸电池', '锂电池', '固态电池'],
        left: mobile ? 'center' : 'right', top: 0,
        textStyle: { color: '#4A4A4A', fontSize: mobile ? 10 : 12, fontFamily: 'Noto Sans SC' },
        itemWidth: 14, itemHeight: 8,
        itemGap: window.innerWidth < 600 ? 8 : 18
      },
      grid: { left: mobile ? 38 : 56, right: mobile ? 18 : 32, top: mobile ? 58 : 48, bottom: mobile ? 36 : 42 },
      xAxis: {
        type: 'category', data: years, boundaryGap: false,
        axisLine: { lineStyle: { color: '#1A1A1A', width: 1 } },
        axisLabel: { color: '#4A4A4A', fontSize: mobile ? 10 : 12, fontFamily: 'IBM Plex Mono', interval: mobile ? 1 : 0 },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value', max: 100,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#888', fontSize: 11, fontFamily: 'IBM Plex Mono', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#E8E2D5' } }
      },
      tooltip: {
        ...baseTheme.tooltip, trigger: 'axis', axisPointer: { type: 'cross' },
        formatter: params => {
          const year = params[0].name;
          let html = `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${year}</div>`;
          params.forEach(p => {
            html += `<div style="font-size:12px;margin:3px 0;">${p.marker} ${p.seriesName}：<b style="font-family:IBM Plex Mono;">${p.value}%</b></div>`;
          });
          return html;
        }
      },
      series: [
        {
          name: '铅酸电池', type: 'line', smooth: true,
          data: data.map(d => d.leadAcid),
          lineStyle: { color: '#B8B8B8', width: 1.6 },
          itemStyle: { color: '#B8B8B8' },
          symbol: 'circle', symbolSize: 5
        },
        {
          name: '锂电池', type: 'line', smooth: true,
          data: data.map(d => d.lithium),
          lineStyle: { color: PALETTE[0], width: 3 },
          itemStyle: { color: PALETTE[0], borderColor: '#FAF7F0', borderWidth: 1.5 },
          symbol: 'circle', symbolSize: 9,
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(20,33,61,0.18)' },
                { offset: 1, color: 'rgba(20,33,61,0)' }
              ]
            }
          },
          emphasis: { focus: 'series' }
        },
        {
          name: '固态电池', type: 'line', smooth: true,
          data: data.map(d => d.solidState),
          lineStyle: { color: PALETTE[1], width: 2, type: 'dashed' },
          itemStyle: { color: PALETTE[1] },
          symbol: 'circle', symbolSize: 7,
          emphasis: { focus: 'series' }
        }
      ]
    });
  }

  /* ===== 3.2 智能化（雷达） ===== */
  function initChartSmart() {
    const el = document.getElementById('chartSmart');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = DATA.upgrade.smartFeatures;
    const mobile = window.innerWidth < 700;
    const maxVal = Math.ceil(Math.max(...data.map(d => d.rate)) / 10) * 10 + 10;

    chart.setOption({
      ...baseTheme,
      tooltip: { ...baseTheme.tooltip, formatter: p => `${p.name}<br/>\u6e17\u900f\u7387\uff1a<strong style="color:#D89E3F;">${p.value}%</strong>` },
      radar: {
        indicator: data.map(d => ({ name: d.feature, max: maxVal })),
        center: ['50%', mobile ? '54%' : '56%'], radius: mobile ? '47%' : '60%',
        axisName: { color: '#1A1A1A', fontSize: mobile ? 10 : 12, fontFamily: 'Noto Serif SC, serif', lineHeight: 14 },
        splitNumber: 4,
        splitLine: { lineStyle: { color: '#D8D2C5', width: 0.8 } },
        splitArea: { areaStyle: { color: ['rgba(250,247,240,0)', 'rgba(240,235,224,0.45)'] } },
        axisLine: { lineStyle: { color: '#D8D2C5', width: 0.6 } }
      },
      series: [{
        type: 'radar', symbol: 'circle',
        data: [{
          value: data.map(d => d.rate), name: '\u667a\u80fd\u5316\u6e17\u900f\u7387', symbolSize: mobile ? 4 : 6,
          lineStyle: { color: PALETTE[1], width: mobile ? 1.8 : 2.2 },
          itemStyle: { color: PALETTE[1], borderColor: '#FAF7F0', borderWidth: 1.5 },
          areaStyle: { color: { type: 'radial', x: 0.5, y: 0.5, r: 0.5, colorStops: [{ offset: 0, color: 'rgba(200,16,46,0.30)' }, { offset: 1, color: 'rgba(200,16,46,0.08)' }] } },
          label: { show: !mobile, color: '#1A1A1A', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 600, formatter: '{c}%', backgroundColor: 'rgba(250,247,240,0.85)', padding: [2, 4] }
        }]
      }]
    });
  }

  /* ===== 4.2 ???? ===== */
  
  function initChartCert() {
    const el = document.getElementById('chartCert');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = DATA.risk.certification;
    const mobile = window.innerWidth < 700;

    chart.setOption({
      ...baseTheme,
      grid: { left: mobile ? 42 : 58, right: mobile ? 14 : 48, top: mobile ? 28 : 38, bottom: mobile ? 82 : 46, containLabel: true },
      xAxis: {
        type: 'category', data: data.map(d => d.name),
        axisLine: { lineStyle: { color: '#1A1A1A', width: 1 } },
        axisLabel: { color: '#4A4A4A', interval: 0, fontFamily: 'Noto Sans SC', rotate: mobile ? -42 : 0, fontSize: mobile ? 10 : 12, width: mobile ? 58 : 90, overflow: 'break' },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value', name: mobile ? '' : '\u4e07\u7f8e\u5143',
        nameTextStyle: { color: '#888', fontSize: 10, fontFamily: 'IBM Plex Mono' },
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#888', fontSize: mobile ? 10 : 11, fontFamily: 'IBM Plex Mono' },
        splitLine: { lineStyle: { color: '#E8E2D5' } }
      },
      tooltip: {
        ...baseTheme.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: p => {
          const d = data[p[0].dataIndex];
          return `<div style="font-family:Georgia,serif;font-style:italic;font-size:14px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:6px;">${d.name}</div>` +
                 `<div style="font-size:12px;margin:3px 0;">\u8ba4\u8bc1\u6210\u672c\uff1a<b style="color:#D89E3F;font-family:IBM Plex Mono;">${d.cost} \u4e07\u7f8e\u5143</b></div>` +
                 `<div style="font-size:11px;margin:2px 0;opacity:0.85;">\u5468\u671f\uff1a${d.duration}</div>` +
                 `<div style="font-size:11px;opacity:0.85;">\u8986\u76d6\uff1a${d.scope}</div>`;
        }
      },
      series: [{
        type: 'bar',
        data: data.map((d, i) => ({ value: d.cost, itemStyle: { color: i === 0 ? PALETTE[1] : PALETTE[2], borderRadius: [2, 2, 0, 0] } })),
        barWidth: mobile ? 18 : 34,
        label: { show: !mobile, position: 'top', distance: 6, formatter: '{c}', color: '#1A1A1A', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 600 }
      }]
    });
  }

  /* ===== 4.3 ????????? ===== */
  
  function initChartCompetition() {
    const el = document.getElementById('chartCompetition');
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    const data = DATA.risk.competition;
    const colorMap = {
      china: ['#14213D', '#2C3E66', '#3D527A', '#5E78A8', '#8AA0C2'],
      japan: ['#C8102E', '#D63D55', '#E26678'],
      local: ['#5B7C3D', '#7E9F60']
    };
    let selected = null;
    let preview = null;
    const isMobile = () => window.innerWidth < 700;
    const activeItem = () => preview || selected;
    const pieData = data.map(d => {
      const sameType = data.filter(x => x.type === d.type);
      const idx = sameType.findIndex(x => x.brand === d.brand);
      return { name: d.brand, value: d.share, itemStyle: { color: colorMap[d.type][idx] } };
    });
    // ★ R50：去掉环形图中心文字，交互信息只通过 tooltip / 图例高亮表达
    const centerGraphic = () => [];
    const optionForViewport = () => ({
      ...baseTheme,
      tooltip: {
        ...baseTheme.tooltip,
        trigger: 'item',
        formatter: p => {
          const item = data.find(d => d.brand === p.name);
          return `<div style="font-size:12px;margin:3px 0;">\u539f\u4ea7\u56fd\uff1a<b style="color:#F5F1E6;">${item.region}</b></div>` +
                 `<div style="font-size:12px;">\u4efd\u989d\uff1a<b style="color:#D89E3F;font-size:15px;font-family:IBM Plex Mono;">${p.value}%</b></div>`;
        }
      },
      legend: {
        type: 'plain',
        orient: isMobile() ? 'horizontal' : 'vertical',
        right: isMobile() ? 'center' : '2%',
        left: isMobile() ? 'center' : 'auto',
        top: isMobile() ? '74%' : 'middle',
        width: isMobile() ? '94%' : 220,
        itemWidth: 11,
        itemHeight: 11,
        itemGap: isMobile() ? 7 : 11,
        textStyle: { color: '#1A1A1A', fontSize: isMobile() ? 10 : 12, fontFamily: 'Noto Sans SC', lineHeight: 16 },
        formatter: name => {
          const item = data.find(d => d.brand === name);
          return `${name}  ${item.share}%`;
        }
      },
      graphic: centerGraphic(),
      series: [{
        type: 'pie',
        radius: isMobile() ? ['30%', '50%'] : ['32%', '56%'],
        center: isMobile() ? ['50%', '38%'] : ['36%', '50%'],
        avoidLabelOverlap: true,
        selectedMode: 'single',
        selectedOffset: 10,
        itemStyle: { borderColor: '#FAF7F0', borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: true, scaleSize: 4 },
        data: pieData.map(d => ({ ...d, selected: !!selected && d.name === selected.brand }))
      }]
    });
    chart.setOption(optionForViewport());
    chart.on('mouseover', params => {
      const item = data.find(d => d.brand === params.name);
      if (!item) return;
      preview = item;
      chart.setOption({ graphic: centerGraphic() });
    });
    chart.on('mouseout', () => {
      preview = null;
      chart.setOption({ graphic: centerGraphic() });
    });
    chart.on('click', params => {
      const item = data.find(d => d.brand === params.name);
      if (!item) return;
      selected = selected && selected.brand === item.brand ? null : item;
      preview = null;
      chart.setOption(optionForViewport(), true);
    });
    window.addEventListener('resize', () => chart.setOption(optionForViewport(), true));
  }
})();
