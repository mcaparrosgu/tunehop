import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El servidor de dev se accede vía http://[::1]:3000 (relay de WSL sobre IPv6).
  // Sin esto, Next bloquea el HMR y los recursos /_next/* al considerar [::1]
  // un origen distinto de "localhost".
  allowedDevOrigins: ["[::1]", "::1", "localhost", "127.0.0.1"],
};

export default nextConfig;
