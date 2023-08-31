/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config();

const nextConfig = {
  images : {
    domains:["cdn.sanity.io"],
    loader: 'custom',
    loaderFile: './utils/sanityLoader.tsx',
  },
 
}

module.exports = nextConfig
