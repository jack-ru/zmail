import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import ThemeSwitcher from './ThemeSwitcher'; // 导入新增的主题切换组件

interface HeaderProps {
  mailbox?: Mailbox | null;
  onMailboxChange?: (mailbox: Mailbox) => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <Container>
        <div className="flex items-center justify-between py-3.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[1.35rem] font-bold tracking-tight transition-opacity hover:opacity-70"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 drop-shadow-[0_1px_3px_rgba(0,113,227,0.35)]"
            >
              <defs>
                <linearGradient id="logoBg" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2c9bff" />
                  <stop offset="100%" stopColor="#5e5ce6" />
                </linearGradient>
                <linearGradient id="logoSheen" x1="20" y1="1" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* 圆角方形底板，仿 iOS App 图标质感 */}
              <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#logoBg)" />
              <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#logoSheen)" />
              {/* 信封主体 */}
              <rect x="9" y="13" width="22" height="16" rx="4" fill="white" fillOpacity="0.96" />
              {/* 信封翻盖折线 */}
              <path
                d="M10.5 14.5L20 22L29.5 14.5"
                stroke="#2c6bd6"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="gradient-text">{t('app.title')}</span>
          </Link>

          <div className="flex items-center rounded-full bg-muted/70 px-1.5 py-1.5 shadow-apple-sm">
            <ThemeSwitcher />
            <a
              href="https://github.com/wekh/zmail"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/15 hover:text-primary"
              aria-label="GitHub"
              title="GitHub"
            >
              <i className="fab fa-github text-base"></i>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;