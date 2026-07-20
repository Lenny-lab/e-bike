# CHANGELOG_R25 · 中文倒车提示音换成实拍真人录音

> 日期：2026-07-10
> 目标：把 R24 用的 TTS 合成中文版"请注意，车辆倒车"（新闻女声）替换为用户提供的实拍"倒车，请注意"提示音。

## 改动

- **新增** `assets/audio/reverse/reverse-v2-zh.m4a` (52 KB)
  - 来源：用户从爱给网下载到 `_archive/参考资料/小电驴倒车/中文倒车.m4a`
  - 格式：m4a / aac 编码，浏览器原生支持
- **删除** `assets/audio/reverse/reverse-zh.mp3` (R24 TTS 生成的 46 KB 旧文件)
- **index.html:188**：src 从 `assets/audio/reverse/reverse-zh.mp3` → `assets/audio/reverse/reverse-v2-zh.m4a`
- **JS 不动**：`style-C.js` 通过 `id="reverseAudioZh"` 找 audio 元素，src 换了不影响

## 为什么用 v2 文件名（关键）

`vercel.json` 给 `/assets/(.*)` 设了 `Cache-Control: public, max-age=31536000, immutable`（1 年强缓存）。
如果用原名 `reverse-zh.mp3` 覆盖旧文件，Vercel 部署完浏览器/CDN **会继续听旧文件 1 年**。
v2 命名强制让浏览器去请求新 URL，30-90 秒后 Vercel 上线新版本立刻生效。

## 为什么 m4a 不转 mp3

- m4a/aac 是 HTML5 audio **所有现代浏览器原生支持**（Chrome/Edge/Safari/Firefox/iOS/Android）
- Vercel 默认按 `.m4a` 后缀设 `Content-Type: audio/mp4`，部署无障碍
- 机器上 ffmpeg 没装，pydub 装了但找不到 ffmpeg，moviepy/av 都没装
- 与其他 5 个 mp3 混合部署对 HTML5 audio 无任何兼容问题
- 如果后续需要 mp3（比如发现某浏览器兼容问题），装 ffmpeg 后转码即可，不影响 src 路径方案

## 验证

- 不用动 JS：node --check style-C.js 已通过
- git diff --check 干净（无 BOM / 编码问题）
- 旧 `reverse-zh.mp3` 已从 git 删除（`git rm`），避免仓库里有死文件
- Vercel 部署：新文件 30-90 秒后上线；旧 URL `reverse-zh.mp3` 在 CDN 缓存中可能继续 1 年可用，但 index.html 不再引用，无人会触发

## 提交时未带入的外部修改

`git status` 检出 `js/vendor/data.js` 和 `js/vendor/main.js` 在工作区有大改（合计 275 行 + / 79 行 -），看起来是 R48 clusterBelt 三层产业带重构（国家 / 省直辖市 / 县区级，直接对症 0706 朱威老师的层级错配问题）。**本轮 commit 不包含这两个文件的改动**，留给用户自行处理或后续 commit。
