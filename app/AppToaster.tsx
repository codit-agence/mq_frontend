"use client";

import { Toaster } from "react-hot-toast";

/** Sans ce composant, `toast.*` ne s'affiche pas dans l'interface. */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 5000,
        style: { maxWidth: "min(32rem, 92vw)" },
      }}
    />
  );
}
