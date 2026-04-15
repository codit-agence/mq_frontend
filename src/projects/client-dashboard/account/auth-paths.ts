export const AUTH_PATHS = {
  account: "/account",
  login: "/account/login",
  register: "/account/register",
  onboarding: "/account/onboarding",
  forgotPassword: "/account/forgot-password",
  terms: "/account/terms",
} as const;

export function buildRegisteredLoginPath() {
  return `${AUTH_PATHS.login}?registered=true`;
}