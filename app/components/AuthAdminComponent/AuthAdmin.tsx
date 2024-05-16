"use client";
import { useEffect, useState, useCallback } from "react";
import { apiURL } from "@/Constants";

type AuthAdminProps = {
  children: React.ReactNode;
};

const AuthAdmin: React.FC<AuthAdminProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const fetchUserType = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Missing token or user ID");
      }

      const response = await fetch(`${apiURL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      const { Roles_idRole } = data[0];

      if (Roles_idRole === 1) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user type:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    fetchUserType();
  }, [fetchUserType]);

  if (isAuthenticated === null || isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = "/projects"; // Redirect to login or home page
    return null;
  }

  if (!isAdmin) {
    window.location.href = "/projects"; // Redirect non-admin users
    return null;
  }

  return <>{children}</>;
};

export default AuthAdmin;
