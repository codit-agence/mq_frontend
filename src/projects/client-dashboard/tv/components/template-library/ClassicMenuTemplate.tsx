import React from "react";

import { StandardClassicTvLayout } from "@/src/projects/client-dashboard/tv/components/StandardClassicTvLayout";
import type { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";

interface Props {
  manifest: TVManifest;
  productIndex: number;
}

const ClassicMenuTemplate: React.FC<Props> = ({ manifest, productIndex }) => {
  const current = manifest.products[productIndex];
  if (!current) return null;

  return <StandardClassicTvLayout manifest={manifest} product={current} />;
};

export default ClassicMenuTemplate;
