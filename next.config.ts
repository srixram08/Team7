type NextConfig = {
  transpilePackages?: string[];
  reactStrictMode?: boolean;
  [key: string]: unknown;
};

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  reactStrictMode: true,
};

export default nextConfig;
