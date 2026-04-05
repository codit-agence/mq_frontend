const nextConfig = {
  // À la racine, PAS dans experimental
 // allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
  eslint: {
    // Attention: Cela ignore les erreurs lint lors du build. 
    // Utile pour déployer rapidement sur Contabo.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
    // Optionnel: si tu veux aussi ignorer les erreurs TS au build
    // ignoreBuildErrors: true, 
  },

  // Le reste de votre config...
  experimental: {
    // Laissez vide ou avec vos autres options, mais SANS allowedDevOrigins
  },

  images: {
    domains: ['127.0.0.1'],
  },
};

export default nextConfig;