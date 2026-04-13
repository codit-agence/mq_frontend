import { useEffect, useRef } from "react";
import { tvApi } from "./tv.api";
import { useTVStore } from "./tv.store";
import { getTvRuntimeSnapshot } from "@/src/utils/helpers/getTvRuntimeSnapshot";

export const useTVHeartbeat = (intervalMs: number = 30000) => {
  const { accessToken, logout, setTemplate, setControlConfig, controlTransport, manifest, template, pollIntervalSeconds } = useTVStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const performHeartbeat = async () => {
    if (!accessToken) return;

    try {
      const runtimeSnapshot = await getTvRuntimeSnapshot(controlTransport);
      const response = await tvApi.sendHeartbeat(accessToken, {
        uptime_seconds: Math.max(Math.round(intervalMs / 1000), pollIntervalSeconds || 30),
        display_mode: manifest?.template_name || template,
        app_version: process.env.NEXT_PUBLIC_TV_APP_VERSION || "1.1.0",
        ...runtimeSnapshot,
      });
      if (response.current_template) {
        setTemplate(response.current_template);
      }
      setControlConfig({
        transportMode: response.transport_mode,
        pollIntervalSeconds: response.poll_interval_seconds,
        gpsRequired: response.gps_required,
        deviceTier: response.device_tier,
      });
      if (response.needs_refresh) {
        window.location.reload();
      }
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        logout();
      }
    }
  };

  useEffect(() => {
    const effectiveIntervalMs = Math.max((pollIntervalSeconds || Math.round(intervalMs / 1000)) * 1000, 10000);
    performHeartbeat();
    timerRef.current = setInterval(performHeartbeat, effectiveIntervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [accessToken, controlTransport, manifest?.template_name, template, pollIntervalSeconds]);
};
