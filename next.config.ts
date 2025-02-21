import { type NextConfig } from "next";

import "@/env";

const config: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "fux7glt2j7.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};

export default config;
