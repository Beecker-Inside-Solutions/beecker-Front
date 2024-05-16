"use client";
import { useEffect, useState } from "react";

type AuthRouteProps = {
  children: React.ReactNode;
};

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthRoute;
