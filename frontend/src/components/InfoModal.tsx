import React from 'react';
import { useTranslation } from 'react-i18next';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsPage from '../pages/TermsPage';
import AboutPage from '../pages/AboutPage';

// 定义 props 类型
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'about' | null;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
  const { t } = useTranslation();

  if (!isOpen || !type) {
    return null;
  }

  // 根据类型获取标题和内容组件
  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: t('common.privacyPolicy'),
          content: <PrivacyPolicyPage />,
        };
      case 'terms':
        return {
          title: t('common.terms'),
          content: <TermsPage />,
        };
      case 'about':
        return {
          title: t('common.about'),
          content: <AboutPage />,
        };
      default:
        return {
          title: '',
          content: null,
        };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-apple-lg border border-border/60 w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* 弹窗头部 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border/60">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        {/* 弹窗内容 */}
        <div className="p-6 overflow-y-auto">
          {content}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;