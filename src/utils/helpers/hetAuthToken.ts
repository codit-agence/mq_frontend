const getAuthToken = () => {
  // Cette Regex cherche spécifiquement la valeur du cookie access_token
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (match) {
    const token = match[2];
    console.log("✅ Token détecté :", token.substring(0, 15) + "..."); 
    return token;
  }
  console.error("❌ Cookie 'access_token' introuvable dans document.cookie");
  return undefined;
};