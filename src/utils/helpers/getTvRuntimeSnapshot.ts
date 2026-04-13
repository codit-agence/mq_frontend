import type { TVControlTransport } from "@/src/projects/client-dashboard/tv/tv.types";

type PositionSnapshot = {
  latitude?: number;
  longitude?: number;
  gps_accuracy_m?: number;
  location_status: "ok" | "missing" | "denied" | "unavailable" | "unsupported";
};

function readGeolocation(): Promise<PositionSnapshot> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return Promise.resolve({ location_status: "unsupported" });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          gps_accuracy_m: position.coords.accuracy,
          location_status: "ok",
        });
      },
      (error) => {
        const locationStatus = error.code === error.PERMISSION_DENIED
          ? "denied"
          : error.code === error.POSITION_UNAVAILABLE
            ? "unavailable"
            : "missing";
        resolve({ location_status: locationStatus });
      },
      {
        enableHighAccuracy: true,
        timeout: 2500,
        maximumAge: 60000,
      }
    );
  });
}

export async function getTvRuntimeSnapshot(controlTransport: TVControlTransport) {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
  };
  const perf = performance as Performance & {
    memory?: {
      usedJSHeapSize?: number;
      totalJSHeapSize?: number;
      jsHeapSizeLimit?: number;
    };
  };

  const location = await readGeolocation();
  const memory = perf.memory;

  return {
    ...location,
    transport_mode: controlTransport,
    runtime_snapshot: {
      device_memory_gb: nav.deviceMemory,
      hardware_concurrency: navigator.hardwareConcurrency,
      network_type: nav.connection?.effectiveType,
      network_downlink_mbps: nav.connection?.downlink,
      network_rtt_ms: nav.connection?.rtt,
      js_heap_used_mb: memory?.usedJSHeapSize ? Math.round(memory.usedJSHeapSize / (1024 * 1024)) : undefined,
      js_heap_total_mb: memory?.totalJSHeapSize ? Math.round(memory.totalJSHeapSize / (1024 * 1024)) : undefined,
      js_heap_limit_mb: memory?.jsHeapSizeLimit ? Math.round(memory.jsHeapSizeLimit / (1024 * 1024)) : undefined,
      visibility_state: typeof document !== "undefined" ? document.visibilityState : "unknown",
      on_line: navigator.onLine,
      measured_at: new Date().toISOString(),
    },
  };
}