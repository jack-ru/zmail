import { useEffect, useState } from 'react';
import { getEmailDomains, getDefaultEmailDomain, EMAIL_DOMAINS, DEFAULT_EMAIL_DOMAIN } from '../config';

// 异步获取邮箱域名配置，带同步默认值兜底，避免首屏闪烁
export function useEmailDomains() {
  const [emailDomains, setEmailDomains] = useState<string[]>(EMAIL_DOMAINS);
  const [defaultDomain, setDefaultDomain] = useState<string>(DEFAULT_EMAIL_DOMAIN);

  useEffect(() => {
    let cancelled = false;
    const loadConfig = async () => {
      try {
        const domains = await getEmailDomains();
        const defaultDom = await getDefaultEmailDomain();
        if (!cancelled) {
          setEmailDomains(domains);
          setDefaultDomain(defaultDom);
        }
      } catch (error) {
        console.error('加载邮箱域名配置失败:', error);
        // 保持使用默认值
      }
    };

    loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  return { emailDomains, defaultDomain };
}
