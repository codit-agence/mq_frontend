const AUTH_STORAGE_KEYS = ["access_token", "refresh_token", "auth-storage"] as const;

export function clearAuthStorage() {
  if (typeof window === "undefined") {
    return;
  }

  for (const key of AUTH_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
  }
}
