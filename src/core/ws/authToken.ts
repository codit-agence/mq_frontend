import Cookies from "js-cookie";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const c = Cookies.get("access_token");
  if (c) return c.replace(/"/g, "");
  const ls = localStorage.getItem("access_token");
  return ls ? ls.replace(/"/g, "") : null;
}
