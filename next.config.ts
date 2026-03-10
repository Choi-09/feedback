import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 상위 디렉토리 yarn.lock으로 인한 workspace root 오추론 방지
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'exceljs'],
  },
};

export default nextConfig;
