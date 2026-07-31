import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Theme = 'light' | 'dark';

// 读取当前主题：优先用户手动选择过的偏好，其次跟随系统深色模式
const getInitialTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // 忽略读取失败（隐私模式等场景）
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const ThemeSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // 首次挂载时同步一次 DOM class（index.html 里的内联脚本已提前设置，避免闪烁；这里做兜底）
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // 忽略存储失败
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/15 hover:text-primary"
      aria-label={theme === 'dark' ? t('common.switchToLight', '切换到浅色模式') : t('common.switchToDark', '切换到深色模式')}
      title={theme === 'dark' ? t('common.switchToLight', '切换到浅色模式') : t('common.switchToDark', '切换到深色模式')}
    >
      <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
    </button>
  );
};

export default ThemeSwitcher;
