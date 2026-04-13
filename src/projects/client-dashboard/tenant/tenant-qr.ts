export function resolveTenantQrUrl(input: {
  public_landing_url?: string | null;
  qr_redirect_url?: string | null;
  qr_slug?: string | null;
}) {
  if (input.public_landing_url) return input.public_landing_url;

  const redirect = input.qr_redirect_url || (input.qr_slug ? `/q/${input.qr_slug}` : null);
  if (!redirect) return null;

  if (redirect.startsWith("http://") || redirect.startsWith("https://")) {
    return redirect;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${redirect}`;
  }

  return redirect;
}