/** @type {import('next').NextConfig} */
const config = {
    swcMinify: true,
    reactStrictMode: false,
    experimental: {},
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "zencomex.com",
                pathname: "/api/upload/**", // Đảm bảo đường dẫn này được bao gồm
            },
        ],
        domains: ["localhost", "zencomex.com", new URL(process.env.NEXT_PUBLIC_API_URL).hostname],
    },

    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false, // Disable fs module if not needed
                path: false, // Disable path module if not needed
            };
        }
        return config;
    },
    async redirects() {
        return [
            {
                source: "/docs",
                destination: "/docs/welcome",
                permanent: true,
            },
        ];
    },
};

module.exports = config;
