// Auth0 settings
export const authConfig = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    // redirectUri: window.location.origin,
    useRefreshTokens: true,
    cacheLocation: "localstorage" as const,
    authorizationParams:{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email offline_access"
    }
};
  