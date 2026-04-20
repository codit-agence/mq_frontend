import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function buildMediaPattern(value: string): RemotePattern | null {
  try {
    const url = new URL(value);
    return {
      protocol: url.protocol === "https:" ? "https" : "http",
      hostname: url.hostname,
      port: url.port,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const remotePatterns = [
  process.env.NEXT_PUBLIC_BACKEND_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  // Hôte API prod (médias /media/…, logos, slides)
  "https://api.qalyas.com",
]
  .filter((value): value is string => Boolean(value))
  .map(buildMediaPattern)
  .filter((value): value is NonNullable<ReturnType<typeof buildMediaPattern>> => Boolean(value))
  .filter((value, index, list) => list.findIndex((item) => `${item.protocol}//${item.hostname}:${item.port}${item.pathname}` === `${value.protocol}//${value.hostname}:${value.port}${value.pathname}`) === index);

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  /**
   * Evite CORS en dev : le navigateur appelle `http://localhost:3000/api/...`, Next transmet vers Django.
   * .env.local : API_PROXY_TO_BACKEND=http://127.0.0.1:8000 et NEXT_PUBLIC_API_URL=http://localhost:3000/api
   */
  async rewrites() {
    const backend = process.env.API_PROXY_TO_BACKEND?.trim();
    if (!backend) return [];
    const base = backend.replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
};

export default nextConfig;