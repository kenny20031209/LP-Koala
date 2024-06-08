/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/log-in',
                permanent: true
            }
        ]
    },
    images: {
        domains: [
            "localhost"
        ]
    }
}



module.exports = nextConfig
