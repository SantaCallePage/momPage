import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[new URL(process.env.SUPABASE_URL! /*Confía TS*/ )],
    qualities:[25,50,75,80,100],
    imageSizes:[16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

};

export default nextConfig;
