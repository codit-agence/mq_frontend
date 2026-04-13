import { InternalOption, InternalScreenMapRow, InternalTenantRow, InternalTenantStats } from "@/src/projects/admin-dashboard/internal/services/internal-tenants.service";

export const previewStats: InternalTenantStats = {
  tenants_total: 18,
  tenants_by_status: [
    { status: "active", count: 13 },
    { status: "trial", count: 3 },
    { status: "suspended", count: 2 },
  ],
  tenants_by_business_type: [
    { business_type: "restaurant", count: 8 },
    { business_type: "cafe", count: 5 },
    { business_type: "agency", count: 5 },
  ],
  tenants_by_pack: [
    { subscription_pack: "starter", count: 6 },
    { subscription_pack: "pro", count: 8 },
    { subscription_pack: "enterprise", count: 4 },
  ],
  screens_total: 64,
  screens_online: 51,
  screens_moved_alert: 4,
};

export const previewRowsBase: InternalTenantRow[] = [
  {
    id: "preview-1",
    name: "Qalyas Coffee Anfa",
    slug: "qalyas-coffee-anfa",
    owner_email: "owner-anfa@example.com",
    city: "Casablanca",
    country: "MA",
    business_type: "cafe",
    status: "active",
    client_category: "A",
    subscription_pack: "pro",
    subscription_offer: "Pack Pro 2026",
    payment_type: "monthly",
    tenant_level: 2,
    followed_by_type: "commercial",
    followed_by_name: "S. Karim",
    screen_count: 6,
    online_screens: 5,
    moved_alert_screens: 0,
    commercial_name: "S. Karim",
    technician_name: "M. Adil",
    lead_source: "website",
    lead_source_detail: "SEO landing",
    coupon_code: "ANFA26",
  },
  {
    id: "preview-2",
    name: "Medina Grill Rabat",
    slug: "medina-grill-rabat",
    owner_email: "owner-rabat@example.com",
    city: "Rabat",
    country: "MA",
    business_type: "restaurant",
    status: "trial",
    client_category: "B",
    subscription_pack: "starter",
    subscription_offer: "Trial launch",
    payment_type: "quarterly",
    tenant_level: 1,
    followed_by_type: "technician",
    followed_by_name: "L. Sami",
    screen_count: 3,
    online_screens: 2,
    moved_alert_screens: 1,
    commercial_name: "A. Yassine",
    technician_name: "L. Sami",
    lead_source: "referral",
    lead_source_detail: "Partner referral",
    coupon_code: "",
  },
  {
    id: "preview-3",
    name: "Atlas Market Marrakesh",
    slug: "atlas-market-marrakesh",
    owner_email: "owner-marrakesh@example.com",
    city: "Marrakesh",
    country: "MA",
    business_type: "other",
    status: "active",
    client_category: "C",
    subscription_pack: "enterprise",
    subscription_offer: "Enterprise HQ",
    payment_type: "yearly",
    tenant_level: 3,
    followed_by_type: "company",
    followed_by_name: "HQ Support",
    screen_count: 12,
    online_screens: 11,
    moved_alert_screens: 2,
    commercial_name: "R. Lina",
    technician_name: "H. Ismail",
    lead_source: "outbound",
    lead_source_detail: "Key account outbound",
    coupon_code: "ATLASVIP",
  },
];

export const previewScreenMapBase: InternalScreenMapRow[] = [
  { screen_id: "s1", screen_name: "TV Lounge 01", tenant_id: "preview-1", tenant_name: "Qalyas Coffee Anfa", is_online: true, last_ping: new Date().toISOString(), lat: 33.5899, lng: -7.6039, moved_alert: false },
  { screen_id: "s2", screen_name: "Menu Wall 02", tenant_id: "preview-2", tenant_name: "Medina Grill Rabat", is_online: false, last_ping: new Date().toISOString(), lat: 34.0209, lng: -6.8416, moved_alert: true },
  { screen_id: "s3", screen_name: "Promo Gate 03", tenant_id: "preview-3", tenant_name: "Atlas Market Marrakesh", is_online: true, last_ping: new Date().toISOString(), lat: 31.6295, lng: -7.9811, moved_alert: false },
];

export const previewOptionsBase: {
  business_types: InternalOption[];
  statuses: InternalOption[];
  client_categories: InternalOption[];
  subscription_packs: InternalOption[];
  payment_types: InternalOption[];
  followed_by_types: InternalOption[];
  lead_sources: InternalOption[];
} = {
  business_types: [
    { value: "restaurant", label: "Restaurant" },
    { value: "cafe", label: "Cafe" },
    { value: "other", label: "Other" },
  ],
  statuses: [
    { value: "pending", label: "En attente" },
    { value: "active", label: "Actif" },
    { value: "suspended", label: "Suspendu" },
    { value: "trial", label: "Essai" },
  ],
  client_categories: [
    { value: "A", label: "Category A" },
    { value: "B", label: "Category B" },
    { value: "C", label: "Category C" },
  ],
  subscription_packs: [
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Enterprise" },
  ],
  payment_types: [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "transfer", label: "Bank Transfer" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ],
  followed_by_types: [
    { value: "company", label: "Company" },
    { value: "technician", label: "Technician" },
    { value: "commercial", label: "Commercial" },
  ],
  lead_sources: [
    { value: "referral", label: "Referral" },
    { value: "social", label: "Social Media" },
    { value: "website", label: "Website" },
    { value: "walkin", label: "Walk-in" },
    { value: "outbound", label: "Outbound" },
    { value: "other", label: "Other" },
  ],
};

export function filterPreviewTenantRows(
  rows: InternalTenantRow[],
  filters: {
    search?: string;
    business_type?: string;
    status?: string;
    client_category?: string;
    subscription_pack?: string;
  }
) {
  const normalizedSearch = filters.search?.trim().toLowerCase() || "";

  return rows.filter((row) => {
    const matchesSearch = !normalizedSearch || row.name.toLowerCase().includes(normalizedSearch) || row.city.toLowerCase().includes(normalizedSearch);
    const matchesBusinessType = !filters.business_type || row.business_type === filters.business_type;
    const matchesStatus = !filters.status || row.status === filters.status;
    const matchesClientCategory = !filters.client_category || row.client_category === filters.client_category;
    const matchesPack = !filters.subscription_pack || row.subscription_pack === filters.subscription_pack;
    return matchesSearch && matchesBusinessType && matchesStatus && matchesClientCategory && matchesPack;
  });
}