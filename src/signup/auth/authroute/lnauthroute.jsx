// ProtectedRoute.js
import { useNavigate } from "react-router-dom";
import Authlocation from "../lnauth";

const ProtectedRouteAuthlocation = ({ children }) => {
    
    const navigate = useNavigate();

  const { user, checking } = Authlocation();

  if(checking) return <div>Loading...</div>;
  if(!user) return navigate('/citytown');

  return children;
};

export default ProtectedRouteAuthlocation

