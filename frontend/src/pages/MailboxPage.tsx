import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EmailList from '../components/EmailList';
import MailboxHero from '../components/MailboxHero';
import { MailboxContext } from '../contexts/MailboxContext';
import { useEmailDomains } from '../hooks/useEmailDomains';
import Container from '../components/Container';

const MailboxPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    mailbox,
    setMailbox,
    isLoading,
    emails,
    selectedEmail,
    setSelectedEmail,
    isEmailsLoading,
    loadMailboxByAddress,
    showErrorMessage,
  } = useContext(MailboxContext);
  const { emailDomains, defaultDomain } = useEmailDomains();

  useEffect(() => {
    if (!address) return;

    // Extract local part if full email is provided (e.g., abc@test.com -> abc)
    const localPart = address.includes('@') ? address.split('@')[0] : address;

    // If the current mailbox already matches, no need to reload
    if (mailbox?.address === localPart) return;

    const load = async () => {
      const success = await loadMailboxByAddress(localPart);
      if (!success) {
        showErrorMessage(t('mailbox.invalidAddress'));
        setTimeout(() => navigate('/'), 2000);
      }
    };
    load();
  }, [address]);

  // 切换/更换邮箱后同步跳转到新地址对应的路由
  const handleMailboxChange = (newMailbox: Mailbox) => {
    setMailbox(newMailbox);
    navigate(`/${newMailbox.address}`);
  };

  return (
    <Container>
      <MailboxHero
        mailbox={mailbox}
        onMailboxChange={handleMailboxChange}
        domain={defaultDomain}
        domains={emailDomains}
        isLoading={isLoading}
      />

      <EmailList
        emails={emails}
        selectedEmailId={selectedEmail}
        onSelectEmail={setSelectedEmail}
        isLoading={isEmailsLoading}
      />
    </Container>
  );
};

export default MailboxPage;
