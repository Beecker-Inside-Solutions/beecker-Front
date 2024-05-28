import { useState, useCallback } from "react";
import { apiURL } from "@/Constants";

const useFetchUserType = () => {
  const [user, setUser] = useState({ isAdmin: false, isBeecker: false });

  const fetchUserType = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/users/${localStorage.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      const { Roles_idRole } = data[0];

      switch (Roles_idRole) {
        case 1:
          setUser({ isAdmin: true, isBeecker: true });
          break;
        case 2:
          setUser({ isAdmin: false, isBeecker: true });
          break;
        case 3:
          setUser({ isAdmin: false, isBeecker: false });
          break;
        default:
          setUser({ isAdmin: false, isBeecker: false });
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
      setUser({ isAdmin: false, isBeecker: false });
    }
  }, [apiURL]);

  return { user, fetchUserType };
};

export default useFetchUserType;
