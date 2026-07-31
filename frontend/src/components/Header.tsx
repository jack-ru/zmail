import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from './Container';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <Container>
        <div className="flex items-center justify-center py-3.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
          >
            {/* 苹果风格圆角方形 App 图标：渐变底 + 双色信封（含折角光影），与 favicon 保持一致 */}
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
                  <stop offset="45%" stopColor="#0a84ff" />
                  <stop offset="100%" stopColor="#5b4fe0" />
                </linearGradient>
                <linearGradient id="logoSheen" x1="20" y1="1" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#logoBg)" />
              <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#logoSheen)" />
              {/* 信封主体 */}
              <rect x="9" y="13" width="22" height="15" rx="3" fill="#ffffff" />
              {/* 信封折角：浅色三角 + 一条清晰折线，比纯描边更有层次 */}
              <path d="M9 13.6L20 21.2L31 13.6Z" fill="#d9e9ff" />
              <path
                d="M9 13.6L20 21.2L31 13.6"
                stroke="#0a63cf"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="gradient-text text-xl font-extrabold tracking-tight">
              {t('app.shortTitle')}
            </span>
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default Header;
