import { OktaAuth } from "@okta/okta-auth-js";

export const oktaAuth = new OktaAuth({
  issuer: process.env.OKTA_ISSUER,
  clientId: process.env.OKTA_CLIENT_ID,
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["email", "openid", "groups"],
  pkce: true,
});
