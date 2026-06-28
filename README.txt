# 风格 C · Vogue Luxury

## 定位
高端时尚杂志感。极简白底 + 巨幅衬线斜体 + 大量留白 + 金色点缀。
适合"奢侈品向""走秀感""优雅端庄""高级感长读"。

## 视觉关键词
- **纯白底**：`#FFFFFF` + 极少装饰
- **Cormorant Garamond 衬线斜体**：所有标题用 400 italic，1em 行高
- **金色 `#bf9b30`**：唯一强调色，用于数字、引言、装饰
- **巨幅字号**：报头 `clamp(72px, 12vw, 160px)`、章节标题 `clamp(48px, 7vw, 96px)`
- **大留白**：章节 padding `120px`，hero padding `120px / 96px`
- **金色 ✦ 装饰**：作为章节前缀、栏目分隔
- **首字下沉 7em**：导语首字用斜体衬线，金色
- **居中排版**：所有章节起始居中，引言用 `text-align: center`

## 关键差异点
| vs v2 | 变化 |
|---|---|
| 报头 | "在路上" 56px → "在路上" 160px 斜体 |
| 主色调 | 红 + 海军蓝 → 黑 + 金 |
| 强调色 | 多色（红/橙/橄榄绿） → 单色（金） |
| 字体 | 思源宋 + 思源黑 → Cormorant Garamond 斜体 + Noto Sans |
| 排版 | 左对齐、紧凑 → 居中、大留白 |
| 引言 | 4em 实色首字 → 7em 斜体金色首字 |
| 装饰 | 简单横线 → ✦ 星号 · 斜体分隔符 |

## 适用 vs 不适用
✅ 高端品牌、奢侈品、时尚传媒、走秀场刊
❌ 不适合：数据密度高、商务感、移动端阅读（巨幅字号缩放困难）

## 文件清单
- `index.html` — 完整页面结构（多加载 Cormorant Garamond 字体）
- `css/style.css` — Vogue 奢华版样式
- `assets/preview/` — 6 张概览截图
- `README.txt` — 本文档

## 共享依赖
- `../../js/data.js`
- `../../js/main.js`
- `../../js/charts.js`

## R17 增量更新（2026-06-28）
新增 3 个访谈板块 + 1 个访谈致谢，整合 7 位行业一线受访者：

### ch2 末尾追加 3 个 aside 板块
1. **散件出口（CKD / SKD）** — 6 步全流程（`#ckdFlow`）+ 2 张访谈实拍图 + 商家账本
2. **江苏丰县 · 全球电动三轮车产业中心** — 受访者陆先生肖像（`interviewee-2-2.jpg`）+ 5 大事实（`#fengxianFacts`）
3. **区域利润排序** — 商家视角 5 大区域表（`#profitTable`）

### 文末致谢
4. **访谈贡献者致谢**（`#interviewCredits`） — 7 位受访者匿名/具名信息卡

### 受访者来源
- 受访者 1（匿名）：徐州苏征机车销售 · 小电驴出口（2026-06-26）
- 受访者 1b（匿名）：同一厂家 · 老挝散件出口
- 受访者 2：陆先生 · 杰玛电机销售（2026-06-25）
- ＋ 4 位匿名补充（古巴制裁、能源替代、土耳其中转、特种机器人）

### 增量数据
- `assets/interview/interviewee-{1,1b,2}-{1,2,3}.jpg` — 9 张访谈实拍
- `assets/preview/r17-{ckd,fengxian,profit,credits,brands,ch2,full}.png` — 7 张增量预览

### 技术说明
- R17 内容由 ROOT `../../js/main.js` 渲染（`renderCkdFlow` / `renderFengxianFacts` / `renderProfitTable` / `renderInterviewCredits`）
- R17 CSS 已合并至 `css/style.css`，原 ROOT 红色 (`#C8102E`) 已替换为 STYLE-C 金色 (`var(--accent-gold)`)
- 保持 Vogue Luxury 设计系统：`--accent-gold #bf9b30` Cormorant Garamond 斜体、`✦` 装饰、米白底大留白