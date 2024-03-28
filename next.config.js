/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        domains: ["firebasestorage.googleapis.com"]
    },
    async redirects() {
        return [
          {
            source: '/',
            destination: '/home',
            permanent: true, // set to false if the redirect is temporary
          },
        ]
      }
}

module.exports = nextConfig
