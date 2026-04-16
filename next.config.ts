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
  // Hôte API prod : utile si le build CI n’injecte pas les NEXT_PUBLIC_* (images _next/image)
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
};

export default nextConfig;