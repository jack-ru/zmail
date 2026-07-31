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
            {/* 苹果风格圆角方形 App 图标：渐变底 + 简洁 @ 符号，缩略/小尺寸下依旧清晰，与 favicon 保持统一 */}
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
              </defs>
              <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#logoBg)" />
              <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#logoSheen)" />
              <text
                x="20"
                y="21.5"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Arial, sans-serif"
                fontWeight="700"
                fontSize="22"
                fill="white"
              >
                @
              </text>
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
