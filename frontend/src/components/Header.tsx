import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import HeaderMailbox from './HeaderMailbox';
import Container from './Container';
import { getEmailDomains, getDefaultEmailDomain, EMAIL_DOMAINS, DEFAULT_EMAIL_DOMAIN } from '../config';
import ThemeSwitcher from './ThemeSwitcher'; // 导入新增的主题切换组件

interface HeaderProps {
  mailbox: Mailbox | null;
  onMailboxChange?: (mailbox: Mailbox) => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  mailbox = null, 
  onMailboxChange = () => {}, 
  isLoading = false 
}) => {
  const { t } = useTranslation();
  const [emailDomains, setEmailDomains] = useState<string[]>(EMAIL_DOMAINS);
  const [defaultDomain, setDefaultDomain] = useState<string>(DEFAULT_EMAIL_DOMAIN);
  
  // 异步获取邮箱域名配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const domains = await getEmailDomains();
        const defaultDom = await getDefaultEmailDomain();
        setEmailDomains(domains);
        setDefaultDomain(defaultDom);
      } catch (error) {
        console.error('加载邮箱域名配置失败:', error);
        // 保持使用默认值
      }
    };
    
    loadConfig();
  }, []);
  
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <Container>
        <div className="flex items-center justify-between py-3.5">
          <Link
            to="/"
            className="flex items-center gap-2 text-[1.35rem] font-bold tracking-tight transition-opacity hover:opacity-70"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-apple-sm">
              <i className="fas fa-envelope text-sm"></i>
            </span>
            <span className="gradient-text">{t('app.title')}</span>
          </Link>
          
          {mailbox && (
            <div className="flex items-center rounded-full bg-muted/70 px-3 py-1.5 shadow-apple-sm">
              <HeaderMailbox 
                mailbox={mailbox} 
                onMailboxChange={onMailboxChange}
                domain={defaultDomain}
                domains={emailDomains}
                isLoading={isLoading}
              />
              <div className="ml-3 pl-3 border-l border-border flex items-center">
                {/* 在这里添加主题切换组件 */}
                <ThemeSwitcher />
                <LanguageSwitcher />
                <a
                  href="https://github.com/zaunist/zmail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/15 hover:text-primary ml-1"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <i className="fab fa-github text-base"></i>
                </a>
              </div>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;