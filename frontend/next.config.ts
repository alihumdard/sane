import type { NextConfig } from "next";

/**
 * The API's own host, when it has one.
 *
 * Empty or relative means the API answers on whichever host served the page,
 * so its images are same-origin and need no entry below. Parsing a relative
 * value as a URL is what broke the build when that became the default.
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
const backendOrigin = apiUrl.startsWith("http") ? new URL(apiUrl).origin : null;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    // Declared explicitly: Next 16 refuses any quality not listed here, which
    // is what the hero images were warning about.
    qualities: [75, 85, 90],
    remotePatterns: [
      // Documents and logos served by the API, when it lives on its own host.
      ...(backendOrigin
        ? [
            {
              protocol: (backendOrigin.startsWith("https") ? "https" : "http") as "https" | "http",
              hostname: new URL(backendOrigin).hostname,
            },
          ]
        : []),
      // Placeholder avatars and photos still used by the dashboard screens
      // that have not been wired to real data yet. Remove these once those
      // pages serve uploads from the API.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  // Keeps stack traces and framework details out of production responses.
  poweredByHeader: false,

  compiler: {
    // Debug logging should not ship; console.error and .warn are kept so real
    // failures remain visible in production.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  /**
   * Baseline security headers.
   *
   * Deliberately no Content-Security-Policy here: a CSP that is wrong is worse
   * than none, because it silently breaks the page, and it has to be written
   * against the real production origins. It belongs with the deployment step.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
