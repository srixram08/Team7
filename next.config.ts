type NextConfig = {
  transpilePackages?: string[];
  reactStrictMode?: boolean;
  typescript?: {
    ignoreBuildErrors?: boolean;
  };
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
  [key: string]: unknown;
};

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
