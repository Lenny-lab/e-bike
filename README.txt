# 小电驴驶向大世界 · 从 2020 到 2025 一辆中国电动车如何出海、变身与落地

> **数据新闻大赛参赛作品 · 风格 C · Vogue Luxury**
> 高端时尚杂志感。米白底 + 衬线斜体大标题 + 金色点缀 + 大量留白 + ✦ 装饰

## 项目定位

一份基于 UN Comtrade / 中国海关总署 / Statista / 上市公司年报 / 7 位行业一线受访者的**深度数据新闻作品**：

- 2020—2025 五个完整年度间隔，中国“装有驱动电动机的摩托车及脚踏车”（HS 87116000）出口量从 **1,794 万辆**增至 **2,673 万辆**（按 2025 海关总署年度明细表 26,726,934 辆计），五年 CAGR **+8.30%**；出口额从 **35.05 亿美元**增至 **68.27 亿美元**（按 6,826,606,215 美元计），五年 CAGR **+14.26%**。
- 2020—2025 累计出口 **1.21 亿辆**，2025 年单一年度覆盖 **199** 个有正值的贸易伙伴。
- 2026 年第一季度单季再添 **720 万辆**，同比 **+68.2%**（媒体援引行业通报 · B 级）。
- 5 大洲流向轨迹 · 9 张可视化图表（含 §6 法规切面 + §8 产业链分层 + §9 海外需求）
- 散件出口 / 丰县集群 / 区域利润 / 智能化升级 / 贸易摩擦 5 大专题
- **7 位受访者** · 76 张实拍访谈图 + 工厂车间照

## 文件结构

```
小电驴/                          ← 当前仓库根目录
├── .git/                        ← GitHub: Lenny-lab/e-bike
├── index.html                   ← 单页全长 96 页 · 5 章
├── css/style.css                ← Vogue Luxury 设计系统 (120 KB)
├── js/
│   ├── style-C.js               ← 主交互逻辑 (71 KB)
│   └── vendor/                  ← ROOT JS 已 vendor 化 (ECharts / 数据 / 主控)
├── assets/
│   ├── lib/                     ← echarts / gsap 本地 (无外网 CDN)
│   ├── interview/               ← 9 张访谈实拍图
│   ├── preview/                 ← 截图存档 (含 R17-R22 多轮截图)
│   └── share/                   ← 社交分享卡
├── README.txt                   ← 本文档
├── CHANGELOG_R17.md             ← R17 内容增量
├── CHANGELOG_R18.md             ← R18 视觉打磨
└── CHANGELOG_R19.md             ← R19 冲刺三轮审查
```

## 设计系统（Vogue Luxury · STYLE-C）

- **纯白底** `#FAF7F0` + 极少装饰
- **衬线斜体大标题**：`Georgia / Source Han Serif SC`（系统字体栈 · 完全离线）
- **金色** `#bf9b30` 唯一强调色 · 用于数字、引言、装饰
- **巨幅字号**：报头 `clamp(72px, 12vw, 160px)` · 章节标题 `clamp(48px, 7vw, 96px)`
- **大留白**：章节 padding `72-120px` (responsive)
- **金色 ✦ 装饰** · 首字下沉 7em 衬线斜体

字体策略：**R22 起完全本地化**，移除 `fonts.font.im` 外链。所有设备 100% 离线可用：
```
--f-serif-display: Georgia, 'Songti SC', 'Source Han Serif SC', serif
--f-serif: 'Source Han Serif SC', 'Songti SC', Georgia, serif
--f-sans: -apple-system, PingFang SC, Microsoft YaHei, sans-serif
--f-mono: SF Mono, Menlo, Consolas, monospace
```

## 章节结构（R50 · 0717 整改后）

| 章节 | 主线问题 | 关键内容 |
| --- | --- | --- |
| Hero | — | 2020—2025 六个完整年度 + 2026Q1 单列 + 巨大数字条 |
| Lede | — | 3.5 亿人社会保有量 / 180 国家 |
| **01 出发** | 它走了多远？ | chartYearly 6 年 + 地图 + 5 区域 + chartPrice 4 年 + 1.21 亿辆累计 |
| **02 成链** | 谁把它造出来？ | identityJourney §6 法规切面 + §7 CKD 散件 + §8 产业链分层（国家—省—市—县区）+ §9 海外需求 |
| **03 驱动力** | 谁在推它出海？ | 政策时间轴 + chartSupply 三电 + 8 部件拆解 + 情感分析 + 区域利润 + 丰县 |
| **04 变身** | 到了海外变成什么？ | NIU 公告 + chartSmart 智能 + 4 品牌案例 + chartBattery（移除）+ chartSentiment |
| **05 落地** | 怎样留下来？ | 贸易摩擦时间轴 + chartCert 6 国 + chartCompetition + 风险三类图 |
| **06 下一站** | 下一站要完成什么？ | 三场转换：被命名 / 被维修 / 被信任 |
| Credits | — | 7 位受访者完整信息卡 |
| Footer | — | 数据与方法 + 致谢 |

## 响应式（R21 全适配）

| 视口 | 宽度 | 适配要点 |
| --- | --- | --- |
| Mobile | ≤ 600px | nav 紧 / hero 40-56px / chapter 32-44px / case-stats 3→1 列 / 浮动按钮紧凑 / chart mobile 自适应 / 表格 6→卡片堆叠 |
| Tablet | 601-900px | nav 13px / case-stats 3 列 gap 紧 / 浮动按钮间距收 |
| Desktop | > 900px | FT 杂志风全展开 · 70+ 字段 / 28 像素网格 |

**所有 chart** (`chartYearly / Price / Supply / Battery / Smart / Cert / Competition`) 都在 `window.innerWidth < 600` 时自适应：
- 柱图 barWidth 28→14
- 雷达 radius 62→58%, 字号 12→9
- 饼图 legend 垂直→水平, center 34%→50%
- 认证成本 X 轴 8 国标签 rotate -30°

## 数据新闻大赛标准对照（R22 状态）

| 标准 | 状态 | 说明 |
| --- | --- | --- |
| 数据来源标注 | ✅ | 8/8 数据图 + region-cell 都有 `.figure-source` |
| 数据准确性 | ✅ | 2213 / 4.79 / 5 region 均对齐 UN Comtrade A1-INTL VERIFIED |
| 引用可追溯 | ✅ | 7 位访谈者 + 10+ 公开数据源 + 公司年报 URL |
| 时间一致性 | ✅ | 访谈 24-26 号、timeline 2018-2025、月度精度 |
| 视觉打磨 | ✅ | Vogue Luxury 全套 / ✦ 装饰 / Cormorant 斜体大标题 |
| 响应式 | ✅ | desktop/tablet/mobile 三视口 0 overflow |
| 可访问性 | ✅ | skip-link + landmarks + aria-label + alt + reduced-motion |
| 性能 | ✅ | 本地 ECharts / 字体完全本地 / lazy img / reveal fallback |
| SEO | ✅ | h1 / og:* / twitter:card / canonical / theme-color |
| 字体离线 | ✅ | R22 起 0 外链字体 · system stack 100% 可用 |

## Git 提交历史

```
b1aea56  R22 字体完全本地化 · 修复移动 4G/5G 字体加载失败导致排版乱
2ac1273  R21.1 mobile polish · 作者手动优化
a46de71  R21 响应式适配 · 移动端 + 平板端视觉优化
1df3984  R20.1 polish · 截图扫描后的两处收尾
a925b42  R20 polish · SEO/可访问性/heading 语义化深度优化
ab532ad  R19 参赛标准冲刺 · 三轮审查 + ROOT vendor
02798e1  R18: 修复区域利润表数字标号看不见
a2c5c99  R18: 修复右下角浮动元素重叠 + 图例居中
7f91832  CDN 本地化 + 移除 Cover 阻塞 + Reveal 兜底：消除空白页
f4ee6cd  R17: 散件出口 / 丰县集群 / 区域利润排序 / 访谈致谢
c9600de  Version C: 中国小电驴出海数据新闻作品
```

## 本地运行

```bash
# 直接打开
open index.html        # macOS
start index.html       # Windows

# 或起本地服务器 (推荐)
python -m http.server 8000
# → http://localhost:8000/
```

## 部署

GitHub Pages 推荐配置（仓库 Settings → Pages）：

- **Source**: Deploy from a branch
- **Branch**: `main` / `(root)`
- **URL**: `https://lenny-lab.github.io/e-bike/`

## 致谢

- **采编**：秦文雨 · 单文溪 · 卜言庆
- **数据**：朱桂子瑜 · 赵晨瑜
- **视觉**：李一
- **指导**：数据新闻教研室
- **受访者**：徐州苏征机车销售、杰玛电机、徐州科亚机电、徐州南普机电、江苏汉邦车业、丰县电动车行业协会等 7 位行业一线

— 在路上编辑部