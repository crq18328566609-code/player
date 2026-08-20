# 飞行棋 · 和机一起玩

九个版本的双人飞行棋。功能页选版本、总览棋盘；聊天弹窗里掷骰走格；可最小化成浮窗。

---

## 文件

| 文件 | 对应什么 | 说明 |
|------|----------|------|
| `index.html` | **功能页** | 选版本、看整盘、看进度、保存；点「在聊天里玩」进入弹窗 |
| `flight-chess-popup.html` | **聊天弹窗** | 掷骰、事件提示、保存 / **— 最小化** / × 关闭 |
| `float-window.js` | 浮窗模块 | 弹窗最小化后的可拖动胶囊，点一下恢复弹窗 |
| `README.md` | 说明 | 本文件 |

预览时三个文件放**同一目录**。功能页看棋盘请打开 `index.html`；测最小化请打开 `flight-chess-popup.html`（不要只开 index 找浮窗）。

---

## 九个版本

| key | 名称 |
|-----|------|
| `foreplay` | 前戏版 |
| `maid` | 女仆版 |
| `couple` | 情侣版 |
| `private_adv` | 私密进阶版 |
| `sm` | SM版 |
| `butler` | 男仆版 |
| `love` | 恋爱版 |
| `private` | 私密版 |
| `advanced` | 高级版 |

---

## 规则

1. **停下才生效**：只有棋子停在格子上才触发内容；路过不触发。  
2. **后进 / 退回**：停在「后进 X 格」会实际后退；「退回到 N 格」会跳到第 N 格。  
3. **谁接受格子内容**：
   - **女仆版 / SM版**：无论谁停 → **你（女方）**接受  
   - **男仆版**：无论谁停 → **小机（男方）**接受  
   - **其他版本**：谁停谁接受  
4. **互相 / 一起 / 双方**：按字面双方一起完成，不要理解成「两个人各受一次惩罚」。  
5. **回合**：你的回合在弹窗点「我投掷」；小机回合点「到你了」，或对机说「到你了」后由前端调用 API 自动掷骰并注入提示词。

---

## 使用流程（预览）

```
打开 index.html
  → 选版本、看棋盘
  → 保存进度（可选）
  → 点「在聊天里玩」
       ↓
flight-chess-popup.html
  → 掷骰 / 看事件
  → 点「—」最小化 → 右下角浮窗「飞行棋进行中」
  → 点浮窗 → 恢复弹窗
  → 点「×」关闭（预览会回功能页）
```

进度读写共用 localStorage：

- `flight_chess_progress`
- `flight_chess_player`（兼容备份）

---

## 给前端 / 机的接口

在已加载游戏脚本的页面里：

### 推荐：用户说「到你了」时只调一个方法

```js
const result = window.flightChessHandleYourTurn()
if (result.ok) {
  // result.dice
  // result.event         { lander, receiver, pos, text, roundsLeft, ... }
  // result.injectPrompt  直接塞进系统提示词
  sendToAI({ systemAppend: result.injectPrompt })
}
```

`injectPrompt` 会标明：骰子已掷完、谁停的、谁接受（或互相格）、格子原文；并禁止模型再讨论掷骰。

### 其他 API

```js
window.flightChessAiRoll()              // 仅机回合掷骰，返回 event
window.flightChessGetLastEvent()        // 取事件（每取一次 roundsLeft-1，最多约 2 轮）
window.flightChessBuildInjectPrompt(ev) // 手动生成注入文本
```

### 机提示词可加一句

> 当系统提示中出现【飞行棋事件 · 已自动掷完】时：视为骰子已掷完、格子已生效，直接按格子内容完成，禁止再提出掷骰或写掷骰代码。格子含「互相/一起」时双方一起做，不要改成双份单人惩罚。

---

## 浮窗模块（float-window.js）

仅**聊天弹窗**需要。功能页不显示浮窗。

```html
<script src="float-window.js"></script>
<div class="float-bar" id="floatBar" style="display:none">
  <span data-float-restore>飞行棋进行中</span>
  <span data-float-pos></span>
</div>
<script>
  FlightFloat.init({ onRestore: function () { /* 恢复弹窗 */ } })
  FlightFloat.show()
  FlightFloat.hide()
  FlightFloat.setPosText('你2 · 机1')
</script>
```

初始化时会强制 `inline-flex` + 横向排布，避免被全局 `button { flex:1 }` 拉成竖条。

---

## 接入 App（beilyes）时的对应关系

| Player 文件 | App 内 |
|-------------|--------|
| `index.html` | 功能区 → 飞行棋子页（总览） |
| `flight-chess-popup.html` | 聊天层 `flightChessOpen` 弹窗 |
| `float-window.js` | 弹窗最小化胶囊 |

App 内逻辑以 beilyes 前端为准；本仓库是可单独预览、可分享的轻量实现。

---

## 快速打开

浏览器直接打开 `index.html` 即可。  
若弹窗最小化后浮窗不出现：确认 `float-window.js` 与 `flight-chess-popup.html` 同目录，并硬刷新清缓存。
