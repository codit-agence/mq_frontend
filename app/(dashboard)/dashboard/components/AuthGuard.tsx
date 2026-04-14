// src/components/auth/AuthGuard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { authService } from "@/src/projects/client-dashboard/account/auth.services";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { logout, setContext, setInitializing } = useAuthStore();
  const { isInitializing } = useAuthStore();
  const { previewMode } = useInternalPreviewMode();

  useEffect(() => {
    if (previewMode) {
      setInitializing(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      logout();
      return;
    }

    authService.getMe()
      .then(data => {
        setContext(data.user, data.current_tenant);
      })
      .catch((err) => {
        if (err.response?.status === 401) logout();
        setInitializing(false);
      });
  }, [logout, previewMode, setContext, setInitializing]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-black text-xs uppercase tracking-widest text-slate-400 animate-pulse">Initialisation SmartDisplay...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}