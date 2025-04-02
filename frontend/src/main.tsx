import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from "@auth0/auth0-react";
import { authConfig } from "./config/authConfig";
import { AuthProvider } from "./context/AuthContext";
import './custom_css/style.css';
import { AlertProvider } from "./context/AlertContext";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider {...authConfig}>
    <AuthProvider>
      <AlertProvider>
      <StrictMode>
        <App />
      </StrictMode>
      </AlertProvider>
    </AuthProvider>
  </Auth0Provider>
);