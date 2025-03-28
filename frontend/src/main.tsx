import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from "@auth0/auth0-react";
import { authConfig } from "./config/authConfig";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider {...authConfig}>
    <AuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AuthProvider>
  </Auth0Provider>
);