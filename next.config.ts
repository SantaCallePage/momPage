import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[new URL(process.env.SUPABASE_URL! /*Confía TS*/ )]
  },

};

export default nextConfig;
