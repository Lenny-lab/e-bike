# CHANGELOG_R24 · 倒车提示多语种语音播放

> 日期：2026-07-10
> 目标：给"先听一声倒车提示"模块接入 6 语种 TTS 语音，让点击"倒车"按钮时切换并播放对应语言的提示音。

## 修改内容

### 1. 新增 6 条多语种 TTS 语音（assets/audio/reverse/）

| 文件 | 语种 | 文本 | 选用音色 | 大小 |
|------|------|------|----------|------|
| `reverse-zh.mp3` | 中文（普通话） | 请注意，车辆倒车 | Chinese (Mandarin)_News_Anchor | 46 KB |
| `reverse-en.mp3` | English | Reverse, please watch out | English_Trustworthy_Man | 35 KB |
| `reverse-es.mp3` | Español | Atención, vehículo en reversa | Spanish_Narrator | 65 KB |
| `reverse-id.mp3` | Bahasa Indonesia | Awas, kendaraan mundur | Indonesian_ReservedYoungMan | 35 KB |
| `reverse-ru.mp3` | Русский | Внимание, задний ход | Russian_ReliableMan | 42 KB |
| `reverse-ar.mp3` | العربية | انتبه، المركبة ترجع للخلف | Arabic_FriendlyGuy | 65 KB |

总大小 288 KB。音色挑选原则：稳重/播报风，不做花哨表演，匹配"工业产品提示音"语境。
语种对应 6 大出海区域：中文（中国本土）、英文（北美）、西语（拉美）、印尼语（东南亚）、俄语（中亚/俄罗斯）、阿拉伯语（中东/北非）。
通过 matrix_audios_understand 抽检 zh / ru / ar 三条，内容与文本完全一致，发音清晰。

### 2. index.html：新增 audio 池

在 `#reverseIntro` section 末尾插入 6 个 `<audio>` 元素，preload="auto" 一次性预加载；通过 `id="reverseAudioZh/En/Es/Id/Ru/Ar"` 标识。
用 `aria-hidden="true"` 包装，对屏幕阅读器隐藏（视觉/交互完全由按钮驱动）。

### 3. js/style-C.js：点击"倒车"时播放

在 `initReverseIntro()` 的 `states` 数组里每项加 `audio: 'reverseAudioXxx'` 字段。
新加 `audioPool` 缓存所有 audio 元素引用。
新加 `playCurrent()` 函数：每次 paint 后 `currentTime = 0` + `play()`，从语音起点重新播放当前语种。
按钮 click 事件改为：先 `paint()` 切文字，再 `playCurrent()` 播语音。
首次进入页面不自动播放（遵循浏览器 autoplay 策略），用户首次点击"倒车"即听到第二语种语音。

## 用户交互流

1. 页面加载：显示"请注意，车辆倒车" + "中文 · 中国"，无声
2. 第一次点"倒车"：切到 "Reverse, please watch out" + "English · North America"，同时播放英文语音
3. 第二次点：切到西班牙语 + 播放
4. 循环切换：每点一次切换到下一语种并播放

## 验证

- `node --check js/style-C.js` 通过
- `git diff --check` 干净（无 BOM / 编码问题）
- matrix_audios_understand 抽检 3 条：中文/俄语/阿拉伯语内容与文本完全一致
- MP3 总大小 288 KB，对 GitHub Pages / 移动端 4G 都轻量
- 音频采用本地相对路径，符合 README 离线原则

## 未做

- 未加"播放/暂停"独立按钮（用户当前需求是"点击播放"）
- 未加可视化波形/进度条（保持 Vogue Luxury 极简风）
- 未做语音自动循环/连续播放 6 语种 demo（避免页面加载时噪音）
