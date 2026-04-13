import { TVDeviceInfo } from "@/src/types/tvstream/tvstream";

export const getDeviceInfo = (): TVDeviceInfo => {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
    };
    userAgentData?: {
      platform?: string;
      brands?: Array<{ brand: string }>;
    };
  };

  const ua = navigator.userAgent;
  let os = "Unknown OS";
  
  if (ua.indexOf("Tizen") !== -1) os = "Samsung Tizen";
  else if (/Web0S|WebOS/i.test(ua)) os = "LG WebOS";
  else if (ua.indexOf("Android") !== -1) os = "Android TV";
  else if (ua.indexOf("Windows") !== -1) os = "Windows (PC/Stick)";
  else if (ua.indexOf("Linux") !== -1) os = "Linux/Raspberry";

  const browserFamily = nav.userAgentData?.brands?.[0]?.brand || navigator.vendor || "Generic Browser";
  const appVersion = process.env.NEXT_PUBLIC_TV_APP_VERSION || "1.1.0";

  return {
    browser_family: browserFamily,
    os_platform: os,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    user_agent: ua,
    app_version: appVersion,
    preferred_transport: "auto",
    device_memory_gb: nav.deviceMemory,
    hardware_concurrency: navigator.hardwareConcurrency,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language,
    websocket_supported: typeof window !== "undefined" && "WebSocket" in window,
    polling_supported: true,
    geolocation_supported: typeof navigator !== "undefined" && "geolocation" in navigator,
    max_touch_points: navigator.maxTouchPoints,
    network_type: nav.connection?.effectiveType,
    capabilities: {
      platform: nav.userAgentData?.platform || navigator.platform,
      cookie_enabled: navigator.cookieEnabled,
      on_line: navigator.onLine,
      performance_memory_supported: typeof performance !== "undefined" && "memory" in performance,
    },
  };
};