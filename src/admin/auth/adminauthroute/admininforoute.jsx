// ProtectedRoute.js
import { useNavigate } from "react-router-dom";
import ADMININFOAuth from "../admininfoauth";

const ProtectedRouteADMININFO = ({ children }) => {
      
  const { user, checking } = ADMININFOAuth();
  const navigate = useNavigate();

  if(checking) return <div>Loading...</div>;
  if(!user) return navigate(`/admin`);

  return children;
};

export default ProtectedRouteADMININFO

