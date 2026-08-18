# 飞行棋 · 和机一起玩

八个版本的双人飞行棋，支持人机轮流掷骰、进度保存、可拖动浮窗。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 情趣飞行棋（含前戏版等九种图纸） |
| `float-window.js` | **独立浮窗模块**，可单独接入其他页面 |
| `README.md` | 本说明 |

## 版本

前戏版 / 女仆版 / 情侣版 / 私密进阶版 / SM版 / 男仆版 / 恋爱版 / 私密版 / 高级版

## 规则要点

1. **停下才生效**：只有棋子停在格子上才触发内容；路过不触发。
2. **后进格**：停在「后进X格」上会实际后退 X 格。
3. **谁接受格子内容**（按图纸）：
   - **女仆版 / SM版**：无论谁停，都是**你（女方）**接受
   - **男仆版**：无论谁停，都是**机（男方）**接受
   - **其他版本**：谁停谁接受
4. **回合**：你的回合点「掷骰子」；机的回合对机说「到你了」后触发投掷。

`flightChessGetLastEvent()` 会返回 `lander`（谁停的）和 `receiver`（谁接受内容），方便机写剧情。

---

## 给前端 / 机的接口

```js
// 触发机投掷
window.flightChessAiRoll()

// 获取最近一次停下的格子事件（建议注入机提示词 2 轮）
// 返回 { lander, receiver, pos, text, roundsLeft } 或 null
window.flightChessGetLastEvent()
```

机投完后，调用 `flightChessGetLastEvent()`，把返回的 `text` 写进提示词，连续两轮，让机知道要执行什么剧情/动作。

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
    // 用户点「飞行棋进行中」时：恢复主界面
    document.getElementById('gameMain').classList.remove('hidden');
    FlightFloat.hide();
  }
});
```

### 4. 常用 API

```js
FlightFloat.show()                    // 显示浮窗（最小化时）
FlightFloat.hide()                    // 隐藏浮窗
FlightFloat.setPosText('你18 · 机15') // 更新位置文案
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

浮窗支持鼠标拖动和触摸拖动；点标题文字会触发 `onRestore`，不会开始拖。

---

## 本地进度

`localStorage` key：`flight_chess_player`

## 快速打开

浏览器直接打开 `index.html`（需与 `float-window.js` 同目录）。
