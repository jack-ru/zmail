import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <Container>
        <div className="flex items-center justify-between py-3.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
          >
            {/* 苹果风格圆角方形 App 图标：渐变底 + 居中信封图形，与 favicon.svg 保持完全一致。
                信封主体 rect(x=9,y=12,w=22,h=16) 的几何中心正好是 (20,20)，
                即整个 40x40 图标的正中心；翻盖三角形用 clipPath 裁剪，避免尖角凸出圆角边界 */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <defs>
                <linearGradient id="logoBg" x1="4" y1="2" x2="37" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5ec2ff" />
                  <stop offset="50%" stopColor="#0a84ff" />
                  <stop offset="100%" stopColor="#5b4fe0" />
                </linearGradient>
                <linearGradient id="logoSheen" x1="20" y1="1" x2="20" y2="16" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <clipPath id="envelopeClip">
                  <rect x="9" y="12" width="22" height="16" rx="3" />
                </clipPath>
              </defs>
              <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#logoBg)" />
              <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#logoSheen)" />
              <rect x="9" y="12" width="22" height="16" rx="3" fill="white" />
              <path d="M9 12 L20 21 L31 12 Z" fill="#cfe0ff" clipPath="url(#envelopeClip)" />
            </svg>
            <span className="gradient-text text-xl font-extrabold tracking-tight">
              {t('app.shortTitle')}
            </span>
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
