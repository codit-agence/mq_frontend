const nextConfig = {
  // À la racine, PAS dans experimental
 // allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
  
  // Le reste de votre config...
  experimental: {
    // Laissez vide ou avec vos autres options, mais SANS allowedDevOrigins
  },

  images: {
    domains: ['127.0.0.1'],
  },
};

export default nextConfig;