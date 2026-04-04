// src/utils/helpers/getImageUrl.ts

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "/mq/petitedejeuner.jpg"; // Image par défaut dans ton dossier public
  
  // Si le path est déjà une URL complète (ex: S3 ou externe)
  if (path.startsWith("http")) return path;
  
  // On nettoie le path pour éviter les doubles slashes //
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // On force l'URL vers le backend Django
  return `http://127.0.0.1:8000${cleanPath}`;
};