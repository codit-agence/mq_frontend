

// Maintenant tu peux utiliser __dirname plus bas dans ton code
// Exemple : const path = __dirname + '/public';


const nextConfig = {
  // À la racine, PAS dans experimental
 // allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
  eimages: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app', // Autorise tes domaines Vercel
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Pour tes tests locaux
      },
      // Ajoute ici l'IP de ton serveur Contabo si tu charges des images de là-bas
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