import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

type AlertType = "success" | "danger" | "warning" | "info";

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [variant, setVariant] = useState<AlertType>("success");

  const showAlert = (msg: string, type: AlertType = "success") => {
    setMessage(msg);
    setVariant(type);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {message && (
        <Alert
          variant={variant}
          className="fade show position-fixed top-0 end-0 m-3 shadow"
          style={{ zIndex: 9999 }}
        >
          {message}
        </Alert>
      )}
    </AlertContext.Provider>
  );
};
