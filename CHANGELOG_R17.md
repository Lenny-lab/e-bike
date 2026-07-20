# R17 增量更新日志

> 本地冻结版（未推送至 GitHub）。待网络恢复后用 `git push origin main` 一键推送。

## 提交总览

| Commit  | 时间                | 主题                               | 推送状态 |
|---------|---------------------|------------------------------------|----------|
| f4ee6cd | 2026-06-28 11:33 +0800 | R17 内容增量                       | ✅ 已推送 |
| 7f91832 | 2026-06-28 17:31 +0800 | CDN 本地化 + 移除 Cover 阻塞 + Reveal 兜底 | ⏸ 本地待推 |

---

## Commit `f4ee6cd` — R17 内容增量

### 主题
R17 访谈材料并入 STYLE-C：在 ch2 末尾插入 3 个访谈板块 + 文末访谈致谢，共 7 位行业一线受访者。

### 新增内容

| # | 板块 | 渲染容器 ID | 内容要点 |
|---|------|-------------|----------|
| 1 | 散件出口（CKD/SKD） | `ckdFlow` | 6 步全流程 + 2 张访谈实拍 + 商家账本 |
| 2 | 江苏丰县集群 | `fengxianFacts` | 杰玛电机销售陆先生 + 5 大产业事实 |
| 3 | 区域利润排序 | `profitTable` | 商家视角 5 大区域（古巴/中亚/东南亚/土耳其/欧洲） |
| 4 | 访谈贡献者致谢 | `interviewCredits` | 7 位受访者信息卡 |

### 资源文件

- **9 张访谈实拍图**
  `assets/interview/interviewee-1-1.jpg` / `interviewee-1-2.jpg` / `interviewee-1-3.jpg`
  `assets/interview/interviewee-1b-1.jpg` / `interviewee-1b-2.jpg` / `interviewee-1b-3.jpg`
  `assets/interview/interviewee-2-1.jpg` / `interviewee-2-2.jpg` / `interviewee-2-3.jpg`

- **7 张预览截图**
  `assets/preview/r17-brands.png` / `r17-ch2.png` / `r17-ckd.png` / `r17-credits.png` / `r17-fengxian.png` / `r17-full.png` / `r17-profit.png`

### 代码变更

| 文件 | 变更 |
|------|------|
| `index.html` | +144 行 — ch2 末尾插入 3 个 `<aside class="r17-block">` 板块，about 后插入致谢区 |
| `css/style.css` | +1520 行 — Vogue Luxury 风格的 R17 样式 + ROOT R17 CSS 提取（红色 → 金色） |
| `README.txt` | +28 行 — 新增 R17 章节说明 |
| `.gitignore` | +5 行 — 忽略 R17 调试脚本 |

### 设计系统保留

- 沿用 STYLE-C 黑色 + 金色 (`var(--accent-gold)`) 主调
- 字体保留 Cormorant Garamond 斜体大标题 + Noto Serif SC 正文
- ROOT 的红色 `#C8102E` 在样式表中已替换为金色 `var(--accent-gold)`
- 米白底 / `✦` 装饰 / 大留白风格不变

---

## Commit `7f91832` — CDN 本地化 + 空白页修复

### 主题
解决用户在浏览器中打开 `index.html` 时显示空白页的三大根因。

### 问题诊断

用户在受限网络环境下访问 STYLE-C 时出现整页空白，根因三条：

1. **CDN 阻塞**：`cdn.jsdelivr.net`（ECharts / GSAP / world.js 地图）和 `fonts.googleapis.com` 全部连不上 → 9 张图表 canvas 全部为空 + 字体未加载
2. **Cover 遮罩阻塞**：默认加载的 Vogue 风格 Cover 入口不会自动消失，下方主内容被遮罩
3. **Reveal 类动画未触发**：`.reveal { opacity: 0 }` 依赖 IntersectionObserver 触发 `.is-visible`，未滚动到位时元素永久隐藏

### 修复方案

| 修复项 | 文件 | 改动 |
|--------|------|------|
| ECharts / GSAP 本地化 | `assets/lib/{echarts.min.js, echarts-world.js, gsap.min.js}` | 从 jsdelivr 下载到本地（合计 1 MB） |
| index.html CDN 引用替换 | `index.html` | `cdn.jsdelivr.net` → `assets/lib/*`；`fonts.googleapis.com` → `fonts.font.im`（China 镜像） |
| Cover 默认禁用 | `js/style-C.js` 第 27 行 | `buildCover();` 注释掉（保留代码与 CSS 资产，要恢复取消注释即可） |
| Reveal 兜底 | `js/style-C.js` `initReveal()` | IO 失败时保持默认可见；IO 可用时加 `.reveal-anim`（隐藏态）做渐显动画 + 1.5 秒 `setTimeout` 兜底 |
| Reveal 默认可见 | `css/style.css` `.reveal` | `opacity: 1; transform: none;`；只有 `.reveal.reveal-anim` 才隐藏 |
| .gitignore | `.gitignore` | +7 行 — 忽略 `cdn-blocked-*` / `final-*` / `e2e_*` / `verify_styleC_*` / `reveal_trigger.py` 等调试脚本与截图 |

### 受影响代码段

```diff
- <link rel="preconnect" href="https://fonts.googleapis.com">
- <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
- <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:..." rel="stylesheet">
+ <link rel="preconnect" href="https://fonts.font.im">
+ <link rel="stylesheet" href="https://fonts.font.im/css2?family=Noto+Serif+SC:...">

- <script src="https://cdn.jsdelivr.net/npm/echarts@4.9.0/dist/echarts.min.js"></script>
- <script src="https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js"></script>
- <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
+ <script src="assets/lib/echarts.min.js"></script>
+ <script src="assets/lib/echarts-world.js"></script>
+ <script src="assets/lib/gsap.min.js"></script>
```

```diff
  // js/style-C.js
  document.addEventListener('DOMContentLoaded', () => {
-   buildCover();
+   // buildCover(); // R17 2026-06-28: 默认跳过 Cover 入口
+   // 如需重新启用 Cover，删除上面注释即可
    buildEditorNote();
    buildTOC();
    ...
  });

  function initReveal() {
    targets.forEach(el => el.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) {
-     targets.forEach(el => el.classList.add('is-visible'));
+     // 不支持 IO 时保持默认可见（CSS .reveal 已是 opacity:1）
      return;
    }
+   targets.forEach(el => el.classList.add('reveal-anim'));
+   setTimeout(() => {
+     targets.forEach(el => el.classList.add('is-visible'));
+   }, 1500);
    const io = new IntersectionObserver(...);
    ...
  }
```

```diff
  /* css/style.css */
  .reveal {
-   opacity: 0;
-   transform: translateY(28px);
+   opacity: 1;
+   transform: none;
    transition: opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1),
                transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  }
+ .reveal.reveal-anim {
+   opacity: 0;
+   transform: translateY(28px);
+ }
  .reveal.is-visible { opacity: 1; transform: none; }
```

---

## 本地验证方法

### 最简验证（用户视角）

直接双击打开：

```
G:\我的云端硬盘\数据新闻大赛协作\versions\style-C\index.html
```

应能看到：
- Hero 大标题 "一辆中国电瓶车如何驶向全球"
- 3 个数字卡（12.6 / 8.4 / 6.5）
- 5 个章节全部正常渲染
- 9 张图表（ECharts）全部出图
- ch2 末尾 3 个 R17 板块（CKD/SKD / 丰县 / 利润排序）
- 文末访谈致谢

### 自动化验证（开发者视角）

```python
# cdn-blocked 模式下跑完整 e2e 截图
from playwright.sync_api import sync_playwright
import time

URL = "file:///G:/我的云端硬盘/数据新闻大赛协作/versions/style-C/index.html"

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    # 路由屏蔽国外 CDN（验证本地化生效）
    ctx.route("**/cdn.jsdelivr.net/**", lambda route: route.abort())
    ctx.route("**/cdn.bootcdn.net/**", lambda route: route.abort())
    ctx.route("**/unpkg.com/**", lambda route: route.abort())
    ctx.route("**/fonts.googleapis.com/**", lambda route: route.abort())
    page = ctx.new_page()
    page.goto(URL, wait_until="domcontentloaded")
    time.sleep(3)
    # 检查 echartsLoaded / gsapLoaded
    info = page.evaluate("""() => ({
        echarts: typeof echarts !== 'undefined',
        gsap: typeof gsap !== 'undefined',
        chartCount: document.querySelectorAll('canvas').length
    })""")
    print(info)
    # 应该输出: {'echarts': True, 'gsap': True, 'chartCount': 9}
    browser.close()
```

预期输出：

```python
{'echarts': True, 'gsap': True, 'chartCount': 9}
```

---

## 推送指南（网络恢复后）

代理恢复后，按以下步骤推送本地待推 commit：

```powershell
# 1. 验证代理 / 网络
Test-NetConnection -ComputerName github.com -Port 443

# 2. 推送本地 HEAD（含 f4ee6cd + 7f91832）
cd "G:/我的云端硬盘/数据新闻大赛协作/versions/style-C"
git push origin main

# 3. 验证
git log --oneline -5
git ls-remote origin main
```

如果更换了代理端口：

```powershell
git config --global http.proxy http://127.0.0.1:<新端口>
git config --global https.proxy http://127.0.0.1:<新端口>
git push origin main
```

推送成功后，远程 HEAD 应为 `7f91832`。

---

## 受访者与素材清单

| # | 受访者 | 角色 | 时间 | 引用形式 |
|---|--------|------|------|----------|
| 1 | 陆先生 | 江苏丰县杰玛电机销售负责人 | 2024-11 | 具名 + 实拍 |
| 2 | 匿名 1 | 江苏汉邦车业 / 外贸相关 | 2026-06-25 | 匿名 |
| 3 | 匿名 2 | 江苏台州整车厂 / 设计总监 | 2026-06-25 | 匿名 |
| 4 | 匿名 3 | 浙江出口商 / 行业观察 | 2024-11 | 半匿名（"采访过的一位"） |
| 5 | 徐师傅 | 江苏丰县车架厂负责人 | 2026-06-25 | 半匿名 |
| 6 | 张先生 | 江苏丰县智博机车负责人 | 2026-06-25 | 半匿名 |
| 7 | 李志岗 | 徐州市北岭智能科技 / 总经理 | 2026-06-24 | 具名 |

总访谈贡献：7 人 + 3 段视频（含 9 帧静态图）