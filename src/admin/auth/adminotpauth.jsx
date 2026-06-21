// // useAuthCheck.js
// import { useEffect, useState } from 'react';
// import api from '../../api';

// const ADMINOTPAuth = () => {
//   const [user, setUser] = useState(null);
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     api.get('/api/adminotp', { withCredentials: true })
//       .then((res) => setUser(res.data.user))
//       .catch(() => setUser(null))
//       .finally(() => setChecking(false));
//   }, []);

//   return { user, checking };
// };

// export default ADMINOTPAuth



import { useEffect, useState } from "react";
import api from "../../api.js";

const useAdminauth = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/api/adminotp", {
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

export default useAdminauth;
