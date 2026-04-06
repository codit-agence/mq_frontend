

// Maintenant tu peux utiliser __dirname plus bas dans ton code
// Exemple : const path = __dirname + '/public';


const nextConfig = {
  // À la racine, PAS dans experimental
 // allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
  images: {
    remotePatterns: [
     
      // Si tu utilises aussi 'localhost' au lieu de '127.0.0.1'
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },

     {
        protocol: 'https',             // Obligatoire car ton domaine est en SSL
        hostname: 'qooom.duckdns.org', // Ton nouveau domaine
        pathname: '/media/**',
        // port: "",                   // Laisse vide, le HTTPS utilise le port 443 par défaut
      }
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