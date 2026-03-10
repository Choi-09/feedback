import type { MetadataRoute } from 'next';

// 내부 앱이므로 검색 엔진 크롤링 차단
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
