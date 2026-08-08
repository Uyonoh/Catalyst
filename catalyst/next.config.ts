import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'fxzukdwevxstqiicqavc.supabase.co',
				pathname: '/**',
			},
		],
		qualities: [25, 50, 60, 75, 85],
	},
};

export default nextConfig;
