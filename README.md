# 飞行棋 · 和机一起玩

**九个版本**的双人飞行棋：人机轮流掷骰、进度保存、可拖动浮窗。


## 两个页面怎么分

| 文件 | 对应 App 哪里 | 要不要最小化 |
|------|----------------|--------------|
| `index.html` | **功能页**总览：选版本、看整盘、保存进度、**在聊天里玩** | 不需要最小化 |
| `flight-chess-popup.html` | **聊天页弹窗**：掷骰、事件、保存 / **— 最小化** / × 关闭 | **要**，点 — 变浮窗，点浮窗恢复 |

功能页预览：`index.html` → 点「在聊天里玩」进入弹窗页。

预览最小化请打开 `flight-chess-popup.html`（同目录需有 `float-window.js`），不要只开 `index.html`。


## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 情趣飞行棋（九种图纸） |
| `flight-chess-popup.html` | 聊天弹窗单版本示意（固定高度、棋盘可滚） |
| `float-window.js` | **独立浮窗模块**，可单独接入其他页面 |
| `README.md` | 本说明 |

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

与 App（beilyes）内 `FLIGHT_BOARDS` 一致。

## 规则要点

1. **停下才生效**：只有棋子停在格子上才触发内容；路过不触发。
2. **后进 / 退回**：停在「后进X格」上会实际后退 X 格；「退回N格」会退到第 N 格；路过不触发。
3. **谁接受格子内容**（按图纸）：
   - **女仆版 / SM版**：无论谁停，都是**你（女方）**接受
   - **男仆版**：无论谁停，都是**机（男方）**接受
   - **其他版本**：谁停谁接受
4. **互相 / 一起 / 双方**：按字面**双方一起完成**，不要理解成「两个人各受一次惩罚」。
5. **回合**：你的回合点「掷骰子」；机的回合可点「机掷骰」，或对机说「到你了」后由前端自动投掷并注入提示词。
6. **再来一局**：到达终点后可重置本局，不必换版本。

`flightChessGetLastEvent()` 会返回 `lander`（谁停的）和 `receiver`（谁接受内容），方便机写剧情。

---

## 给前端 / 机的接口（重要）

### 推荐：用户说「到你了」时只调一个方法

```js
const result = window.flightChessHandleYourTurn()
if (result.ok) {
  // result.dice          骰子点数
  // result.event         { lander, receiver, pos, text, roundsLeft }
  // result.injectPrompt  直接塞进系统提示词的完整文本
  sendToAI({
    systemAppend: result.injectPrompt,
    // 不要再让机选择是否掷骰
  })
}
```

`injectPrompt` 会标明：骰子已掷完、谁停的、谁接受、格子原文；并禁止再讨论掷骰。

### 其他 API

```js
window.flightChessAiRoll()              // 仅掷骰，返回 event
window.flightChessGetLastEvent()        // 取事件（可取 2 轮）
window.flightChessBuildInjectPrompt(ev) // 手动生成注入文本
```

### 机的角色提示词建议加一句

> 当系统提示中出现【飞行棋事件 · 已自动掷完】时：视为骰子已掷完、格子已生效，直接按格子内容完成，禁止再提出掷骰或编写掷骰代码。格子含「互相/一起」时双方一起做，不要改成双份单人惩罚。

---

## 浮窗模块接入（float-window.js）

浮窗已拆成独立文件，别的页面也能直接用。

### 1. 引入

```html
<script src="float-window.js"></script>
```

### 2. HTML 结构

```html
<div class="float-bar" id="floatBar">
  <span data-float-restore style="cursor:pointer;">飞行棋进行中</span>
  <span data-float-pos style="opacity:0.85;font-size:0.7rem;"></span>
</div>
```

### 3. 初始化

```js
FlightFloat.init({
  onRestore: function () {
    document.getElementById('gameMain').classList.remove('hidden');
    FlightFloat.hide();
  }
});
```

初始化时会强制 `inline-flex` + `height:auto`，避免被全局 `button { flex:1 }` 拉成竖条。

### 4. 常用 API

```js
FlightFloat.show()
FlightFloat.hide()
FlightFloat.setPosText('你18 · 机15')
```

### 5. 和主游戏的配合

```js
function minimizeGame() {
  saveProgress();
  document.getElementById('gameMain').classList.add('hidden');
  FlightFloat.setPosText(`你${state.playerPos} · 机${state.aiPos}`);
  FlightFloat.show();
}
```

浮窗支持鼠标/触摸拖动；点标题触发 `onRestore`，不会开始拖。

---

## 本地进度

App / 示例常用 key：`flight_chess_progress` 或 `flight_chess_player`（以接入方为准）。

## 快速打开

浏览器直接打开 `index.html`（需与 `float-window.js` 同目录）。
