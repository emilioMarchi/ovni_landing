import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://7586-2803-9800-9802-b39d-dc05-3a7b-f3c7-8d74.ngrok-free.app",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://7586-2803-9800-9802-b39d-dc05-3a7b-f3c7-8d74.ngrok-free.app",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;