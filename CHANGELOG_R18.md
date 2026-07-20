# R18 视觉修复日志

> 本地冻结版（未推送至 GitHub）。待网络恢复后用 `git push origin main` 一键推送。

## 提交总览

| Commit  | 时间                | 主题                               | 推送状态 |
|---------|---------------------|------------------------------------|----------|
| a2c5c99 | 2026-06-28 18:00 +0800 | 右下角浮动元素重叠 + 图例居中     | ⏸ 本地待推 |
| 02798e1 | 2026-06-28 18:25 +0800 | 区域利润表数字标号可见性         | ⏸ 本地待推 |

---

## Commit `a2c5c99` — 右下角浮动元素重叠 + 图例居中

### 问题 1：右下角三件套重叠

**症状**：SHARE / TOP / PAGE (FOLIO) 三个浮动按钮在屏幕右下挤在一起，TOP 按钮的下边框线压住 FOLIO 文字。

**根因**（实测位置，视口 1440×900）：

| 元素 | CSS bottom | 实测 top | 实测 bottom |
|------|-----------|----------|-------------|
| `.share-btn` | 184px | 666 | 716 |
| `.back-to-top` | 110px | 734 | 790 |
| `.page-number` | 24px | 771 | 876 |

TOP (734-790) 跟 PAGE (771-876) 垂直重叠 19px。

**修复**（`versions/style-C/css/style.css`）：

```diff
  .share-btn {
    position: fixed;
-   right: 24px; bottom: 184px;
+   right: 24px; bottom: 232px;  /* 上挪 48px */
    ...
  }

  .back-to-top {
    position: fixed;
-   right: 24px; bottom: 110px;
+   right: 24px; bottom: 152px;  /* 上挪 42px */
    ...
  }
```

**新间距**：SHARE ↔ TOP 24px，TOP ↔ PAGE 23px。

### 问题 2：图表图例文字重叠

**症状**：`chartYearly` 图右上角，"出口量（万辆）"和"出口额（亿美元）"两个图例挤成一团，文字互相覆盖。

**根因**（`js/charts.js` line 72-78）：legend 配置 `right: 0, top: 0` + `itemGap: 18`，靠右对齐且间距过窄，导致两个长文本标签溢出重叠。

**修复**（`js/charts.js`）：

```diff
  legend: {
    data: [{ name: '出口量（万辆）' }, { name: '出口额（亿美元）' }],
-   right: 0, top: 0,
+   top: 0, left: 'center',       /* 顶部居中，不再跟右轴挤 */
    textStyle: { color: '#4A4A4A', fontSize: 12, fontFamily: 'Noto Sans SC' },
-   itemWidth: 14, itemHeight: 10,
-   itemGap: 18
+   itemWidth: 16, itemHeight: 10,
+   itemGap: 32
  },
```

> ⚠️ 此修改在**根目录的 `js/charts.js`**（`G:\我的云端硬盘\数据新闻大赛协作\js\charts.js`），根目录不是 git 仓库，**该修改不会进 git 历史**。等下次同步若重置根目录会丢失。

---

## Commit `02798e1` — 区域利润表数字标号可见性

### 症状

R17 区域利润排序表的左侧数字标号 1-5，第 2、3 行的数字完全消失，第 5 行几乎看不见。

### 根因（`versions/style-C/css/style.css` line 3793-3815）

```css
.profit-rank-badge.rank-2 { background: var(--accent-amber); }   /* 变量未定义 */
.profit-rank-badge.rank-3 { background: var(--accent-olive); }   /* 变量未定义 */
.profit-rank-badge.rank-5 { background: var(--ink-fade); }       /* #c8c8c8 太浅，白字看不清 */
```

`--accent-amber` 和 `--accent-olive` 在 STYLE-C CSS 变量系统中**从未定义**，导致 rank-2/3 背景色变成默认 transparent（透明），白色数字直接消失。rank-5 用了 `#c8c8c8` 浅灰背景 + 白色数字，对比度也不够。

### 修复

| Rank | 之前 | 现在 | 颜色 |
|------|------|------|------|
| 1 | `--accent-gold` | 不变 | 金 #bf9b30 |
| 2 | `--accent-amber` ⚠️ | `--accent-bronze` | 深金 #8b6f1f |
| 3 | `--accent-olive` ⚠️ | `--ink-soft` | 深灰 #4a4a4a |
| 4 | `--ink-mute` | 不变 | 灰 #888 |
| 5 | `--ink-fade` ⚠️ | `--ink-soft` | 深灰 #4a4a4a |

```diff
  .profit-rank-badge.rank-2 {
-   background: var(--accent-amber);
+   background: var(--accent-bronze);  /* R18 修复 amber 未定义 */
  }
  .profit-rank-badge.rank-3 {
-   background: var(--accent-olive);
+   background: var(--ink-soft);  /* R18 修复 olive 未定义 */
  }
  .profit-rank-badge.rank-5 {
-   background: var(--ink-fade);
+   background: var(--ink-soft);  /* R18 修复 ink-fade 太浅 */
  }
```

### 附带变更

`.gitignore` 增加忽略：
- `corner-test.png` / `chart-legend-test.png` / `profit-table-fix.png`
- `check_corner.py` / `check_legend.py` / `check_profit.py`

---

## 累计待推 commits

```
a2c5c99  R18: 修复右下角浮动元素重叠 + 图例居中
02798e1  R18: 修复区域利润表数字标号看不见
7f91832  CDN 本地化 + 移除 Cover 阻塞 + Reveal 兜底：消除空白页
```

> 加上已推的 `f4ee6cd`，本地分支比远端领先 3 个 commit。代理恢复后 `git push origin main` 一键同步。

## 验证方法

```powershell
# 1. 验证代理 / 网络
Test-NetConnection -ComputerName github.com -Port 443

# 2. 推送（一次性带走 3 个本地 commit）
cd "G:/我的云端硬盘/数据新闻大赛协作/versions/style-C"
git push origin main

# 3. 验证远端 HEAD
git ls-remote origin main
# 期望输出：02798e1xxxxxxxx...
```

## 本地现状一览

| 项 | 状态 |
|---|---|
| 工作区干净 | ✅ `git status` 无未提交改动 |
| 本地领先远端 | 3 个 commit |
| 图表代码同步风险 | ⚠️ `js/charts.js`（根目录）未进 git |
| 双击 index.html 可看完整版 | ✅ |

修复后用户视角截图：
- 右下角三件套不重叠：`versions/style-C/assets/preview/corner-test.png`
- 图例居中显示：`versions/style-C/assets/preview/chart-legend-test.png`
- 五个数字标号都看得见：`versions/style-C/assets/preview/profit-table-fix.png`