import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@bustrack/types",
    "@bustrack/api-client",
    "@bustrack/hooks",
    "@bustrack/ui",
  ],
  outputFileTracingRoot: join(__dirname, "../../"),
};

export default nextConfig;
