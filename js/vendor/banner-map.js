/**
 * banner-map.js -- chapter banner map, visual polish only.
 */
(function () {
  'use strict';

  function initBannerMaps() {
    const containers = document.querySelectorAll('.banner-map');
    if (!containers.length || typeof echarts === 'undefined') return;

    containers.forEach(el => {
      const id = el.id || ('bannerMap_' + Math.random().toString(36).slice(2, 8));
      el.id = id;
      const chart = echarts.init(el, null, { renderer: 'canvas' });
      const flows = (window.DATA && window.DATA.market && window.DATA.market.mapFlows) || [];
      if (!flows.length) return;
      const maxV = Math.max.apply(null, flows.map(f => f.value));
      const minV = Math.min.apply(null, flows.map(f => f.value));
      const spread = Math.max(maxV - minV, 0.01);
      const china = [116.4074, 39.9042];
      const mainCountries = {
        '\u7f8e\u56fd': 'right',
        '\u5fb7\u56fd': 'top',
        '\u5370\u5ea6': 'right',
        '\u5370\u5c3c': 'right'
      };
      const linesData = flows.map(f => {
        const t = (f.value - minV) / spread;
        return {
          coords: [china, f.to],
          value: f.value,
          country: f.country,
          qty: f.qty,
          lineStyle: {
            color: t > 0.78 ? '#14213D' : '#6E778A',
            width: 0.55 + Math.pow(t, 0.72) * 2.35,
            opacity: 0.34 + t * 0.52,
            curveness: f.to[0] < -30 ? 0.32 : 0.22
          }
        };
      });
      const pointsData = flows.map(f => {
        const t = (f.value - minV) / spread;
        return {
          name: f.country,
          value: [...f.to, f.value],
          showLabel: !!mainCountries[f.country],
          labelPos: mainCountries[f.country] || 'right',
          symbolSize: 5.5 + t * 5.5,
          label: { position: mainCountries[f.country] || 'right' },
          itemStyle: { color: '#B5122B', borderColor: '#FAF7F2', borderWidth: 1.2 }
        };
      });
      pointsData.unshift({
        name: '\u4e2d\u56fd',
        value: [...china, maxV * 1.25],
        showLabel: true,
        labelPos: 'left',
        symbolSize: 17,
        label: { position: 'left' },
        itemStyle: { color: '#C8102E', borderColor: '#FAF7F2', borderWidth: 2 }
      });

      const option = {
        backgroundColor: '#FBF8F1',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(20,33,61,0.96)',
          borderColor: '#B07D2A',
          borderWidth: 1,
          padding: [10, 14],
          textStyle: { color: '#F5F1E6', fontSize: 12, fontFamily: 'Noto Sans SC, Georgia, serif' },
          extraCssText: 'box-shadow: 4px 4px 0 rgba(176,125,42,0.2);',
          formatter: function (p) {
            if (p.seriesType === 'lines') {
              return `<div style="font-family:Georgia,serif;font-style:italic;font-size:15px;border-bottom:1px solid #B07D2A;padding-bottom:4px;margin-bottom:5px;">${p.data.country}</div>` +
                `<div>2024 \u51fa\u53e3\u989d <b style="color:#D89E3F;font-size:14px;">${p.data.value} \u4ebf$</b></div>` +
                `<div style="opacity:.72;font-size:11px;margin-top:2px;">${p.data.qty} \u767e\u4e07\u8f86</div>`;
            }
            if (p.seriesType === 'scatter' || p.seriesType === 'effectScatter') {
              return p.name === '\u4e2d\u56fd'
                ? `<b>\u4e2d\u56fd</b><br/><span style="opacity:.72;font-size:11px;">\u51fa\u53d1\u5730 \u00b7 \u4e3b\u8981\u5f27\u7ebf\u6c47\u805a\u70b9</span>`
                : `<b>${p.name}</b>`;
            }
            return '';
          }
        },
        geo: {
          map: 'world',
          roam: false,
          zoom: window.innerWidth < 700 ? 1.02 : 1.18,
          center: window.innerWidth < 700 ? [55, 23] : [62, 26],
          label: { show: false },
          itemStyle: { areaColor: '#EFE2C8', borderColor: '#FFFFFF', borderWidth: 0.7 },
          emphasis: { disabled: true },
          silent: true
        },
        series: [
          { type: 'lines', coordinateSystem: 'geo', data: linesData, zlevel: 1, silent: false, large: true, lineStyle: { curveness: 0.26 } },
          {
            type: 'scatter', coordinateSystem: 'geo', data: pointsData, zlevel: 3,
            symbol: 'circle', symbolSize: val => val && val[2] >= maxV ? 16 : 6,
            label: {
              show: true,
              position: 'right',
              distance: 5,
              formatter: p => p.data && p.data.showLabel ? p.name : '',
              fontSize: window.innerWidth < 700 ? 10 : 11,
              fontWeight: 700,
              color: '#14213D',
              backgroundColor: 'rgba(251,248,241,0.84)',
              padding: [1, 3],
              textBorderColor: '#FBF8F1',
              textBorderWidth: 2
            },
            emphasis: { scale: 1.45, label: { show: true } }
          }
        ]
      };
      chart.setOption(option);
      window.addEventListener('resize', () => chart.resize());
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBannerMaps);
  else initBannerMaps();
})();
