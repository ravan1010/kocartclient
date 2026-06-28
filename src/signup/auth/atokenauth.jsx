

// useAuthCheck.js
import { useEffect, useState } from "react";
import api from "../../api.js";

const useClientauth = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/api/token", {
          withCredentials: true, 
        });

        if (isMounted) {
          setUser(res.data?.user || null);
        } 
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    }; 
  }, []);

  return {
    user,
    isAdmin: !!user,
    checking,
  };
};

export default useClientauth;

