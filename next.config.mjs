/** @type {import('next').NextConfig} */
const nextConfig = {
	rewrites: async () => {
		return [
			{
				source: "/",
				destination: "/landing/index.html",
			},
		];
	},
};

export default nextConfig;
