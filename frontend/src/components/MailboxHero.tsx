import React, { useState, useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createRandomMailbox, createCustomMailbox } from '../utils/api';
import MailboxSwitcher from './MailboxSwitcher';
import { MailboxContext } from '../contexts/MailboxContext';

interface MailboxHeroProps {
  mailbox: Mailbox | null;
  onMailboxChange: (mailbox: Mailbox) => void;
  domain: string;
  domains: string[];
  isLoading: boolean;
}

// 首页顶部的大标题 + 邮箱地址栏，样式参考简洁临时邮箱站点：
// 大标题 + 副标题，下方是一条地址栏和几个深色圆角操作按钮
const MailboxHero: React.FC<MailboxHeroProps> = ({
  mailbox,
  onMailboxChange,
  domain,
  domains,
  isLoading,
}) => {
  const { t } = useTranslation();
  const { showSuccessMessage, showErrorMessage } = useContext(MailboxContext);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(domain);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [customAddressError, setCustomAddressError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // [fix #23] 切换邮箱时恢复该邮箱自己的域名后缀，而不是沿用当前下拉框的值
  useEffect(() => {
    setSelectedDomain(mailbox?.domain || domain);
  }, [mailbox, domain]);

  const copyToClipboard = () => {
    if (!mailbox) return;
    const fullAddress = mailbox.address.includes('@') ? mailbox.address : `${mailbox.address}@${selectedDomain}`;
    navigator.clipboard.writeText(fullAddress)
      .then(() => showSuccessMessage(t('mailbox.copySuccess')))
      .catch(() => showErrorMessage(t('mailbox.copyFailed')));
  };

  // 更换随机邮箱（domainOverride 用于域名刚切换、state 尚未更新的场景）
  const handleRefreshMailbox = async (domainOverride?: string) => {
    setIsActionLoading(true);
    const result = await createRandomMailbox();
    setIsActionLoading(false);

    if (result.success && result.mailbox) {
      onMailboxChange({ ...result.mailbox, domain: domainOverride || selectedDomain });
      showSuccessMessage(t('mailbox.refreshSuccess'));
    } else {
      showErrorMessage(t('mailbox.refreshFailed'));
    }
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomAddressError(null);

    const normalized = customAddress.trim().toLowerCase();
    if (!/^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9])?$/.test(normalized)) {
      setCustomAddressError(t('mailbox.invalidAddress'));
      return;
    }

    setIsActionLoading(true);
    const result = await createCustomMailbox(normalized);
    setIsActionLoading(false);

    if (result.success && result.mailbox) {
      onMailboxChange({ ...result.mailbox, domain: selectedDomain });
      showSuccessMessage(t('mailbox.createSuccess'));
      setTimeout(() => {
        setIsCustomMode(false);
        setCustomAddress('');
      }, 1200);
    } else {
      const isAddressExistsError = result.error === 'Address already exists' || String(result.error).includes('已存在');
      if (isAddressExistsError) {
        setCustomAddressError(t('mailbox.addressExists'));
      } else {
        showErrorMessage(t('mailbox.createFailed'));
      }
    }
  };

  const handleCancelCustom = () => {
    setIsCustomMode(false);
    setCustomAddress('');
    setCustomAddressError(null);
  };

  const handleDomainChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDomain = e.target.value;
    setSelectedDomain(newDomain);
    if (isCustomMode) return;
    await handleRefreshMailbox(newDomain);
  };

  // 深色圆角按钮，呼应参考站点的黑色胶囊按钮
  const darkButtonClass = "flex items-center justify-center rounded-xl bg-foreground text-background transition-all duration-200 hover:opacity-85 active:scale-95 shadow-apple-sm disabled:opacity-50";

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text mb-3">
        {t('home.hero.title')}
      </h1>
      <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
        {t('home.hero.subtitle')}
      </p>

      {!mailbox || isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : isCustomMode ? (
        <form onSubmit={handleCreateCustom} className="flex flex-col items-center gap-2 max-w-xl mx-auto">
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center flex-1 min-w-0 rounded-xl border border-border/60 bg-card shadow-apple-sm overflow-hidden">
              <input
                ref={inputRef}
                type="text"
                value={customAddress}
                onChange={(e) => {
                  setCustomAddress(e.target.value);
                  if (customAddressError) setCustomAddressError(null);
                }}
                className="flex-1 min-w-0 px-4 py-3 text-base font-mono focus:outline-none bg-transparent"
                placeholder={t('mailbox.customAddressPlaceholder')}
                disabled={isActionLoading}
                autoFocus
              />
              <span className="flex items-center px-3 py-3 text-sm border-l border-border/60 bg-muted/60">
                @
                <div className="relative">
                  <select
                    value={selectedDomain}
                    onChange={handleDomainChange}
                    className="appearance-none bg-transparent border-none focus:outline-none pl-1 pr-5"
                  >
                    {domains.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none"></i>
                </div>
              </span>
            </div>
            <button
              type="button"
              onClick={handleCancelCustom}
              className="px-4 py-3 text-sm rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              disabled={isActionLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className={`px-4 py-3 text-sm whitespace-nowrap ${darkButtonClass}`}
              disabled={isActionLoading}
            >
              {isActionLoading ? t('common.loading') : t('common.create')}
            </button>
          </div>
          {customAddressError && (
            <div className="text-destructive text-xs">{customAddressError}</div>
          )}
        </form>
      ) : (
        <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto flex-wrap">
          <div className="flex items-center min-w-0 rounded-xl border border-border/60 bg-card shadow-apple-sm px-4 py-3">
            <code className="font-mono text-sm sm:text-base font-medium truncate">
              {mailbox.address}@
            </code>
            <div className="relative shrink-0">
              <select
                value={selectedDomain}
                onChange={handleDomainChange}
                className="appearance-none bg-transparent border-none focus:outline-none pl-0.5 pr-5 font-mono text-sm sm:text-base font-medium"
              >
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none"></i>
            </div>
          </div>

          {/* 只有存在多个已保存邮箱时才显示切换按钮 */}
          <MailboxSwitcher
            currentMailbox={mailbox}
            onSwitchMailbox={onMailboxChange}
            domain={selectedDomain}
          />

          <button
            onClick={copyToClipboard}
            className={`w-11 h-11 ${darkButtonClass}`}
            aria-label={t('common.copy')}
            title={t('common.copy')}
          >
            <i className="fas fa-copy"></i>
          </button>

          <button
            onClick={() => setIsCustomMode(true)}
            className={`w-11 h-11 ${darkButtonClass}`}
            disabled={isActionLoading}
            title={t('mailbox.customize')}
          >
            <i className="fas fa-grip"></i>
          </button>

          <button
            onClick={() => handleRefreshMailbox()}
            className={`px-4 h-11 gap-2 text-sm font-medium whitespace-nowrap ${darkButtonClass}`}
            disabled={isActionLoading}
            title={t('mailbox.refresh')}
          >
            <i className={`fas fa-sync-alt ${isActionLoading ? 'fa-spin' : ''}`}></i>
            {t('mailbox.refresh')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MailboxHero;
