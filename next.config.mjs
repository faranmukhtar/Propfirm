/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/:path*' // Local development (Uvicorn)
            : '/api/:path*',                    // Production on Vercel
      },
    ];
  },
};

export default nextConfig;