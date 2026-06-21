// // useAuthCheck.js
// import { useEffect, useState } from 'react';
// import api from '../../api';

// const ADMINMainauth = () => {
//   const [admin, setUser] = useState(null);
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     api.get('/api/adminmain', { withCredentials: true })
//       .then((res) => setUser(res.data.user))
//       .catch(() => setUser(null))
//       .finally(() => setChecking(false));
//   }, []);

//   return { admin, checking };
// };

// export default ADMINMainauth


// export default Authlocation;

import { Navigate, Outlet } from "react-router-dom";
import useAdminauth from "./adminotpauth";

const ProtectedMarchent = () => {
  const { isAdmin, checking } = useAdminauth();

  if (checking) return <div>Checking access...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedMarchent;  
 

