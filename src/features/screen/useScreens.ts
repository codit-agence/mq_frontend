import { useState, useEffect, useCallback } from "react";
import { TVScreen } from "@/src/types/screens/screen.types";

const SERVER_IP = "192.168.110.3";

export function useScreens() {
  const [screens, setScreens] = useState<TVScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthToken = () => {
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    return match ? match[2] : undefined;
  };

  const fetchScreens = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(`http://${SERVER_IP}:8000/api/screens/manage/my-screens/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setScreens(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  const addScreen = async (name: string) => {
    const token = getAuthToken();
    if (!token || !name.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://${SERVER_IP}:8000/api/screens/manage/add-screen/`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchScreens();
      return res.ok;
    } finally {
      setIsSubmitting(false);
    }
  };

  const pairTV = async (tvToken: string) => {
    const authToken = getAuthToken();
    if (!authToken) return false;
    const res = await fetch(`http://${SERVER_IP}:8000/api/screens/tv/confirm-scan/${tvToken}/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (res.ok) await fetchScreens();
    return res.ok;
  };

  useEffect(() => { fetchScreens(); }, [fetchScreens]);

  return { screens, loading, isSubmitting, addScreen, pairTV };
}