

// Maintenant tu peux utiliser __dirname plus bas dans ton code
// Exemple : const path = __dirname + '/public';


const nextConfig = {
  // À la racine, PAS dans experimental
 // allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
  images: {
    remotePatterns:[
      {
        protocol: "http",
        hostname: "161.97.96.60", // Ajoute ton IP ici
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "qooom.duckdns.org",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },

  // 2. Supprime la clé 'eslint' qui fait planter le build
  // Pour ignorer ESLint pendant le build en Next 16, cela se fait désormais 
  // via le CLI ou dans un fichier séparé, mais plus ici.

  // 3. Garde la sécurité Webpack si nécessaire
 

  typescript: {
    ignoreBuildErrors: true,
    // Optionnel: si tu veux aussi ignorer les erreurs TS au build
    // ignoreBuildErrors: true, 
  },


};

export default nextConfig;