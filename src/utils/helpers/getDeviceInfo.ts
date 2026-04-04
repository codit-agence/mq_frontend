import { TVDeviceInfo } from "@/src/types/tvstream/tvstream";

export const getDeviceInfo = (): TVDeviceInfo => {
  // Détection basique de l'OS/Navigateur
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  
  if (ua.indexOf("Tizen") !== -1) os = "Samsung Tizen";
  else if (ua.indexOf("Web0S") !== -1) os = "LG WebOS";
  else if (ua.indexOf("Android") !== -1) os = "Android TV";
  else if (ua.indexOf("Windows") !== -1) os = "Windows (PC/Stick)";
  else if (ua.indexOf("Linux") !== -1) os = "Linux/Raspberry";

  return {
    browser_family: navigator.vendor || "Generic Browser",
    os_platform: os,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    user_agent: ua,
    app_version: "1.0.4" // Incrémente à chaque mise à jour de ton code
  };
};