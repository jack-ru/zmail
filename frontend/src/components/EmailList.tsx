import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MailboxContext } from '../contexts/MailboxContext';
import EmailDetail from './EmailDetail';
import { formatShortDate, formatFullDate } from '../utils/format';

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
  
  const calculateTimeLeft = (expiresAt: number) => {
    if (!expiresAt) return '';
    
    const now = Math.floor(Date.now() / 1000);
    const timeLeftSeconds = expiresAt - now;
    
    if (timeLeftSeconds <= 0) {
      return t('mailbox.expired');
    }
    
    const hours = Math.floor(timeLeftSeconds / 3600);
    const minutes = Math.floor((timeLeftSeconds % 3600) / 60);
    
    if (hours > 0) {
      return t('mailbox.expiresInTime', { hours, minutes });
    } else {
      return t('mailbox.expiresInMinutes', { minutes });
    }
  };
  
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
  
  // [fix]: 只有首次加载（列表还是空的）或删除邮箱时才整体显示 spinner；
  // 后台轮询刷新不清空列表，避免每 10 秒闪烁一次、正在阅读的详情被卸载
  if ((isLoading && emails.length === 0) || isDeleting) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card shadow-apple p-6">
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
    <div className="rounded-2xl border border-border/60 bg-card shadow-apple overflow-hidden">
      <div className="flex justify-between items-center px-5 py-4 border-b border-border/60">
        <h2 className="text-lg font-semibold tracking-tight">{t('email.inbox')}</h2>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleRefresh}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-muted"
            title={t('email.refresh')}
          >
            <i className={`fas fa-sync-alt text-sm ${isLoading ? 'fa-spin' : ''}`}></i>
          </button>
          <button
            onClick={toggleAutoRefresh}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-muted ${autoRefresh ? 'text-primary' : 'text-muted-foreground'}`}
            title={autoRefresh ? t('email.autoRefreshOn') : t('email.autoRefreshOff')}
          >
            <i className="fas fa-clock text-sm"></i>
          </button>
        </div>
      </div>
      
      {mailbox && (
        <div className="px-5 py-3 bg-muted/40 border-b border-border/60 text-xs text-muted-foreground">
          <div className="flex justify-between items-center mb-1">
            <span>{t('mailbox.created')}:</span>
            <span>{formatFullDate(mailbox.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>{t('mailbox.expiresAt')}:</span>
            <span>{formatFullDate(mailbox.expiresAt)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span>{t('mailbox.timeLeft')}:</span>
            <span>{calculateTimeLeft(mailbox.expiresAt)}</span>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleDeleteMailbox}
              className="text-destructive hover:text-destructive/80 text-xs flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-destructive/10"
              title={t('mailbox.delete')}
            >
              <i className="fas fa-trash-alt"></i>
              <span>{t('mailbox.delete')}</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center px-5 py-2.5 bg-muted/40">
        <span className="text-sm text-muted-foreground">
          {emails.length} {emails.length === 1 ? t('email.message') : t('email.messages')}
        </span>
        <span className="text-xs text-muted-foreground">
          {autoRefresh ? t('email.autoRefreshOn') : t('email.autoRefreshOff')}
        </span>
      </div>
      
      {emails.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground">
          <i className="fas fa-inbox text-3xl mb-3 text-muted-foreground/50"></i>
          <p className="font-medium text-foreground/80">{t('email.emptyInbox')}</p>
          <p className="text-sm mt-1">{t('email.waitingForEmails')}</p>
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