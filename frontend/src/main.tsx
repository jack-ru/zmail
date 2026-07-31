import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './i18n'

// 创建路由器配置，添加未来标志
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

// 禁止页面缩放：viewport meta 的 user-scalable=no 在部分 iOS Safari 版本下对双指手势缩放无效，
// 这里在事件层面再兜底拦截双指捏合缩放（gesturestart/gesturechange）与双击缩放
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
  { passive: false }
);

// 桌面端：拦截 Ctrl/Cmd + 滚轮缩放
document.addEventListener(
  'wheel',
  (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// 桌面端：拦截 Ctrl/Cmd + '+' / '-' / '0' 缩放快捷键
document.addEventListener('keydown', (e) => {
  const isZoomKey = ['=', '+', '-', '_', '0'].includes(e.key);
  if ((e.ctrlKey || e.metaKey) && isZoomKey) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter {...router}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
) 