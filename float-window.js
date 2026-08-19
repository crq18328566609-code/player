/**
 * 飞行棋 · 可拖动浮窗
 * 独立模块，方便别的页面 / 机端接入
 *
 * 用法：
 *   1. 页面里放一个 #floatBar 元素（见下方 HTML 结构）
 *   2. 引入本文件
 *   3. FlightFloat.init({ onRestore: () => { ... } })
 *   4. FlightFloat.show() / FlightFloat.hide()
 *   5. FlightFloat.setPosText('你18 · 机15')
 */

(function (global) {
  const FlightFloat = {
    el: null,
    _dragging: false,
    _startX: 0,
    _startY: 0,
    _origX: 0,
    _origY: 0,
    _onRestore: null,

    /**
     * @param {Object} opts
     * @param {string} [opts.selector='#floatBar']
     * @param {Function} [opts.onRestore] 点击「飞行棋进行中」时回调（恢复主界面）
     */
    init(opts = {}) {
      const sel = opts.selector || '#floatBar';
      this.el = document.querySelector(sel);
      if (!this.el) {
        console.warn('[FlightFloat] 找不到浮窗元素:', sel);
        return;
      }
      this._onRestore = opts.onRestore || null;
      // 防止全局 button{flex:1;flex-direction:column} 把胶囊拉成竖条
      const s = this.el.style;
      s.display = 'inline-flex';
      s.flexDirection = 'row';
      s.alignItems = 'center';
      s.width = 'auto';
      s.height = 'auto';
      s.maxHeight = '48px';
      s.flex = 'none';
      this._bindDrag();
      this._bindRestoreClick();
    },

    show() {
      if (this.el) this.el.classList.add('show');
    },

    hide() {
      if (this.el) this.el.classList.remove('show');
    },

    /** 更新浮窗上的位置文案，例如 "你18 · 机15" */
    setPosText(text) {
      const span = this.el && this.el.querySelector('[data-float-pos]');
      if (span) span.textContent = text;
    },

    _bindRestoreClick() {
      const title = this.el.querySelector('[data-float-restore]');
      if (!title) return;
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof this._onRestore === 'function') this._onRestore();
      });
    },

    _bindDrag() {
      const bar = this.el;

      const onStart = (e) => {
        // 点标题文字时不拖，交给恢复逻辑
        if (e.target.closest('[data-float-restore]')) return;

        this._dragging = true;
        const pt = e.touches ? e.touches[0] : e;
        this._startX = pt.clientX;
        this._startY = pt.clientY;
        const rect = bar.getBoundingClientRect();
        this._origX = rect.left;
        this._origY = rect.top;
        bar.style.right = 'auto';
        bar.style.bottom = 'auto';
        bar.style.left = this._origX + 'px';
        bar.style.top = this._origY + 'px';
        e.preventDefault();
      };

      const onMove = (e) => {
        if (!this._dragging) return;
        const pt = e.touches ? e.touches[0] : e;
        const dx = pt.clientX - this._startX;
        const dy = pt.clientY - this._startY;
        bar.style.left = this._origX + dx + 'px';
        bar.style.top = this._origY + dy + 'px';
      };

      const onEnd = () => {
        this._dragging = false;
      };

      bar.addEventListener('mousedown', onStart);
      bar.addEventListener('touchstart', onStart, { passive: false });
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    }
  };

  global.FlightFloat = FlightFloat;
})(typeof window !== 'undefined' ? window : globalThis);

/*
推荐 HTML 结构（可直接复制）：

<div class="float-bar" id="floatBar">
  <span data-float-restore style="cursor:pointer;">飞行棋进行中</span>
  <span data-float-pos style="opacity:0.85;font-size:0.7rem;"></span>
</div>

推荐 CSS（可按主题改颜色）：

.float-bar {
  position: fixed;
  bottom: 18px;
  right: 14px;
  background: #C4A77D;
  color: #fff;
  padding: 10px 16px;
  border-radius: 22px;
  font-size: 0.78rem;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
  cursor: grab;
  z-index: 40;
  display: none;
  align-items: center;
  gap: 8px;
  user-select: none;
  touch-action: none;
}
.float-bar.show { display: flex; }
.float-bar:active { cursor: grabbing; }
*/
