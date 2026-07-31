import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from './Container';

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
        <div className="flex items-center justify-center py-3.5">
          <Link
            to="/"
            className="flex items-center gap-2 text-[1.35rem] font-bold tracking-tight transition-opacity hover:opacity-70"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-apple-sm">
              <i className="fas fa-envelope text-sm"></i>
            </span>
            <span className="gradient-text">{t('app.title')}</span>
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default Header;