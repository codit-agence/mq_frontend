import { applicationDomain } from "@/src/projects/admin-dashboard/application/domain";
import { businessDomain } from "@/src/projects/admin-dashboard/business/domain";
import { contentDomain } from "@/src/projects/admin-dashboard/content/domain";
import { marketingDomain } from "@/src/projects/admin-dashboard/marketing/domain";
import { mediaLibraryDomain } from "@/src/projects/admin-dashboard/media-library/domain";
import { paymentsDomain } from "@/src/projects/admin-dashboard/payments/domain";
import { productsDomain } from "@/src/projects/admin-dashboard/products/domain";
import { regieTvDomain } from "@/src/projects/admin-dashboard/regie-tv/domain";
import { usersDomain } from "@/src/projects/admin-dashboard/users/domain";

export const adminDomainCatalog = [
  applicationDomain,
  businessDomain,
  usersDomain,
  regieTvDomain,
  contentDomain,
  productsDomain,
  paymentsDomain,
  mediaLibraryDomain,
  marketingDomain,
] as const;