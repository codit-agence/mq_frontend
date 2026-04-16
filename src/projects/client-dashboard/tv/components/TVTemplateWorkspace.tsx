"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import TemplateManager from "@/app/tv/componenents/TemplateManager";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { tvApi } from "@/src/projects/client-dashboard/tv/tv.api";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import { applyManifestPersonalization, buildManifestFromCatalog } from "@/src/projects/client-dashboard/tv/tv.manifest";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { TVWorkspaceControls } from "@/src/projects/client-dashboard/tv/components/tv-workspace/TVWorkspaceControls";
import { TVWorkspaceOverlay } from "@/src/projects/client-dashboard/tv/components/tv-workspace/TVWorkspaceOverlay";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { DEFAULT_LOGO, DEFAULT_PRIMARY, DEFAULT_SECONDARY, DEFAULT_TICKER, tvTemplateOptions } from "@/src/projects/client-dashboard/tv/components/tv-workspace/tv-workspace.constants";
import { normalizeTemplate } from "@/src/projects/client-dashboard/tv/components/tv-workspace/tv-workspace.utils";

interface Props {
  mode: "catalog" | "token_or_catalog";
  pageName: string;
}

const TVTemplateWorkspace: React.FC<Props> = ({ mode, pageName }) => {
  const { products, categories, fetchCatalog, loading } = useCatalogStore();
  const { accessToken } = useTVStore();

  const [isLoading, setIsLoading] = useState(true);
  const [baseManifest, setBaseManifest] = useState<TVManifest | null>(null);
  const [productIndex, setProductIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("tvplayer");
  const [displayName, setDisplayName] = useState("Mon Ecran");
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_SECONDARY);
  const [tickerMessage, setTickerMessage] = useState(DEFAULT_TICKER);
  const [showQr, setShowQr] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showPrayer, setShowPrayer] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);

      if (mode === "token_or_catalog" && accessToken) {
        try {
          const manifest = await tvApi.getManifest(accessToken);
          if (!mounted) return;
          setBaseManifest(manifest);
          setSelectedTemplate(normalizeTemplate(manifest.template_name));
          setDisplayName(manifest.tenant?.name_override || manifest.tenant?.name || "Mon Ecran");
          setPrimaryColor(manifest.tenant?.primary_color || DEFAULT_PRIMARY);
          setSecondaryColor(manifest.tenant?.secondary_color || DEFAULT_SECONDARY);
          setTickerMessage(DEFAULT_TICKER);
          setIsLoading(false);
          return;
        } catch {
          // fallback catalog
        }
      }

      await fetchCatalog();
      if (!mounted) return;
      setIsLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [mode, accessToken, fetchCatalog]);

  useEffect(() => {
    if (baseManifest) return;
    const fallbackManifest = buildManifestFromCatalog(products, categories);
    if (fallbackManifest) {
      setBaseManifest(fallbackManifest);
      setSelectedTemplate(normalizeTemplate(fallbackManifest.template_name));
      setDisplayName(fallbackManifest.tenant.name || "Mon Ecran");
      setPrimaryColor(fallbackManifest.tenant.primary_color || DEFAULT_PRIMARY);
      setSecondaryColor(fallbackManifest.tenant.secondary_color || DEFAULT_SECONDARY);
    }
  }, [baseManifest, products, categories]);

  useEffect(() => {
    if (!baseManifest?.products?.length) return;
    const delay = (baseManifest.slot_duration || 10) * 1000;
    const interval = setInterval(() => {
      setProductIndex((prev) => (prev + 1) % baseManifest.products.length);
    }, delay);
    return () => clearInterval(interval);
  }, [baseManifest?.products?.length, baseManifest?.slot_duration]);

  const previewManifest = useMemo(() => {
    if (!baseManifest) return null;
    return applyManifestPersonalization(baseManifest, {
      templateName: selectedTemplate,
      displayName,
      primaryColor,
      secondaryColor,
    });
  }, [baseManifest, selectedTemplate, displayName, primaryColor, secondaryColor]);

  const logoSrc = getImageUrl(previewManifest?.tenant.logo || DEFAULT_LOGO);

  if (isLoading || loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <span className="font-bold">Chargement du studio TV...</span>
      </div>
    );
  }

  if (!previewManifest || !previewManifest.products.length) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex items-center justify-center">
        Aucun produit actif a afficher.
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <TemplateManager type={selectedTemplate} manifest={previewManifest} productIndex={productIndex} />

      <TVWorkspaceOverlay pageName={pageName} displayName={displayName} logoSrc={logoSrc} />

      <TVWorkspaceControls
        displayName={displayName}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        tickerMessage={tickerMessage}
        selectedTemplate={selectedTemplate}
        templateOptions={tvTemplateOptions}
        showQr={showQr}
        showWeather={showWeather}
        showPrayer={showPrayer}
        onDisplayNameChange={setDisplayName}
        onPrimaryColorChange={setPrimaryColor}
        onSecondaryColorChange={setSecondaryColor}
        onTickerMessageChange={setTickerMessage}
        onTemplateChange={setSelectedTemplate}
        onToggleQr={() => setShowQr((value) => !value)}
        onToggleWeather={() => setShowWeather((value) => !value)}
        onTogglePrayer={() => setShowPrayer((value) => !value)}
      />

      <div className="absolute inset-x-0 bottom-0 z-40 h-12 bg-black/85 border-t border-white/10 overflow-hidden">
        <div className="h-full flex items-center tv-marquee whitespace-nowrap">
          <span className="px-8 text-sm font-black" style={{ color: primaryColor }}>
            {tickerMessage || DEFAULT_TICKER}
          </span>
          <span className="px-8 text-sm font-black" style={{ color: primaryColor }}>
            {tickerMessage || DEFAULT_TICKER}
          </span>
          <span className="px-8 text-sm font-black" style={{ color: primaryColor }}>
            {tickerMessage || DEFAULT_TICKER}
          </span>
        </div>
      </div>

      <style jsx>{`
        .tv-marquee {
          animation: tv-marquee 25s linear infinite;
          width: max-content;
        }
        @keyframes tv-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33%);
          }
        }
      `}</style>
    </div>
  );
};

export default TVTemplateWorkspace;
