import type { VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  images: {
    
    sizes: [100, 200, 256, 500, 640, 1080, 2048, 3840],
    qualities: [25, 50, 75],
    localPatterns: [
      {
        pathname: '^/.*$',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.SUPABASE_HOSTNAME,
        port: '',
        pathname: '^/storage/v1/object/public/.*$',
      },
    ],
  },
}