import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permet au build Vercel de réussir même s'il y a des erreurs ESLint.
    // Les erreurs resteront visibles en local via `npm run lint`.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Nous conservons l'échec en cas d'erreur TS à la build pour éviter des régressions silencieuses.
    // Passez à `true` si vous souhaitez ignorer temporairement les erreurs TS pendant le déploiement.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
