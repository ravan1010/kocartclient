// ProtectedRoute.js
import { useNavigate } from "react-router-dom";
import ADMINOTPAuth from "../adminotpauth";

const ProtectedRouteADMINOTP = ({ children }) => {
      
  const { user, checking } = ADMINOTPAuth();
    const navigate = useNavigate();
  
  if(checking) return <div>Loading...</div>;
  if(!user) return navigate('/admin');

  return children;
};

export default ProtectedRouteADMINOTP

