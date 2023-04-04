/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images : {
    domains:["cdn.sanity.io"],
    unoptimized:true
  },
  output: 'export',
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
