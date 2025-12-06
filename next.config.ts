import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features for Next.js 16
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },
  
  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
