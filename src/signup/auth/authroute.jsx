
// export default Authlocation;

import { Navigate, Outlet } from "react-router-dom";
import useClientauth from "./atokenauth"; 

const ProtectedClient = () => {
  const { isAdmin, checking } = useClientauth();

  if (checking) return <div>Checking access...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default ProtectedClient;  
 

