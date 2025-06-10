import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * 啟用靜態匯出
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: 'export',

  /**
   * 設定 Base Path，對應 GitHub Pages 的 repository slug
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: '/edumon',

  /**
   * TypeScript 允許在有錯誤時仍然編譯
   */
  typescript: {
    ignoreBuildErrors: true,
  },

  /**
   * ESLint 允許在 build 階段忽略 lint 錯誤
   */
  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * 關閉伺服器端影像最佳化（因為靜態匯出不支援動態最佳化），
   * 同時保留遠端圖片載入的路徑規則
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'google.github.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloud.google.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
