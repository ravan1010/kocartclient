// ProtectedRoute.js
import { useNavigate } from "react-router-dom";
import ADMINMainauth from "../adminMainauth";

const ProtectedRouteADMINMain = ({ children }) => {

  const navigate = useNavigate();
      
  const { admin, checking } = ADMINMainauth();

  if(checking) return <div>Loading...</div>;
  if(!admin) return <p>404</p>;

  return children;
};

export default ProtectedRouteADMINMain

