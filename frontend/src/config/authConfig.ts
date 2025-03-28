// Auth0 settings
export const authConfig = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    redirectUri: window.location.origin,
    useRefreshTokens: true,
    cacheLocation: "localstorage" as const
};
  