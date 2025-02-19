/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apidevsales-dev.devsoul.net",
        port: "",
      },
    ],
  },
};

export default nextConfig;
