import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'ZMAIL-6小时匿名邮箱',
  description = '创建临时邮箱地址，接收邮件，无需注册，保护您的隐私安全',
  keywords = '临时邮箱,匿名邮箱,一次性邮箱,隐私保护,电子邮件,ZMAIL',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
}) => {
  const location = useLocation();
  // 使用当前访问的实际域名，而不是写死某个具体域名，这样无论部署到哪个域名下都能生成正确的链接
  const url = `${window.location.origin}${location.pathname}`;
  const fullTitle = `${title} | 创建临时邮箱地址，接收邮件，无需注册，保护您的隐私安全`;

  useEffect(() => {
    // 更新页面标题
    document.title = fullTitle;
    
    // 更新元标签
    const metaTags = {
      'description': description,
      'keywords': keywords,
    };
    
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': url,
      'og:type': ogType,
      'og:image': ogImage,
    };
    
    const twitterTags = {
      'twitter:title': title,
      'twitter:description': description,
      'twitter:url': url,
      'twitter:card': twitterCard,
      'twitter:image': ogImage,
    };
    
    // 更新常规元标签
    Object.entries(metaTags).forEach(([name, content]) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      }
    });
    
    // 更新Open Graph标签
    Object.entries(ogTags).forEach(([property, content]) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (element) {
        element.setAttribute('content', content);
      }
    });
    
    // 更新Twitter标签
    Object.entries(twitterTags).forEach(([property, content]) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (element) {
        element.setAttribute('content', content);
      }
    });
    
    // 更新规范链接
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', url);
    }
  }, [fullTitle, description, keywords, url, title, ogType, ogImage, twitterCard]);

  return null; // 这个组件不渲染任何内容
};

export default SEO; 