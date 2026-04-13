import React from "react";
import ClassicMenu from "./templates/ClassicMenu";
import GridPromotion from "./templates/GridPromotion";
import VideoFocus from "./templates/VideoFocus";
import TVPlayerTemplate from "./templates/TVPlayerTemplate";
import DisplayTemplate from "./templates/DisplayTemplate";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";

interface Props {
  type: string;
  manifest: TVManifest;
  productIndex: number;
}

const TemplateManager: React.FC<Props> = ({ type, manifest, productIndex }) => {
  const normalized = (type || "").toLowerCase();
  switch (normalized) {
    case "display":
      return <DisplayTemplate manifest={manifest} productIndex={productIndex} />;
    case "grid":
    case "promo":
    case "full_promo":
      return <GridPromotion manifest={manifest} productIndex={productIndex} />;
    case "video_focus":
    case "focus":
      return <VideoFocus manifest={manifest} productIndex={productIndex} />;
    case "tvplayer":
      return <TVPlayerTemplate manifest={manifest} productIndex={productIndex} />;
    case "classic":
    case "standard":
    case "branded":
    default:
      return <ClassicMenu manifest={manifest} productIndex={productIndex} />;
  }
};

export default TemplateManager;
