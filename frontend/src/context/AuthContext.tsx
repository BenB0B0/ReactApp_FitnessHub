// Manages authentication
import { ReactNode, createContext, useContext, useEffect, useState  } from "react";
import { IdToken, useAuth0 } from "@auth0/auth0-react";

const AUTH_URL = import.meta.env.VITE_BACKEND_URL + '/authorize';

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  userId: string | null;
  login: () => void;
  handleLogout: () => void;
  getToken: () => Promise<IdToken | null | undefined>;
  isLoading: boolean;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, loginWithRedirect, logout, getIdTokenClaims, isLoading } = useAuth0();
  const [localUserId, setLocalUserId] = useState<string | null>(null);

  // Function to get the access token
  const getToken = async () => {
    if (!isAuthenticated) return null;
    try {
      return await getIdTokenClaims();
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  // Handle user creation on successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      getToken().then((token) => {
        const tokenWithRaw = token as any;
        if (token) {
          fetch(AUTH_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenWithRaw.__raw}`, 
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("User successfully created in database", data)
              setLocalUserId(data["user_id"]);
            })
            .catch((error) => {
              console.error("Error creating user:", error);
            });
        }
      });
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin, // Redirect to home page after logout
    } as any);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated || false, 
        user: user || null, 
        userId: localUserId || user?.sub || null,
        login: loginWithRedirect,
        handleLogout,
        getToken,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
