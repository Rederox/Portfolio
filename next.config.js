/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "mistral.ai" },
      { protocol: "https", hostname: "n8n.io" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.gstatic.com" },
      { protocol: "https", hostname: "www.pipedrive.com" },
    ],
  },
};

module.exports = nextConfig;
