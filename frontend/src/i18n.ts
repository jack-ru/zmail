import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入翻译文件（仅保留简体中文）
import zhCN from '../i18n/locales/zh-CN.json';

// 配置i18next
i18n
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    lng: 'zh-CN',
    resources: {
      'zh-CN': {
        translation: zhCN,
      },
    },
    fallbackLng: 'zh-CN',
    debug: import.meta.env.MODE === 'development',
    interpolation: {
      escapeValue: false, // 不转义HTML
    },
  });

export default i18n;