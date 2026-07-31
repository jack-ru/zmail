import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MailboxContext } from '../contexts/MailboxContext';
import EmailDetail from './EmailDetail';
import { formatShortDate, formatCountdown } from '../utils/format';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string | null) => void;
  isLoading: boolean;
}

const EmailList: React.FC<EmailListProps> = ({ 
  emails, 
  selectedEmailId, 
  onSelectEmail,
  isLoading 
}) => {
  const { t } = useTranslation();
  const { autoRefresh, setAutoRefresh, refreshEmails, mailbox, deleteMailbox } = useContext(MailboxContext);
  const [isDeleting, setIsDeleting] = useState(false);
  // 每分钟触发一次重渲染，驱动倒计时徽章自动更新
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(t => t + 1), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    // feat: 调用 context 中的 refreshEmails，并传入 true 表示是手动刷新
    refreshEmails(true);
  };
  
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };
  
  const handleDeleteMailbox = async () => {
    if (window.confirm(t('mailbox.confirmDelete'))) {
      setIsDeleting(true);
      try {
        await deleteMailbox();
      } catch (error) {
        console.error('Error deleting mailbox:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const countdown = mailbox ? formatCountdown(mailbox.expiresAt) : null;
  
  // [fix]: 只有首次加载（列表还是空的）或删除邮箱时才整体显示 spinner；
  // 后台轮询刷新不清空列表，避免每 10 秒闪烁一次、正在阅读的详情被卸载
  if ((isLoading && emails.length === 0) || isDeleting) {
    return (
      <div className="rounded-2xl border border-border/60 glass-card shadow-apple p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold tracking-tight">{t('email.inbox')}</h2>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-2xl border border-border/60 glass-card shadow-apple overflow-hidden">
      {/* 标题 + 徽章：邮件数量 & 到期倒计时，风格参考截图中的两枚圆角徽章 */}
      <div className="flex flex-wrap justify-between items-center gap-2 px-5 py-4 border-b border-border/60">
        <h2 className="text-lg font-semibold tracking-tight">{t('email.inbox')}</h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            {emails.length} {emails.length === 1 ? t('email.message') : t('email.messages')}
          </span>
          {countdown && (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 font-mono">
              <i className="fas fa-hourglass-half text-[10px]"></i>
              {countdown}
            </span>
          )}
        </div>
      </div>

      {/* 次级工具栏：手动刷新、自动刷新开关、删除邮箱，保持轻量小巧不抢视觉焦点 */}
      <div className="flex justify-end items-center gap-1 px-3 py-1.5 bg-muted/30 border-b border-border/60">
        <button
          onClick={handleRefresh}
          className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-muted text-muted-foreground"
          title={t('email.refresh')}
        >
          <i className={`fas fa-sync-alt text-xs ${isLoading ? 'fa-spin' : ''}`}></i>
        </button>
        <button
          onClick={toggleAutoRefresh}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-muted ${autoRefresh ? 'text-primary' : 'text-muted-foreground'}`}
          title={autoRefresh ? t('email.autoRefreshOn') : t('email.autoRefreshOff')}
        >
          <i className="fas fa-clock text-xs"></i>
        </button>
        {mailbox && (
          <button
            onClick={handleDeleteMailbox}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            title={t('mailbox.delete')}
          >
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
        )}
      </div>
      
      {emails.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground">
          {isLoading ? (
            <div className="animate-spin mx-auto mb-4 rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (
            <i className="fas fa-inbox text-3xl mb-3 text-muted-foreground/50"></i>
          )}
          <p className="font-medium text-foreground/80">{t('email.waitingForEmails')}</p>
          <button
            onClick={handleRefresh}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium shadow-apple-sm transition-colors hover:bg-muted"
          >
            <i className={`fas fa-sync-alt text-xs ${isLoading ? 'fa-spin' : ''}`}></i>
            {t('email.refresh')}
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {emails.map((email) => (
            <React.Fragment key={email.id}>
              <li 
                className={`px-5 py-3.5 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedEmailId === email.id ? 'bg-muted/70' : ''
                } ${!email.isRead ? 'font-semibold' : ''}`}
                onClick={() => onSelectEmail(selectedEmailId === email.id ? null : email.id)}
              >
                <div className="flex justify-between mb-1">
                  <span className="truncate">{email.fromName || email.fromAddress}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatShortDate(email.receivedAt)}
                  </span>
                </div>
                <div className="text-sm truncate text-muted-foreground">
                  {email.subject || t('email.noSubject')}
                </div>
              </li>
              {selectedEmailId === email.id && (
                <li className="border-t border-border/60 bg-muted/20">
                  <EmailDetail 
                    emailId={email.id} 
                    onClose={() => onSelectEmail(null)}
                  />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailList;
